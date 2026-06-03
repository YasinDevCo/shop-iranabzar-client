import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() minlength: number | null = null;
  @Input() pattern: string | null = null;
  @Input() email: boolean = false;
  @Input() submitted: boolean = false;

  value: any = '';
  touched = false;
  disabled = false;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    this.value = event.target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  get isInvalid(): boolean {
    return (this.touched || this.submitted) && !this.isValid;
  }

  get isValid(): boolean {
    if (this.disabled) return true;
    if (this.required && !this.value) return false;
    if (this.minlength && this.value?.length < this.minlength) return false;
    if (this.pattern && !new RegExp(this.pattern).test(this.value)) return false;
    if (this.email && this.value && !this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return false;
    return true;
  }

  getErrorMessage(): string {
    if (!this.required && !this.value) return '';
    if (this.required && !this.value) return `${this.placeholder} الزامی است`;
    if (this.minlength && this.value?.length < this.minlength) {
      return `${this.placeholder} باید حداقل ${this.minlength} کاراکتر باشد`;
    }
    if (this.pattern && !new RegExp(this.pattern).test(this.value)) {
      if (this.name === 'mobile') return 'شماره موبایل معتبر وارد کنید (مثال: 09123456789)';
      return `${this.placeholder} معتبر وارد کنید`;
    }
    if (this.email && !this.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return 'ایمیل معتبر وارد کنید';
    }
    return '';
  }
}
