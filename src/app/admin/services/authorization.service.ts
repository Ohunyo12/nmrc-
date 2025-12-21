import { AuthHttp } from './token.service';
import { Injectable } from '@angular/core';

import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';


// import { AppConstant } from './../../shared/constant/app.constant';
import { AppConfigService } from '../../shared/services/app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class AuthorizationService {
    constructor(private http: AuthHttp, private appConfigService: AppConfigService) {
        AppConstant = appConfigService;
    }

    authenticateUser(staffCode, passCode) {
        // console.log("StaffCode: ", staffCode);
        return this.http.get(`${AppConstant.API_BASE}admin/two-factor-auth?staffCode=${staffCode}&passCode=${passCode}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    twoFactorAuthEnabled() {
        return this.http.get(`${AppConstant.API_BASE}admin/two-factor-auth-enabled`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    enable2FAForLastApproval(operationId, productClassId, productId, levelAmount) {
        return this.http.get(`${AppConstant.API_BASE}admin/two-factor-auth-last-approval?operationId=${operationId}&productClassId=${productClassId}&productId=${productId}&levelAmount=${levelAmount}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroups() {
        return this.http.get(`${AppConstant.API_BASE}setup/groups`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGroup(body) {

        let bodyObj = JSON.stringify(body);

    

        return this.http.post(`${AppConstant.API_BASE}setup/group/add`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateGroup(id, body) {

        let bodyObj = JSON.stringify(body);

        return this.http.put(`${AppConstant.API_BASE}setup/group/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getActivities() {
        return this.http.get(`${AppConstant.API_BASE}setup/activities`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addGroupActivity(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setup/group/activities`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getActivitiesByGroupId(id) {
        let url = `${AppConstant.API_BASE}setup/activities/group/${id}`;
        return this.http.get(url)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getActivitiesByRoleId(id) {
        return this.http.get(`${AppConstant.API_BASE}setup/activities/role/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupsByRoleId(id) {
        return this.http.get(`${AppConstant.API_BASE}setup/groups/role/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAllUsers() {
        return this.http.get(`${AppConstant.API_BASE}auth/user`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getById(id) {
        return this.http.get(`${AppConstant.API_BASE}auth/user/${id}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveUser(body) {

        let bodyObj = JSON.stringify(body);

        return this.http.post(`${AppConstant.API_BASE}admin/user`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}