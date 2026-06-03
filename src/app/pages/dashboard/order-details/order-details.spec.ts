import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsTs } from './order-details.ts';

describe('OrderDetailsTs', () => {
  let component: OrderDetailsTs;
  let fixture: ComponentFixture<OrderDetailsTs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailsTs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDetailsTs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
