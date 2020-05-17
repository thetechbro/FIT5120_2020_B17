import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tableau65Component } from './tableau65.component';

describe('Tableau65Component', () => {
  let component: Tableau65Component;
  let fixture: ComponentFixture<Tableau65Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tableau65Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tableau65Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
