import { ListBase } from './list-base';

export abstract class CrudBase<T, CreateDto, UpdateDto> extends ListBase<T> {
  // Add modal
  showAddModal = false;
  showEditModal = false;

  // Form model
  abstract formModel: CreateDto | UpdateDto;

  // Abstract methods
  protected abstract createItem(data: CreateDto): void;
  protected abstract updateItem(id: string, data: UpdateDto): void;
  protected abstract deleteItem(id: string): void;

  openAddModal(): void {
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  openEditModal(item: T): void {
    this.showEditModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    document.body.style.overflow = '';
  }
}
