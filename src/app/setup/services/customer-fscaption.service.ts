
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class CustomerFSCaptionService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllCustomerFSCaption(fsCaptionGroupId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption/group/${fsCaptionGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCustomerFSCaptions() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption/group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUnmappedCustomerFSCaption(queryParams) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption/customer/unmapped/?${queryParams}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUnmappedCustomerGroupFSCaption(queryParams) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption/customer-group/unmapped/?${queryParams}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCustomerFSCaption(fsCaptionObj) {
        let bodyObj = JSON.stringify(fsCaptionObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-fs-caption`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerFSCaption(fsCaptionObj, fsCaptionId) {
        let bodyObj = JSON.stringify(fsCaptionObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-fs-caption/${fsCaptionId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCustomerFSCaption(fsCaptionId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-fs-caption/${fsCaptionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    getAccountCategories() {
        return this.http.get(`${AppConstant.API_BASE}setups/account-category`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllCustomerFSCaptionGroup() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-group`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllTATSetup() {
      return this.http.get(`${AppConstant.API_BASE}setups/tat-setup`).pipe(
        map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getAllCustomerFSCaptionGroupWithoutRatio() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-group-without-ratio`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addFSCustomerCaptionGroup(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-fs-caption-group`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    calculateFSRatioValueForDerived(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/calculate-fs-ratio-value-derived`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerFSCaptionGroupById(fsCaptionId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-group/${fsCaptionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerFSCaptionGroup(postObj, fsCaptionId) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-fs-caption-group/${fsCaptionId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCustomerFSCaptionGroup(fsCaptionId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-fs-caption-group/${fsCaptionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSCaptionDetailByCustomer(queryParams) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-detail/customer/?${queryParams}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFSCaptionDetailByCustomer(queryParams) {
        return this.http.get(`${AppConstant.API_BASE}customers/all-customer-fs-caption-detail/customer/?${queryParams}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSCaptionDetailByCustomerId(customerId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-detail/customer/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSCaptionDetailByCustomerGroup(queryParams) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-group-fs-caption-detail/customer-group/?${queryParams}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerFSCaptionDetailById(fsCaptionId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-caption-detail/${fsCaptionId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCustomerFSCaptionDetail(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-fs-caption-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addCustomerGroupFSCaptionDetail(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-group-fs-caption-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerFSCaptionDetail(postObj, fsCaptionId) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-fs-caption-detail/${fsCaptionId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateCustomerGroupFSCaptionDetail(postObj, fsCaptionId) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-group-fs-caption-detail/${fsCaptionId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    deleteCustomerFSCaptionDetail(fsDetailId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-fs-caption-detail/${fsDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteCustomerGroupFSCaptionDetail(fsDetailId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-group-fs-caption-detail/${fsDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Customer FS Ratio Caption
     */

    addFSRatioCaption(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFSRatioCaptions() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSRatioCaptionsByFSCaptionGroupId(fSCaptionGroupId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption-by-group/${fSCaptionGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getCustomerFSRatioValue(customerId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-values/${customerId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSRatioCaptionById(fsRatioId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption/${fsRatioId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateFSRatioCaption(postObj, fsRatioId) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption/${fsRatioId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteFSRatioCaption(fsRatioId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-fs-ratio-caption/${fsRatioId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Customer FS Ratio Detail
     */

    addFSRatioDetail(postObj) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.post(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFSRatioDetails(ratioCaptionId, fsCaptionGroupId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/ratio-caption/` +
            `${ratioCaptionId}/caption-group/${fsCaptionGroupId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFSRatioDetailById(fsRatioDetailId) {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/${fsRatioDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateFSRatioDetail(postObj, fsRatioDetailId) {
        let bodyObj = JSON.stringify(postObj);
        return this.http.put(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/${fsRatioDetailId}`, bodyObj)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteFSRatioDetail(fsRatioDetailId) {
        return this.http.delete(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/${fsRatioDetailId}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    /**
     * Customer FS Ratio Types
     */

    getAllFSRatioDivisorTypes() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/divisor-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllFSRatioValueTypes() {
        return this.http.get(`${AppConstant.API_BASE}customers/customer-fs-ratio-detail/value-type`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}