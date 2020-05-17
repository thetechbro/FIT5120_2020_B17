import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tableau75Component } from './tableau75.component';

describe('Tableau75Component', () => {
  let component: Tableau75Component;
  let fixture: ComponentFixture<Tableau75Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tableau75Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tableau75Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
