import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionGapFinderPageComponent } from './distribution-gap-finder-page.component';

describe('DistributionGapFinderPageComponent', () => {
  let component: DistributionGapFinderPageComponent;
  let fixture: ComponentFixture<DistributionGapFinderPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionGapFinderPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionGapFinderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
