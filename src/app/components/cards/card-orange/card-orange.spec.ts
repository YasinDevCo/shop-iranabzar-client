import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOrange } from './card-orange';

describe('CardOrange', () => {
  let component: CardOrange;
  let fixture: ComponentFixture<CardOrange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOrange]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardOrange);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
