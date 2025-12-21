
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AppConfig {

    private _config: Object;

    constructor(private http: HttpClient) { }

    load() {
        // json files will be loaded here
        return new Promise((resolve, reject) => {
            this.http.get('assets/config/app.config.json').pipe(
                map((res: any) => res),
                catchError((error: any) => {
                   // console.error(error);
                    return observableThrowError(error.error || 'Server error');
                }),)
                .subscribe((data: any) => {
                    this._config = data;
                    resolve(true);
                });
        });
    }

    get(key: any) {
       sessionStorage.setItem(key, this._config[key]);
        return this._config[key];
    }
// tslint:disable-next-line:eofline
};
