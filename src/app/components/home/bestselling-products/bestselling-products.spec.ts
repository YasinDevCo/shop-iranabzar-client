import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestsellingProducts } from './bestselling-products';

describe('BestsellingProducts', () => {
  let component: BestsellingProducts;
  let fixture: ComponentFixture<BestsellingProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestsellingProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestsellingProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
