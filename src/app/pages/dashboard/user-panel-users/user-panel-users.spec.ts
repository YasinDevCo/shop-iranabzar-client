import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelUsers } from './user-panel-users';

describe('UserPanelUsers', () => {
  let component: UserPanelUsers;
  let fixture: ComponentFixture<UserPanelUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelUsers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
