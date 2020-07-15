import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError, retry } from 'rxjs/operators';

export class ErrorIntercept implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                //retry(1),
                //timeout(30000),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        if (error.message == "Timeout has occurred") {
                            errorMessage = `Server response has timed out.\n\nTry your search again after a few\nminutes or further filter your results\nby using additional search fields`;
                        }
                        
                        
                    }
                    window.alert(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }
}