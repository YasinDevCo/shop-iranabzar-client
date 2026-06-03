import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelDashboard } from './user-panel-dashboard';

describe('UserPanelDashboard', () => {
  let component: UserPanelDashboard;
  let fixture: ComponentFixture<UserPanelDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
