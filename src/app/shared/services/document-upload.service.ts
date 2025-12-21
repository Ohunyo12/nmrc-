
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from './app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class DocumentpUloadService {

  constructor(private http: AuthHttp, private appConfigService: AppConfigService) {
    AppConstant = appConfigService;
}

uploadFile(file: File, body: any) {
  // let bodyObj = JSON.stringify(body);
  return new Promise((resolve, reject) => {

      let url = `${AppConstant.API_BASE}upload/upload-document`;
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




getUploadedDocument(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}upload/get-uploaded-document`, bodyObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

deleteUploadedDocument(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}upload/delete-uploaded-document`, bodyObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
  
//document-upload/operation/{operationId}/target/{targetId}/isOperationSpecific/{isOperationSpecific}/isLms/{isLms}
getAllUploadedDocumentLms(operationId,targetId) {
    return this.http.get(`${AppConstant.API_BASE}document/document-uploadlms/operation/${operationId}/target/${targetId}`)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getAllUploadedDocument(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}upload/get-all-document-uploads`, bodyObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getAllUploadedOperationsDocument(body) {
    let bodyObj = JSON.stringify(body);
    return this.http.post(`${AppConstant.API_BASE}upload/get-all-document-operations-uploads`, bodyObj)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}

getMinutesByApplication(applicationNumber) {
    return this.http.get(`${AppConstant.API_BASE}credit/committee-minutes/application/${applicationNumber}`)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
getMinutesByDocumentId(loanDocumentId) {
    return this.http.get(`${AppConstant.API_BASE}credit/committee-minutes/${loanDocumentId}`)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
getContingentDocument(loanId) {
    return this.http.get(`${AppConstant.API_BASE}contingent/contingent/document/${loanId}`)
        .pipe(
            map((res: any) => res),
            catchError((error: any) => observableThrowError(error.error || 'Server error')));
}
}
