import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../loader/loader.service';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  constructor(
    private toasterService: ToastrService,
    private loader: LoaderService
) {
}

public responseMiddleware(observable: Observable<any>, transform?: Function): Observable<any> {
    this.loader.show();

    return observable
        .pipe(map((response: any) => {
            this.loader.hide();

            if (transform) {
                return transform(response);
            }

            return response;
        }),
        catchError(res => {
            this.loader.hide();

            if (res.error.errors && res.error.errors.length) {
                res.error.errors.forEach(error => this.toasterService.show("An error occurred"));
            }

            if (res.error.message) {
                this.toasterService.show("An error occurred");
            }

            return Observable.throw(res);
        }));
}
}
