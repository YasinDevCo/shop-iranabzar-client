import {HttpInterceptorFn} from '@angular/common/http';
import {ApiAddress} from '../utilities/api-address-util';

export const baseUrlInterceptor: HttpInterceptorFn =
  (req, next) => {

    if (!req.url.startsWith("http")) {
      const newUrl = req.clone({
        url: `${ApiAddress.baseAddress}${req.url}`
      });
      return next(newUrl)
    } else {
      return next(req);
    }


  };
