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
    '350',
    '40000',
    '150000',
    '170000',
    '175000',
    '190000',
    '200000',
    '210000',
    '225000',
    '228000',
    '233000',
    '240000',
    '250000',
    '253000',
    '255000',
    '260000',
    '265000',
    '275000',
    '279000',
    '280000',
    '285000',
    '290000',
    '295000',
    '299000',
    '300000',
    '304000',
    '310000',
    '315000',
    '319000',
    '320000',
    '324000',
    '325000',
    '330000',
    '335000',
    '340000',
    '345000',
    '349000',
    '350000',
    '355000',
    '359000',
    '360000',
    '365000',
    '366000',
    '369000',
    '370000',
    '375000',
    '380000',
    '385000',
    '390000',
    '395000',
    '400000',
    '405000',
    '406000',
    '410000',
    '413000',
    '415000',
    '420000',
    '421000',
    '425000',
    '426000',
    '430000',
    '440000',
    '441000',
    '449000',
    '450000',
    '456000',
    '460000',
    '461000',
    '470000',
    '475000',
    '480000',
    '485000',
    '490000',
    '495000',
    '500000',
    '507000',
    '520000',
    '525000',
    '530000',
    '540000',
    '545000',
    '548000',
    '550000',
    '557000',
    '560000',
    '568000',
    '570000',
    '575000',
    '598000',
    '600000',
    '611400',
    '625000',
    '628000',
    '639000',
    '650000',
    '662350',
    '664000',
    '675000',
    '679000',
    '681000',
    '685000',
    '690000',
    '695000',
    '700000',
    '710000',
    '730000',
    '733000',
    '750000',
    '751000',
    '760000',
    '766000',
    '783000',
    '785000',
    '800000',
    '803750',
    '812000',
    '825000',
    '838000',
    '850000',
    '852000',
    '875000',
    '880000',
    '888000',
    '900000',
    '925000',
    '943000',
    '950000',
    '975000',
    '980000',
    '995000',
    '1000000',
    '1045000',
    '1100000',
    '1200000',
    '1210000',
    '1226000',
    '1250000',
    '1254000',
    '1257000',
    '1300000',
    '1325000',
    '1350000',
    '1375000',
    '1400000',
    '1425000',
    '1450000',
    '1466000',
    '1500000',
    '1600000',
    '1650000',
    '240000'
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

  ngOnInit(): void {
    this.loading$ = of(true);
    const zipcode = this.data.zipcode;
    const type = this.data.organizationtype;
    if (zipcode && zipcode !== 0 && type && type !== 'All') {
      this.matchedItems$ = this.db.collection('goldenstick', ref =>
        ref.where('STREET_PCODE', '==', zipcode.toString()).where('Organisation Type', '==', type)
          .orderBy('SERVICE_NAME', 'asc')).valueChanges();
    } else if (zipcode && zipcode !== 0) {
      this.matchedItems$ = this.db.collection('goldenstick', ref =>
        ref.where('STREET_PCODE', '==', zipcode.toString()).orderBy('SERVICE_NAME', 'asc')).valueChanges();
    } else if (type && type !== 'All') {
      this.matchedItems$ = this.db.collection('goldenstick', ref =>
        ref.where('Organisation Type', '==', type).orderBy('SERVICE_NAME', 'asc')).valueChanges();
    } else {
      this.matchedItems$ = this.db.collection('goldenstick', ref => ref.orderBy('SERVICE_NAME', 'asc')).valueChanges();
    }
    this.matchedItems$.subscribe(matchedItems => {
      if (matchedItems) {
        this.matchedItems = matchedItems;
        this.originalData = matchedItems;
      }
      this.loading$ = of(false);
    });
  }

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
        return item.roomDetail ? item.roomDetail.filter(room => room.Price.trim() === price).length > 0 : false;
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
   * scrollTop is for scrooling to top
   */
  scrollTop() {
    document.querySelector('#mat-dialog-0').scrollTo(0, 0);
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

  addToCompare(item) {
    this.compareItems.push(item);
  }

  removeFromCompare(serviceId: string) {
    this.compareItems = this.compareItems.filter(item => item.SERVICE_ID !== serviceId);
  }

  alreadyInCompare(serviceId: string) {
    return this.compareItems.filter(item => item.SERVICE_ID === serviceId).filter(a => !!a).length > 0;
  }
}
