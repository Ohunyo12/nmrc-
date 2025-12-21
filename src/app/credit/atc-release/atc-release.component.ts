import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from '../services/loan.service';
import { FormBuilder, Validators, FormGroup, Form } from '@angular/forms';
import swal from 'sweetalert2';
import {CollateralService, CurrencyService } from 'app/setup/services';
import { ApplicationStatus, GlobalConfig, CollateralType } from 'app/shared/constant/app.constant';
import { ApprovalService } from 'app/setup/services';

@Component({
  selector: 'app-atc-release',
  templateUrl: './atc-release.component.html',
  //styleUrls: ['./atc-release.component.scss']
})
export class AtcReleaseComponent implements OnInit {
  AtcLodgments: any;
  searchCustomerId: any;
  customerId: any;
  showCusotmerSearch: boolean;
  atcLodgmentId: any;
  showAdditionalDocument: boolean;
  AtcLodgmentDetailList: any;
  displayAccountBalance: boolean;
  activeTabindex: any;
  showRelease:boolean=false;
  atcLodgement: any;
  atcReleaseForm: FormGroup;
  show: boolean = false; message: any; title: any; cssClass: any;
  AtcReleaseDetail: any;
  accountBalances: any;
  showPhoneNumberSearch: boolean = false;
  selectedAtcReleaseRows: any[] = [];
  AtcReleaseRow: any;
  editable: boolean = false;
  atcReleaseList: any;
  displayAtcReleaseListForApproval: boolean = false;
  convertedUnitToRelease: number;
  collateralList: any;
  mainCollateralDetail: any;
  customerCollateral: any;
  isInsurancePolicy: any;
  isVisitation: any;
  collateralId: any;
  customerName: any;
  collateralProperty: boolean;
  mainCollateralView: boolean;
  collateralMarketableSecurity: boolean;
  collateralGaurantee: boolean;
  collateralEquipment: boolean;
  collateralVehicle: boolean;
  collateralStock: boolean;
  collateralPreciousMetal: boolean;
  collateralCasa: boolean;
  collateralDeposit: boolean;
  collateralItemPolicy: boolean;
  collateralPromissory: boolean;
  indemnity: boolean;
  collateralIspo: boolean;
  domiciliationContract: boolean;
  domiciliationSalary: boolean;
  useSearch: boolean;
  hideGrid: boolean;
  supportingDocuments: any;
  selectedCollateralId: any;
  selectedRow: any;
  originalDocumentApproval: any;
  unitToRelease: any;
  arrayLength: number = 0;
  editModal: boolean = false;
  editRowData: any;
  editedLength: number = 0;
  editSelection: any;
  editedData: any[] = [];
  editedDataBody: any;
  selectedId: any;

  constructor(
    private loadingService: LoadingService,
    private loanService: LoanService,
    private collateralService: CollateralService,
    private approvalService: ApprovalService,
    private fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.getAtcLodgments();
    this.clearInput();
    this.getAtcReleaseList();
  }

  getAtcReleaseList() {
    this.loanService.getAtcReleaseList().subscribe((response: any) => {
      if(response.success == true) this.atcReleaseList = response.result;
    })
  }

