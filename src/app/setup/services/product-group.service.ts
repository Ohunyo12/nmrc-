
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';
import { ProductGroup } from '../models/product-group';

let AppConstant: any = {};
@Injectable()
export class ProductGroupService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getProductGroups() {
        return this.http.get(`${AppConstant.API_BASE}setups/product-group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProductTypeByGroupId(prodGroupId: number) {
        return this.http.get(`${AppConstant.API_BASE}setups/product-type-by-group/${prodGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    save(body) {
        let bodyObj = JSON.stringify(body);

        return this.http.post(`${AppConstant.API_BASE}setups/product-group`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    update(body, id: number) {
        let bodyObj = JSON.stringify(body);

        return this.http.put(`${AppConstant.API_BASE}setups/product-group/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    delete(id: number) {
        return this.http.delete(`${AppConstant.API_BASE}setups/product-group/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}