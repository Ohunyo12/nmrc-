import { Component, OnInit, Input, Output , EventEmitter, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { CollateralService } from '../../../setup/services/collateral.service';
import { AppConstant, GlobalConfig } from '../../../shared/constant/app.constant';
import { LoanService } from 'app/credit/services';
import swal from 'sweetalert2';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { isNullOrUndefined } from 'util';

@Component({
    templateUrl: 'collateral-swap.component.html'
})

export class CollateralSwapComponent implements OnInit {
    activeTabindex: number;
    displaySearchForm: boolean = false;
    searchForm:FormGroup;
    applications: any[];
    searchString: any;
    selection: any;
    targetId: any;
	operationId: number = 206; // Collateral Swap OperationId
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
	reload:number;
	showProposedCollaterals = false;
	selectedRecord: any;
	swapRecord: any;
  
    useSearch: boolean;
    fileDocument: any;
    binaryFile: any;
    selectedDocument: any;
    displayDocument: boolean;
	allRequiredDocumentsAreUploaded = true;
	oldSwapCollateral: any;
	newSwapCollateral: any;
	collateralSwapForm: FormGroup;
	swapForwardForm: FormGroup;
	collateralSwapRequests: any[] = [];
	proposedCollateralDetails: any[] = [];
	approvedCollateralDetails: any[] = [];
	selectedId: number;
	csForwardForm: FormGroup;
	showCsForward: boolean;
    csForwardTitle = 'Collateral Swap';
	vote: number;
	forwardAction: number;
	showCollateralDetail = false;
	showLoanDetails = false;
	selectedApplicationId = 0;
	collateralToShow: any = {};
	disableSubmitForApproval: boolean = true;
	customerId: number;
	oldCollateralId: number;
	newCollateralId: number;
	collateralSwapCode: string;
	displayCollateralHistory = false;
  
    constructor(
		private collateralService: CollateralService,
        private loanService: LoanService,
		private creditAppraisalService: CreditAppraisalService,
		private loadingService:LoadingService,
		private fb: FormBuilder
    ) { }
  
    ngOnInit() {
		this.initializeControls();
		this.getCollateralSwapRequests();
    }

	initializeControls() {
		this.resetActiveTabIndex();
		this.clearControls();
	}

    clearControls() {
		this.approvedCollateralDetails = [];
		this.proposedCollateralDetails = [];
		this.applications = [];
		this.selectedId = null;
		this.selectedApplicationId = null;
		this.reload = 1;
		this.oldSwapCollateral = {};
		this.newSwapCollateral = {};
		this.searchForm = this.fb.group({
			searchString: ['', Validators.required],
		});
		this.collateralSwapForm = this.fb.group({
			customerId: '',
			collateralSwapId: '',
			loanCollateralMappingId: ['', Validators.required],
			loanAppCollateralId: ['', Validators.required],
			oldCollateralId: ['', Validators.required],
			newCollateralId: ['', Validators.required],
		});

		this.csForwardForm = this.fb.group({
            forward: [''],
            comment: ['', Validators.required]
        });
	}

	startNewSwapRequest() {
		this.showNextTab();
	}
	
	getCollateralSwapRequests() {
		this.loadingService.show();
		this.collateralService.getCollateralSwapRequests().subscribe((response: any) => {
			this.collateralSwapRequests = response.result;
			this.loadingService.hide();
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
			this.loadingService.hide(1000);
		});
	}

	// getCollateralSwapRequestsForApproval() {
	// 	this.collateralService.getCollateralSwapRequestsForApproval().subscribe((response: any) => {
	// 		this.collateralSwapRequests = response.result;
	// 	});
	// }

	// viewSwapInfo(row) {
	// 	this.selectedId = row.collateralSwapId;
	// 	this.loadingService.show();
	// 	this.collateralService.getCollateralMappingDetails(row.loanAppCollateralId).subscribe((response: any) => {
	// 		this.loadingService.hide();
	// 		if (response.success == true){
	// 			this.applications = response.result;
	// 			this.showNextTab();
	// 		}
	// 	});
	// }

	viewSwapInfo(row) {
		this.loadingService.show();
		this.selectedId = row.collateralSwapId;
		this.targetId = row.collateralSwapId;
		this.customerId = row.customerId;
		this.oldCollateralId = row.oldCollateralId;
		this.selectedApplicationId = row.loanApplicationId;
		this.newCollateralId = row.newCollateralId;
		this.collateralSwapCode = row.swapRef;
		this.editCollateralSwapForm(row);
		this.loadingService.hide();
		// for document upload
		// if (this.staffRoleRecord.staffRoleCode == 'LEGAL') {
		// 	this.isUserLegal = true;
		// }
		// else {
		// 	this.isUserLegal = false;
		// }

		this.getCustomerCollateralByCustomerCollateralId(this.oldCollateralId, 1, row.coverage);
		this.getCustomerCollateralByCustomerCollateralId(this.newCollateralId, 2, row.coverage);

		this.loadingService.show();
		this.collateralService.getCollateralMappingDetails(row.loanAppCollateralId).subscribe((response: any) => {
			if (response.success == true) {
				this.applications = response.result;
				// this.disableApprovalButtons = this.applications.length > 0 ? false : true;
				// this.showNextTab();
			}
			this.loadingService.hide();
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
			this.loadingService.hide(1000);
		});
		this.activeTabindex = 3;
	}

	getCustomerCollateralByCustomerCollateralId(customerCollateralId: number, newOrOld: number, coverage: number) {
		this.loadingService.show();
		this.collateralService.getCustomerCollateralByCustomerCollateralId(customerCollateralId).subscribe((response: any) => {
			if (response.success == true) {
				if (newOrOld == 1) { 
					this.approvedCollateralDetails = [];
					this.oldSwapCollateral = response.result;
					this.oldSwapCollateral.coverage = coverage;
					this.approvedCollateralDetails.push(this.oldSwapCollateral);
				}
				if (newOrOld == 2) { 
					this.proposedCollateralDetails = [];
					this.newSwapCollateral = response.result; 
					this.newSwapCollateral.coverage = coverage; 
					this.proposedCollateralDetails.push(this.newSwapCollateral);
				}
			}
			this.loadingService.hide();
		}, (err: any) => {
			this.loadingService.hide(1000);
			this.finishBad(JSON.stringify(err));
		});
	}
    
    showSearchForm() {this.displaySearchForm=true;}
  
    cancelDetails() { 
		this.showBottom = false;
		this.mainInsuranceView = null;
	}
	
    submitSearch(form) {
		this.searchString = form.value.searchString;
		this.loadingService.show();
		let body = {
			searchString: this.searchString
		}
		this.loanService.approvedLoanApplicationDetailSearch(body).subscribe((response: any) => {
			this.loadingService.hide();
			this.applications = response.result;
			this.displaySearchForm = false;
			this.showBottom = false;
		}, (err: any) => {
			this.loadingService.hide(1000);
		});
	}

	showNextTab() {
		this.activeTabindex += 1;
	}
  
  	viewProposedCollaterals(row) {
		//console.log('ProposedCollateral: ', row);
		this.selectedRecord = row;
		this.customerId = row.customerId;
		this.selectedApplicationId = row.loanApplicationId;
		// this.resetActiveTabIndex();
		this.showNextTab();
		// this.showProposedCollaterals = true;
	}

	viewLoanDetail(row){
		this.selectedApplicationId = row.loanApplicationId;
		this.showLoanDetails = true;
	}

	viewCollateralDetail(row){
		this.collateralToShow = row;
		this.showCollateralDetail = true;
	}

	viewCollateralHistory(row) {
		this.collateralToShow = row;
		this.displayCollateralHistory = true;
	}
  
	onTabChange(event) {
        this.activeTabindex = event.index;
    }
  
	setrequiredUploadValue(value: boolean) {
		this.allRequiredDocumentsAreUploaded = value;
	
	}
  
	isOnApplicationsListTab(): boolean {
        return (this.activeTabindex == 0 || this.activeTabindex == 1);
    }
	
	resetActiveTabIndex() {
        this.activeTabindex = 0;
        this.activeTabindex = 0;
        this.activeTabindex = 0;
	}
	
	getEmittedCollateral(event) {
		this.approvedCollateralDetails = [];
		this.proposedCollateralDetails = [];
		//console.log("event: ", event);
		this.newSwapCollateral = event;
		this.oldSwapCollateral = event.oldCollateral;
		this.newSwapCollateral.coverage = event.oldCollateral.actualCollateralCoverage;
		this.oldSwapCollateral.coverage = event.oldCollateral.actualCollateralCoverage;
		if(!isNullOrUndefined(this.newSwapCollateral) && this.newSwapCollateral.currencyId == 1){
			this.newSwapCollateral.baseCurrencyCode = this.newSwapCollateral.currencyCode;
			this.newSwapCollateral.collateralValueLcy = this.newSwapCollateral.collateralValue;
		}
		this.approvedCollateralDetails.push(this.oldSwapCollateral);
		this.proposedCollateralDetails.push(this.newSwapCollateral);
		if (this.oldAndNewCollateralsForSwapAreValid) {
			this.showNextTab();
			this.setCollateralSwapForm();
		}
	}

	oldAndNewCollateralsForSwapAreValid(): boolean {
		return ((this.newSwapCollateral != null && this.newSwapCollateral != undefined) && (this.oldSwapCollateral != null && this.oldSwapCollateral != undefined))
	}

	setCollateralSwapForm() {
		this.collateralSwapForm.patchValue({
			loanCollateralMappingId: this.newSwapCollateral.oldCollateral.loanCollateralMappingId,
			loanAppCollateralId: this.newSwapCollateral.oldCollateral.loanAppCollateralId,
			oldCollateralId: this.newSwapCollateral.oldCollateral.collateralId,
			newCollateralId: this.newSwapCollateral.collateralId,
			customerId: this.customerId
		});
	}

	editCollateralSwapForm(body) {
		this.collateralSwapForm.setValue({
			collateralSwapId: body.collateralSwapId,
			loanCollateralMappingId: body.loanCollateralMappingId,
			customerId: body.customerId,
			loanAppCollateralId: body.loanAppCollateralId,
			oldCollateralId: isNullOrUndefined(body.oldSwapCollateral) ? body.oldCollateralId : body.oldSwapCollateral,
			newCollateralId: isNullOrUndefined(body.collateralId) ? body.newCollateralId : body.collateralId
		});
	}

	saveCollateralSwapRequest(form = this.collateralSwapForm) {
		form.value.customerId = this.customerId;
		form.value.collateralSwapId = this.selectedId;
		// var test = (this.collateralSwapForm.invalid) || !(this.selectedId > 0);
		(form.value);
		
		if (!(form.value.collateralSwapId > 0)) {
			this.loadingService.showKeyApiCall();
			this.collateralService.saveCollateralSwapRequest(form.value).subscribe((response: any) => {
				if (response.success == true) {
					this.disableSubmitForApproval = false;
					this.selectedId = response.result.collateralSwapId;
					this.targetId = response.result.collateralSwapId;
					this.collateralSwapCode = response.result.swapRef;
					this.finishGood(response.message);
					this.getCollateralSwapRequests();
				}else {
					this.finishBad(response.message);
				}
				this.loadingService.hideKeyApiCall();
			}, (err: any) => {
				this.finishBad(JSON.stringify(err));
				this.loadingService.hideKeyApiCall(1000);
			});
		} else {
			this.loadingService.showKeyApiCall();
			this.collateralService.updateCollateralSwapRequest(form.value, form.value.collateralSwapId).subscribe((response: any) => {
				if (response.success == true) {
					this.disableSubmitForApproval = false;
					this.finishGood(response.message);
					this.getCollateralSwapRequests();
				}
				else this.finishBad(response.message);
				this.loadingService.hideKeyApiCall();
			}, (err: any) => {
				this.finishBad(JSON.stringify(err));
				this.loadingService.hideKeyApiCall(1000);
			});
		}
    }

	forward() {
        this.showCsForward = true;
	}

	goForApproval() {
        const __this = this;
            swal({
                title: 'Are you sure?',
                text: 'You want to submit?',
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
            __this.vote = 1;
            __this.forwardAction = 0;
                
            let body = {
                    forwardAction: __this.forwardAction,
                    comment: __this.csForwardForm.controls['comment'].value,
					collateralSwapId: __this.selectedId,
					customerId: __this.customerId,
                    vote: __this.vote,
                };
					__this.collateralService.forwardForCollateralSwap(body)
							.subscribe((res) => {
								__this.loadingService.hide();
								if (res.success === true) {
									__this.getCollateralSwapRequests();
									__this.initializeControls();
									__this.showCsForward = false;
										swal(`${GlobalConfig.APPLICATION_NAME}`, 
										'<br/> ' + res.message , 'success');
								} else {
									__this.showCsForward = false;
									swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
									__this.loadingService.hide();
								}
							}, (err) => {
								__this.showCsForward = false;
								__this.loadingService.hide();
								swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
							});
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
                }
            });
    }
	

	// ---------------------- message ----------------------

	show: boolean = false; message: any; title: any; cssClass: any;

	finishGood(message) { 
	  this.showMessage(message, 'success', "FintrakBanking");
	  this.loadingService.hide(); }
  
	hideMessage(event) { this.show = false; }
  
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
}
  

