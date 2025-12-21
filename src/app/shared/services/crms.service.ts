import { Injectable } from '@angular/core';
import { AppConfigService } from 'app/shared/services/app.config.service';
import { AuthHttp } from 'app/admin/services/token.service';

import { Observable } from 'rxjs';

let AppConstant: any = {};
@Injectable()
export class CrmsService {

  constructor(private http: AuthHttp, private appConfigServ: AppConfigService) {
    AppConstant = appConfigServ;
  }


 


}


