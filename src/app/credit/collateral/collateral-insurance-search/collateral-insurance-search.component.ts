import { Component, OnInit } from '@angular/core';
import { CollateralService } from 'app/setup/services';
import { saveAs } from 'file-saver';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService } from 'app/credit/services';

@Component({
  selector: 'app-collateral-insurance-search',
  templateUrl: './collateral-insurance-search.component.html'

})
export class CollateralInsuranceSearchComponent implements OnInit {
  activeTabindex: any;
  displaySearchForm: boolean = false;
  searchForm:FormGroup;
  displaySearchTable:boolean = false;
  applications: any[];
  searchString: any;
  selection: any;
  targetId: any;
  operationId: any;
  rowSelected:boolean;
  requestNumber: any;
  customerName: any;
  level: any;
  status: any;
  mainInsuranceDetail: any={};
  collateralId: any;
  mainInsuranceView: boolean;
  hideGrid: boolean = false;
  customerCollateral: any;
  showBottom: boolean = false;
  insurancePolicy: any;
   insurancePolicies: any;
  //  applicationSelection: any;
   reload:number;
 
  // requestComment: any;
  // requestReason: any;
  makeDownLoadInsuranceButtonVisible: boolean = false;
  useSearch: boolean;
  fileDocument: any;
  binaryFile: any;
  selectedDocument: any;
  displayDocument: boolean;
  allRequiredDocumentsAreUploaded = true;
  insuranceApplications:any;


  constructor(
    private collateralService: CollateralService,
    private creditAppraisalService: CreditAppraisalService,
    private loadingService:LoadingService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.clearControls();
    this.getItemPolicy();
  }

  getItemPolicy(){
    this.loadingService.show();
    this.collateralService.getInsurancePoliciesWaitingForApproval().subscribe((response: any) => {
      this.insuranceApplications = response.result;
     // console.log("my insuranceApplications "+ JSON.stringify(this.insuranceApplications));
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  clearControls() {
    this.searchForm = this.fb.group({
        searchString: ['', Validators.required],
    });
  }
  onTabChange(obj) { }
  
  showSearchForm() {this.displaySearchForm=true;}

  CancelDetails() { 
    this.showBottom = false;
    this.mainInsuranceView = null;
  }
  submitForm(form) {
    this.searchString = form.value.searchString;
    this.loadingService.show();
    this.collateralService.GetinsuranceSearch(this.searchString).subscribe((response: any) => {
      this.applications = response.result;
      this.loadingService.hide();
      this.displaySearchForm = false;
      this.displaySearchTable = true;
      this.showBottom = false;
    }, (err: any) => {
      this.loadingService.hide(1000);
    });
}

public getInsuranceInformation(insurance): any {
  
  this.selection = insurance;
  //console.log("see my Ids",insurance);

  this.targetId = insurance.insuranceRequestId;
  this.operationId = insurance.operationId;
  this.customerName = insurance.customerName;
  this.requestNumber = insurance.requestNumber;
  // this.requestComment = insurance.requestComment;
  // this.requestReason = insurance.requestReason;
  this.level=insurance.level;
  this.rowSelected = true;
  this.status=insurance.status;
  this.GetInsurancePolicyByCollateralid(insurance.collateraalId);
 // console.log('targetId, OperationId and good', this.operationId, this.targetId);
  
  if (this.applications != null) {
     this.mainInsuranceDetail = this.applications.find(x => x.insuranceRequestId == insurance.insuranceRequestId)
     
}
     this.collateralId = this.mainInsuranceDetail.collateraalId;
     this.customerName = this.mainInsuranceDetail.customerName;
  this.hideGrid = true;
  this.mainInsuranceView = true;
  this.useSearch = false;

  this.showBottom = true;

  this.getInsurancePolicies(this.collateralId)
  return this.customerCollateral;
}

getInsurancePolicies(collateralId) {
  //loan-visitation/{collateralVisitationId}
  this.collateralService.getInsurancePolicies(collateralId).subscribe((response: any) => {
    this.insurancePolicies = response.result;
    

  });
}

setrequiredUploadValue(value: boolean) {
  this.allRequiredDocumentsAreUploaded = value;

}

GetInsurancePolicyByCollateralid(collateralId) {
  this.collateralService.GetInsurancePolicyByCollateralid(collateralId).subscribe((response: any) => {
    this.insurancePolicy = response.result;
  });
}

deleteInsurance(){

}

editInsurance(){
  
}


}





