import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelCategories } from './user-panel-categories';

describe('UserPanelCategories', () => {
  let component: UserPanelCategories;
  let fixture: ComponentFixture<UserPanelCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