  getAtcLodgments() {
    this.loanService.getAtcLodgmentForRelease().subscribe((response: any) => {
        this.AtcLodgments = response.result;
        //console.log('ATCLODGMENTS',this.AtcLodgments );
        
    });
}

addAdditionalDetail(d){
  this.atcLodgmentId = d.atcLodgmentId
  this.showAdditionalDocument=true;

  this.getAtcLodgmentDetail(this.atcLodgmentId);
}
getAtcLodgmentDetail(id){
  this.loanService.getAtcLodgmentDetail(id).subscribe((response: any) => {
      this.AtcLodgmentDetailList = response.result;
      
  });
}
getCusotmerAccountBalance(){
  this.accountBalances = this.getAccountBalance("");
  this.displayAccountBalance=true;
}
getAccountBalance(customerId) {
  let list: any = [
      { 'AccountNumber': '34343434343', 'AccountBalance': '20000000' },
      { 'AccountNumber': '34343434222', 'AccountBalance': '45000000' },
      { 'AccountNumber': '34343112222', 'AccountBalance': '64555000' },
      { 'AccountNumber': '32223434222', 'AccountBalance': '39900000' },
  ];
  return list;
}

select(d){

  //console.log('>>>>>>', d);

  this.searchCustomerId =d.customerId;
  this.atcLodgement = d;
  this.activeTabindex=1;
}
onTabChange($event) {
  this.activeTabindex = $event.index;
}
/* newAtcRelease(){
  this.loanService.getAtcRelease(this.atcLodgement.atcLodgmentId).subscribe((response: any) => {
    this.AtcReleaseDetail = response.result;

  this.atcReleaseForm.controls['unitNumber'].setValue(this.atcLodgement.unitNumber);
  this.atcReleaseForm.controls['unitRelease'].setValue(this.AtcReleaseDetail.unitRelease);
  this.atcReleaseForm.controls['unitBalance'].setValue(this.AtcReleaseDetail.unitBalance);
 //  this.getAtcRelease(this.searchCustomerId.atcLodgmentId)
  this.showRelease=true;
});
  
} */

clearInput(){
  this.atcReleaseForm = this.fb.group({
    unitNumber: ['', Validators.required],
    unitRelease: [''],
    unitBalance:[''],
    unitToRelease:['',Validators.required]
});
}

getAtcRelease(id){
  this.loanService.getAtcRelease(id).subscribe((response: any) => {
      this.AtcReleaseDetail = response.result;
      
  });
}

Approve(row) {
  
  //console.log('rowData', row);
  this.convertedUnitToRelease = +(row.unitToRelease);
  
  //console.log('convertedUnitToRelease', this.convertedUnitToRelease);

  //Validating unitNumber against UnitToRelease
  //unit to release( same as convertedUnitToRelease) must NOT be zero, undefined, null and must be less than unitNumber
  
  if(row.unitNumber >= this.convertedUnitToRelease && this.convertedUnitToRelease > 0) {

    let __this = this;
    swal({
        title: 'Are you sure?',
        text: "This cannot be reversed. Are you sure you want to proceed?",
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
      __this.loanService.saveAtcRelease(__this.selectedAtcReleaseRows).subscribe((response: any) => {
        if (response.success == true) {
  
          __this.selectedAtcReleaseRows=[];
          __this.arrayLength = 0;
          __this.getAtcLodgments();
          __this.getAtcReleaseList();
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.activeTabindex =4;
        
        } else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
          __this.selectedAtcReleaseRows=[];
          __this.arrayLength = 0;
          __this.getAtcLodgments();
          __this.getAtcReleaseList();
          __this.activeTabindex = 4;
        }
        
      
    });
  
  
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
        }
    });      
         
  }
  else{

    this.message = 'Invalid Input For Unit To Release';
    this.finishBad(this.message);
  }
}

saveAtcRelase(){
 
  let __this = this;
  swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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
    __this.loanService.saveAtcRelease(__this.selectedAtcReleaseRows).subscribe((response: any) => {
      if (response.success == true) {

        __this.selectedAtcReleaseRows=[];
        __this.arrayLength = 0;
        __this.getAtcLodgments();
        __this.getAtcReleaseList();
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        __this.activeTabindex =4;
      
      } else {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        __this.selectedAtcReleaseRows=[];
        __this.arrayLength = 0;
        __this.getAtcLodgments();
        __this.getAtcReleaseList();
        __this.activeTabindex = 4;
      }
      
    
  });


  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });      
       
}

deleteAtcRelease(row) {
  let __this = this;
  swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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
      
      
  __this.loanService.deleteAtcLodgment(row.atcReleaseId).subscribe((response: any) => {
      if (response.result == true) this.getAtcRelease(row.atcLodgmentId);
  });
     
  }, function (dismiss) {
      if (dismiss === 'cancel') {
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
  });
}

onRowSelect(data) {
  //console.log('rowData', data);
  this.convertedUnitToRelease = +(data.unitToRelease);
  
  //console.log('convertedUnitToRelease', this.convertedUnitToRelease);
  //console.log('selectedAtcReleaseRows', this.selectedAtcReleaseRows);
  let index = this.selectedAtcReleaseRows.findIndex(obj => obj.atcLodgmentId == data.atcLodgmentId);
  //console.log('index', index);
  //Validating unitNumber against UnitToRelease
  //unit to release( same as convertedUnitToRelease) must NOT be zero, undefined, null and must be less than unitNumber
  
  if(data.unitNumber >= this.convertedUnitToRelease && this.convertedUnitToRelease > 0 && (index < 0 || index == null))
  //if(data.unitNumber >= this.unitToRelease && this.unitToRelease != 0 && (index < 0 || index == null))
  {
      this.selectedAtcReleaseRows.push ({
        approvalStatusId: data.approvalStatusId,
        approvalStatusName: data.approvalStatusName,
        atcLodgmentId: data.atcLodgmentId,
        atcReleaseId: data.atcReleaseId,
        atcTypeId: data.atcTypeId,
        branchId: data.branchId,
        branchName: data.branchName,
        companyId: data.companyId,
        createdBy: data.createdBy,
        customerCode: data.customerCode,
        customerId: data.customerId,
        customerName: data.customerName,
        depot: data.depot,
        description: data.description,
        numberOfBags: data.numberOfBags,
        totalValue: data.totalValue,
        unitNumber: data.unitNumber,
        unitToRelease: this.convertedUnitToRelease,
        unitValue: data.unitValue,
        dateCreated: data.dateCreated
    });
    this.arrayLength = this.selectedAtcReleaseRows.length;
  }
  else 
  {
    this.message = 'ERROR!\nInvalid Input For Unit To Release';
    swal(`${GlobalConfig.APPLICATION_NAME}`, this.message, 'error');
  }

}



