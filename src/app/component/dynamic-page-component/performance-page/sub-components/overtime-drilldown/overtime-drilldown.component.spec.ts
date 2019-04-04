import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeDrilldownComponent } from './overtime-drilldown.component';

describe('OvertimeDrilldownComponent', () => {
  let component: OvertimeDrilldownComponent;
  let fixture: ComponentFixture<OvertimeDrilldownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeDrilldownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeDrilldownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
