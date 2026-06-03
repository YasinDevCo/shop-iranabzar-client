import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelProfile } from './user-panel-profile';

describe('UserPanelProfile', () => {
  let component: UserPanelProfile;
  let fixture: ComponentFixture<UserPanelProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
