import { Component, OnInit, Input, Output , EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import swal from 'sweetalert2';
import { LoadingService } from '../../shared/services/loading.service';
import { LoanOperationService } from '../../credit/services/loan-operations.service';
import { GlobalConfig } from '../../shared/constant/app.constant';


@Component({
  selector: 'app-camsol-approval',
  templateUrl: './camsol-approval.component.html',
//  styleUrls: ['./camsol-approval.component.scss']
})
export class CamsolApprovalComponent implements OnInit {
  targetCustomer: any;
  viewCusotmerDetail: boolean;
  customerLoanCamsol: any;
  loanCamsolType: any;
  loanCamsolValue: any;
  entityName: any;
  loanCamsolData: any;
  camsolForm: FormGroup;
  viewDetail:boolean;
  searchValue:any;
  camsoltypeid:any;
  customercode:any;
  updateOption:boolean;
  response:any;
  comment: any;
  approvalStatusId: any;
  camsolAprovalStatus: any;
  useSearch:boolean;
  camsolApprovalForm: FormGroup;
  tempLoancamsolid: any;
  multipleCamsolData: any;
  multipleData: any = {};
  displayMultipleModel: boolean = false;
  display: boolean = false;

  constructor( private loadingService: LoadingService, private fb: FormBuilder,
     private loanOperationService: LoanOperationService,
) { }

  ngOnInit() {
    this.viewDetail=false;
    this.multipleCamsolData = [];
    this.GetLaonCamsolAwaitingApproval();
   // this.getCamsolPropeties();
  }

  // getCamsolPropeties()
  // {
  //   this.camsolApprovalForm = this.fb.group({
  //     Comment : [''],
  //     approvalStatusId : [''],
  //   });
  // }
  GetLaonCamsol() {
    this.loadingService.show();
    this.loanOperationService.getAllCamsol()
      .subscribe(results => {
        this.loanCamsolData = results.result;
        
      });
      this.loadingService.hide();
  }

  ViewCamsolAwaingApprovalById(row) {
    this.loadingService.show();
    this.customercode=row.customercode
    this.loanOperationService.CamsolByCamsolAwaitingApprovalById(row.tempLoancamsolid)
      .subscribe(results => {
        this.loanCamsolValue = results.result;
        this.customercode=this.loanCamsolValue.customercode
         this.viewDetail=true;
        this.entityName = this.loanCamsolData.loansystemtype;
        this.loadingService.hide();
      });
  }

GetLaonCamsolAwaitingApproval() {
    this.loadingService.show();
    this.loanOperationService.getAllCamsolByCamsolAwaitngApproval()
      .subscribe(results => {
        this.loanCamsolData = results.result;
        this.loadingService.hide();
      });
  }

  GetLaonCamsolByType(id) {
    this.loadingService.show(); 
    this.loanOperationService.getLoanCamsolTypeId(id)
      .subscribe(results => {
    this.loanCamsolData = results.result;
    this.loadingService.hide();
      });
  }

  GetLaonCamsolType() {
    this.loanOperationService.getLoanCamsolType()
      .subscribe(results => {
        this.loanCamsolType = results.result;
      });
  }

  GetAllSearchCamsol() {
    if(this.searchValue!=null){  
    this.loanOperationService.getAllSearchCamsol(this.searchValue)
      .subscribe(results => {
        if(results.result.length==0){
          this.loanCamsolData = results.result;
          swal('FinTrak Credit 360', "No matching record found! : " , 'warning');
        }else{
        this.loanCamsolData = results.result;
        }

      });
    }else{
      swal('FinTrak Credit 360', "Search parameter is required : " , 'error');

    }
  }

  turnOnSearch(){
    this.viewDetail=false;
  }

  forwardCollateralApproval(d) {
    let __this = this;
    swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to proceed with this approval?',
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
   
        let data = {
          tempLoancamsolid:__this.loanCamsolValue.tempLoancamsolid,
          comment:__this.comment,
          approvalStatusId : __this.approvalStatusId,
          customercode :__this.customercode
        }
        
      __this.loanOperationService.goForCamsolApproval(data).subscribe((response: any) => {
          __this.camsolAprovalStatus = response.result;
          __this.GetLaonCamsolAwaitingApproval();
          __this.viewDetail = false;
          __this.comment = "";
          __this.approvalStatusId = "";
          __this.loadingService.hide();

          if(response.success) {
            swal('FinTrak Credit 360', response.result, 'success');
          }
          else { swal('FinTrak Credit 360', response.result, 'error'); }          
      }, (err) => {
          __this.loadingService.hide(1000);
      });
        
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });

  }

  GetLaonCamsolById() {
    if(this.searchValue!=null){  
    this.loanOperationService.getAllSearchCamsol(this.searchValue)
      .subscribe(results => {
        this.loanCamsolData = results.result;
        this.targetCustomer=this.searchValue;
   // this.entityName = this.loanCamsolData.loansystemtype;
     
      });
    }else{
      swal('FinTrak Credit 360', "Search parameter is required : " , 'error');

    }
  }

  goForCamsolApproval(data) {

    this.loadingService.show();
    this.loanOperationService.getLoanCamsolByCostomerCode(data)
      .subscribe(results => {
        this.customerLoanCamsol = results.result;

        this.loadingService.hide();
        this.viewCusotmerDetail = true;
      });
  }

  ShowApproveBulkStaff() {
    this.multipleData = [];
    this.displayMultipleModel = true;
}

goForBulkApproval() {
  let loading = this.loadingService;
  let srv = this.loanOperationService;
  let getCamsol = this.GetLaonCamsol;
  let bodyObj = [];
  this.multipleCamsolData.forEach(el => {
      let body = {
        tempLoancamsolid: el.tempLoancamsolid,
          approvalStatusId: this.multipleData.approvalStatusId,
          comment: this.multipleData.comment
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
      __this.loanOperationService.approveBulkCamsol(bodyObj).subscribe((response: any) => {
          __this.loadingService.hide();
          if (response.success === true) {
              __this.multipleData = [];
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
              __this.GetLaonCamsolAwaitingApproval();
              __this.displayMultipleModel = false;
          } else {
              __this.displayMultipleModel = true;
              swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
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

  // ApproveLoan(){
  //   var __this=this;
  //   swal({
  //     title: 'Are you sure?',
  //     text: ' Are you sure you want to proceed?',
  //     type: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No, cancel!',
  //     confirmButtonClass: 'btn btn-success btn-move',
  //     cancelButtonClass: 'btn btn-danger',
  //     buttonsStyling: true,

  // }).then(function () {

  //   const data = {
  //     customercode : __this.searchValue,
  //     updateOption: __this.updateOption
  //    }

     
  //      __this.loadingService.show(); 
      
  //      __this.loanOperationService.approveLoan(data)
  //        .subscribe(results => {
  //          __this.response = results.result;
          
  //          swal(`${GlobalConfig.APPLICATION_NAME}`, 'concession granted to access loan', 'success');

  //  __this.loadingService.hide();
  //  __this.EditLaonCamsolByCustomerName(__this.searchValue);
  //  __this.searchValue="";
  //  __this.viewCusotmerDetail=false;


  //        });
      
  //    // this.displayModalForm = false;
  // }, function (dismiss) {
  //     if (dismiss === 'cancel') {
  //         swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
  //     }
  // });

  // }
}
