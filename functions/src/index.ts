import * as functions from 'firebase-functions';
const fs = require('fs');
const neatCsv = require('neat-csv');
const admin = require("firebase-admin");
const serviceAccount = require("../goldenstick-6ec97-d3719800b384.json");

admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
  }
);
const db = admin.firestore();
const runtimeOpts = {
  timeoutSeconds: 540
}
/**
 * uploadData is a HTTP function which will upload HousingUncertainty.csv data to google firestore
 */
export const uploadData = functions.runWith(runtimeOpts).https.onRequest((request, res) => {
  let dataArr: any[] = [];
  fs.readFile('.\\src\\scripts\\Aged_care_info.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        await db.collection('goldenstick_data').doc(row.SERVICE_ID).set({ ...row })
      }
      return res.status(200).send({ 'data': dataArr });
    } catch (error) {
      console.log(`Something went wrong while reading csv ${error}`)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
  });
});

/**
 * uploadRoomData is a HTTP function which will upload RoomDetails.csv data to google firestore
 */
export const uploadRoomData = functions.runWith(runtimeOpts).https.onRequest((request, res) => {
  let dataArr: any[] = [];

  fs.readFile('.\\src\\scripts\\Room_info.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        const docData = await db.collection('goldenstick_data').doc(row.SERVICE_ID).get();
        const roomDetail = docData.data().roomDetail;
        if (!roomDetail || roomDetail.filter((r: any) => r.ROOM_NAME === row.ROOM_NAME).length === 0) {
          console.log('adding room')
          await db.collection('goldenstick_data').doc(row.SERVICE_ID).set({
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


/**
 * uploadFacility is a HTTP function which will upload Facilities_info.csv data to google firestore
 */
export const uploadFacility = functions.runWith(runtimeOpts).https.onRequest((request, res) => {
  let dataArr: any[] = [];
  fs.readFile('.\\src\\scripts\\Facilities_info.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        console.log(row['Facility_ID'], row);
        const docData = await db.collection('goldenstick_facility').doc(row['Facility_ID']).get();
        if (!docData.exists) {
          await db.collection('goldenstick_facility').doc(row['Facility_ID']).set(row);
        } else {
          console.log('already exist')
        }
      }
      return res.status(200).send({ isError: false });
    } catch (error) {
      console.log(`Something went wrong while reading csv ${error}`)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
  });
});


/**
 * uploadPostcodeData is a HTTP function which will upload Postcode_CloestPostcode.csv data to google firestore
 */
export const uploadPostcodeData = functions.runWith(runtimeOpts).https.onRequest((request, res) => {
  let dataArr: any[] = [];
  fs.readFile('.\\src\\scripts\\Postcode_CloestPostcode.csv', async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
    try {
      dataArr = await neatCsv(data);
      // console.log(dataArr);
      for (const row of dataArr) {
        const docData = await db.collection('goldenstick_data').where('STREET_PCODE', '==', row.Postcode).get();
        docData.forEach(async (doc: any) => {
          await db.collection('goldenstick_data').doc(doc.id).set({ 'Cloest_Postcode': row['Cloest_Postcode'] }, { merge: true })
        });
      }
      return res.status(200).send({ isError: false });
    } catch (error) {
      console.log(`Something went wrong while reading csv ${error}`)
      return res.status(500).send({ 'data': dataArr, 'isError': true });
    }
  });
});
