import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Prefixes all relative API calls with /api so the dev-server proxy
 * (or nginx in production) forwards them to the API Gateway.
 *
 * Relative paths like 'auth/login' → '/api/auth/login'
 * Absolute URLs (http://...) are left unchanged.
 */
export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip absolute URLs and assets
  if (req.url.startsWith('http') || req.url.startsWith('/assets') || req.url.startsWith('assets')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `/api/${req.url}`
  });

  return next(apiReq);
};
