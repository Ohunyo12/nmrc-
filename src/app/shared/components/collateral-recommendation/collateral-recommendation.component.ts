import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ApprovalGroupRole, ApprovalStatus, RequestStatus, GlobalConfig } from '../../constant/app.constant';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService } from '../../../setup/services';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'collateral-recommendation.component.html',
    selector: 'app-collateral-recommendation',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService]
})
export class CollateralRecommendationComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number = 1;
    @Input() applicationId: number;
    @Input() proposedItems: any[] = [];
    @Input() isAnalyst: boolean = false;

    @Input() set reload(value: number) { if (value > 0) this.getRecommendedCollateral(); }
    
    // @Output() approvalStatusId: EventEmitter<any> = new EventEmitter<any>();
    formState: string = 'New';
    conditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;

    complianceTimelines: any[] = [];
    recommendedCollateralForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private camService: CreditAppraisalService,
    ) { }

    ngOnInit() {
        this.clearControls();
        // this.getRecommendedCollateral();
    }

    clearControls() {
        this.formState = 'New';
        this.recommendedCollateralForm = this.fb.group({
            id: [null],
            loanApplicationDetailId: [''],
            collateralDetail: ['', Validators.required],
            collateralValue: ['', Validators.required],
            stampedToCoverAmount: ['', Validators.required],
        });
    }

    // condition precedent

    // ---------------------- recommended collaterals -------------

    recommendedCollaterals: any[] = [];
    recommendedCollateralsHistory: any[] = [];
    displayRecommendedCollateralForm: boolean = false;

    saveRecommendedCollateral(form) {

        if (this.isAnalyst == false) return;
        let body = {
            id: form.value.id,
            applicationDetailId: form.value.loanApplicationDetailId,
            collateralDetail: form.value.collateralDetail,
            collateralValue: form.value.collateralValue,
            stampedToCoverAmount: form.value.stampedToCoverAmount,
            applicationId: this.applicationId,
        };
        if (form.value.id == null) {
            this.camService.saveRecommendedCollateral(this.callerId,body).subscribe((response: any) => {
                this.recommendedCollaterals = response.result;
                this.displayRecommendedCollateralForm = false;
                this.recommendedCollaterals = this.recommendedCollaterals.slice(); //Triggers data refresh
            }, (err) => {
            });
        } else {
            this.camService.updateRecommendedCollateral(this.callerId,body).subscribe((response: any) => {
                this.recommendedCollaterals = response.result;
                this.displayRecommendedCollateralForm = false;
                this.recommendedCollaterals = this.recommendedCollaterals.slice(); //Triggers data refresh
            }, (err) => {
            });

        }
    }

    getRecommendedCollateral() {
        //if (this.isAnalyst == false) return;        
        this.camService.getRecommendedCollateral(this.callerId, this.applicationId)
            .subscribe((response: any) => {
                this.recommendedCollaterals = response.result;
            }, (err) => {
            });
        this.getRecommendedCollateralHistory();
    }

    getRecommendedCollateralHistory() {
        //if (this.isAnalyst == false) return;        
        this.camService.getRecommendedCollateral(this.callerId, this.applicationId)
            .subscribe((response: any) => {
                this.recommendedCollateralsHistory = response.result;
            }, (err) => {
            });
    }

    editRecommendedCollateral(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.recommendedCollateralForm.controls['id'].setValue(row.id);
        this.recommendedCollateralForm.controls['collateralDetail'].setValue(row.collateralDetail);
        this.recommendedCollateralForm.controls['collateralValue'].setValue(row.collateralValue);
        this.recommendedCollateralForm.controls['stampedToCoverAmount'].setValue(row.stampedToCoverAmount);
        this.recommendedCollateralForm.controls['loanApplicationDetailId'].setValue(row.applicationDetailId);
        this.displayRecommendedCollateralForm = true;
    }

    showRecommendedCollateralForm() {
        this.clearControls();
        this.displayRecommendedCollateralForm = true;
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