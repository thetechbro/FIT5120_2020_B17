import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'new-topbar',
  templateUrl: './new-topbar.component.html',
  styleUrls: ['./new-topbar.component.scss']
})

export class NewTopbarComponent {
  refresh: any;
  title = 'goldenstick';
  loading$: Observable<boolean>
  
  setRefresh(){
    this.refresh = true;
    console.log(this.refresh)
   }

  constructor() { }

  }

