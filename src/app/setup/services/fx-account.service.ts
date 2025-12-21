import { catchError, map } from 'rxjs/operators';
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';





import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class FxAccountService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }
  getAllFXAccountDropdownData() {
    return this.http.get(`${AppConstant.API_BASE}setups/get-all-fx-code`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
  getAllGLSubHeadCode(schemeCode) {
    return this.http.get(`${AppConstant.API_BASE}setups/get-gl-subhead-code?schemeCode=${schemeCode}`)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  foreignAccountCreation(formObj) {
    let bodyObj = JSON.stringify(formObj);
    return this.http.post(`${AppConstant.API_BASE}setups/foreign-currency-account-creation`, bodyObj)
      .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }
}