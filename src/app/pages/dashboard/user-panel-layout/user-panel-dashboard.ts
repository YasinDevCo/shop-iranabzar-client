import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-user-panel-dashboard',
  imports: [

  ],
  templateUrl: './user-panel-layout.html',
  styleUrl: './user-panel-layout.css',
})
export class UserPanelDashboard {
  activeLink: string = '/'; // لینک فعال پیش‌فرض

  constructor(private router: Router,public account: AccountService) {
    // تشخیص مسیر فعلی هنگام تغییر مسیر
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url;
      }
    });
  }
  goToHome(){
    this.router.navigate(['/']);
  }



  setActiveLink(url: string) {
    this.activeLink = url;
  }

  isActive(url: string): boolean {
    return this.activeLink === url;
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
