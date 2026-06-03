import {CanActivateFn} from '@angular/router';
import {AccountService} from '../services/account.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  let accountService: AccountService = inject(AccountService)
  if (accountService == null)
    return false

  if (accountService.isLoggedIn())
    return true
  else
    return false;
};
