
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';
//import { Response } from '@angular/http';


import { AppConfigService } from '../../shared/services/app.config.service';

let AppConstant: any = {};
@Injectable()
export class JobService {
    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }

    search(terms: Observable<any>, departmentId) {
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchEntries(term, departmentId)));
    }
        
    searchEntries(term,departmentId) {
        return this.http
            .get(`${AppConstant.API_BASE}setup/staff/${departmentId}/search/${term}`)
            .pipe(
                map((res: any) => res),
              catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
        
    // Searching through Customer table
    searchForStaff(terms: Observable<any>, departmentUnitId ) { 
        return terms.pipe(debounceTime(400),
            distinctUntilChanged(),switchMap(term => this.searchForDepartmentStaff(term, departmentUnitId)));
    }

    searchForDepartmentStaff(term, departmentUnitId) {  
        return this.http
            .get(`${AppConstant.API_BASE}setup/department-staff/${departmentUnitId}/?searchQuery=${term}`)
            .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSector() {
        return this.http.get(`${AppConstant.API_BASE}setups/sector`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSubSector() {
        return this.http.get(`${AppConstant.API_BASE}setups/subsector`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getOfficers() {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/names`)
        .pipe(
            map((res: any) => res),
          catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getUnitOfficers(departmentUnitId) {
        return this.http.get(`${AppConstant.API_BASE}setup/staff/unit/${departmentUnitId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    // getJobRequestByDepartment() {
    //     return this.http.get(`${AppConstant.API_BASE}workflow/job-request/department`)
    //         .map((res: Response) => res.json())
    //         .catch((error: any) => Observable
    //             .throw(error.json().error || 'Server error'));
    // }

    getSolicitorsByStateId(stateId) {
        return this.http.get(`${AppConstant.API_BASE}setups/accredited-solicitors/${stateId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLegalToConsultantJobsAwaitingconfirmation() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-detail/legal-details`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    getlegalJobRequestDetailById(jobRequestId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/legal-job-request-detail/${jobRequestId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestByStaffId() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/staff`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestByQueryString(searchString) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/search/${searchString}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getFacilityJobRequestByFacilityReferenceNumber(facilityReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}workflow/facility-job-request/${facilityReferenceNumber}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLMSLoanApplicationDetail(facilityReferenceNumber) {
        return this.http.get(`${AppConstant.API_BASE}workflow/facility-job-request/${facilityReferenceNumber}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLMSRApplicationData(targetId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/lmsr-application-data/${targetId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 
    getLMSROperationData(targetId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/lmsr-operation-data/${targetId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    } 
    getLOSLoanData(loanId, operationId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/loan-data/${loanId}/operation/${operationId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestCount() {
        return this.http.get(`${AppConstant.API_BASE}workflow/count-job-request-by-status`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    

    getJobRequestByStatus(filter, startNumber) {
        return this.http.get(`${AppConstant.API_BASE}workflow/filter-job-request-by-status/${filter}/${startNumber}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getApplicationDetailJobRequest(targetId,operationId,jobSourceId) { 
        return this.http.get(`${AppConstant.API_BASE}workflow/application-detail-job-request/${targetId}/Operation/${operationId}/source/${jobSourceId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getLoanApplicationJobsById(applicationId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/loan-application-details/${applicationId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    

    getJobRequestByGroup() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/group`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobComments(jobRequestId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request/comments/${jobRequestId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobRequestApprovalStatus() {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-approval-status`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getJobStatusFeedback(statusId, jobTypeId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-status-feedback/${statusId}/${jobTypeId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveJobRequest(body) {
        const bodyObj = JSON.stringify(body); 
        return this.http.post(`${AppConstant.API_BASE}workflow/global-job-request`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    processCustomerDebit(body,actionName,actionType,loanApplicationDetailId) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/collateral-customer/job/${actionName}/charge/${actionType}/${loanApplicationDetailId}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    commitCustomerCharges(jobRequestDetailId, body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/customer-charge/${jobRequestDetailId}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveJobComment(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/comment`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    saveCollateralLegalInstructions(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/legal-collateral-job`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    DebitAccountWithLegalFees(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/place-legal-job-charges`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    CreditAccountWithLegalFees(body) {
        const bodyObj = JSON.stringify(body);
        return this.http.post(`${AppConstant.API_BASE}workflow/job-request/reverse-legal-job-charges`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }
    
    updateJobRequestReply(body, id) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/job-request/reply/${id}`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    updateJobRequestForInvoiceSatus(body) {
        let bodyObj = JSON.stringify(body);
        return this.http.put(`${AppConstant.API_BASE}workflow/job-request/invoice-status`, bodyObj)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentByJobRequestCode(jobRequestCode) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-documents/${jobRequestCode}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    getSupportingDocumentById(documentId) {
        return this.http.get(`${AppConstant.API_BASE}workflow/job-request-document/${documentId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    deleteLoanDocument(documentId) {
        return this.http.delete(`${AppConstant.API_BASE}workflow/delete-job-request-document/${documentId}`)
           .pipe(
          map((res: any) => res),
        catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

    uploadFile(file: File, body: any) {
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}workflow/job-document`;
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
                // if(key == 'uploadArrays'){
                //     var ctr = 0;
                //     for(var upload in body[uploadArrays]){ 
                //         formData.append('uploads'+ctr, JSON.stringify( body[uploadArrays[upload]]));
                //         ctr = ctr + 1;
                //     }
                // }else formData.append(key, body[key]);

               formData.append(key, body[key]);
            }
            
            let token = this.http.getAuthorizationHeader();
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.send(formData);
        });
    }

    uploadFileOnly(file: File, body: any) { 
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {
            let url = `${AppConstant.API_BASE}workflow/job-document-only`;
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
 


    replyAnduploadFile(file: File, body: any) {
        // let bodyObj = JSON.stringify(body);
        return new Promise((resolve, reject) => {

            let url = `${AppConstant.API_BASE}workflow/job-reply-and-job-document`;
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
            
}