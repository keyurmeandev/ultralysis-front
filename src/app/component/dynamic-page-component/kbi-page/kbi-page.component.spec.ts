import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KbiPageComponent } from './kbi-page.component';

describe('KbiPageComponent', () => {
  let component: KbiPageComponent;
  let fixture: ComponentFixture<KbiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KbiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KbiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
