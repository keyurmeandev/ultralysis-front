import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDriverAnalysisPageComponent } from './detail-driver-analysis-page.component';

describe('DetailDriverAnalysisPageComponent', () => {
  let component: DetailDriverAnalysisPageComponent;
  let fixture: ComponentFixture<DetailDriverAnalysisPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailDriverAnalysisPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDriverAnalysisPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
