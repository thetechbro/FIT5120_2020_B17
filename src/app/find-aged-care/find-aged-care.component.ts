import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';


@Component({
  selector: 'app-find-aged-care',
  templateUrl: './find-aged-care.component.html',
  styleUrls: ['./find-aged-care.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

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
  constructor(private dialog: MatDialog) { }

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
    if (zipcode && isNaN(zipcode)) {
      this.searchPincodeForm.controls.zipcode.setErrors({
        invalid: true
      }, { emitEvent: true });
      return;
    }
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