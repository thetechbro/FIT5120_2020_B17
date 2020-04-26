import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-compare-dialog',
  templateUrl: './compare-dialog.component.html',
  styleUrls: ['./compare-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareDialogComponent implements OnInit {
  loading$: Observable<boolean>;
  constructor(public dialogRef: MatDialogRef<CompareDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    compareItems
  }) { }


  ngOnInit(): void {
  }

}
