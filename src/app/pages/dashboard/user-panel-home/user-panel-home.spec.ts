import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelHome } from './user-panel-home';

describe('UserPanelHome', () => {
  let component: UserPanelHome;
  let fixture: ComponentFixture<UserPanelHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
