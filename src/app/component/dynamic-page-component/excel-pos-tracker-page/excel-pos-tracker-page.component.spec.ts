import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelPosTrackerPageComponent } from './excel-pos-tracker-page.component';

describe('ExcelPosTrackerPageComponent', () => {
  let component: ExcelPosTrackerPageComponent;
  let fixture: ComponentFixture<ExcelPosTrackerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelPosTrackerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelPosTrackerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
