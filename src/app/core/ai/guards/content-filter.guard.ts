import { CanActivateFn } from '@angular/router';

export const contentFilterGuard: CanActivateFn = (route, state) => {
    return true;
};