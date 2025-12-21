import { Component, OnInit, Input, Output } from '@angular/core';
import { CollateralService } from '../../../../../../setup/services';
import { Subject } from 'rxjs';
import { CustomerService } from '../../../../../../customer/services/customer.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../../../shared/constant/app.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService, LoanService } from 'app/credit/services';
import { ValidationService } from '../../../../../../shared/services/validation.service';
import { Row } from 'primeng/primeng';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
  selector: 'app-policy-approval',
  templateUrl: './policy-approval.component.html',
})
export class PolicyApprovalComponent implements OnInit {

  approvalStatusId: any;
  insurancePolicies: any;
  itemPolicy: any;
  supportingDocuments: any;
  binaryFile: string;
  imageData: any;
  selectedDocument: string;
  displayDocument: boolean = false;
  myPdfFile: any;
  collateralId: any;
  toSearchBtnText: string;
  customerCollateralSelection: any;
  customers: any;
  collateralItemPolicy: any;
  hasInsurance: any;
  collateralDeposit: any;
  collateralCasa: any;
  collateralPreciousMetal: any;
  collateralStock: any;
  collateralVehicle: any;
  collateralEquipment: any;
  customerName: any;
  collateralGaurantee: any;
  collateralMarketableSecurity: any;
  collateralInsurancePolicy: any;
  collateralProperty: any;
  mainCollateralView: any;
  customerCollateral: any;
  searchResults: any[];
  searchTerm$ = new Subject<any>();
  searchStagingTerm$ = new Subject<any>();
  hideTable: boolean = true;
  hideGrid: boolean = false;
  mainCollateralDetail: any = {};
  isInsurancePolicy: any;
  isVisitation: any;
  loanApplicationId: any;
  @Input() isHeaderInfoBased: boolean = true;
  @Input() showCollateralInformation = true;
  @Input() collateralCustomerId: number;
  @Input() useSearch: boolean = true;
  @Input() collateralTypeId: number;
  @Input('searchQuery') searchQuery = new Subject<string>();


  @Output() selectedCaollateral: any;
  customerCollaterals: any[];
  comment: any;
  commentForm: FormGroup;
  displayCommentForm: boolean = false;
  trailApprovalLevels: any;
  insuranceForm: boolean = false;
  insuranceFormGroup: FormGroup;
  insuranceType: any;
  insuranceCompany: any;
  currentDate: Date;
  selection: any;
  show: boolean = false; message: any; title: any; cssClass: any;
  insurancePolicy: any;
  requestComment: any;
  requestReason: any;
  targetId: any;
  operationId: any;
  rowSelected: boolean;
  staffRoleId: any;
  makeAddInsuranceButtonVisible: boolean = false;
  lastApprovalComment: any;
  showInsuranceUploadLink:boolean=false;
  showInsuranceUpload:boolean = false;
  storedApplicationInfo: any;
  loanApplicationReferance: any;
  reload:number;
  InsuranceForm: FormGroup;
  documentUploads: any;
  uploadCount: any;
  selectedId: any;
  formState:string;
  PolicyForm:boolean=false;
  policyFormGroup:FormGroup;
  collateraalId:any;
  insuranceInformation: any;
  // customerId: any;


  constructor(
    private collateralService: CollateralService,
    private loadingService: LoadingService,
    private customerService: CustomerService,
    private camService: CreditAppraisalService,
    private loanBookingService: LoanService,
    private fb: FormBuilder,
    private creditAppraisalService: CreditAppraisalService,
  ) { }

  ngOnInit() {
    this.getItemPolicy();
    this.showCommentForm(true);
    this.intializeForms();
    this.loadDropdowns();
    this.currentDate = new Date();
    this.disableAddInsuranceButton();
    this.approvalStatusId=0;
    // this.getDocumentsByTarget();
  }

