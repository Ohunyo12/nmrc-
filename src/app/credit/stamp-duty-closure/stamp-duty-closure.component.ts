import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';

import { HelperService } from 'app/shared/services/helpers.service';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-stamp-duty-closure',
  templateUrl: './stamp-duty-closure.component.html',

})
export class StampDutyClosureComponent implements OnInit {

  templateTypeId: number
  crmsForm: FormGroup;
  crmsFacilityDetail: any;
  bookinApprovalRecords: any;
  contractReviewApprovalRecords: any;

  crmsCode: any;
  crmsDate: any;
  count: any;
  approvalStatus: any;
  ApprovalStatusList: any[];
  operationId: any;
  facilityStampDuties: any[] = [];
  facilityStampDutiesFiltered: any[] = [];
  ApprovalOperationList: any[];
  multipleData: any = {};
  displayModalForm: boolean = false;
  approvalWorkflowData: any[];

  showContractReviewData: boolean = false;

  startDate: Date;
  endDate: Date;
  systemResponse: any;
  CRMSLoan: any;
  document: any;
  maxIndividualSLA: string;
  tatData: any;
  facilityStampDuty: any;
  facilityStampDutyDetail: any;
  displayfacilityStampDutyDetail: boolean;
  facilityStampDutyId: any;
  files: FileList;
  file: File;
  uploadFileTitle: string = null;
  physicalFileNumber: string = null;
  physicalLocation: string = null;
  documentTypeId: number = null;
  @ViewChild('fileInput', { static: false }) fileInput: any;
  stampDutySharingForm: FormGroup;
  customerId: number;
  showFacilityStampDuties: boolean;
  showFacilityStampDutiesFiltered: boolean;
  TotalStampDuty: any;
  displayMultipleModel: boolean;
  multipleStampData: any;
  stampDutyBulkForm: FormGroup;
  loanApplicationDetailId: any;
  csdc: any;
  facilityStampDutiesFixed: any;
  facilityStampDutiesFixedFiltered: any;
  showFacilityStampDutiesFixedFiltered: boolean;
  showFacilityStampDutiesFixed: boolean;
  constructor(private fb: FormBuilder, private collateralService: CollateralService,
    private loadingService: LoadingService,

    public helperService: HelperService) { }



  ngOnInit() {
    this.getAllFacilityStampDuty();
    this.getAllFacilityStampDutyFixed();
    this.activateForm(); 
    this.activateBulkForm();
    this.multipleStampData = [];
  }

  getFacilityStampDuty(loanApplicationId) {
    this.loadingService.show()
    this.collateralService.getFacilityStampDutyById(loanApplicationId).subscribe((response) => {
      this.facilityStampDuty = response.result;
      this.csdc = response.result.csdc
      this.loadingService.hide();
    });
  }

  getAllFacilityStampDuty() {
    this.loadingService.show()
    this.collateralService.getAllFacilityStampDuty().subscribe((response) => {
      this.facilityStampDuties = response.result;
      this.showFacilityStampDuties = true
      this.loadingService.hide();
    });
  }
  getAllFacilityStampDutyFixed() {
    this.loadingService.show()
    this.collateralService.getAllFacilityStampDutyFixed().subscribe((response) => {
      this.facilityStampDutiesFixed = response.result;
      this.showFacilityStampDuties = true
      this.loadingService.hide();
    });
  }

