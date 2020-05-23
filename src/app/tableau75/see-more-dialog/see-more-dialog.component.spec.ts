import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeMoreDialogComponent } from './see-more-dialog.component';

describe('SeeMoreDialogComponent', () => {
  let component: SeeMoreDialogComponent;
  let fixture: ComponentFixture<SeeMoreDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeMoreDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeMoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
