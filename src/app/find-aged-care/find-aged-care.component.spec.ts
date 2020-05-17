import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAgedCareComponent } from './find-aged-care.component';

describe('FindAgedCareComponent', () => {
  let component: FindAgedCareComponent;
  let fixture: ComponentFixture<FindAgedCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAgedCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAgedCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
