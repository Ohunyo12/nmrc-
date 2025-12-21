import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { LoanService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-refresh-staging-monitoring',
  templateUrl: './refresh-staging-monitoring.component.html',
  styleUrls: ['./refresh-staging-monitoring.component.scss']
})
export class RefreshStagingMonitoringComponent implements OnInit {
  searchInfo:any;
  startDate: Date;
  endDate: Date;
  batchPostingCount: any;
  isLms: boolean;
  constructor(private loanService:LoanService,private loadingService: LoadingService) { }

  ngOnInit() {

    this.startDate = new Date();
    this.endDate = new Date();
  }

  getBatchPostingDetails() {
    let data ={
      startDate:this.startDate,
      endDate:this.endDate,
      searchInfo:this.searchInfo

    }
    this.loanService.getBatchPostingCount(data).subscribe((data) => {
      this.batchPostingCount = data.result;
    });
  }
  

  ExportToExcel(status){
    
    this.loadingService.show();
    
    let data ={
      startDate:this.startDate,
      endDate:this.endDate,
      status : status,
      }

      this.loanService.getBatchPostingDetailNew(data).subscribe((response: any) => {
        let doc = response.result;

        if (doc.length != 0) {
          let excel = doc;
           
           var byteString = atob(excel.reportData);
           var ab = new ArrayBuffer(byteString.length);
           var ia = new Uint8Array(ab);
           for (var i = 0; i < byteString.length; i++) {
               ia[i] = byteString.charCodeAt(i);
           }
           var bb = new Blob([ab]);
       
           try {
               var file = new File([bb], excel.templateTypeName, {type: 'application/vnd.ms-excel' });
               saveAs(file);
           } catch (err) {
               var textFileAsBlob = new Blob([bb], {type: 'application/vnd.ms-excel' });
               window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName+'.xlsx');
           }
           
       }  
       this.loadingService.hide();
      })

  }

  // ExportToExcelllllll(status){

  //   this.loadingService.show();

  //   let data ={
  //     startDate:this.startDate,
  //     endDate:this.endDate,
  //     status : status,

  //   }

  //   this.loanService.getBatchPostingDetailNew(data).subscribe((response: any) => {
  //     let doc = response.result;
    

  //      if (doc.length != 0) {
  //        let excel = doc
  //       // doc.forEach(excel => {
          
  //         var byteString = atob(excel.reportData);
  //         var ab = new ArrayBuffer(byteString.length);
  //         var ia = new Uint8Array(ab);
  //         for (var i = 0; i < byteString.length; i++) {
  //             ia[i] = byteString.charCodeAt(i);
  //         }
  //         var bb = new Blob([ab]);
      
  //         try {
  //             var file = new File([bb], excel.templateTypeName, {type: 'application/vnd.ms-excel' });
  //             saveAs(file);
  //         } catch (err) {
  //             var textFileAsBlob = new Blob([bb], {type: 'application/vnd.ms-excel' });
  //             window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName+'.xlsx');
  //         }
          
  //       // });
        
  //     }  
  //    this.loadingService.hide();
  //   });
  // }


}
