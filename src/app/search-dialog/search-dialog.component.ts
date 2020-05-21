import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Observable, of } from 'rxjs';
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
  relatedItems$: Observable<any>;
  relatedItems = [];

  priceList = [
    'All',
    '0-15',
    '16-30',
    '31-45',
    '46-60',
    '61-75',
    '76-90',
    '91-105',
    '106-120',
    '121-135',
    '136-150',
    '151-165',
    '166-180',
    '181-195',
    '196-210',
    '211-225',
    '226-240',
    '241-255',
    '256-270',
    '271-285',
    '286-300',
    '301-315',
    '316-330'
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
    'ATSI',
    'CALD Backgrounds',
    'Financially Disadvantageds',
    'Homeless or at Risk of Becoming Homeless',
    'LGBTI',
    'None',
    'Socially Disadvantageds',
    'Veterans'
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
        if (matchedItems.length <= 1) {
          let pincodes;
          if (matchedItems.length === 0) {
            pincodes = [zipcode.toString()];
          } else {
            matchedItems.map(item => {
              if (item.Cloest_Postcode) {
                const relatedPostcodes = item.Cloest_Postcode.replace('[', '').replace(']', '').replace(/"/g, '').split(',');
                pincodes = relatedPostcodes;
              }
            });
          }
          const relatedItems = [];
          pincodes.map(async (postcode) => {
            relatedItems.push(this.db.collection('goldenstick_data', ref => ref.where('STREET_PCODE', '==', postcode.trim()))
              .valueChanges());
          });
          this.relatedItems$ = combineLatest(relatedItems);
          this.relatedItems$.subscribe(d => {
            d.map(i => (this.relatedItems.length <= 6) ? this.relatedItems.push(...i) : '');
          });
        }
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
    let recommendBasedOnType: { key: string, value: any };
    if (formValues.services && formValues.services !== 'All') {
      const services = formValues.services;
      recommendBasedOnType = { key: 'PARTICULAR_NEED_SERVICES', value: services };
      filteringData = filteringData.filter(item => item.PARTICULAR_NEED_SERVICES.includes(services));
    }
    if (formValues.acreditation && formValues.acreditation !== 'All') {
      const period = formValues.acreditation;
      recommendBasedOnType = { key: 'ACCREDITATION_PERIOD', value: period };
      filteringData = filteringData.filter(item => {
        return item.ACCREDITATION_PERIOD.trim() === period;
      });
    }
    if (formValues.price && formValues.price !== 'All') {
      const price = formValues.price;
      const lowPrice = Number(price.split('-')[0]);
      const highPrice = Number(price.split('-')[1]);
      filteringData = filteringData.filter(item => {
        return item.roomDetail ? item.roomDetail
          .filter(room => {
            const numprice = Number(room.DAILY_PRICE.trim());
            return numprice >= lowPrice && numprice <= highPrice;
          }).length > 0 : false;
      });
    }
    if (formValues.roomtype && formValues.roomtype !== 'All') {
      const roomType = formValues.roomtype;
      filteringData = filteringData.filter(item => {
        return item.roomDetail ? item.roomDetail.filter(room => room.ROOM_TYPE.trim() === roomType).length > 0 : false;
      });
    }
    this.matchedItems = filteringData;
    if (filteringData.length <= 1 && recommendBasedOnType && recommendBasedOnType.key) {
      if (recommendBasedOnType.key === 'PARTICULAR_NEED_SERVICES') {
        this.relatedItems$ = this.db.collection('goldenstick_data').valueChanges();
        this.relatedItems$.subscribe(d => {
          if (d && d.length > 0) {
            d.filter(i => i?.PARTICULAR_NEED_SERVICES.includes(recommendBasedOnType.value))
              .map(i => (this.relatedItems.length <= 6) ? this.relatedItems.push(i) : '');
          }
        });
      } else {
        this.relatedItems$ = this.db.collection('goldenstick_data', ref => ref
          .where(recommendBasedOnType.key, '==', recommendBasedOnType.value.trim()))
          .valueChanges();
        this.relatedItems$.subscribe(d => {
          d.map(i => (this.relatedItems.length <= 6) ? this.relatedItems.push(i) : '');
        });
      }
    }


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
