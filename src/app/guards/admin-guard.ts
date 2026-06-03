import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AccountService } from '../services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  if (!accountService.isLoggedIn())
    return false;

  if (!accountService.isAdmin())
    return false;

  return true;
};