  showCommentForm(init = false) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      approvalLevelId: ['', Validators.required]
    });
    if (init == false) this.displayCommentForm = true;
  }

   

  intializeForms() {
    this.insuranceFormGroup = this.fb.group({
      referenceNumber: ['', Validators.required],
      sumInsured: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      // insuranceType: ['', Validators.required],
      // differInsurancePolicy: false,
      inSurPremiumAmount: ['', Validators.required],
      description: ['', Validators.required],
      premiumPercent: [''],
       policyStateId: ['', Validators.required],
      companyAddress: ['', Validators.required],
      insuranceTypeId: ['', Validators.required],
      insuranceCompanyId: ['', Validators.required],
      prevoiusInsuranceId: [[0]],
      // isInsuranceApplication: ['']
    });

    this.policyFormGroup=this.fb.group({
      referenceNumber: ['', Validators.required],
      insuranceType: ['', Validators.required],
      insuranceCompany: ['', Validators.required],
      sumInsured: ['', Validators.required],
      startDate: ['', Validators.required],
      expiryDate: ['', Validators.required]
    });

  }

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

  loadDropdowns() {

    this.collateralService.getInsuranceType().subscribe((response: any) => {
      this.insuranceType = response.result;
    });

    this.collateralService.getInsuranceCompany().subscribe((response: any) => {
      this.insuranceCompany = response.result;
    });
  }

  getInsurerAddress(d) {

    let record = this.insuranceCompany.filter(x => x.insuranceCompanyId == d);

    this.insuranceFormGroup.controls["companyAddress"].setValue(record[0].address + ", " + record[0].phoneNumber + ", " + record[0].email)
  }


  getTempCustomerCollateral(): void {
    this.loadingService.show();
    this.collateralService.getTempCustomerCollateral().subscribe((response: any) => {
      this.customerCollaterals = response.result;
      ////console.log('response.result >>>>>',response.result)
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getTempCollateralByType(collateralId, typeId): void {
    this.loadingService.show();
    this.collateralService.getTempCollateralInformationByCollateralType(collateralId, typeId).subscribe((response: any) => {
      this.selectedCaollateral = response.result;

      ////console.log('sub items...', response);
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }



  public getPolicyInformation(policy): any {

    this.selection = policy;
    this.targetId = policy.insuranceRequestId;
    this.operationId = policy.operationId;
    this.requestComment = policy.requestComment;
    this.requestReason = policy.requestReason;
    this.rowSelected = true;
    this.getLastComment(this.operationId, this.targetId);
    this.GetInsurancePolicyByCollateralid(policy.collateraalId);

    if (this.itemPolicy != null) {

      this.mainCollateralDetail = this.itemPolicy.find(x => x.insuranceRequestId == policy.insuranceRequestId)
    }

    this.collateralId = this.mainCollateralDetail.collateraalId;
    this.customerName = this.mainCollateralDetail.customerName;

    this.hideGrid = true;
    this.mainCollateralView = true;
    this.useSearch = false;

    this.getInsurancePolicies(this.collateralId);

    return this.customerCollateral;
  }


  onSlectedCustomerChange() {
    this.collateralCustomerId = this.customerCollateralSelection.collateralId;
    this.collateralTypeId = this.customerCollateralSelection.collateralTypeId;

    //this.getPolicyInformation(this.collateralCustomerId,this.collateralTypeId);
  }

  turnOnSearch() {
    this.useSearch = true;
    this.mainCollateralView = false;
  }

  forwardCollateralApproval() {

    let __this = this;
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to approve this item policy?',
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
        targetId: __this.mainCollateralDetail.insuranceRequestId,
        comment: __this.comment,
        approvalStatusId: __this.approvalStatusId
      }
      __this.collateralService.approveItemPolicyCreation(data).subscribe((response: any) => {
        __this.selectedCaollateral = response.result;

        if (response.success == true) {

          __this.getItemPolicy();
          __this.refreshApprovalCommentAndStatus();
          __this.turnOnSearch();
          __this.loadingService.hide();
          __this.displayApplicationStatusMessage(response.result);

        }
        else if (response.success == true) {
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }


      }, (err) => {
        __this.loadingService.hide(1000);
      });


    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });

  }

  displayApplicationStatusMessage(response) {
    if (response.stateId == 3)
      swal(`${GlobalConfig.APPLICATION_NAME}`, `The Insurance Policy has been <strong>${response.statusName}</strong>`, 'success');
    else {
      swal(`${GlobalConfig.APPLICATION_NAME}`, `Application Status: <strong>${response.statusName}</strong>, Sent to: ${response.nextLevelName} <i>${response.nextPersonName}</i>`, 'success');
    }
  }

  viewVisitationDocument(id: number) {
    this.collateralService.getCollateralVisitationFile(id).subscribe((response: any) => {
      this.imageData = response.result;

    });

    let doc = this.imageData;
    // let doc = this.imageData.find(x => x.targetId == id);
    if (doc != null) {

      ////console.log('doc.fileData..',  doc.fileData);

      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayDocument = true;
    }
  }
  viewCollateralDocument() {
    this.collateralService.getCollateralDocument(this.collateralId).subscribe((response: any) => {
      this.imageData = response.result[0];
      ////console.log('documents..',  this.imageData);
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayDocument = true;
    });

    let doc = this.imageData;
    // let doc = this.imageData.find(x => x.targetId == id);
    if (doc != null) {

      ////console.log('doc.fileData..',  doc.fileData);

      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayDocument = true;
    }
  }

  viewDocument(id: number) {

    let doc = this.supportingDocuments.find(x => x.documentId == id);
    if (doc != null) {
      this.binaryFile = doc.fileData;
      this.selectedDocument = doc.documentTitle;
      this.displayDocument = true;
    }
    ////console.log("binary file..", this.binaryFile);
  }
  getSupportingDocuments(id) {

    this.collateralService.getTempCollateralDocument(id).subscribe((response: any) => {
      this.supportingDocuments = response.result;
      ////console.log('documents..', response.result);
    });
  }

  getItemPolicy(): void {
    this.loadingService.show();
    this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response: any) => {
      this.itemPolicy = response.result;
      ////console.log('response.result >>>>>',response.result)
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getInsurancePolicies(collateralId) {
    //loan-visitation/{collateralVisitationId}
    this.collateralService.getInsurancePolicies(collateralId).subscribe((response: any) => {
      this.insurancePolicies = response.result;
      ////console.log('insurancePolicies..',  this.insurancePolicies);

    });
  }

  addInsurance(row): void {
    
    //this.loadingService.show();
    this.selectedId = null;
     
    this.selection = row;
    let data = {
      collateraalId: row.collateraalId,

    };
    this.loadingService.show();
    this.collateralService.checkInsurancePolicy(data).subscribe((response: any) => {
      if (response.success == true && response.result == true) {
        this.loadingService.hide(1000);
        this.insuranceForm = true;
      }
      else if (response.success == true && response.result == false) {

        this.loadingService.hide(1000);

        let __this = this;
        swal({
          title: 'Information',
          text: "Insurance has already been saved for this collateral, Do you want to Edit it?",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success btn-move',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: true,
        }).then(function () {
          __this.editInsurancePolicy(row.collateraalId);
        }, function (dismiss) {
          if (dismiss === 'cancel') {
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
          }
        });
      }
    });
    this.loadingService.hide();
  }

  editInsurancePolicy(collateraalId): void {

    this.loadingService.show();
    this.intializeForms();

    //this.insuranceInformation = this.getAddedInsurance(collateraalId);

    this.collateralService.getAddedInsurance(collateraalId).subscribe((response: any) => {
    this.insuranceInformation = response.result;

   // console.log('INFO_INSURANCE', this.insuranceInformation);
    this.selectedId = this.insuranceInformation.policyId;

    this.insuranceFormGroup.controls['referenceNumber'].setValue(this.insuranceInformation.referenceNumber);
    this.insuranceFormGroup.controls['sumInsured'].setValue(this.insuranceInformation.sumInsured);
    this.insuranceFormGroup.controls['startDate'].setValue( new Date(this.insuranceInformation.startDate));
    this.insuranceFormGroup.controls['expiryDate'].setValue(new Date(this.insuranceInformation.expiryDate));
    this.insuranceFormGroup.controls['inSurPremiumAmount'].setValue(this.insuranceInformation.inSurPremiumAmount);
    this.insuranceFormGroup.controls['description'].setValue(this.insuranceInformation.description);
    this.insuranceFormGroup.controls['premiumPercent'].setValue(this.insuranceInformation.premiumPercent);
    this.insuranceFormGroup.controls['policyStateId'].setValue(this.insuranceInformation.policyStateId);
    this.insuranceFormGroup.controls['companyAddress'].setValue(this.insuranceInformation.companyAddress);
    this.insuranceFormGroup.controls['insuranceTypeId'].setValue(this.insuranceInformation.insuranceTypeId);
    this.insuranceFormGroup.controls['insuranceCompanyId'].setValue(this.insuranceInformation.insuranceCompanyId);
    //this.insuranceFormGroup.controls['prevoiusInsuranceId'].setValue(prevoiusInsuranceId); 
    });

    //this.formState = 'Edit';
    this.loadingService.hide(1000);

    this.insuranceForm = true;
    
  }


  // this.insuranceFormGroup = this.fb.group({
  //   referenceNumber: ['', Validators.required],
  //   sumInsured: ['', Validators.compose([ValidationService.isNumber, Validators.required])],
  //   startDate: ['', Validators.required],
  //   expiryDate: ['', Validators.required],
  //   // insuranceType: ['', Validators.required],
  //   // differInsurancePolicy: false,
  //   inSurPremiumAmount: ['', Validators.required],
  //   description: ['', Validators.required],
  //   premiumPercent: [''],
  //    policyStateId: ['', Validators.required],
  //   companyAddress: ['', Validators.required],
  //   insuranceTypeId: ['', Validators.required],
  //   insuranceCompanyId: ['', Validators.required],
  //   prevoiusInsuranceId: [[0]],
  //   // isInsuranceApplication: ['']
  // });

  // public getAddedInsurance(collateraalId): any {
  //   var result;
  //   this.collateralService.getAddedInsurance(collateraalId).subscribe((response: any) => {
  //     result = response.result;
  //   });

  //   return result;
  // }


  SaveInsuranceForm(form) {

    var data = {
      collateraalId: this.selection.collateraalId,
      referenceNumber: form.value.referenceNumber,
      sumInsured: form.value.sumInsured,
      insuranceCompany: form.value.insuranceCompany,
      startDate: form.value.startDate,
      expiryDate: form.value.expiryDate,
      //insuranceType: form.value.insuranceType,
      inSurPremiumAmount: form.value.inSurPremiumAmount,
      description: form.value.description,
      premiumPercent: form.value.premiumPercent,
       //policyState: form.value.policyState,
      policyStateId: form.value.policyStateId,
      previousInsurance: form.value.previousInsurance,
      companyAddress: form.value.companyAddress,
      insuranceTypeId: form.value.insuranceTypeId,
      insuranceCompanyId: form.value.insuranceCompanyId,
      prevoiusInsuranceId: form.value.prevoiusInsuranceId
     
    };

    this.loadingService.show();
    if(this.selectedId == null) {
      this.collateralService.addInsurancePolicy(data).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true){ 
            this.intializeForms();         
              //this.PolicyForm = false;
              this.insuranceForm = false;
              this.getPolicyInformation(this.selection);
              swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
            }
          else{ 
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
          }
      }, (err: any) => {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
  } 
  else {
    this.collateralService.updateInsurancePolicy(this.selectedId, data).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {    
        //this.PolicyForm= false;
        this.insuranceForm = false;
        this.getPolicyInformation(this.selection);
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Updated Successfully!', 'success');
      }
      else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }
   
  }


  GetInsuranceDetail(id) {
    if (id == 2) {

    } else {
      this.insuranceFormGroup.controls['referenceNumber'].setValue("");
      this.insuranceFormGroup.controls['sumInsured'].setValue("");
      this.insuranceFormGroup.controls['startDate'].setValue("");
      this.insuranceFormGroup.controls['expiryDate'].setValue("");
      this.insuranceFormGroup.controls['inSurPremiumAmount'].setValue("");
      this.insuranceFormGroup.controls['description'].setValue("");
      this.insuranceFormGroup.controls['premiumPercent'].setValue("");
      //  this.insuranceForm.controls['policyState'].setValue("");
      this.insuranceFormGroup.controls['companyAddress'].setValue("");
    }
  }

  GetInsurancePolicyByCollateralid(collateralId) {
    this.collateralService.GetInsurancePolicyByCollateralid(collateralId).subscribe((response: any) => {
      this.insurancePolicy = response.result;
      //console.log('this.insurancePolicy', this.insurancePolicy);

    });
  }

  refreshApprovalCommentAndStatus() {
    this.approvalStatusId = 0;
    this.comment = "";
  }

  modalControl(event) {
    if (event == true) {
      this.displayCommentForm = false;
    }
  }

  referBackResultControl(event) {
    if (event == true) {
      this.getItemPolicy();
      this.displayCommentForm = false;
      this.turnOnSearch();
    }
  }

  disableAddInsuranceButton() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
    this.staffRoleId = userInfo.staffRoleId;
    if (this.staffRoleId == 483) {
      this.makeAddInsuranceButtonVisible = true;
    }
  }

  forwardForApproval() {


    if (this.staffRoleId == 483) {

      this.loadingService.show();

      let body = {
        collateraalId: this.selection.collateraalId,

      };

      this.collateralService.checkInsurancePolicy(body).subscribe((response: any) => {
        if (response.success == true && response.result == true) {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, 'Add Insururance to Proceed', 'error');
        }
        else if (response.success == true && response.result == false) {
          this.loadingService.hide();
          this.forwardCollateralApproval();
        }
        else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
    }
    else {
      this.forwardCollateralApproval();
    }

  }

  checkIfInsuranceHasBeenAdded(): boolean {
    this.loadingService.show();

    //483 is the staffRoleId for F1 Desk
    if (this.staffRoleId == 483) {
      let body = {
        collateraalId: this.selection.collateraalId,

      };

      this.collateralService.checkInsurancePolicy(body).subscribe((response: any) => {
        if (response.success == true && response.result == true) {
          this.loadingService.hide();
          return false;
        }
        else if (response.success == true && response.result == false) {
          this.loadingService.hide();
          return true;
        }
        else {
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
      });
    }
    else {
      return true;
    }

  }

  getLastComment(operationId, targetId) {

      this.collateralService.getLastComment(operationId, targetId).subscribe((response: any) => {
      this.lastApprovalComment = response.result;
      //console.log('LAST_APPROVAL_COMMENT', this.lastApprovalComment);
    });
  }

  setShowInsuranceUpload(){
   
        this.showInsuranceUpload = true;

  }

  UploadPolicy(event) {
    if (event.target.checked == true) {
        this.showInsuranceUploadLink = true
        this.InsuranceForm.controls['approvedLimitId'].disable();     
    } else{
        this.InsuranceForm.controls['approvedLimitId'].enable();
        this.showInsuranceUploadLink = false;
    }
}

deleteInsurance(d){
  this.collateralService.deleteInsurancePolicy(d.policyId).subscribe((response: any) => {
  });
}

editInsurance(row){
  this.formState = 'Edit';
  this.selectedId = row.policyId;
  this.collateraalId = this.selection.collateraalId;
  
  this.insuranceFormGroup.setValue({
    referenceNumber: row.referenceNumber,
    sumInsured: row.sumInsured,
    startDate: new Date(row.startDate),
    expiryDate: new Date(row.expiryDate),
    inSurPremiumAmount: row.inSurPremiumAmount,
    description: row.description,
    premiumPercent: row.premiumPercent,
    policyState: row.policyState,
    companyAddress: row.companyAddress,
    insuranceTypeId: row.insuranceTypeId,
    insuranceCompanyId: row.insuranceCompanyId,
    prevoiusInsuranceId: row.prevoiusInsuranceId
  });

  this.insuranceForm = true;

}




cancelPolicyForm(){
  this.insuranceFormGroup.setValue({
    referenceNumber: null,
    insuranceType:null,
    insuranceCompany:null,
    sumInsured:null,
    startDate:null,
    expiryDate:null
  });
  this.PolicyForm  = false;
}

savePolicy(form) {
  let body = {
    referenceNumber: form.value.referenceNumber,
    insuranceType: form.value.insuranceType,
    insuranceCompany: form.value.insuranceCompany,
    sumInsured: form.value.sumInsured,
    startDate: form.startDate,
    expiryDate: form.expiryDate
};
  this.loadingService.show();
  if(this.selectedId == null) {
    this.collateralService.savePolicy(body).subscribe((response: any) => {
        this.loadingService.hide();
        if (response.success == true){ 
          this.intializeForms();         
            this.PolicyForm = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');
          }
        else{ 
          this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
    }, (err: any) => {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
} 
else {
  this.collateralService.updateInsurancePolicy(this.selectedId, body).subscribe((response: any) => {
    this.loadingService.hide();
    if (response.success == true) {    
      this.PolicyForm= false;
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Updated Successfully!', 'success');
    }
    else {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
    }
  }, (err: any) => {
    this.loadingService.hide();
    swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
  });
}

}
deleteInsurancePolicy(data): void {
  this.selectedId = data.signatoryId;
  let __this = this;
  swal({
    title: 'Are you sure?',
    text: "Confirm Delete, Are you sure you want to Delete?",
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
    __this.collateralService.deleteInsurancePolicy(__this.selectedId).subscribe((response: any) => {
      __this.loadingService.hide();
      if (response.success == true) {
     
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Removed Successfully!', 'success');
      }
      else {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }, (err: any) => {
      __this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }, function (dismiss) {
    if (dismiss === 'cancel') {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
  });
}



 }
