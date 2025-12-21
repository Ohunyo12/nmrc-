
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class RequestJobTypeService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getJobTypes() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobDestinationUnits(jobTypeId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-type-unit/${jobTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    ReRouteJobUnit(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/re-route-job`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobTypeHub(jobTypeId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-type-hub/${jobTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getHubStaffByHubId(hubId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-hub-staff/${hubId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobReasignmentStaff(staffId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/reasigned-job-by-staff/${staffId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobSubTypes(jobId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-sub-type/${jobId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobSubTypeClass(jobSubTypeId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-sub-type-class/${jobSubTypeId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveJobType(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateJobType(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/job-type/${id}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getRequestStatus() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-status`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestFeedback() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-feedback`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addUpdateJobFeedback(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request-feedback`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    assignJobTypeToStaff(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/assign-job-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    mapJobTypeHubStaff(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/map-job-type-hub-staff`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateMappedJobTypeHubStaff(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/update-map-job-type-hub-staff`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteMappedJobTypeHubStaff(hubStaffId) {
        return this.http.delete(`${AppConstant.API_BASE}workflow/delete-mapped-job-type-hub-staff/${hubStaffId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateAssignJobTypeToStaff(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/update-assigned-job-type`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteAssignedJobTypeToStaff(id) {
        return this.http.delete(`${AppConstant.API_BASE}workflow/delete-assigned-job-type/${id}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobTypeReasignmentAdminStaff() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-type-admin-staff`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobTypeHubStaff() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-type-hub-staff`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}