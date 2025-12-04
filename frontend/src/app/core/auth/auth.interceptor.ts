import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  // Recuperar empresaId
  const empresaId = localStorage.getItem('empresaId') ?? '1';

  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (empresaId) {
    headers['x-empresa-id'] = empresaId;
  }

  const cloned = req.clone({ setHeaders: headers });

  return next(cloned);
};