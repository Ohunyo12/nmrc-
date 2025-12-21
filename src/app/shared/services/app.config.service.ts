import { Injectable } from '@angular/core';
import { AppConfig } from '../constant/app.config';
import { AdminService } from 'app/admin/services';

@Injectable()
export class AppConfigService {

    private baseApiUrl: string;
    private tokenUrl: string;
    private hostUrl: string;
    private appTimeOut: number;
    ecosystemBaseApiUrl: string;

    constructor(private appConfig: AppConfig
    ) { }

    public get API_BASE(): string {

        this.baseApiUrl = this.appConfig.get('baseApiUrl');

        return this.baseApiUrl;
    }

    public set API_BASE(val: string) {
        this.baseApiUrl = val;
    }

    public get TOKEN_URL(): string {

        this.tokenUrl = this.appConfig.get('tokenUrl');

        return this.tokenUrl;
    }

    public set TOKEN_URL(val: string) {
        this.tokenUrl = val;
    }

    public get APP_HOST(): string {

        this.hostUrl = this.appConfig.get('hostUrl');

        return this.hostUrl;
    }
  
    public get APP_TIMEOUT(): number {
       // this.getProfileSetting();
                this.appTimeOut = this.appConfig.get('appTimeOut');
               //this.appTimeOut = this.sessionTimeOut;
                return this.appTimeOut;
            }
    
     public get ECOSYSTEM_API_BASE(): string {

        this.ecosystemBaseApiUrl = this.appConfig.get('ecosystemBaseApiUrl');

        return this.ecosystemBaseApiUrl;
    }

    public set ECOSYSTEM_API_BASE(val: string) {
        this.ecosystemBaseApiUrl = val;
    }
}