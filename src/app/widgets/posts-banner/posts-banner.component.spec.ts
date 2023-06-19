import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsBannerComponent } from './posts-banner.component';

describe('PostsBannerComponent', () => {
  let component: PostsBannerComponent;
  let fixture: ComponentFixture<PostsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostsBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
