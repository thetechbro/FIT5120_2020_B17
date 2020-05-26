import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-find-aged-care',
  templateUrl: './find-aged-care.component.html',
  styleUrls: ['./find-aged-care.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class FindAgedCareComponent implements OnInit {
  searchPincodeForm = new FormGroup({
    zipcode: new FormControl(''),
    organizationtype: new FormControl('')
  });

  organizationtypeList = [
    'All',
    'Private Incorporated Body',
    'Religious',
    'Community Based',
    'State Government',
    'Charitable'
  ];
  constructor(private dialog: MatDialog, private db: AngularFirestore) { }

  ngOnInit(): void {
  }

  /**
   * getHome will open search dialog with selected zipcode and type
   * @param zipcode - zipcode
   * @param type - organization type
   */
  getHome(zipcode: number, type: string) {
    if (!zipcode && !type) {
      this.searchPincodeForm.setErrors({
        noinput: true
      }, { emitEvent: true });
      return;
    }
    if (zipcode && (isNaN(zipcode) || zipcode <= 0)) {
      this.searchPincodeForm.controls.zipcode.setErrors({
        invalid: true
      }, { emitEvent: true });
      return;
    }
    if (zipcode) {
      const ifExistSnap = this.db.collection('goldenstick_data', ref =>
        ref.where('STREET_PCODE', '==', zipcode.toString()).orderBy('AGED_CARE_NAME', 'asc')).valueChanges();
      ifExistSnap.subscribe(pincode => {
        if (pincode && pincode.length > 0) {
          this.openSearchDialog(zipcode, type);
        } else {
          this.searchPincodeForm.controls.zipcode.setErrors({
            notExist: true
          }, { emitEvent: true });
          return;
        }
      });
    } else {
      this.openSearchDialog(zipcode, type);
    }
  }

  /**
   * This method will open search dialog with aged care results.
   * @param zipcode postcode
   * @param type organization type
   */
  openSearchDialog(zipcode, type){
    this.dialog.open(SearchDialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      panelClass: 'show-full-image-dialog',
      disableClose: true,
      autoFocus: false,
      data: { zipcode: Number(zipcode), organizationtype: type }
    });
  }
}
