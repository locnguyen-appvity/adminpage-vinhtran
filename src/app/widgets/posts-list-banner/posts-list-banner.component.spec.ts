import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsListBannerComponent } from './posts-list-banner.component';

describe('PostsListBannerComponent', () => {
  let component: PostsListBannerComponent;
  let fixture: ComponentFixture<PostsListBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsListBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsListBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
