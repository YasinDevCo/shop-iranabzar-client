import { signal, OnInit, OnDestroy, Directive } from '@angular/core';

@Directive()
export abstract class ScreenBase implements OnInit, OnDestroy {
  isMobile = signal(false);
  private resizeHandler: () => void;

  constructor() {
    this.resizeHandler = () => this.checkScreenSize();
  }

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
  }

  protected checkScreenSize(): void {
    this.isMobile.set(window.innerWidth <= 768);
  }
}
