import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestReviewComponent } from './guest-review.component';

describe('GuestReviewComponent', () => {
  let component: GuestReviewComponent;
  let fixture: ComponentFixture<GuestReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
