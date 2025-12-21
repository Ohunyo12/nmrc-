import { Component, OnInit, ViewChild} from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { CustomerInformationDetailComponent } from '../../../customer/components';
import { CollateralInformationViewComponent } from '../../collateral';
import { JobRequestViewComponent } from '../../components';
import { CustomerService } from '../../../customer/services/customer.service';
import { DateUtilService } from '../../../shared/services/dateutils';
import { DocumentService } from '../../../setup/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tranche-facility-utilization',
  templateUrl: './tranche-facility-utilization.component.html',
  providers: [LoanService]
})
export class TrancheFacilityUtilizationComponent implements OnInit {
    isLoanSelection: boolean=false;
    activeSearchTabindex: any;
    selectedLoan: any;
    loanId: any;
    contingentLoanSelection: any;
    OverdraftLoanSelection: any;
    showDetail: boolean;
    searchForm: FormGroup;
    displaySearchForm: boolean;
    showCollateralInformation: boolean;
    loanTypeId: any;
    collateralCustomerId: any;
    collateralTypeId: any;
    displayCollateralDetails: boolean;
    disbursableAmount: any;
    loanApplId: any;
    loanApplDetailId: any;
    file: any;
    files: any;
    displayInitiationForm: boolean;

    secondaryInfocaption: string;
    loanInfoUpdate: any;
    isGroup: boolean;
    pdfFile: any;
    pdfFileName: string;
    myDocExtention: string;
    displayDocument: boolean;
    selectedDocument: any;
    binaryFile: any;
    display: boolean = false; show: boolean = false; width: string; message: any; title: any; cssClass: any;
    loanApplication: any[];
    initiationForm: FormGroup;
    inputTitleText = 'Customer Request Document';
    loans: any[] = [];
    loanSelection: any;
    customerSelection: any;
    formState: string = null;
    customerName: string;
    customerCode: string;
    feeTypeText: string;
    uploadFileTitle: string = "Customer Request Document";
    //activeSearchTabindex:any;
    supportingDocuments: any[] = [];

    applicantName: string;
    showCustomerCollaterals: boolean = false;
    customerCollaterals: any[];
    scheduleTitle: string = 'Generate Schedule';
    noDataDiv: string = 'no-data-div';
    casaAccountId: number;
    reload: number = 0;

    @ViewChild(CustomerInformationDetailComponent, {static: false}) customerInfo: CustomerInformationDetailComponent;
    @ViewChild(CollateralInformationViewComponent, {static: false}) CollateralInfoObj: CollateralInformationViewComponent;
    @ViewChild(JobRequestViewComponent, {static: false}) jobRequestViewObj: JobRequestViewComponent;

    constructor(private customerService: CustomerService,
        private fb: FormBuilder,
        private dateUtilService: DateUtilService,
        private loanBookingService: LoanService,
        private loadingSrv: LoadingService,
        private camService: CreditAppraisalService,
        private documentService: DocumentService,
        private router: Router
    ) { }

    ngOnInit() {
        this.clearControls();
    }


    getAvailedLoanApplications() {
        this.loadingSrv.show();
        this.loanBookingService.getAvailedLoanApplications()
            .subscribe((res) => {
                this.loanApplication = this.loans = res.result;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
    }
    getLoanApplicationsForTrancheFacilityUilization() {

        let searchValue =this.searchForm.get('searchString').value;
        this.loadingSrv.show();
        this.loanBookingService.getApplicationsForTrancheFacilityUilization(searchValue)
            .subscribe((res) => {
                this.loanApplication = this.loans = res.result;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
            this.displaySearchForm=false;
    }
  
    closeCollateralDetaits(event) {
        if (event)
            this.showCollateralInformation = false;
    }

    ViewCollateralDetails(index_data) {
        this.showCollateralInformation = true;
        this.collateralCustomerId = index_data.collateralCustomerId;
        this.reload++;
    }

    viewTranch(row){
        this.loanBookingService.getLoanFacilityDetal(row.loanApplicationDetailId).subscribe(response => {
            this.selectedLoan = response.result;
            this.activeSearchTabindex = 1;
            
    }); 
    }



    
    onSearchTabChange($event) {
        this.activeSearchTabindex = $event.index;
      }
    getLoanDetails(loanId) {
        this.loanBookingService.getFacilityDetail(loanId).subscribe(response => {
          this.loanSelection = response.result;
           
          this.loanId =this.loanSelection.loanId
        //   if(this.loanSelection!=null){this.isLoanSelection=true; 
        });
      }


      getOverdraftLoanDetails(loanId) {
        this.loanBookingService.getOverdraftFacilityDetail(loanId).subscribe(response => {
          this.OverdraftLoanSelection = response.result;
        });
      }

      getContingentLoanDetails(loanId) {
        this.loanBookingService.getContingentFacilityDetail(loanId).subscribe(response => {
          this.contingentLoanSelection = response.result;
        });
    
    
      }

    showSearchForm(){
        this.displaySearchForm=true;
    }

    submitForm(){
        
    }

    showBalance(){
        
    }

    clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
    }
}