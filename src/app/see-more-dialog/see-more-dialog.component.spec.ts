import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-see-more-dialog',
  templateUrl: './see-more-dialog.component.html',
  styleUrls: ['./see-more-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeeMoreDialogComponent implements OnInit {
  loading$: Observable<boolean>;
  isOpenFacility: boolean;
  isOpenRoomDetail: boolean;
  facilities$: Observable<unknown[]>;
  displayedColumns = ['No', 'Name', 'Sports'];
  constructor(
    private db: AngularFirestore,
    public dialogRef: MatDialogRef<SeeMoreDialogComponent>, private sanitizer: DomSanitizer, @Inject(MAT_DIALOG_DATA) public data: {
      item
    }) { }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps/embed/v1/place?key=${environment.googleMapAPI}&q=${encodeURI(this.data.item.AGED_CARE_NAME)}&center=${Number(this.data.item.Latitude)},${Number(this.data.item.Longitude)}`);
  }
  
  ngOnInit(): void {
    console.log(this.data.item);
    if (this.data && this.data.item && this.data.item.CLOSEST_Facility) {
      const cloestFacilities = [...new Set(this.data.item.CLOSEST_Facility.replace('[', '')
        .replace(']', '').replace(/"/g, '')
        .replace(/'/g, '').replace(/ /g, '').split(',') as string)];
      console.log(cloestFacilities);
      const facilites = [];
      for (const facilityId of cloestFacilities) {
        facilites.push(this.db.collection('goldenstick_facility').doc(facilityId).valueChanges());
      }
      this.facilities$ = combineLatest(facilites);
    }
  }

  /**
   * scrollTop is for scroling to top
   */
  scrollTop() {
    const elem = document.querySelectorAll('[id^="mat-dialog"]');
    elem.forEach(e => e.scrollTo(0, 0));
  }
}
