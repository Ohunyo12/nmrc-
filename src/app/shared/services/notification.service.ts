
import {throwError as observableThrowError,  Observable } from 'rxjs';
// import { AppConstant } from './../constant/app.constant';
import { UserNotification } from '../models/notification';
import { AuthHttp } from '../../admin/services/token.service';
import { Injectable, EventEmitter } from '@angular/core';


import { AppConfigService } from './app.config.service';
import { catchError, map } from 'rxjs/operators';

let AppConstant: any = {};
@Injectable()
export class NotificationService {

    public notificationAdded$: EventEmitter<UserNotification>;
    notifications: UserNotification[];

    constructor(private http: AuthHttp, private appConfigService: AppConfigService) {
        AppConstant = appConfigService;
        this.notificationAdded$ = new EventEmitter();
    }


    getNotificationList() {
        return this.http.get(`${AppConstant.API_BASE}notifications/workflow/all`)
            .pipe(
                
                map((response: Response) => {
                    return (<any>response).result.map(item => {
                        return new UserNotification({
                            message: item.message,
                            actionUrl: item.operationURL,
                            count: item.messageCount,
                        });
                    });

                }),catchError((error: any) => observableThrowError(error.error || 'Server error')),);
                           
    }

    getNotificationForFinalState() {
        return this.http.get(`${AppConstant.API_BASE}notifications/completed-approval/all`).pipe(
            map((response: Response) => {
                return (<any>response).result.map(item => {
                    return new UserNotification({
                        message: item.message,
                        actionUrl: item.operationURL,
                        count: item.messageCount
                    });
                });
            }),catchError((error: any) => observableThrowError(error.error || 'Server error')),);
    }

}