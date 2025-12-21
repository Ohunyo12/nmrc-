import { Component, OnInit } from '@angular/core';
import { AdminService } from 'app/admin/services/admin.service';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-application-error-log',
  templateUrl: './application-error-log.component.html',
 // styleUrls: ['./application-error-log.component.scss']
})
export class ApplicationErrorLogComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  apiLog: any;
  errorLog: any;
  constructor(private adminService: AdminService, private loadingService: LoadingService,) { 
    this.startDate = new Date();
    this.endDate = new Date();
  }

  ngOnInit() {
   // this.getGetErrorLog();
  }

  GetAPILog():void {
    let data ={
      startDate : this.startDate,
      endDate : this.endDate,

    }
  }

  getGetErrorLog(): void {
    this.loadingService.show();
    let data = {
      startDate : this.startDate,
      endDate : this.endDate
    }
     this.adminService.getErrorLog(data).subscribe((response: any) => {
       this.errorLog = response.result;

       
       this.loadingService.hide();
     }, (err) => {
         this.loadingService.hide(1000);
     });
 }
}
