// import { AppConstant } from './../../shared/constant/app.constant';
import { Injectable } from '@angular/core';

import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { AuthHttp } from './token.service';
import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class StaffService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    getAllStaff() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllUnprocessedBulkPrepaymentReversal() {
        return this.http.get(`${AppConstant.API_BASE}setup/UnprocessedBulkPrepaymentReversal`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllUnprocessedBulkPrepaymentBatch() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-unprocessed-bulk-prepayment-batch`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitPrepaymentBatchForApproval(batch) {
        let batchObj = JSON.stringify(batch);
        return this.http.post(`${AppConstant.API_BASE}setup/submit-prepayment-batch-for-approval`, batchObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoadedDocumentationBulkLiquidation(operationId, targetId) {
        return this.http.get(`${AppConstant.API_BASE}credit/documentation-bulk-liquidation/operation/${operationId}/target/${targetId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getBulkPrepaymentsAwaitingApprovalBatch() {
        return this.http.get(`${AppConstant.API_BASE}setup/get-bulk-prepayments-awaiting-approval-batch`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    submitPrepaymentBatchForWorkflowApproval(batch) {
        let batchObj = JSON.stringify(batch);
        return this.http.post(`${AppConstant.API_BASE}setup/submit-prepayment-batch-for-workflow-approval`, batchObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getProcessingBulkPrepaymentByBatch(batchId) {
        return this.http.get(`${AppConstant.API_BASE}setup/get-processing-bulk-prepayment-by-batch/batchId/${batchId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllSensitivityLevel() {
        return this.http.get(`${AppConstant.API_BASE}setup/sensitivitylevel`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getStaffInfoById(staffId) {
        return this.http.get(`${AppConstant.API_BASE}setup/${staffId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApprovalStatus() {
        return this.http.get(`${AppConstant.API_BASE}setup/approval-status`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffAwaitingApprovals() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/approvals/temp`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffDeleteRequestAwaitingApprovals() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff-delete/approvals/temp`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffAwaitingApprovalsById(staffId) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/approvals/temp/${staffId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffActualDetailsByCode(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/approvals/${staffCode}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getStaffActualDetails() {

        return this.http.get(`${AppConstant.API_BASE}setup/staff/approvals`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    addStaff(body) {

        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setup/staff`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);

    }

    updateStaff(id, staff) {
        let bodyObj = JSON.stringify(staff);
        return this.http.put(`${AppConstant.API_BASE}setup/staff/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    
    updatePrepaymentAmount(id, staff) {
        let bodyObj = JSON.stringify(staff);
        return this.http.put(`${AppConstant.API_BASE}setup/bulkrepaymentinfo/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }


    updateSupervisor(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}setup/staff/update-supervisor`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveStaff(formObj) {
        let body = JSON.stringify(formObj);
        
        return this.http.post(`${AppConstant.API_BASE}setup/staff/approval`, formObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    approveStaffDelete(formObj) {
        let body = JSON.stringify(formObj);
        
        return this.http.post(`${AppConstant.API_BASE}setup/staff-delete/approval`, formObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 

    approveBulkStaff(formObj) {
        let body = JSON.stringify(formObj);
        return this.http.post(`${AppConstant.API_BASE}setup/staff/bulk-approval`, formObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    UploadBulkPrepaymentReversalData(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}setup/staff/bulk-prepament-reversal`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            let formData = new FormData();
            formData.append("file", file, file.name);

            for (var key in body) {
                formData.append(key, body[key]);
            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }


    uploadFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}setup/staff/upload-signature`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            let formData = new FormData();
            formData.append("file", file, file.name);

            for (var key in body) {
                formData.append(key, body[key]);
            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }

    uploadStaffRecordFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}setup/staff/multiple-staff-data`;
            // let url = `${AppConstant.API_BASE}media/upload-file`;
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.open('POST', url, true);
            let formData = new FormData();
            formData.append("file", file, file.name);

            for (var key in body) {
                formData.append(key, body[key]);
            }

            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }


    removeBulkRepayment(staffId) {
        return this.http.delete(`${AppConstant.API_BASE}setup/bulkrepayment/${staffId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    removeStaff(staffId) {
        return this.http.delete(`${AppConstant.API_BASE}setup/staff/${staffId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getAllStaffSignatures() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/signature/all`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentByStaffCode(staffCode) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/signature/?staffCode=${staffCode}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSampleStaffBulkUploadDocument() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/sample-document`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
}