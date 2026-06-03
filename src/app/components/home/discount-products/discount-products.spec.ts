import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountProducts } from './discount-products';

describe('DiscountProducts', () => {
  let component: DiscountProducts;
  let fixture: ComponentFixture<DiscountProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
