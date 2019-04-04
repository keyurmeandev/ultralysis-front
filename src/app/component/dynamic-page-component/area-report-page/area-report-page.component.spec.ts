import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaReportPageComponent } from './area-report-page.component';

describe('AreaReportPageComponent', () => {
  let component: AreaReportPageComponent;
  let fixture: ComponentFixture<AreaReportPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaReportPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
