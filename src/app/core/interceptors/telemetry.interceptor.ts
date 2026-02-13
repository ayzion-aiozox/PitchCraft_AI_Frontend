import { HttpInterceptorFn } from '@angular/common/http';

export const telemetryInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req);
};