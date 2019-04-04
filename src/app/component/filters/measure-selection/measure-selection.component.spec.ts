import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureSelectionComponent } from './measure-selection.component';

describe('MeasureSelectionComponent', () => {
  let component: MeasureSelectionComponent;
  let fixture: ComponentFixture<MeasureSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasureSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
