import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class Category implements OnInit, OnDestroy {
  // ==================== Data Properties ====================
  selectedCategoryId: string | null = '4';
  isMobileView: boolean = false;

  // ==================== Categories List ====================
  categories: CategoryItem[] = [
    { id: '1', name: 'ابزارآلات صنعتی', icon: '/cate1.svg', active: false },
    { id: '2', name: 'لوازم یدکی', icon: '/cate2.svg', active: false },
    { id: '3', name: 'تجهیزات برقی', icon: '/cate3.svg', active: false },
    { id: '4', name: 'ابزار دقیق', icon: '/cate4.svg', active: true },
    { id: '5', name: 'چکش و دریل', icon: '/cate5.svg', active: false },
    { id: '6', name: 'پیچ گوشتی', icon: '/cate6.svg', active: false },
    { id: '7', name: 'انبردست', icon: '/cate7.svg', active: false },
  ];

  constructor(private router: Router) {}

  // ==================== Lifecycle Hooks ====================
  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  // ==================== Screen Size Handler ====================
  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  handleResize(): void {
    this.checkScreenSize();
  }

  // ==================== Category Selection ====================
  selectCategory(categoryId: string, categoryName: string): void {
    this.selectedCategoryId = categoryId;

    // Update active state for all categories
    this.categories.forEach(cat => {
      cat.active = cat.id === categoryId;
    });

    this.router.navigate(['/products'], {
      queryParams: { category: categoryId, categoryName: categoryName }
    });
  }
}
