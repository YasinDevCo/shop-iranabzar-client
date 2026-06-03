import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelPayments } from './user-panel-payments';

describe('UserPanelPayments', () => {
  let component: UserPanelPayments;
  let fixture: ComponentFixture<UserPanelPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
