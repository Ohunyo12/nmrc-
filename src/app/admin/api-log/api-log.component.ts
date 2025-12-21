import { Component, OnInit } from '@angular/core';
import { AdminService } from 'app/admin/services/admin.service';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-api-log',
  templateUrl: './api-log.component.html',
})
export class ApiLogComponent implements OnInit {
  startDate: Date;
  endDate: Date;
  apiLog: any;
  loanRefNo:any;
  constructor(private adminService: AdminService, private loadingService: LoadingService,) { 
    this.startDate = new Date();
    this.endDate = new Date();
  }

  ngOnInit() {
    //this.getGetAPILog();
  }

  GetAPILog():void {
    let data ={
      startDate : this.startDate,
      endDate : this.endDate,

    }
  }

  getGetAPILog(): void {
    this.loadingService.show();
    let data = {
      startDate : this.startDate,
      endDate : this.endDate,
      loanRefNo : this.loanRefNo
    }
     this.adminService.getAPILog(data).subscribe((response: any) => {
       this.apiLog = response.result;
      
       this.loadingService.hide();
     }, (err) => {
         this.loadingService.hide(1000);
     });
 }
}

//test