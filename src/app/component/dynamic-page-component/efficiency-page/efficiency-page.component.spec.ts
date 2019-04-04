import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EfficiencyPageComponent } from './efficiency-page.component';

describe('EfficiencyPageComponent', () => {
  let component: EfficiencyPageComponent;
  let fixture: ComponentFixture<EfficiencyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EfficiencyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfficiencyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
