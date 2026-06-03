import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPanelBlogs } from './user-panel-blogs';

describe('UserPanelBlogs', () => {
  let component: UserPanelBlogs;
  let fixture: ComponentFixture<UserPanelBlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPanelBlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPanelBlogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
