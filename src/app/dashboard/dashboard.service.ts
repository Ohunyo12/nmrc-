
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'app/admin/services/token.service';
import { AppConfigService } from 'app/shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';



let AppConstant: any = {};

@Injectable()
export class DashboardService {

  constructor(private http: AuthHttp, private appConfigService: AppConfigService) { 
    AppConstant = appConfigService;
  }
  loanApplicationBysector(data) {
    return this.http.post(`${AppConstant.API_BASE}dashboard/loan-application-sector`,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
loanRiskByExposure(data) {
  return this.http.post(`${AppConstant.API_BASE}dashboard/loans-risk-exposure`,data)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
loanApplicationPerformance(data) {
  return this.http.post(`${AppConstant.API_BASE}dashboard/loan-performamce`,data)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
loanDisbursedLoan(data) {
    return this.http.post(`${AppConstant.API_BASE}dashboard/disbursed-loan`,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

loansOnPipeline(data) {
  return this.http.post(`${AppConstant.API_BASE}dashboard/loans-on-pipeline`,data)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}


subsLoansOnPipeline(data) {
  return this.http.post(`${AppConstant.API_BASE}dashboard/subs-loans-on-pipeline`,data)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getLoansInPipelineLms(operationId: number, classId = null) {
  return this.http.get(`${AppConstant.API_BASE}dashboard/get-loans-in-pipeline-Lms/operationId/${operationId}/classId/${classId}`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getApprovedLoansLms() {
  return this.http.get(`${AppConstant.API_BASE}dashboard/get-approved-loans-Lms`)
    .pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

collateralExposure(data) {
    return this.http.post(`${AppConstant.API_BASE}dashboard/collateral-exposure`,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }

  approvedLoan(data) {
    return this.http.post(`${AppConstant.API_BASE}dashboard/approved-loan`,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
  totalRiskExposure(data) {
    return this.http.post(`${AppConstant.API_BASE}dashboard/risk-exposure`,data)
      .pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
  }
}
