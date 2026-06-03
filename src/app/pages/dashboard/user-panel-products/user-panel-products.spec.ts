import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelProducts } from './user-panel-products';

describe('UserPanelProducts', () => {
  let component: UserPanelProducts;
  let fixture: ComponentFixture<UserPanelProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
