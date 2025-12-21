import { Injectable } from "@angular/core";
import { throwError as observableThrowError, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthHttp } from "../../admin/services/token.service";
import { AppConfigService } from "../../shared/services/app.config.service";
import { HttpParams } from "@angular/common/http";

let AppConstant: any = {};

@Injectable({
  providedIn: "root",
})
export class LoanRefinancingService {
  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }

  getSecondaryLender() {
    return this.http
      .get(`${AppConstant.ECOSYSTEM_API_BASE}Customer/LoadSecondaryLenders`)
      .pipe(
        map((res: any) => res),
        catchError((error: any) =>
          observableThrowError(error.error || "Server error")
        )
      );
  }

  // getDisbursedLoans(companyId: number) {
  //   const params = new HttpParams().set('companyId', companyId.toString());
  
  //   return this.http
  //     .get(`${AppConstant.API_BASE}loan/get-disbursed-loans`, { params }) 
  //     .pipe(
  //       map((res: any) => res),
  //       catchError((error: any) => observableThrowError(error.error || "Server error"))
  //     );
  // } 

      getDisbursedLoans(companyId: number) {
        return this.http.get(`${AppConstant.API_BASE}loan/get-disbursed-loans?companyId=${companyId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
  
  //   refinanceLoans(model: any): Observable<any> {
  //     return this.http.post(`${AppConstant.API_BASE}loan/Refinance-Loans`, model)
  //         .pipe(
  //             map((res: any) => res),
  //             catchError((error: any) => observableThrowError(error.error || 'Server error'))
  //         );
  // }

  refinanceLoans(payload: any) {
    return this.http.post(`${AppConstant.API_BASE}loan/Refinance-Loans`, payload)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error'))
        );
    }

  
}