  viewRecord(row) {
    this.facilityStampDutyDetail = row;
    this.displayfacilityStampDutyDetail = true;
    this.facilityStampDutyId = row.facilityStampDutyId;
    this.customerId = row.customerId;
    this.operationId = row.operationId;
    this.documentTypeId = row.documentTypeId;
    this.getFacilityStampDuty(row.loanApplicationDetailId);
    this.loanApplicationDetailId = row.loanApplicationDetailId;
    this.stampDutySharingForm = this.fb.group({

      fileData: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  activateForm() {
    this.stampDutySharingForm = this.fb.group({

      fileData: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  activateBulkForm() {
    this.stampDutyBulkForm = this.fb.group({

      fileData: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }

  onFileChange(event) {
    this.files = event.target.files;
    this.file = this.files[0];
  }

  hideModal() {
    this.displayfacilityStampDutyDetail = false;

  }

  ShowApproveBulkStamp() {
    this.multipleData = [];
    this.displayMultipleModel = true;
  }

  GetFacilities():void {
    let data = {
      startDate : this.startDate,
      endDate : this.endDate,
      
    }
    this.showContractReviewData = false;
    this.loadingService.show();
    this.collateralService.getAllFacilityStampDutyFiltered(data).subscribe((response) => {
     
      this.loadingService.hide();
      if(response.success)
      {
        this.facilityStampDutiesFiltered = response.result;
        this.count = response.count;
        this.TotalStampDuty = this.facilityStampDutiesFiltered[0].totalDutyAmount
        this.showFacilityStampDuties = false;
        this.showFacilityStampDutiesFiltered = true
        
      }        
        this.loadingService.hide();
    }, (err: any) => {    
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
      this.loadingService.hide(1000);
    });

    this.collateralService.getAllFacilityStampDutyFixedFiltered(data).subscribe((response) => {
     
      this.loadingService.hide();
      if(response.success)
      {
        this.facilityStampDutiesFixedFiltered = response.result;
        this.count = response.count;
        this.TotalStampDuty = this.facilityStampDutiesFixedFiltered[0].totalDutyAmount
        this.showFacilityStampDuties = false;
        this.showFacilityStampDutiesFixed = false;
        this.showFacilityStampDutiesFixedFiltered = true
        
      }        
        this.loadingService.hide();
    }, (err: any) => {    
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
      this.loadingService.hide(1000);
    });
  }

  fileExtention(name: string) {
    var regex = /(?:\.([^.]+))?$/;
    return regex.exec(name)[1];
  }

  uploadFile(form) {
    if (this.file != undefined || this.uploadFileTitle != null) {
      let body = {
        comment: form.comment,
        customerId: this.customerId,
        documentTitle: this.uploadFileTitle,
        fileName: this.file.name,
        operationId: this.operationId,
        fileExtension: this.fileExtention(this.file.name),
        physicalFileNumber: this.physicalFileNumber,
        physicalLocation: this.physicalLocation,
        documentTypeId: this.documentTypeId, // TODO: redundant with fileExtension known
        fileSize: this.file.size,
        
        fileSizeUnit: 'kilobyte',
        isOriginalCopy: false,
        targetId: this.facilityStampDutyId,
        //targetReferenceNumber: this.targetReferenceNumber, 
        overwrite: false,
      
      };
      this.loadingService.show();

      this.collateralService.uploadSDFile(this.file, body).then((val: any) => {
        
        // this.updateCustomerInformationCompletion(this.customerId);
        this.uploadFileTitle = null;
        this.documentTypeId = null;
        this.fileInput.nativeElement.value = "";
        this.loadingService.hide();
        if (val.success == true) {
          this.getAllFacilityStampDuty();
         
          this.displayfacilityStampDutyDetail = false;
          this.loadingService.hide();
          
          swal(`${GlobalConfig.APPLICATION_NAME}`, val.message   , 'success');
          
          
          
        }
        else{
          swal(`${GlobalConfig.APPLICATION_NAME}`, val.message, 'error');
          this.loadingService.hide();
        }
      }, (error) => {
        this.loadingService.hide(1000);
        ////console.log("error", error);
      });
    }
  }

  approveBulk() {   
    
    let bodyObj = [];
    this.multipleStampData.forEach(el => {
        let body = {
          facilityStampDutyId: el.facilityStampDutyId,
            approvalStatusId: 2,
            comment: this.multipleData.comment,
            //comment: form.comment,
        customerId: this.multipleData.customerId,
        documentTitle: this.multipleData.uploadFileTitle,
        fileName: this.file.name,
        operationId: this.multipleData.operationId,
        fileExtension: this.fileExtention(this.file.name),
        physicalFileNumber: this.multipleData.physicalFileNumber,
        physicalLocation: this.multipleData.physicalLocation,
        documentTypeId: this.multipleData.documentTypeId, // TODO: redundant with fileExtension known
        fileSize: this.file.size,
        loanApplicationDetailId: el.loanApplicationDetailId,
        fileSizeUnit: 'kilobyte',
        isOriginalCopy: false,
        targetId: this.multipleData.facilityStampDutyId,
        
        //targetReferenceNumber: this.targetReferenceNumber, 
        overwrite: false,
        };
        
        bodyObj.push(body);
    });
  
  
    // this.display = false;
  
    const __this = this;
  
    swal({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
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
        __this.collateralService.approveBulkStamp( bodyObj).subscribe((val: any) => {
            __this.loadingService.hide();
            if (val.success === true) {
    
              __this.getAllFacilityStampDuty();
             
                __this.multipleData = [];
                
                
                swal(`${GlobalConfig.APPLICATION_NAME}`, val.message   , 'success');
                __this.showFacilityStampDutiesFiltered = false;
                __this.displayMultipleModel = false;
            } else {
                __this.displayMultipleModel = true;
                swal(`${GlobalConfig.APPLICATION_NAME}`, val.message, 'success');
            }
        }, (err) => {
            __this.loadingService.hide();
            __this.displayMultipleModel = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });
  }
}
