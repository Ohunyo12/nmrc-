
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AuthHttp } from 'app/admin/services/token.service';
import { AppConfigService } from 'app/shared/services/app.config.service';



let AppConstant: any = {};

@Injectable()
export class LetterGenerationRequestService {

    constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
        AppConstant = appConfigServ;
    }



    saveLetterGenerationRequest(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/letter-generation-request`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    updateLetterGenerationRequest(body, id) {
        return this.http.put(`${AppConstant.API_BASE}credit/letter-generation-request/${id}`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    deleteLetterGenerationRequest(id) {
        return this.http.delete(`${AppConstant.API_BASE}credit/letter-generation-request/${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLetterGenerationRequests() {
        return this.http.get(`${AppConstant.API_BASE}credit/letter-generation-request`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLetterGenerationCompleted() {
        return this.http.get(`${AppConstant.API_BASE}credit/letter-generation-completed`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLetterGenerationRequestsForApproval() {
        return this.http.get(`${AppConstant.API_BASE}credit/letter-generation-request-approval`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    forwardLetterGen(body) {
        return this.http.post(`${AppConstant.API_BASE}credit/letter-gen-request/forward`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCamsolLoansByCustomerCode(customerName: string, customerCode: string) {
        return this.http.get(`${AppConstant.API_BASE}credit/get-camsol-loans-by-customer-code/${customerName}/customerName/${customerCode}/customerCode`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getCamsolLoanDocument(typeId: Number, body) {
        return this.http.post(`${AppConstant.API_BASE}credit/get-camsol-loan-document/${typeId}/typeId`, JSON.stringify(body))
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLetterGenSignatories(requestId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/letter-generation-request/signatory/${requestId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getLetterGenCamsol(requestId: number) {
        return this.http.get(`${AppConstant.API_BASE}credit/letter-generation-request/signatory/${requestId}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));

    }
}
