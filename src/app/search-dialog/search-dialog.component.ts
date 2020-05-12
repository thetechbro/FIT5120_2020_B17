import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { CompareDialogComponent } from '../compare-dialog/compare-dialog.component';
import { SeeMoreDialogComponent } from '../see-more-dialog/see-more-dialog.component';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  @ViewChild('gridContainer') gridContainer;
  loading$: Observable<boolean>;
  isFilterData: boolean;
  filterForm = new FormGroup({
    roomtype: new FormControl(''),
    price: new FormControl(null),
    services: new FormControl(''),
    acreditation: new FormControl('')
  });
  originalData: any[];
  compareItems = [];
  constructor(public dialogRef: MatDialogRef<SearchDialogComponent>, private db: AngularFirestore,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: {
      zipcode: number,
      organizationtype: string
    }) { }
  matchedItems = [];
  matchedItems$: Observable<any>;

  priceList = [
    'All',
    '5',
    '20',
    '23',
    '24',
    '26',
    '27',
    '28',
    '30',
    '31',
    '32',
    '33.63',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '40.36',
    '41',
    '42',
    '42.37',
    '43',
    '44',
    '44.39',
    '45',
    '46',
    '47',
    '48',
    '48.43',
    '49',
    '49.77',
    '50',
    '51',
    '51.12',
    '52',
    '53',
    '53.81',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '60',
    '60.53',
    '61',
    '62',
    '63',
    '63.22',
    '64',
    '65',
    '66',
    '67',
    '68',
    '70',
    '71',
    '73',
    '73.99',
    '74',
    '75',
    '76',
    '77',
    '80',
    '81',
    '82',
    '84',
    '86',
    '87',
    '89',
    '91',
    '92',
    '93',
    '94',
    '96',
    '98.2',
    '99',
    '100.89',
    '101',
    '102',
    '103',
    '105',
    '106',
    '108',
    '109',
    '111',
    '113',
    '114',
    '115',
    '118',
    '119',
    '121',
    '124',
    '127',
    '128',
    '131',
    '132',
    '134',
    '135',
    '140.57',
    '148',
    '161',
    '161.42',
    '163',
    '165',
    '168',
    '169',
    '174.88',
    '175',
    '178.24',
    '182',
    '185',
    '188',
    '188.33',
    '192',
    '195',
    '197',
    '201.78',
    '202',
    '215.23',
    '222',
    '322.85',
  ];
  roomTypeList = [
    'All',
    'Single room + ensuite',
    'Single room + no bathroom or ensuite',
    'Single room + shared bathroom',
    'Shared room + ensuite',
    'Shared room + no bathroom or ensuite',
    'Shared room + shared bathroom',
  ];
  servicesList = [
    'All',
    'Focus on socially and financially disadvantaged people',
    'Specific services for veterans',
    'Specific services for people with CALD backgrounds',
    'Specific services for ATSI people',
    'Specific services for LGBTI people',
    'People who are homeless or at risk of becoming homeless',
    'None',
  ];
  acreditationList = [
    'All', '3 Years', '1 Year'
  ];

  /**
   * ngOnInit invoke on load and load search results based on input passed from home component.
   */
  ngOnInit(): void {
    this.loading$ = of(true);
    const zipcode = this.data.zipcode;
    const type = this.data.organizationtype;
    if (zipcode && zipcode !== 0 && type && type !== 'All') {
      this.matchedItems$ = this.db.collection('goldenstick_data', ref =>
        ref.where('STREET_PCODE', '==', zipcode.toString()).where('Organisation Type', '==', type)
          .orderBy('AGED_CARE_NAME', 'asc')).valueChanges();
    } else if (zipcode && zipcode !== 0) {
      this.matchedItems$ = this.db.collection('goldenstick_data', ref =>
        ref.where('STREET_PCODE', '==', zipcode.toString()).orderBy('AGED_CARE_NAME', 'asc')).valueChanges();
    } else if (type && type !== 'All') {
      this.matchedItems$ = this.db.collection('goldenstick_data', ref =>
        ref.where('Organisation Type', '==', type).orderBy('AGED_CARE_NAME', 'asc')).valueChanges();
    } else {
      this.matchedItems$ = this.db.collection('goldenstick_data', ref => ref.orderBy('AGED_CARE_NAME', 'asc')).valueChanges();
    }
    this.matchedItems$.subscribe(matchedItems => {
      if (matchedItems) {
        this.matchedItems = matchedItems;
        this.originalData = matchedItems;
      }
      this.loading$ = of(false);
    });
  }

  /**
   * openSearchMore will open See more dialog
   * @param item item to get more detail
   */
  openSearchMore(item) {
    this.dialog.open(SeeMoreDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      panelClass: 'show-full-image-dialog',
      disableClose: true,
      autoFocus: false,
      data: { item }
    });
  }

  /**
   * filterdata will filter data
   * @param formValues contain filter valus
   */
  filterData(formValues) {
    let filteringData = this.originalData;
    this.isFilterData = true;
    if (formValues.services && formValues.services !== 'All') {
      const services = formValues.services;
      filteringData = filteringData.filter(item => item.PARTICULAR_NEED_SERVICES.includes(services));
    }
    if (formValues.acreditation && formValues.acreditation !== 'All') {
      const period = formValues.acreditation;
      filteringData = filteringData.filter(item => {
        return item.ACCREDITATION_PERIOD.trim() === period;
      });
    }
    if (formValues.price && formValues.price !== 'All') {
      const price = formValues.price;
      filteringData = filteringData.filter(item => {
        return item.roomDetail ? item.roomDetail.filter(room => room.MAX_DAP.trim() === price).length > 0 : false;
      });
    }
    if (formValues.roomtype && formValues.roomtype !== 'All') {
      const roomType = formValues.roomtype;
      filteringData = filteringData.filter(item => {
        return item.roomDetail ? item.roomDetail.filter(room => room.ROOM_TYPE.trim() === roomType).length > 0 : false;
      });
    }
    this.matchedItems = filteringData;
  }

  /**
   * scrollTop is for scroling to top
   */
  scrollTop() {
    document.querySelector('[id^="mat-dialog"]').scrollTo(0, 0);
  }

  /**
   * openCompareItems will open comparision dialog based on compareItems
   */
  openCompareItems() {
    this.dialog.open(CompareDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      panelClass: 'show-full-image-dialog',
      disableClose: true,
      autoFocus: false,
      data: { compareItems: this.compareItems }
    });
  }

  /**
   * clearFilterData will clear filtered data and load original data
   */
  clearFilterData() {
    this.isFilterData = false;
    this.filterForm.reset({
      roomtype: new FormControl(''),
      services: new FormControl(''),
      accredition: new FormControl('')
    }, { emitEvent: true });
    this.matchedItems = this.originalData;
  }

  /**
   * addToCompare will add item for comparision
   * @param item
   */
  addToCompare(item) {
    this.compareItems.push(item);
  }

  /**
   * removeFromCompare will remove item from comparision
   * @param serviceId
   */
  removeFromCompare(serviceId: string) {
    this.compareItems = this.compareItems.filter(item => item.SERVICE_ID !== serviceId);
  }

  /**
   * alreadyInCompare will verify exsisting item has already been added to comparision or not
   * @param serviceId
   */
  alreadyInCompare(serviceId: string) {
    return this.compareItems.filter(item => item.SERVICE_ID === serviceId).filter(a => !!a).length > 0;
  }
}
