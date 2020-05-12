import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

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
  constructor(public dialogRef: MatDialogRef<SeeMoreDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    item
  }) { }

  ngOnInit(): void {
  }

  /**
   * scrollTop is for scroling to top
   */
  scrollTop() {
    const elem = document.querySelectorAll('[id^="mat-dialog"]');
    elem.forEach(e => e.scrollTo(0, 0));
  }
}
