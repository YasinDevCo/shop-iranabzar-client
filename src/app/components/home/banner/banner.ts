import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner implements OnInit, OnDestroy {
  banners = [
    {
      title: 'دریل های شارژی ASED',
      subtitle: 'با فناوری موتور براش لمسی',
      image: '/banner.png'
    },
    {
      title: 'سنگ های برشی MAX',
      subtitle: 'با تیغه الماسه و برش دقیق',
      image: '/banner.png'
    },
    {
      title: 'اره های برقی PRO',
      subtitle: 'با موتور قدرتمند و بی صدا',
      image: '/banner.png'
    }
  ];

  currentIndex = 0;
  private autoPlayInterval: any;
  private readonly AUTO_PLAY_INTERVAL_MS = 5000;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  get currentBanner() {
    return this.banners[this.currentIndex];
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.AUTO_PLAY_INTERVAL_MS);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  nextSlide() {
    if (this.currentIndex < this.banners.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.banners.length - 1;
    }
    this.resetAutoPlay();
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.resetAutoPlay();
  }
}
