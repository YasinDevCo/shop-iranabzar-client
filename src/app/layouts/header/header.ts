import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';

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

  constructor(private router: Router, public account: AccountService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.url;
      }
    });
  }

  goToAccount() {
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    // چک کردن لاگین بودن کاربر
    if (!this.account.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/dashboard/home']);
  }
  onSearch(): void {
    // if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
    // }
  }
  setActiveLink(url: string) {
    this.activeLink = url;
  }

  isActive(url: string): boolean {
    return this.activeLink === url;
  }

  goToCate() {
    this.router.navigate(['/category']);

  }
  goToCarts() {
    this.router.navigate(['/cart']);

  }
}
