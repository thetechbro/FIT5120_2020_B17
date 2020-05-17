import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'new-topbar',
  templateUrl: './new-topbar.component.html',
  styleUrls: ['./new-topbar.component.scss']
})
export class NewTopbarComponent implements OnInit {
  
  title = 'goldenstick';
  loading$: Observable<boolean>;

  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
