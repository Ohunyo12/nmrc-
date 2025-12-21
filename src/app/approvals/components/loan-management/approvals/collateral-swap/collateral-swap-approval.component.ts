// import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from 'app/credit/services/loan.service';
import { CollateralService, StaffRealTimeSearchService, StaffRoleService } from 'app/setup/services';
import { Subject ,  fromEvent } from 'rxjs';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { isNullOrUndefined } from 'util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'app-collateral-swap-approval',
	templateUrl: './collateral-swap-approval.component.html',
})
export class CollateralSwapApprovalComponent implements OnInit {
	activeTabindex = 0;
	displaySearchForm: boolean = false;
	searchForm: FormGroup;
	applications: any[];
	searchString: any;
	selection: any;
	targetId: number;
	operationId: number = 206; // Collateral Swap OperationId
	rowSelected: boolean;
	requestNumber: any;
	customerName: any;
	level: any;
	status: any;
	mainInsuranceDetail: any = {};
	collateralId: any;
	mainInsuranceView: boolean;
	hideGrid: boolean = false;
	customerCollateral: any;
	showBottom: boolean = false;
	insurancePolicy: any;
	insurancePolicies: any;
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
	customerId: number = 0;
	loanCollateralMappingId: any;
	newCollateralId: any;
	displayReferBackModal: boolean = false;
	loanAppCollateralId: any;
	oldCollateralId: any;
	disableApprovalButtons: boolean = true;
	approvalWorkflowData: any;
	isUserLegal: boolean = false;
	staffRoleRecord: any;
	collateralSwapCode: any;
	uploadCount: number;
	isDocumentUploaded: boolean;
	nextLevelId: any;
	displayApproverSearchForm: boolean = false;
	searchTerm$ = new Subject<any>();
	availableApprovers: any[] = [];
	toStaffId: number;
	selectedApprover: string;
	displayCollateralHistory = false;
	@ViewChild('staffInPut', {static: false}) staffInPut: ElementRef;
	disableSubmitButton: boolean = true;
	oldOrNew = [
		{name: 'old', id: 1},
		{name: 'new', id: 2}
	];
	isBusiness = false;
	@Input() isCollateralSwapSearch = false;
	@Input() collateralSwapId = 0;
	@Input() collateralSwapDetailSearch: any = {};
	@Input() set reload(value: number){
		if (value > 0){
			this.clearControls();
			this.getCollateralSwapRequestSearch();
		}
	}

	constructor(
		private collateralService: CollateralService,
		private loanService: LoanService,
		private loadingService: LoadingService,
		private fb: FormBuilder,
		private staffRole: StaffRoleService,
		private realSearchSrv: StaffRealTimeSearchService
	) { }

