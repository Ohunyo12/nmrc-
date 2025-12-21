import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoanService } from 'app/credit/services/loan.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { saveAs } from 'file-saver';
@Component({
  selector: 'crms-regulatories-operations',
  templateUrl: './crms-regulatories-operations.component.html',
  //styleUrls: ['./crms-regulatories.component.scss']
})
export class CrmsRegulatoriesOperationsComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  templateTypeId:number
  crmsForm: FormGroup;
  crmsFacilityDetail:any;
  crmsCode:any;
  crmsDate:any;
  count:any;

  @Input() loanId:any;
  @Input() isLms:any;

  @Input() loanSystemTypeId:any;
  @Input() hideTab:boolean;
  @Input() menuPage:boolean;

  systemResponse: any;
  CRMSLoan: any;
  document: any;
  constructor(private fb:FormBuilder,private loanService: LoanService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    
  }

  GetFacilities():void {
    let data ={
      startDate : this.startDate,
      endDate : this.endDate,
isLms: this.isLms,
    }
    this.loanService.getAllLoanWithCRMSLoan(data).subscribe((response: any) => {
      if(response.result.length>0)
      {
        this.crmsFacilityDetail = response.result;
        this.count = response.count;
        
      }else{
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'No Record Found', 'warning');
      }
        
        this.loadingService.hide();
    });
}

  InitiateCRMSForm(){
  this.crmsForm = this.fb.group({

  })
  }
  AddCBNCode(){

    
    
  }


  AddCRMSCode(){
    let __this = this;
    swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to assign this CRMS Code?',
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success btn-move',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
    }).then(function () {
        __this.loadingService.show();
  
      let data ={
      crmsCode:__this.crmsCode,
      loanId:__this.loanId,
      crmsDate:__this.crmsDate,
      loanSystemTypeId:__this.loanSystemTypeId
    }
    __this.loanService.addCRMScode(data).subscribe((response: any) => {
      if (response.success === true) {
        swal(GlobalConfig.APPLICATION_NAME, 'Code Added Successfully.', 'success');
         __this.systemResponse = response.result;
      __this.loadingService.hide();
    } else {
        swal(GlobalConfig.APPLICATION_NAME, response.message, 'error');
        __this.loadingService.hide(1000);
    }   

  }, (err: any) => {    
    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error')
    __this.loadingService.hide(1000);
  });  
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
          
  }
  show: boolean = false; message: any; title: any; cssClass: any; // message box

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
}
showMessage(message: string, cssClass: string, title: string) {
  this.message = message;
  this.title = title;
  this.cssClass = cssClass;
  this.show = true;
}
  ExportToExcel(){

    this.loadingService.show();

    let data ={
      crmsCode:this.crmsCode,
      loanId:this.loanId,
      crmsDate:this.crmsDate,
      loanSystemTypeId:this.loanSystemTypeId,
      startDate:this.startDate,
      endDate:this.endDate,
      templateTypeId : this.templateTypeId

    }

    this.loanService.exportCRMSReportToExcel(data).subscribe((response: any) => {
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
  }


}
