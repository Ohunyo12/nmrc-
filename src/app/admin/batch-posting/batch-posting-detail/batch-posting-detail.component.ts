import { Component, OnInit } from '@angular/core';
import { LoanService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { saveAs } from 'file-saver';
import swal from 'sweetalert2';

@Component({
  selector: 'app-batch-posting-detail',
  templateUrl: './batch-posting-detail.component.html',
  styleUrls: ['./batch-posting-detail.component.scss']
})
export class BatchPostingDetailComponent implements OnInit {
  searchInfo:any;
  startDate: Date;
  endDate: Date;
  batchPostingList: any;
  isLms: boolean;
  date: any;
  loanAcct: any;
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
    this.loanService.getBatchPostingDetails(data).subscribe((data) => {
      if (data.success==true){
      this.batchPostingList = data.result;
      }else{
        swal('FinTrak Credit 360', "No Record Found", 'error');
      }

    });
  }


  ExportToExcel(val){

    this.loadingService.show();

    let data ={
      date:val.rcreDate,
      loanAcct:val.loanAccount,

    }

    this.loanService.generateDailyAccrualExcellReport(data).subscribe((response: any) => {
      let doc = response.result;
    

       if (doc.length != 0) {
         let excel = doc
        // doc.forEach(excel => {
          
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
        // });
        
      }  
     this.loadingService.hide();
    });
    this.loadingService.hide();

  }

 
  
}
