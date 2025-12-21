import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CreditAppraisalService } from '../services/credit-appraisal.service';
import { ProductClassProcessEnum, ApprovalStatus, GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { fromEvent } from 'rxjs';
import { StaffRealTimeSearchService } from 'app/setup/services/staff-realtime-search.service';
import swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-appraisal-pool',
  templateUrl: './appraisal-pool.component.html',
  styleUrls: ['./appraisal-pool.component.scss']
})
export class AppraisalPoolComponent implements OnInit {

	filteredProductClass: string = null;
    isProductProgram: boolean = false;
    searching: boolean = false;
    searchString: string = '';
    productPrograms: any[] = [];
    applications: any[] = [];
    readonly OPERATION_ID: number = 6; 
    filteredProductClassId: number = null;
    productProgramClassProcessId: number = ProductClassProcessEnum.CreditProgram;
	displayApproverSearchForm = false;
	nextLevelId = 0;
	availableApprovers: any[] = [];
    @ViewChild('staffInPut', {static: false}) staffInPut: ElementRef;
    approvalTrailId: number;

	constructor(
		// private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        // private productService: ProductService,
        // private loanService: LoanService,
        private realSearchSrv: StaffRealTimeSearchService,
        // private customerService: CustomerService,
        // private conditionService: ConditionPrecedentService,
        // private router: Router,
        // private loanApplService: LoanApplicationService,
        // private staffRole: StaffRoleService,
        // private sanitizer: DomSanitizer,
        // private reportServ: ReportService,
        // private collateralService: CollateralService,
        // private authService: AuthenticationService,
        // private currencyService: CurrencyService,
	) { }

	ngOnInit() {
		this.loadProductPrograms();
		this.getLoanApplications();
	}

	loadProductPrograms() {
        this.camService.getProductPrograms().subscribe((response: any) => { // make refreshable
            this.productPrograms = response.result;
        });
    }

	getLoanApplications(
        // page: number,
        // itemsPerPage: number,
        classId: number = this.filteredProductClassId,
        search: boolean = false
        ) {
            this.loadingService.show();
            if (search == false) { this.searchString = ''; this.searching = false; } else { this.searching = true; }
            this.camService.getPoolApplications(this.OPERATION_ID, classId, this.searchString).subscribe((response: any) => {
            	this.loadingService.hide();
                this.applications = response.result;
                console.log(this.applications)
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

	filterByProductClass(classId, className) {
        this.filteredProductClass = className;
        this.filteredProductClassId = classId;
        // this.getLoanApplications(0, this.currentLazyLoadEvent.rows, classId);
        this.getLoanApplications(classId);
    }

	reset() {
        this.filteredProductClass = null;
        this.filteredProductClassId = null; // MUST RUN BEFORE getLoanApplications()
        this.getLoanApplications(); // refresh list

        this.loadProductPrograms();
	}
	
	getApplicationStatus(submitted, approvalStatus) {
        if (submitted == true) {
            let processLabel = 'PROCESSING';
            if (approvalStatus == ApprovalStatus.PROCESSING)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.AUTHORISED)
                return '<span class="label label-info">' + processLabel + '</span>';
            if (approvalStatus == ApprovalStatus.REFERRED)
                return '<span class="label label-danger">REFERRED BACK</span>';
            if (approvalStatus == ApprovalStatus.APPROVED)
                return '<span class="label label-success">APPROVED</span>';
            if (approvalStatus == ApprovalStatus.DISAPPROVED)
                return '<span class="label label-danger">REJECTED</span>';
        }
        return '<span class="label label-warning">NEW APPLICATION</span>';
    }
    
    refresh(){
        this.getLoanApplications();
        this.approvalTrailId = null;
        this.nextLevelId = null;
    }

	selfAssignApplication(row){
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign this application to Self?',
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
            __this.camService.selfAssignApplication(row.approvalTrailId).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.getLoanApplications();
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
    }

    selectapprover(row){
        this.approvalTrailId = row.approvalTrailId;
        this.nextLevelId = row.currentApprovalLevelId;
        this.displayApproverSearchForm = true;
    }
    
    pickSearchedApprover(row){
        const selectedApprover = row.staffCode + ' -- ' + row.firstName + ' ' + row.lastName;
        const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'You want to assign this application to ' + selectedApprover + '?',
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
            __this.camService.assignApplication(__this.approvalTrailId, row.staffId).subscribe((result) => {
                __this.loadingService.hide();
                if (result.success == true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, result.message, 'success');
                    __this.refresh();
                    __this.displayApproverSearchForm = false;
                }
            }, (err) => {
                __this.loadingService.hide(1000);
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
            }
        });
	}
	
	ngAfterViewInit(): void {
		fromEvent(this.staffInPut.nativeElement, 'keyup').pipe(
            debounceTime(150),
            distinctUntilChanged(),)
            .subscribe(() => {
			this.realSearchSrv.searchApproversEntries(this.staffInPut.nativeElement.value,this.nextLevelId)
			.subscribe(results => {
				if (results != null) {
					this.availableApprovers = results.result;
				}
			});
		});
    }
    
    searchApprover(searchString) {
    }

}
