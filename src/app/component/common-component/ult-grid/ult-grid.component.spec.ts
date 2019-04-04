import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltGridComponent } from './ult-grid.component';

describe('UltGridComponent', () => {
  let component: UltGridComponent;
  let fixture: ComponentFixture<UltGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
