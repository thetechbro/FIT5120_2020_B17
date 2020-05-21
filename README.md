# Goldenstick

## Local Run

- Install node js
- Run `npm i firebase-tools -g`
- Run `npm i @angular/cli -g`
- Run `npm i` from project root path
- Run `npm run start` from project root path

## Build and Deploy

- Run `npm run build-prod` to create build
- Run `firebase login` and login with `fit5120groupb17@gmail.com` email
- Run `firebase deploy --except functions` to deploy

## Database Information

- Database: Firestore ( NOSQL)
- Cloud functions to load csv data to cloud firestore
- Indexes for sorting search results in Ascending (ASC) order
  - collection : goldenstick_data
  - Index 1 => Organisation Type ASC , AGED_CARE_NAME ASC
  - Index 2 => STREET_PCODE ASC , AGED_CARE_NAME ASC
- Query
  - Framework - AngularFire which integrate Angular with Firestore database
  - Below query used to get results based on filter data
    - db.collection('goldenstick_data', ref =>
      ref.where('STREET_PCODE', '==', zipcode.toString()).where('Organisation Type', '==', type)
      .orderBy('AGED_CARE_NAME', 'asc'))
