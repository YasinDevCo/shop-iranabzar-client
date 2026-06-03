import { signal, Directive } from '@angular/core';

@Directive()
export abstract class ModalBase<T = any> {
  // Modal state
  showModal = signal(false);
  selectedItem = signal<T | null>(null);
  submitted = signal(false);

  open(item?: T): void {
    this.selectedItem.set(item || null);
    this.showModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this.showModal.set(false);
    this.selectedItem.set(null);
    this.submitted.set(false);
    document.body.style.overflow = '';
  }

  protected abstract resetForm(): void;
}
