import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelMessages } from './user-panel-messages';

describe('UserPanelMessages', () => {
  let component: UserPanelMessages;
  let fixture: ComponentFixture<UserPanelMessages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelMessages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
