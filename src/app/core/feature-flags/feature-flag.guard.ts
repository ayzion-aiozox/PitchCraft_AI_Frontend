import { CanActivateFn } from '@angular/router';

export const featureFlagGuard: CanActivateFn = (route, state) => {
    return true;
};