	ngOnInit() {
		this.initializeControls();
		this.getCollateralSwapRequestsForApproval();
		this.getStaffRole();
		// this.getCollateralSwapRequests();
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
		this.oldSwapCollateral = {};
		this.newSwapCollateral = {};
		this.searchForm = this.fb.group({
			searchString: ['', Validators.required],
		});
		this.collateralSwapForm = this.fb.group({
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

		this.nextLevelId = null;
        this.toStaffId = null;
        this.selectedApprover = null;
	}

	startNewSwapRequest() {
		this.showNextTab();
	}



	// getCollateralSwapRequests() {
	// 	this.collateralService.getCollateralSwapRequests().subscribe((response: any) => {
	// 		this.collateralSwapRequests = response.result;
	// 	});
	// }

	// getApprovalWorkFlowComments(operationId, targetId) {
	// 	this.loanService.getApprovalTrailByOperation(operationId, targetId).subscribe((res) => {
	// 		this.approvalWorkflowData = res.result;
	// 	});
	// }

	getCollateralSwapRequestsForApproval() {
		if(this.isForCollateralSwapSearch()){
			this.getCollateralSwapRequestSearch();
			return;
		}
		this.loadingService.show();
		this.collateralService.getCollateralSwapRequestsForApproval().subscribe((response: any) => {
			this.collateralSwapRequests = response.result;
			this.loadingService.hide();
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
			this.loadingService.hide(1000);
		});
	}

	getCollateralSwapRequestSearch(){
		if(this.collateralSwapId <= 0 || isNullOrUndefined(this.collateralSwapDetailSearch)){
			return;
		}
		this.viewSwapInfo(this.collateralSwapDetailSearch);
		// this.loadingService.show();
		// this.collateralService.getCollateralSwapRequest(this.collateralSwapId).subscribe((response: any) => {
		// 	this.collateralSwapRequests = response.result;
		// 	this.loadingService.hide();
		// }, (err: any) => {
		// 	this.finishBad(JSON.stringify(err));
		// 	this.loadingService.hide(1000);
		// });
	}

	viewSwapInfo(row) {
		//console.log("row: ", row);
		this.loadingService.show();
		this.selectedId = row.collateralSwapId;
		this.targetId = row.collateralSwapId;
		this.customerId = row.customerId;
		this.oldCollateralId = row.oldCollateralId;
		this.newCollateralId = row.newCollateralId;
		this.collateralSwapCode = row.swapRef;
		this.selectedApplicationId = row.loanApplicationId;
		this.isBusiness = row.isBusiness;
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
		// if(this.isForCollateralSwapSearch()){
			
		// }else{

		// }
		this.activeTabindex = 1;
	}

	selectApprover() {
		this.loadingService.show();
		this.collateralService.getNextLevelForCollateralSwap(this.targetId)
			.subscribe((res) => {
				if (res.success == true) {
					this.nextLevelId = res.data;
					this.displayApproverSearchForm = true;
					this.loadingService.hide();

				} else { swal('Fintrak Credit360', res.message, 'error'); this.loadingService.hide(); }

			}, (err) => {
				this.loadingService.hide(); swal('Fintrak Credit360', err.message, 'error');
			});
	}

	searchApprover(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
	}
	
	ngAfterViewInit(): void {
        fromEvent(this.staffInPut.nativeElement, 'keyup')
           .pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.realSearchSrv.searchApproversEntries(this.staffInPut.nativeElement.value, this.nextLevelId)
                    .subscribe(results => {
                        if (results != null) {
                            this.availableApprovers = results.result;
                        }
                    });
            });

        // fromEvent(this.approvalInPut.nativeElement, 'keyup')
        //     .debounceTime(150)
        //     .distinctUntilChanged()
        //     .subscribe(() => {
        //         this.customerService.searchCustomerGroupMembers(this.approvalInPut.nativeElement.value, this.loanSelection.customerGroupId)
        //             .subscribe(results => {
        //                 if (results != null) {
        //                     this.groupMembers = results.result;
        //                 }
        //             });
        //     });
    }