closeAtcReleaseForm() {
 this.showRelease=false;
 this.clearInput();
}

remove(row){
  //console.log('rowToDelete', row);
  let index = this.selectedAtcReleaseRows.findIndex(obj=> obj.atcLodgmentId == row.atcLodgmentId);
  //console.log('indexToRemove', index);
  if(index > -1)
  {
    this.selectedAtcReleaseRows.splice(index, 1);
  }
}

  onRowSelectUnselect(row){
    this.remove(row);
    //console.log('rowToDelete', row);
    //console.log('MyList', this.selectedAtcReleaseRows);
    this.arrayLength = this.selectedAtcReleaseRows.length;
  }

  // ---------------------- message ----------------------

  finishGood(message) { 
      this.showMessage(message, 'success', "FintrakBanking"); 
  }

  hideMessage(event) { this.show = false; }

  finishBad(message) {
      this.showMessage(message, 'error', "FintrakBanking");
  }

  showMessage(message: string, cssClass: string, title: string) {
      this.message = message;
      this.title = title;
      this.cssClass = cssClass;
      this.show = true;
  }
  // showAtcReleaseListForApproval() {
  //   this.displayAtcReleaseListForApproval = true;
  // }

  // cancelAtcReleaseListForApproval() {
  //   //make sure to refesh the list after canceling or atleast clear selections
  //   this.ngOnInit();
  //   this.selectedAtcReleaseRows = [];
  //   this.displayAtcReleaseListForApproval = false;
  // }

  public getCollateralInformation(collateralCustomerId: number): any {
    this.collateralService.getCustomerCollateralByCollaterId(collateralCustomerId)
        .subscribe((res) => {
            this.mainCollateralDetail = res.result[0];
            //console.log(' this.mainCollateral', this.mainCollateralDetail);

            this.collateralService.GetCollateralDetailsByCollateral(this.mainCollateralDetail.collateralId, this.mainCollateralDetail.collateralTypeId)
                .subscribe((res) => {
                    //console.log('res', res);
                    this.customerCollateral = res.result;

                    this.isInsurancePolicy = this.mainCollateralDetail.requireInsurancePolicy;
                    this.isVisitation = this.mainCollateralDetail.requireVisitation;
                    this.collateralId = this.mainCollateralDetail.collateralId;
                    this.customerName = this.mainCollateralDetail.customerName;
                    this.customerId = this.mainCollateralDetail.customerId

                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.IMMOVABLE_PROPERTY) { this.collateralProperty = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.MARKETABLE_SECURITIES) { this.collateralMarketableSecurity = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.GUARANTEE) { this.collateralGaurantee = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.PLANT_AND_EQUIPMENT) { this.collateralEquipment = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.VEHICLE) { this.collateralVehicle = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.STOCK) { this.collateralStock = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.PRECIOUS_METAL) { this.collateralPreciousMetal = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.CASA) { this.collateralCasa = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.FIXED_DEPOSIT) { this.collateralDeposit = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.POLICY) { this.collateralItemPolicy = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.PROMISSORY) { this.collateralPromissory = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.INDEMNITY) { this.indemnity = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.ISPO) { this.collateralIspo = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONCONTACT) { this.domiciliationContract = true; this.mainCollateralView = true; }
                    if (this.mainCollateralDetail.collateralTypeId == CollateralType.DOMICILIATIONSALARY) { this.domiciliationSalary = true; this.mainCollateralView = true; }

                    this.customerCollateral != null ? this.useSearch = false : this.useSearch = true;

                    this.getSupportingDocuments(collateralCustomerId);
                    // this.getCollateralValuations(collateralCustomerId);
                    // if (this.isInsurancePolicy) {
                    //   this.getCollaterTempItemPolicies(collateralCustomerId);
                    // }
                });

            //this.activeTabindex = 3;
        });
    this.hideGrid = true;
    return this.customerCollateral;
}

viewValuationDetail(row) {
 //console.log('row', row);
  this.selectedCollateralId = row.collateralId;
  var collateralDetail = this.getCollateralInformation(row.collateralId);
  this.selectedRow = row;
 // console.log("collateralDetail:", collateralDetail);
  this.getOriginalDocumentByCollateralCustomerId(row.collateralId);
  this.activeTabindex = 3;
}

getSupportingDocuments(id) {
  this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
      this.supportingDocuments = response.result;
      ////console.log('documents..', response.result);
  });
}

