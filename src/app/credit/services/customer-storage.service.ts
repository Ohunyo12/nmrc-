import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


/**
* This class provides the CustomerStorage service with methods to read names and add names.
*/
@Injectable()
export class CustomerStorageService {
/**
* Creates a new CustomerStorageService with the injected Http.
* @param {Http} http - The injected Http.
* @constructor
*/

    storage: any = {};

    constructor(private http: HttpClient) {}

    get customerStorage() {
        return JSON.parse(sessionStorage.getItem('customer-loan-details'));
    }

    set customerStorage(items) {
        sessionStorage.setItem('customer-loan-details', items);
    }

}