	pickSearchedApprover(data) {
		if (this.displayApproverSearchForm == true) {
			if (data.secondName == undefined) {
				this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.lastName;
			}
			else {
				this.selectedApprover = data.staffCode + ' -- ' + data.firstName + ' ' + data.secondName + ' ' + data.lastName;
			}
			this.toStaffId = data.staffId;
			this.displayApproverSearchForm = false;
			this.disableSubmitButton = this.applications.length > 0 ? false : true;

		}
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


	showSearchForm() { this.displaySearchForm = true; }

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
			this.applications = response.result;
			this.displaySearchForm = false;
			this.showBottom = false;
			this.loadingService.hide();
		}, (err: any) => {
			this.loadingService.hide(1000);
		});
	}

	showNextTab() {
		this.activeTabindex += 1;
	}

	viewProposedCollaterals(row) {
		this.selectedRecord = row;
		this.selectedApplicationId = row.loanApplicationId;
		this.customerId = row.customerId;
		//this.loanCollateralMappingId = row.loanCollateralMappingId;
		this.loanAppCollateralId = row.loanAppCollateralId;
		//this.newCollateralId = row.newCollateralId;
		// this.resetActiveTabIndex();
		this.showNextTab();
		// this.showProposedCollaterals = true;
	}

	viewLoanDetail(row) {
		this.selectedApplicationId = row.loanApplicationId;
		this.showLoanDetails = true;
	}

	viewCollateralDetail(row) {
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
		return this.activeTabindex == 0;
	}

	resetActiveTabIndex() {
		this.activeTabindex = 0;
		this.activeTabindex = 0;
		this.activeTabindex = 0;
	}

	getEmittedCollateral(event) {
		//console.log(event);
		//this.newSwapCollateral = event;
		//this.oldSwapCollateral = event.oldCollateral;
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
			newCollateralId: this.newSwapCollateral.collateralId
		});
	}

	editCollateralSwapForm(body) {
		this.collateralSwapForm.setValue({
			collateralSwapId: body.collateralSwapId,
			loanCollateralMappingId: body.loanCollateralMappingId,
			loanAppCollateralId: body.loanAppCollateralId,
			oldCollateralId: body.oldCollateralId,
			newCollateralId: body.newCollateralId
		});
	}

	saveCollateralSwapRequest(form = this.collateralSwapForm) {
		form.value.collateralSwapId = this.selectedId;
		//console.log(form.value);
		if (!(form.value.collateralSwapId > 0)) {
			this.loadingService.showKeyApiCall();
			this.collateralService.saveCollateralSwapRequest(form.value).subscribe((response: any) => {
				this.loadingService.hideKeyApiCall();
				if (response.success == true) {
					this.finishGood(response.message);
					// this.getCollateralSwapRequests();
				}
				else this.finishBad(response.message);
			}, (err: any) => {
				this.loadingService.hideKeyApiCall(1000);
				this.finishBad(JSON.stringify(err));
			});
		} else {
			this.loadingService.showKeyApiCall();
			this.collateralService.updateCollateralSwapRequest(form.value, form.value.collateralSwapId).subscribe((response: any) => {
				this.loadingService.hideKeyApiCall();
				if (response.success == true) {
					this.finishGood(response.message);
					// this.getCollateralSwapRequests();
				}
				else this.finishBad(response.message);
			}, (err: any) => {
				this.loadingService.hideKeyApiCall(1000);
				this.finishBad(JSON.stringify(err));
			});
		}
	}

	referBackResultControl(event) {
		if (event == true) {
			this.getCollateralSwapRequestsForApproval();
			this.displayReferBackModal = false;
			this.resetActiveTabIndex();
			this.initializeControls();
			// this.activeTabindex = 0;
		}
	}

	modalControl(event) {
		if (event == true) {
			this.displayReferBackModal = false;
		}
	}

	showReferBackModal() {
		this.displayReferBackModal = true;
	}

	decline() {
		this.showCsForward = true;
		this.vote = 2;
		this.forwardAction = 3;
	}

	forward() {
		this.showCsForward = true;
		this.vote = 1;
		this.forwardAction = 2;
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
			__this.loadingService.showKeyApiCall();
			// __this.vote = 1;
			// __this.forwardAction = 0;

			let body = {
				forwardAction: __this.forwardAction,
				comment: __this.csForwardForm.controls['comment'].value,
				collateralSwapId: __this.selectedId,
				customerId: __this.customerId,
				//loanCollateralMappingId: __this.loanCollateralMappingId,
				loanAppCollateralId: __this.loanAppCollateralId,
				newCollateralId: __this.newCollateralId,
				// d,receiverLevelId: this.lcSelection.currentApprovalLevelId, // refer back
				// receiverStaffId: this.lcSelection.toStaffI // refer back
				vote: __this.vote,
				toStaffId: __this.toStaffId
			};
			__this.collateralService.forwardForCollateralSwap(body)
				.subscribe((res) => {
					if (res.success == true) {
						__this.getCollateralSwapRequestsForApproval();
						// __this.getCollateralSwapRequests();
						__this.initializeControls();
						__this.showCsForward = false;
						swal(`${GlobalConfig.APPLICATION_NAME}`,
							'<br/> ' + res.message, 'success');
					} else {
						__this.showCsForward = false;
						swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
					}
					__this.loadingService.hideKeyApiCall();
				}, (err) => {
					__this.showCsForward = false;
					__this.loadingService.hideKeyApiCall(1000);
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

	getStaffRole() {
		this.loadingService.show();
		this.staffRole.getStaffRoleByStaffId().subscribe((res) => {
			this.loadingService.hide();
			this.staffRoleRecord = res.result;
			//console.log('staffRoleRecord', this.staffRoleRecord);
		}, (err: any) => {
			this.loadingService.hideKeyApiCall(1000);
			this.finishBad(JSON.stringify(err));
		});
	}

	setUploadCount(count) {
		this.uploadCount = +count;
		this.isDocumentUploaded = +count > 0 ? true : false;
    }

	isForCollateralSwapSearch(): boolean {
		return (this.isCollateralSwapSearch == true);
	}
}
