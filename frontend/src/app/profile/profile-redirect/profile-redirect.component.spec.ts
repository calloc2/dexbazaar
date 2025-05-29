import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileRedirectComponent } from './profile-redirect.component';

describe('ProfileRedirectComponent', () => {
  let component: ProfileRedirectComponent;
  let fixture: ComponentFixture<ProfileRedirectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProfileRedirectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
