import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageConstant } from '../../shared/constants/local-storage.constant';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(LocalStorageConstant.Token);

  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authReq);
  }

  return next(req);
};
