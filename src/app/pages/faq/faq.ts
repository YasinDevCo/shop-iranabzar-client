import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './faq.html',
  styleUrls: ['./faq.css']
})
export class Faq {
  activeIndex: number | null = null;

  faqCategories = [
    {
      name: 'حساب کاربری و ثبت سفارش',
      icon: '👤',
      questions: [
        {
          id: 1,
          question: 'چگونه می‌توانم در سایت ثبت نام کنم؟',
          answer: 'برای ثبت نام در سایت ایران ابزار، روی گزینه "ورود / ثبت نام" در بالای صفحه کلیک کنید و اطلاعات خواسته شده (نام، نام خانوادگی، ایمیل، شماره موبایل و رمز عبور) را وارد کنید. پس از تایید، حساب کاربری شما ایجاد می‌شود.'
        },
        {
          id: 2,
          question: 'آیا برای خرید نیاز به ثبت نام است؟',
          answer: 'بله، برای ثبت سفارش و پیگیری آن نیاز به حساب کاربری دارید. ثبت نام فقط چند دقیقه زمان می‌برد و کاملاً رایگان است.'
        },
        {
          id: 3,
          question: 'رمز عبور خود را فراموش کرده‌ام، چه کنم؟',
          answer: 'در صفحه ورود، روی گزینه "رمز عبور را فراموش کرده‌اید" کلیک کنید. ایمیلی حاوی لینک بازنشانی رمز عبور برای شما ارسال می‌شود.'
        }
      ]
    },
    {
      name: 'سفارش و پرداخت',
      icon: '🛒',
      questions: [
        {
          id: 4,
          question: 'چگونه می‌توانم سفارش خود را ثبت کنم؟',
          answer: 'پس از ورود به حساب کاربری، محصول مورد نظر را به سبد خرید اضافه کنید، سپس روی دکمه "پرداخت" کلیک کرده و مراحل ثبت سفارش را تا انتها طی کنید.'
        },
        {
          id: 5,
          question: 'روش‌های پرداخت چیست؟',
          answer: 'ما از درگاه‌های پرداخت امن مانند زرین‌پال پشتیبانی می‌کنیم. شما می‌توانید با استفاده از کارت‌های بانکی عضو شتاب پرداخت خود را انجام دهید.'
        },
        {
          id: 6,
          question: 'آیا امکان پرداخت در محل وجود دارد؟',
          answer: 'بله، برای شهر تهران و برخی شهرهای بزرگ امکان پرداخت در محل وجود دارد. برای اطلاع از جزئیات با پشتیبانی تماس بگیرید.'
        }
      ]
    },
    {
      name: 'ارسال و تحویل سفارش',
      icon: '🚚',
      questions: [
        {
          id: 7,
          question: 'هزینه ارسال چگونه محاسبه می‌شود؟',
          answer: 'هزینه ارسال بر اساس وزن بسته، مقصد و روش ارسال محاسبه می‌شود. برای سفارشات بالای ۵۰۰ هزار تومان، ارسال رایگان است.'
        },
        {
          id: 8,
          question: 'زمان تحویل سفارش چقدر است؟',
          answer: 'سفارشات تهران معمولاً ۱ تا ۳ روز کاری و شهرستان‌ها ۳ تا ۷ روز کاری بعد از تایید پرداخت ارسال می‌شوند.'
        },
        {
          id: 9,
          question: 'چگونه سفارش خود را پیگیری کنم؟',
          answer: 'وارد حساب کاربری خود شوید و از بخش "سفارشات من" می‌توانید وضعیت سفارش خود را مشاهده و پیگیری کنید.'
        }
      ]
    },
    {
      name: 'مرجوعی و گارانتی',
      icon: '🔄',
      questions: [
        {
          id: 10,
          question: 'شرایط مرجوعی کالا چیست؟',
          answer: 'در صورت وجود مشکل در کالا، تا ۷ روز پس از تحویل می‌توانید کالا را مرجوع کنید. کالا باید در بسته‌بندی اصلی و بدون استفاده باشد.'
        },
        {
          id: 11,
          question: 'گارانتی محصولات چگونه است؟',
          answer: 'تمامی محصولات دارای گارانتی اصالت و سلامت فیزیکی هستند. برخی محصولات دارای گارانتی اضافه از سوی نمایندگی می‌باشند.'
        },
        {
          id: 12,
          question: 'چگونه درخواست مرجوعی ثبت کنم؟',
          answer: 'با پشتیبانی تماس بگیرید یا از بخش "تماس با ما" درخواست خود را ثبت کنید. کارشناسان ما در اسرع وقت با شما تماس می‌گیرند.'
        }
      ]
    }
  ];

  // Calculate global index across all categories
  getGlobalIndex(categoryIndex: number, questionIndex: number): number {
    let globalIndex = 0;
    for (let i = 0; i < categoryIndex; i++) {
      globalIndex += this.faqCategories[i].questions.length;
    }
    return globalIndex + questionIndex;
  }

  // Toggle FAQ answer open/close
  toggleAnswer(categoryIndex: number, questionIndex: number): void {
    const globalIndex = this.getGlobalIndex(categoryIndex, questionIndex);
    if (this.activeIndex === globalIndex) {
      this.activeIndex = null;
    } else {
      this.activeIndex = globalIndex;
    }
  }
}
