import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService } from '../../../setup/services';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'repayment-terms.component.html',
    selector: 'app-repayment-terms',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class RepaymentTermsComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() applicationId: number;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;

    @Output() hasTerms: EventEmitter<boolean> = new EventEmitter<boolean>();

    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;
    repaymentPatterns: any[] = [];
    complianceTimelines: any[] = [];

    @Input() reload: number= 0;
    // @Input() set reload(value: number) { if (value > 0) this.getRepaymentTerms(); }

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
        private reviewService: LoanReviewApplicationService,
        private conditionService: ConditionPrecedentService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.proposedItems.length > 0 && this.applicationId > 0 && this.reload > 0){
            this.getRepaymentTerms();
        }
    }

    ngOnInit() {
        this.clearControls();
        this.loadDropdowns();
    }

    loadDropdowns() {
        // this.conditionService.getAllComplianceTimeline().subscribe((response: any) => {
        //     this.complianceTimelines = response.result;
        // });
        //add yours Ade
        this.getAllRepaymentSchedules();
    }

    getAllRepaymentSchedules() {
        this.camService.getAllRepaymentSchedules().subscribe((res) => {
                this.repaymentPatterns = res.result;
            });
    }

    clearControls() {
        this.formState = 'New';
        this.repaymentTermsForm = this.fb.group({
            terms: [''],
            //add yours Ade
            repaymentScheduleId: ['', Validators.required],
            // nextReviewDate:['',Validators.required],
            loanApplicationDetailId: ['', Validators.required],
        });
    }

    // ----------------- repayment schedule terms -----------------

    repaymentTerms: any[] = [];
    repaymentTermsForm: FormGroup;
    displayRepaymentTermsForm: boolean = false;
    termsNonEmpty: boolean = false;
    
    editRepaymentTerms(row) {
        this.formState = 'Edit';
        //console.log(row);
        // let nextDate = row.nextReviewDate == null ? "" : new Date (row.nextReviewDate);

        this.repaymentTermsForm.controls['terms'].setValue(row.terms);
        this.repaymentTermsForm.controls['repaymentScheduleId'].setValue(row.repaymentScheduleId);
        //add yours Ade
        // this.repaymentTermsForm.controls["nextReviewDate"].setValue(nextDate);
        this.repaymentTermsForm.controls['loanApplicationDetailId'].setValue(row.applicationDetailId);
        this.displayRepaymentTermsForm = true;
    }

    addRepaymentTerms() {
        this.clearControls();
        this.displayRepaymentTermsForm = true;
    }

    saveRepaymentTerms(form) {
        // if (this.isAnalyst == false) return;
        let body = {
            terms: form.value.terms,
            repaymentScheduleId: form.value.repaymentScheduleId,
            //add yours Ade
            // nextReviewDate: form.value.nextReviewDate,
            applicationDetailId: form.value.loanApplicationDetailId,
        };
        this.camService.saveRepaymentTerms(this.callerId,body).subscribe((response: any) => {
            this.repaymentTerms = response.result;
            this.displayRepaymentTermsForm = false;
            this.repaymentTerms = this.repaymentTerms.slice(); //Triggers data refresh
            this.emitUpdate();
        }, (err) => {
        });
    }

    getRepaymentTerms() {
        // console.log("proposedItems: ", this.proposedItems);
        this.proposedItems.forEach(x => {
            this.repaymentTerms.push({
                terms: x.terms,
                repaymentScheduleId: x.repaymentScheduleId,
                schedule: x.schedule,
                //add yours Ade
                // nextReviewDate: x.nextReviewDate,
                applicationDetailId: x.loanApplicationDetailId,
                productCustomerName: x.approvedProductName + ' -- ' + x.obligorName,
            });
        });
        this.repaymentTerms = this.repaymentTerms.slice(); //Triggers data refresh
        this.emitUpdate();
    }

    emitUpdate() {
        this.termsNonEmpty = this.repaymentTerms
            .filter(x => x.repaymentScheduleId > 0)
            .length > 0;
        this.hasTerms.emit(this.termsNonEmpty);
    }
    // ---------------------- message ----------------------

    show: boolean = false; message: any; title: any; cssClass: any; // message box

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood() {
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

    hideMessage(event) {
        this.show = false;
    }


}