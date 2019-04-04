import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectionDaysComponent } from './time-selection-days.component';

describe('TimeSelectionDaysComponent', () => {
  let component: TimeSelectionDaysComponent;
  let fixture: ComponentFixture<TimeSelectionDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeSelectionDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSelectionDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
