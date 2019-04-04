import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthDeclineDriverPageComponent } from './growth-decline-driver-page.component';

describe('GrowthDeclineDriverPageComponent', () => {
  let component: GrowthDeclineDriverPageComponent;
  let fixture: ComponentFixture<GrowthDeclineDriverPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrowthDeclineDriverPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthDeclineDriverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
