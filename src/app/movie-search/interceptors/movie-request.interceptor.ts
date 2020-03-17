import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Http interceptor class for movie queries, required to intercept
 * all the outgoing traffic to set the request headers, including
 * respose type (text/html) and English language setting for responses.
 */
@Injectable({ providedIn: 'root' })
export class MovieRequestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('Doing an intercept...');

    req = req.clone({
      setHeaders: {
        'Content-Type': 'text/html; charset=utf-8',
        'Accept-Language': 'en-US'
      }
    });
    return next.handle(req);
  }
}
