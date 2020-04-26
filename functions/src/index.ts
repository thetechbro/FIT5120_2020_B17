import * as functions from 'firebase-functions';
const fs = require('fs');
const neatCsv = require('neat-csv');
const admin = require("firebase-admin");
// const serviceAccount = require("C:\\Users\\Chaturthi\\Downloads\\Workspace\\Github\\fit512\\FIT5120_IE_B17\\functions\\src\\scripts\\goldenstick-6ec97-d3719800b384.json");
const serviceAccount = require("../goldenstick-6ec97-d3719800b384.json");

admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
  }
);
const db = admin.firestore();

/**
 * uploadData is a HTTP function which will upload HousingUncertainty.csv data to google firestore
 */
export const uploadData = functions.https.onRequest((request, res) => {
  let dataArr: any[] = [];
  fs.readFile('.\\src\\scripts\\HousingUncertainty.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        await db.collection('goldenstick').doc(row.SERVICE_ID).set({ ...row })
      }
      return res.status(200).send({ 'data': dataArr });
    } catch (error) {
      console.log(`Something went wrong while reading csv ${error}`)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
  });
});

const runtimeOpts = {
  timeoutSeconds: 540
}

/**
 * uploadRoomData is a HTTP function which will upload Roome Details.csv data to google firestore
 */
export const uploadRoomData = functions.runWith(runtimeOpts).https.onRequest((request, res) => {
  let dataArr: any[] = [];

  fs.readFile('.\\src\\scripts\\Roome Details.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        const docData = await db.collection('goldenstick').doc(row.SERVICE_ID).get();
        if (!docData.data().roomDetail) {
          await db.collection('goldenstick').doc(row.SERVICE_ID).set({
            roomDetail: admin.firestore.FieldValue.arrayUnion(row)
          }, { merge: true });
        }
      }
      return res.status(200).send({ isError: false });
    } catch (error) {
      console.log(`Something went wrong while reading csv ${error}`)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
  });
});
