import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTopbarComponent } from './new-topbar.component';

describe('NewTopbarComponent', () => {
  let component: NewTopbarComponent;
  let fixture: ComponentFixture<NewTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
