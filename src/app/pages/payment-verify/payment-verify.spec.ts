import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVerify } from './payment-verify';

describe('PaymentVerify', () => {
  let component: PaymentVerify;
  let fixture: ComponentFixture<PaymentVerify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentVerify]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentVerify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
