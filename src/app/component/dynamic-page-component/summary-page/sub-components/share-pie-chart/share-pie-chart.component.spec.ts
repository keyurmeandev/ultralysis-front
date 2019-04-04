import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePieChartComponent } from './share-pie-chart.component';

describe('SharePieChartComponent', () => {
  let component: SharePieChartComponent;
  let fixture: ComponentFixture<SharePieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
