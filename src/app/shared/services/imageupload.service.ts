
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { AuthenticationService } from '../../admin/services/authentication.service';
// import { AppConstant } from './../constant/app.constant';

import { AuthHttp } from '../../admin/services/token.service';
import { Injectable } from '@angular/core';


import { AppConfigService } from './app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class ImageService {


    constructor(private http: AuthHttp, private authTencticateService: AuthenticationService,
        private appConfigService: AppConfigService) {
        AppConstant = appConfigService;
    }

    getDocument(id) {
        return this.http.get(`${AppConstant.API_BASE}media/document?id=${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    getDocumentViewer(id) {
        return this.http.get(`${AppConstant.API_BASE}media/document-viewer?id=${id}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }
    uploadImage(url: string, params: any, file: File) {
        return new Promise((resolve, reject) => {
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            formData.append("file", file, file.name);
            formData.append("title", params.title);
            //formData.append("description", params.description);


            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 201) {
                        resolve(JSON.parse(xhr.response));

                    } else {
                        reject(JSON.parse(xhr.response));
                    }
                }
            }
            let token = this.authTencticateService.getToken();
            xhr.open("POST", url, true);
            xhr.setRequestHeader('enctype', 'multipart/form-data');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token, );
            xhr.send(formData);
        });
    }
}