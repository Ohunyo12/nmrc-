
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { CustomFieldBase } from '../../models/customfieldbase';
import { AppConstant } from '../../constant/app.constant';
import { AuthHttp } from '../../../admin/services/token.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';



@Injectable()
export class CustomFieldsService {
    constructor(private http: AuthHttp) { }

    getFields1(id, ownerid) {

        return this.http.get(`${AppConstant.API_BASE}setups/custom-field-data/hostpage/${id}/${ownerid}`)
            .pipe(
                map((res: any) => res),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }

    getFields(id, ownerid): Observable<CustomFieldBase[]> {
        return this.http.get(`${AppConstant.API_BASE}setups/custom-field-data/hostpage/${id}/${ownerid}`).pipe(
            map((response: Response) => {
                return (<any>response).result.map(item => {
                    return new CustomFieldBase({
                        dataDetails: item.dataDetails,
                        controlKey: item.controlKey,
                        labelName: item.labelName,
                        required: item.required,
                        itemOrder: item.itemOrder,
                        controlType: item.controlType,
                        customFieldId: item.customFieldId
                    });

                });
            }),
                catchError((error: any) => observableThrowError(error.error || 'Server error')));
    }




}