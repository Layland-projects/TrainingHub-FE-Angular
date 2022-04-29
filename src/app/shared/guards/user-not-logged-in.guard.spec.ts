import { TestBed } from '@angular/core/testing';

import { UserNotLoggedInGuard } from './user-not-logged-in.guard';

describe('UserNotLoggedInGuard', () => {
  let guard: UserNotLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserNotLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
