
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { AppConstant } from './../../shared/constant/app.constant';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class StaffRoleService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    get() {
        return this.http.get(`${AppConstant.API_BASE}setups/default-staff-role`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getStaffRoles() {
        return this.http.get(`${AppConstant.API_BASE}setups/staff-role/company`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getStaffRoleByStaffId() {
        return this.http.get(`${AppConstant.API_BASE}setups/staff-role-by-staffid`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    StaffReportingTo(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff-reporting/${staffCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    StaffSupervosorReporting(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff-reporting-search/${staffCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    StaffSupervosor(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/supervisor/${staffCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    StaffInformation(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/information/${staffCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    StaffMIS(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/mis/${staffCode}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    StaffSearch(searchQuery) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/search/${searchQuery}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addUpdateStaffRole(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/staff-role`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getAllStaffRoleAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}setups/staff-role-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllApprovalFlowTypes() {
      return this.http.get(`${AppConstant.API_BASE}setups/approval-flow-type`)
          .pipe(
        map((response: any) => response),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

    goForApproval(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/staff-role/approval`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    StaffRoles() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/roles`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addUpdateApprovalSetup(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/approval-setup`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }





    getApprovalSetUp() {
        return this.http.get(`${AppConstant.API_BASE}setups/approval-setup-table`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateApprovalSetUp(body: any) {
        return this.http.put(`${AppConstant.API_BASE}setups/approval-setup-update`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllOperations() {
        return this.http.get(`${AppConstant.API_BASE}setups/operation-all`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOperations() {
        return this.http.get(`${AppConstant.API_BASE}setups/all-operations`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateFlowOder(body: any) {
        return this.http.put(`${AppConstant.API_BASE}setups/update-flow-order`, body)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addFlowOder(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setups/flow-order-add`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


}