import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url-interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, authInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-left',
      preventDuplicates: true,
      timeOut: 4000,
      extendedTimeOut: 1000,
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: false,
      newestOnTop: true,
      tapToDismiss: false,
      maxOpened: 5,
      autoDismiss: true,
      enableHtml: true,
      titleClass: 'toast-title',
      messageClass: 'toast-message',
      toastClass: 'toast',
      easeTime: 300,
      easing: 'ease-in-out',
    })
  ]
};
