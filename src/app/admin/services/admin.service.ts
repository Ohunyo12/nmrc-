import { AuthHttp } from './token.service';
import { Injectable, ModuleWithProviders } from '@angular/core';

import { throwError as observableThrowError, Observable, Subject } from 'rxjs';


import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

let AppConstant: any = {};

@Injectable()
export class AdminService {


    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    ///User Methods
    GetProfileConfiguration(): any {
        return this.http.get(`${AppConstant.API_BASE}admin/getprofileconfiguration`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getStaffADDetails(staffCode, password): any {
        return this.http.get(`${AppConstant.API_BASE}admin/getStaffactiveDirectoryDetails/${staffCode}/${password}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getProfileSettings() {
        return this.http.get(`${AppConstant.API_BASE}admin/profilesettings`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAPILog(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/api-log`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getErrorLog(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/error-log`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    updateProfileSettings(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/updateprofilesettings`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllUsers() {
        return this.http.get(`${AppConstant.API_BASE}admin/users`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getStaffRole() {
        return this.http.get(`${AppConstant.API_BASE}admin/dashboard`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getUsersByStaffId(staffId) {
        return this.http.get(`${AppConstant.API_BASE}admin/users-by-staffId?staffId=${staffId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllUsersAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}admin/user/approvals/temp`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllUserAccountStatusChangeAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}admin/user/account-status/approvals/temp`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendForUserAccountStatusApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}admin/user-account-status-update/approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    sendForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}admin/user/approval`, formObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    saveUser(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}admin/user`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateUser(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/user/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    ///End User
    getAllGlobalSettings() {
        return this.http.get(`${AppConstant.API_BASE}admin/global-settings`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    //Group

    getAllGroups() {
        return this.http.get(`${AppConstant.API_BASE}admin/groups`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    saveGroup(body) {

        let bodyObj = JSON.stringify(body);

        return this.http.post(`${AppConstant.API_BASE}admin/group/add`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateGroup(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/group/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getGroupById(id) {
        return this.http.get(`${AppConstant.API_BASE}admin/group/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getActivityParentAndChild() {
        return this.http.get(`${AppConstant.API_BASE}admin/activities/parents`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getActivityDetailsByParent(parentId) {
        return this.http.get(`${AppConstant.API_BASE}admin/activities/parents/details/${parentId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    //group/activities/mapped

    getGroupsAndActivities() {
        return this.http.get(`${AppConstant.API_BASE}admin/group/activities/mapped`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    assignAccessRight(id, body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}admin/group/activity/access/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    //group/activity/access/{id}

    //End Group

    getDeletedStaffLog() {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/deleted-staff-log`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getDormantStaffLog() {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/dormant-staff-log`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getAuditTrails(page: number, itemPerPage: number) {
        return this.http.get(`${AppConstant.API_BASE}admin/audit/log?page=${page}&itemsPerPage=${itemPerPage}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    searchDeletedStaffLogLog(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(), switchMap(term => this.searchDeletedStaffLogEntries(term)));
    }

    searchDeletedStaffLogEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}admin/audit/deleted-staff-log/search/${term}`)
            .pipe(map((res: any) => res));
    }

    searchAuditLog(terms: Observable<any>) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(), switchMap(term => this.searchEntries(term)));
    }

    searchEntries(term) {
        return this.http
            .get(`${AppConstant.API_BASE}admin/audit/log/search/${term}`)
            .pipe(map((res: any) => res));
    }

    manageUserAccountStatus(userId, lockStatus) {
        let bodyObj = {};
        return this.http.put(`${AppConstant.API_BASE}admin/manage-account-status/user/${userId}/lock-status/${lockStatus}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getActiveUsers(page: number, itemPerPage: number) {
        return this.http.get(`${AppConstant.API_BASE}admin/accountmanagement?page=${page}&itemsPerPage=${itemPerPage}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateActiveUsers(data) {
        return this.http.post(`${AppConstant.API_BASE}admin/accountmanagement`, data)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    // downloadFile(): Observable<Blob> {
    //     let options = new RequestOptions({responseType: ResponseContentType.Blob });
    //     return this.http.get(`${AppConstant.API_BASE}media/staff-data-sample`)
    //         .map(res => res.blob())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getAllSupportIssueType() {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-support-issue-type`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    GetCustomersIssuesByParams() {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-customer-issue-by-param`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }


    // GetApprovalTrail(body) {
    //     return this.http.post(`${AppConstant.API_BASE}support-utility/view-approval-trail`, JSON.stringify(body))
    //         .pipe(
    //       map((res: any) => res),
    //     catchError((error: any) => observableThrowError(error.error || 'Server error')),); 
    // }

    getApprovalTrail(searchString) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/view-approval-trail/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getSingleTrail(approvalTrailId) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/view-single-trail/${approvalTrailId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getDistinctOperations(searchString) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/view-unique-operations/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getExpectedWorkflow(operationId) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/view-expected-workflow/${operationId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getBusinessRule(approvalLevelId) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-business-rule/${approvalLevelId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getStaffRecord(searchString) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-staff-record/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getTempStaffRecord(searchString) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-Temp-staff-record/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCustomerRecord(searchString) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-customer-record/${searchString}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getTempCustomerRecord(customerId) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-temp-customer-record/${customerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCasaCustomerRecord(customerId) {
        return this.http.get(`${AppConstant.API_BASE}support-utility/get-casa-customer-record/${customerId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateCustomerRecord(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}support-utility/update-customer-record/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateApprovalTrail(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}support-utility/update-approval-trail/${id}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateStaffRecord(body, staffId, staffCode) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}support-utility/update-staff-record/${staffId}/${staffCode}`, bodyObj)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
}