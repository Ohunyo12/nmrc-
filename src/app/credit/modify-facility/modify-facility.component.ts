import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { LoanApplicationService } from '../services/loan-application.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { LoanService } from '../services/loan.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-modify-facility',
  templateUrl: './modify-facility.component.html',
})
export class ModifyFacilityComponent implements OnInit {

    @ViewChild('approvalInPut', {static: false}) approvalInPut: ElementRef;
	@Input() loanApplicationId = 0;
	@Input() loanApplicationDetails: any[] = [];
	@Input() set applicationSelection(value: any){
		if (value != null && value != undefined){
			// this.loadLoan(value);
		}
	}
	@Input() loanApplicationReferance: string;
	@Input() customerTypeId: number;
	@Input() customerNameTitle: string;
    @Input() productClassProcessId: number = 0;
	@Input() customerGroupId: number;
	@Input() customerId: number;
	@Input() loanTypeId: number;
    @Output() refreshDetailsGrid = new EventEmitter<number>();

	applicationDetailId: number;
	productClassId: number;
	editFacilityMode = false;
	displayFacilityDetailForm = false;
	proposedProductId: number;
	storedApplicationInfo: any = {};
	proposedAmount: number;
	productClasses: any[] = [];
	userInfo: any;  
    applications: any[] = [];
    activeTabindex: number;
    application: any = {};
    displaySearchForm: boolean = false;
    displaySearchTable: boolean = false;
    searchString = '';
    displayApplicationDetail: boolean = false;
    loanApplicationDetail: any = {};
    searchForm: FormGroup;
    reloadLoan = false;
    currentStaffActivities: string[];
    availableApprovers: any[] = [];
    nextLevelId = 0;
    displayApproverSearchForm = false;
    proposedItems:any[] = [];

	constructor(
		private loanApplService: LoanApplicationService,
        private camService: CreditAppraisalService,
        private realSearchSrv: StaffRealTimeSearchService,
        private loanService: LoanService,
        private fb: FormBuilder,
        private loadingService: LoadingService,
	) { }

	ngOnInit() {
        this.clearControls();
        this.loadStorageData();
	}

    clearControls() {
        this.searchForm = this.fb.group({
            searchString: ['', Validators.required],
        });
    }

  	loadStorageData() {
		this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        this.currentStaffActivities = JSON.parse(sessionStorage.getItem('userActivities'));
    }
    
    isAmongActivities(activity: string): boolean {
        if (this.currentStaffActivities == undefined) {
            return false;
        }
        return (this.currentStaffActivities.indexOf(activity) >= 0);
    }

    editFacilityDetails(row) {
        this.productClassId = row.productClassId;
        this.applicationDetailId = row.loanApplicationDetailId;
        this.editFacilityMode = true;
        this.displayFacilityDetailForm = true;
        this.proposedAmount = row.proposedAmount;
        this.customerNameTitle = row.customerName;
    }
    showSearchForm() { this.displaySearchForm = true; }

    submitForm(form) {
        
        this.searchString = form.value.searchString;
        let body = {
            searchString: form.value.searchString
        };

            this.loadingService.show();
            this.loanService.loanApplicationSearch(body).subscribe((response: any) => { 
            this.loadingService.hide();
            this.applications = response.result;
            this.displaySearchForm = false;
            this.displaySearchTable = true;
            this.displayApplicationDetail = false;
        }, (err: any) => {
            this.loadingService.hide(1000);
        });
        // this.loadingService.hide();
    }

    view(row) {
        this.application = row;
        this.loanApplicationReferance = row.applicationReferenceNumber;
        this.loanApplicationId = row.loanApplicationId;
        this.getLoanDetails(row.loanApplicationId);
		this.customerGroupId = row.customerGroupId;
		this.customerTypeId = row.customerTypeId;
		this.productClassId = row.productClassId;
		this.productClassProcessId = row.productClassProcessId;
        this.loanTypeId = row.loanTypeId;
        this.customerId = row.customerId;
        this.displayApplicationDetail = true;
        this.displaySearchTable = false;
    }

    getLoanDetails(applicationId): void {
        this.loadingService.show();
        this.camService.getLoanDetail(applicationId).subscribe((response: any) => {
            this.proposedItems = response.result.facilities;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    getLevelStaffs(row){
        this.displayApproverSearchForm = true;
    }

    // getLoanApplicationById(id): void {
    //     this.loadingService.show();
    //     this.loanApplService.getLoanApplicationById(id).subscribe((response: any) => {
    //         this.loanApplicationDetail = response.result;
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide(1000);
    //     });
    // }

    onTabChange(obj) { }

    reloadFacilities(modify: boolean) {
        this.loanApplicationId = 0;
        this.applicationDetailId = 0;
        this.loanApplicationId = this.application.loanApplicationId;
        this.displayFacilityDetailForm = modify;
        this.reloadLoan = true;
    }

    getEmittedLoanApplicationDetailId(loanApplicationDetailId: number){
        this.applicationDetailId = loanApplicationDetailId;
    }

    openForModification(modify: boolean){
        this.displayFacilityDetailForm = modify;
        this.reloadLoan = false;
    }

    pickSearchedApprover(staff: any){

    }

    ngAfterViewInit(): void {
        fromEvent(this.approvalInPut.nativeElement, 'keyup')
           .pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
                this.realSearchSrv.searchApproversEntries(this.approvalInPut.nativeElement.value,this.nextLevelId)
                    .subscribe(results => {
                        if (results != null) {
                            this.availableApprovers = results.result;
                        }
                    });
            });
    }

}
