import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByStorePageComponent } from './sales-by-store-page.component';

describe('SalesByStorePageComponent', () => {
  let component: SalesByStorePageComponent;
  let fixture: ComponentFixture<SalesByStorePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesByStorePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesByStorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
