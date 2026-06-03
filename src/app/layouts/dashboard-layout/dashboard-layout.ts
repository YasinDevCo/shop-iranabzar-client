import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    NgIf,
    RouterLink
  ],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css'],
})
export class DashboardLayout {
  activeLink: string = '/';
  isSidebarOpen: boolean = true;

  constructor(private router: Router, public account: AccountService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goToHome() {
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
