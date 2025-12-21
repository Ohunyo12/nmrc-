import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoanService } from '../../credit/services/loan.service';
import { LoadingService } from '../../shared/services/loading.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../shared/constant/app.constant';
import { saveAs } from 'file-saver';
import { ReportService } from '../service/report.service';


@Component({
  selector: 'app-approval-monitoring',
  templateUrl: './approval-monitoring.component.html',
  styleUrls: ['./approval-monitoring.component.scss']
})
export class ApprovalMonitoringComponent implements OnInit {

 
  startDate: Date;
  endDate: Date;
  templateTypeId:number
  crmsForm : FormGroup;
  crmsFacilityDetail:any;
  bookinApprovalRecords:any;
  contractReviewApprovalRecords:any;

  crmsCode:any;
  crmsDate:any;
  count:any;
  approvalStatus: any;
  ApprovalStatusList:any[];
  operationId: any;
  ApprovalOperationList: any[];
  @Input() loanId:any;
  @Input() isLms:any;
  displayModalForm: boolean = false;
  approvalWorkflowData: any[];

  showContractReviewData:boolean = false;
  @Input() loanSystemTypeId:any;
  @Input() hideTab :boolean;
  @Input() menuPage :boolean;
  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  systemResponse: any;
  CRMSLoan: any;
  document: any;
  constructor(private fb:FormBuilder,private loanService: LoanService,
    private loadingService: LoadingService,
    private reportServ: ReportService) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.getApprovalStatus();
    this.getApprovalOperations();
  }

  GetFacilities():void {
    let data = {
      startDate : this.startDate,
      endDate : this.endDate,
      //approvalStatus : this.approvalStatus,
      //operationId : this.operationId,
    }
    this.showContractReviewData = false;
    this.loadingService.show();
    this.reportServ.GetApprovalMointoring(data).subscribe((response: any) => {
      if(response.success)
      {
        this.crmsFacilityDetail = response.result;
        this.count = response.count;
        
      }        
        this.loadingService.hide();
    }, (err: any) => {    
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
      this.loadingService.hide(1000);
    });

    this.loadingService.show();
    this.reportServ.GetBookingMointoring(data).subscribe((response: any) => {
      if(response.success)
      {
        this.bookinApprovalRecords = response.result;
        this.count = response.count;
        
      }        
        this.loadingService.hide();
    }, (err: any) => {    
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
      this.loadingService.hide(1000);
    });
  }



GetContractApprovals():void {
  let data = { startDate : this.startDate, endDate : this.endDate }
 
  this.loadingService.show();
  this.reportServ.GetContractReviewMointoring(data).subscribe((response: any) => {
    if(response.success) {
      this.contractReviewApprovalRecords = response.result;
      this.count = response.count;
      if(this.count > 0)this.showContractReviewData = true;
    }        
      this.loadingService.hide();
  }, (err: any) => {    
    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
    this.loadingService.hide(1000);
  });
  
}

  getApprovalStatus() {
    this.reportServ.GetAllApprovalStatus().subscribe((respone: any) => {
      this.ApprovalStatusList = respone.result;
  })
  }

  getApprovalOperations() {
    this.reportServ.GetAllApprovalOperations().subscribe((respone: any) => {
      this.ApprovalOperationList = respone.result;
      ////console.log('this.ApprovalOperationList',this.ApprovalOperationList);
      
  })
  }
  selectedRowRecord:any;
  viewRecord(row){
    this.approvalWorkflowData = [];
    this.selectedRowRecord = row;
    //console.log("selectedRowRecord",this.selectedRowRecord);
  this.reportServ.getApprovalTrailByTargetId(this.selectedRowRecord.loanApplicationId).subscribe((res: any) => {
    const record = res.result;
     this.approvalWorkflowData = record;
     this.displayModalForm = true;

 });

}
  viewBookingRecord(row){
    this.approvalWorkflowData = [];
    this.selectedRowRecord = row;
    //console.log("selectedRowRecord",this.selectedRowRecord);
    this.loadingService.show();
    this.reportServ.getBookingApprovalTrailByTargetId(this.selectedRowRecord.loanBookingRequestId).subscribe((res: any) => {
      this.loadingService.hide();
      const record = res.result;
      this.approvalWorkflowData = record;
      this.displayModalForm = true;
    });
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
         __this.success.emit(true);  
      __this.loadingService.hide();
    } else {
        swal(GlobalConfig.APPLICATION_NAME, response.message, 'error');
        __this.success.emit(false);  
        __this.loadingService.hide(1000);
    }   

  }, (err: any) => {    
    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error')
    this.success.emit(false);  
    __this.loadingService.hide(1000);
  });  
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            this.success.emit(false);  
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
      startDate : this.startDate,
      endDate : this.endDate,
      //approvalStatus : this.approvalStatus,
      //operationId : this.operationId,

    }

    this.reportServ.exportApprovalMonitoringExportToExcel(data).subscribe((response: any) => {
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

