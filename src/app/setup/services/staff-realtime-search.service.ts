// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';





import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class StaffRealTimeSearchService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    search(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}setup/staff/search/?queryString=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }



    searchApprovers(terms: Observable<any>, operationId, approvelLevelId) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchApproversEntries(term, approvelLevelId)));
    }

    searchApproversEntries(term, levelId) {
        return this.http
            .get(`${AppConstant.API_BASE}setup/staff/approver-search/levelId/${levelId}/?queryString=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}

function observableThrowError(arg0: any): any {
    throw new Error('Function not implemented.');
}
