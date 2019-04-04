import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMarketSelectionInlineComponent } from './product-market-selection-inline.component';

describe('ProductMarketSelectionInlineComponent', () => {
  let component: ProductMarketSelectionInlineComponent;
  let fixture: ComponentFixture<ProductMarketSelectionInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductMarketSelectionInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMarketSelectionInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
