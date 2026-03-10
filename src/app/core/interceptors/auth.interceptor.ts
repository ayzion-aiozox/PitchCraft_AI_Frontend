import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageConstant } from '../../shared/constants/local-storage.constant';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(LocalStorageConstant.Token);
  let workspaceId = localStorage.getItem(LocalStorageConstant.WorkspaceId);
  if (!workspaceId && (environment as { defaultWorkspaceId?: string }).defaultWorkspaceId) {
    workspaceId = (environment as { defaultWorkspaceId: string }).defaultWorkspaceId;
  }

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (workspaceId) headers['X-Workspace-Id'] = workspaceId;

  if (Object.keys(headers).length > 0) {
    return next(req.clone({ setHeaders: headers }));
  }

  return next(req);
};
