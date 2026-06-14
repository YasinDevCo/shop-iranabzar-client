import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    NgIf,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  activeLink: string = '/';
  searchQuery: string = '';
  isDrawerOpen: boolean = false;

  // برای دیباگ - وضعیت لاگین
  isUserLoggedIn: boolean = false;

  constructor(private router: Router, public account: AccountService) {
    // چک کردن وضعیت لاگین
    this.checkLoginStatus();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url;
        this.closeDrawer();
        // بروزرسانی وضعیت لاگین بعد از نویگیت
        this.checkLoginStatus();
      }
    });
  }

  checkLoginStatus() {
    this.isUserLoggedIn = this.account.isLoggedIn();
    console.log('Login status:', this.isUserLoggedIn); // برای دیباگ
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    console.log('Drawer toggled:', this.isDrawerOpen); // برای دیباگ

    if (this.isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    document.body.style.overflow = '';
  }

  // متدهای نویگیشن با لاگ برای دیباگ
  goToAccount() {
    console.log('goToAccount clicked');
    this.closeDrawer();
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    console.log('goToDashboard clicked');
    if (!this.account.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.closeDrawer();
    this.router.navigate(['/dashboard/home']);
  }

  onSearch(): void {
    console.log('Search:', this.searchQuery);
    this.closeDrawer();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    }
  }

  setActiveLink(url: string) {
    console.log('setActiveLink:', url);
    this.activeLink = url;
    this.closeDrawer();
  }

  isActive(url: string): boolean {
    return this.activeLink === url;
  }

  goToCate() {
    console.log('goToCate clicked');
    this.closeDrawer();
    this.router.navigate(['/category']);
  }

  goToCarts() {
    console.log('goToCarts clicked');
    this.router.navigate(['/cart']);
  }
}
