import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSalesColumnChartComponent } from './total-sales-column-chart.component';

describe('TotalSalesColumnChartComponent', () => {
  let component: TotalSalesColumnChartComponent;
  let fixture: ComponentFixture<TotalSalesColumnChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalSalesColumnChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalSalesColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
