
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthHttp } from '../../admin/services/token.service';



import { AppConfigService } from '../../shared/services/app.config.service';
// import { AppConstant } from './../../shared/constant/app.constant';

let AppConstant: any = {};
@Injectable()
export class CustomerGroupService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getCustomerGroups() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTempCustomerGroups() {
        return this.http.get(`${AppConstant.API_BASE}customers/get-temp-customer-groups`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupsMembers(groupid: number) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-members/${groupid}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCustomerGroupsAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getAllCustomerGroupMappingAwaitingApproval() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping/awaiting-approval`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    getCustomerGroupByCustomerId(custId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group/${custId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCustomerGroup(custGroupObj) {
        let bodyObj = JSON.stringify(custGroupObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerGroup(custGroupObj, grpId) {
        let bodyObj = JSON.stringify(custGroupObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-group/${grpId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCustomerGroup(grpId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-group/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendCustomerGroupForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group/approval`, formObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    sendCustomerGroupMappingForApproval(formObj) {
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group-mapping/approval`, formObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupMapping() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupMappingByGroupMapId(grpMapId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping/${grpMapId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupMappingByGroupId(grpId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping/customers/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getTempCustomerGroupMappingByGroupId(grpId) {
        return this.http.get(`${AppConstant.API_BASE}customers/get-temp-customer-group-mapping/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getGroupCustomersByGroupId(grpId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customers-in-group/${grpId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupRelationshipTypes() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-mapping/relationship-types`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCustomerGroupMapping(custGrpMapObj) {
        let bodyObj = JSON.stringify(custGrpMapObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group-mapping`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    addCustomerGroupMappingMultiple(custGrpMapObj) {
        let bodyObj = JSON.stringify(custGrpMapObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group-mapping/multiple`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerGroupMaping(custGrpMapObj, grpMapId) {
        return this.http.put(`${AppConstant.API_BASE}customers/customer-group-mapping/${grpMapId}`, custGrpMapObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCustomerGroupMaping(grpMapId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-group-mapping/${grpMapId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    searchGroup(search) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group/?searchQuery=${search}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerGroupDetailedMappingByGroupId(customerGroupId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group/${customerGroupId}/mapping-details`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}