getOriginalDocumentByCollateralCustomerId(id) {
  this.approvalService.getOriginalDocumentByCollateralCustomerId(id).subscribe((response: any) => {
      this.originalDocumentApproval = response.result;
      //console.log(' this.originalDocumentApproval', this.originalDocumentApproval);

  });
}

  getCollateral() {
    this.getCustomerCollateral(this.searchCustomerId);
    this.activeTabindex = 2;
  }

getCustomerCollateral(id, name = null): void {
    this.loadingService.show();
    this.collateralService.getCustomerCollateral(id, null).subscribe((response: any) => {
        this.collateralList = response.result;
        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000);
    });
   // console.log('collateralList',this.collateralList);
}

editReferredAtcRelease(data) {

 // console.log('DATAcHECK', data);
  this.selectedId = data.atcReleaseId;

  this.editRowData = [];
    this.unitToRelease = 0;
    this.editRowData.push({
      approvalStatusId: data.approvalStatusId,
      approvalStatusName: data.approvalStatusName,
      atcLodgmentId: data.atcLodgmentId,
      atcReleaseId: data.atcReleaseId,
      atcType: data.atcType,
      branchId: data.branchId,
      branchName: data.branchName,
      companyId: data.companyId,
      createdBy: data.createdBy,
      customerCode: data.customerCode,
      customerId: data.customerId,
      customerName: data.customerName,
      depot: data.depot,
      description: data.description,
      numberOfBags: data.numberOfBags,
      totalValue: data.totalValue,
      unitNumber: data.unitNumber,
      unitToRelease: this.unitToRelease,
      unitValue: data.unitValue,
      dateCreated: data.dateCreated
  });
  this.editModal = true;
}

checkRowLength() {
  this.editedLength = this.editSelection.length;
}


  checkRow(data) {
   // console.log('EDITED_ROW', data);
    this.editedData = [];
    this.convertedUnitToRelease = +(data.unitToRelease);
    this.editedDataBody = data;

   // console.log('this.convertedUnitToRelease', this.convertedUnitToRelease);

    if (data.unitNumber >= this.convertedUnitToRelease && this.convertedUnitToRelease > 0) {

      this.editedData.push({
        approvalStatusId: data.approvalStatusId,
        approvalStatusName: data.approvalStatusName,
        atcLodgmentId: data.atcLodgmentId,
        atcReleaseId: data.atcReleaseId,
        atcTypeId: data.atcTypeId,
        branchId: data.branchId,
        branchName: data.branchName,
        companyId: data.companyId,
        createdBy: data.createdBy,
        customerCode: data.customerCode,
        customerId: data.customerId,
        customerName: data.customerName,
        depot: data.depot,
        description: data.description,
        numberOfBags: data.numberOfBags,
        totalValue: data.totalValue,
        unitNumber: data.unitNumber,
        unitToRelease: this.convertedUnitToRelease,
        unitValue: data.unitValue,
        dateCreated: data.dateCreated
      });
      this.editedLength = this.editedData.length;
     // console.log('checkData', data);
    }
    else {
      this.message = 'ERROR!\nInvalid Input For Unit To Release';
      swal(`${GlobalConfig.APPLICATION_NAME}`, this.message, 'error');
    }
  }


  saveEditedAtcRelease() {

    //console.log('editedData', this.editedData);
    //console.log('editSelection', this.editSelection);

    let body = {
      customerId: this.editedDataBody.customerId,
      atcTypeId: this.editedDataBody.atcTypeId,
      description: this.editedDataBody.description,
      depot: this.editedDataBody.depot,
      unitValue: this.editedDataBody.unitValue,
      unitNumber: this.editedDataBody.unitNumber,
      numberOfBags: this.editedDataBody.numberOfBags,
      branchId: this.editedDataBody.branchId,
      unitToRelease: this.editedDataBody.unitToRelease,
      totalValue: this.editedDataBody.totalValue,
      atcLodgmentId: this.editedDataBody.atcLodgmentId,
      atcReleaseId: this.editedDataBody.atcReleaseId,
      approvalStatusId: this.editedDataBody.approvalStatusId,
      customerCode: this.editedDataBody.customerCode,

    };
    //this.selectedAtcReleaseRows.push(body);

    this.loadingService.show();

    this.loanService.saveEditedAtc(this.selectedId, body).subscribe((response: any) => {
      if (response.success == true) {
        this.loadingService.hide();
        this.approveEditedAtc(body);
        
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }


  approveEditedAtc(data) {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: "This cannot be reversed. Are you sure you want to proceed?",
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
        __this.loanService.submitReferredAtcForApproval(data).subscribe((response: any) => {

        if (response.success == true) {

          __this.loadingService.hide();
          __this.getAtcReleaseList();
          __this.editModal = false;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        } else {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }

      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

}
