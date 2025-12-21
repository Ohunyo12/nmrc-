import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { GlobalConfig } from 'app/shared/constant/app.constant';
import { HelperService } from 'app/shared/services/helpers.service';
import { LoadingService } from 'app/shared/services/loading.service';

import swal from 'sweetalert2';
import { ReportService } from '../service/report.service';
import { CollateralService, CustomerFSCaptionService } from 'app/setup/services';

@Component({
  selector: 'app-stamp-duty-report',
  templateUrl: './stamp-duty-report.component.html',
  styles: []
})
export class StampDutyReportComponent implements OnInit {

  startDate: Date;
  endDate: Date;
  templateTypeId: number
  crmsForm: FormGroup;
  facilityStampDuties: any;
  bookinApprovalRecords: any;
  contractReviewApprovalRecords: any;

  crmsCode: any;
  crmsDate: any;
  count: any;
  approvalStatus: any;
  ApprovalStatusList: any[];
  operationId: any;
  ApprovalOperationList: any[];
  @Input() loanId: any;
  @Input() isLms: any;
  displayModalForm: boolean = false;
  approvalWorkflowData: any[];

  showContractReviewData: boolean = false;
  @Input() loanSystemTypeId: any;
  @Input() hideTab: boolean;
  @Input() menuPage: boolean;
  @Output() success: EventEmitter<any> = new EventEmitter<any>();

  systemResponse: any;
  CRMSLoan: any;
  document: any;
  maxIndividualSLA: string;
  tatData: any;
  constructor(private fb: FormBuilder, private collateralService: CollateralService, 
    private loadingService: LoadingService,
    private reportServ: ReportService,
    public helperService: HelperService) { }

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    
  }

  GetFacilities():void {
    let data = {
      startDate : this.startDate,
      endDate : this.endDate,
      
    }
    this.showContractReviewData = false;
    this.loadingService.show();
    this.collateralService.getAllFacilityStampDutyReport(data).subscribe((response) => {
     
      this.loadingService.hide();
      if(response.success)
      {
        this.facilityStampDuties = response.result;
        this.count = response.count;
        
      }        
        this.loadingService.hide();
    }, (err: any) => {    
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
      this.loadingService.hide(1000);
    });

  
  }

  





 
  selectedRowRecord: any;
 
  

  
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
  ExportToExcel() {

    this.loadingService.show();
    let data = {
      startDate: this.startDate,
      endDate: this.endDate,
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
          var file = new File([bb], excel.templateTypeName, { type: 'application/vnd.ms-excel' });
          saveAs(file);
        } catch (err) {
          var textFileAsBlob = new Blob([bb], { type: 'application/vnd.ms-excel' });
          window.navigator.msSaveBlob(textFileAsBlob, excel.templateTypeName + '.xlsx');
        }
        // });

      }
      this.loadingService.hide();
    });
    this.loadingService.hide();

  }


}

function saveAs(file: File) {
  throw new Error('Function not implemented.');
}
