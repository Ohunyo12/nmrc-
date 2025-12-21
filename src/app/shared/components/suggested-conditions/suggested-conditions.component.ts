import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading.service';
import { LoanReviewApplicationService } from '../../../credit/services';
import { CreditAppraisalService } from '../../../credit/services/credit-appraisal.service';
import { ConditionPrecedentService } from 'app/setup/services';

@Component({
    templateUrl: 'suggested-conditions.component.html',
    selector: 'suggested-conditions',
    providers: [CreditAppraisalService, LoanReviewApplicationService, LoadingService, ConditionPrecedentService]
})
export class SuggestedConditionsComponent implements OnInit {

    @Input() panel: boolean = false;
    @Input() label: string = '';
    @Input() callerId: number;
    @Input() applicationId: number;
    @Input() isNApprovedLoan: boolean = false;
    @Input() proposedItems: any[] = [];
    @Input() proposedItems2: any[] = [];
    @Input() isAnalyst: boolean = false;
    @Input() isCondition: boolean = false;
    @Input() isTransaction: boolean = false;

    @Input() set reload(value: number) { 
        if (value > 0) this.getSuggestedConditions(); 
    }
    @Output() addSuggestedCondition: EventEmitter<any> = new EventEmitter<any>();

    formState: string = 'New';
    conditions: any[] = [];
    selectedConditions: any[] = [];
    selectedId: number = null;
    isSubsequent: boolean = false;
    modal = this.isNApprovedLoan? 'false': 'true';
    suggestedConditions: any[] = [];
    displayLoanSuggestionsForm: boolean = false;
    rmSuggestionTypes = [
        {suggestionTypeName: 'Condition Precedents', suggestionTypeId: 1},
        {suggestionTypeName: 'Condition Subsequent', suggestionTypeId: 2},
        {suggestionTypeName: 'Transaction Dynamics', suggestionTypeId: 3}
    ];
    suggestionsForm: FormGroup;
    

    constructor(
        private fb: FormBuilder,
        private loadingService: LoadingService,
        private conditionService: ConditionPrecedentService,
    ) { }

    ngOnInit() {
        this.clearControls();
        this.getSuggestedConditions();
        this.initProposedItems();
    }

    initProposedItems() {
        if (this.proposedItems2.length > 0) {
            this.proposedItems = this.proposedItems2;
            this.proposedItems.forEach(p => {
                p.approvedProductName = p.proposedProductName;
                p.obligorName = p.customerName;
            })
        }
    }
    clearControls() {
        this.formState = 'New';
        this.suggestionsForm = this.fb.group({
            suggestionid: [null],
            loanApplicationDetailId: ['', Validators.required],
            suggestionTypeId: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    onSelectedCondition(e) {
        // console.log(this.selectedConditions);
    }
    removeSelectedCondition (e) {
        // console.log(this.selectedConditions);
    }
    onSelectedAllCondition (e) {
        // console.log(this.selectedConditions);
    }

    saveLoanConsultant(form: FormGroup) {
        let body = {
            suggestionid: form.value.suggestionid,
            loanApplicationDetailId: form.value.loanApplicationDetailId,//detailID
            suggestionTypeId: form.value.suggestionTypeId,
            description: form.value.description,
        };
        if (form.value.suggestionid == null) {
            this.conditionService.saveLoanSuggestedConditions(body).subscribe((response: any) => {
                this.displayLoanSuggestionsForm = false;
                this.getSuggestedConditions();
            }, (err) => {
               // console.log(err);
            });
        } else if (form.value.suggestionid != null) {
            this.conditionService.updateLoanSuggestedConditions(body, form.value.suggestionid).subscribe((response: any) => {
                this.displayLoanSuggestionsForm = false;
                this.getSuggestedConditions();
            }, (err) => {
               // console.log(err);
            });
        }
    }

    getsuggestionTypeName(id): string {
        return this.rmSuggestionTypes.find(s => s.suggestionTypeId == id).suggestionTypeName;
    }

    getFacilityName(loanApplicationDetailId): string {
        if (this.isNApprovedLoan) {
            return this.proposedItems2.find(f => f.loanApplicationDetailId == loanApplicationDetailId).proposedProductName;
        } else if (!this.isNApprovedLoan) {
        return this.proposedItems.find(f => f.loanApplicationDetailId == loanApplicationDetailId).approvedProductName;
        }
    }

    getSuggestedConditions(applicationId = this.applicationId) {
        this.conditionService.getLoanSuggestedConditionsByApplicationId(applicationId).subscribe((response: any) => {
            this.suggestedConditions = response.result;
            this.suggestedConditions.forEach(c => {
                c.suggestionTypeName = this.getsuggestionTypeName(c.suggestionTypeId);
                c.approvedProductName = this.getFacilityName(c.loanApplicationDetailId);
            if (this.isCondition) {
                this.suggestedConditions = this.suggestedConditions.filter(c => c.suggestionTypeId != 3);
            } else if (this.isTransaction) {
                this.suggestedConditions = this.suggestedConditions.filter(c => c.suggestionTypeId == 3);
            }
            });            
        });
    }

    editLoanSuggestedConditions(row) {
        this.clearControls();
        this.formState = 'Edit';
        this.suggestionsForm.controls['suggestionid'].setValue(row.suggestionid);
        this.suggestionsForm.controls['suggestionTypeId'].setValue(row.suggestionTypeId);
        this.suggestionsForm.controls['loanApplicationDetailId'].setValue(row.loanApplicationDetailId);
        this.suggestionsForm.controls['description'].setValue(row.description);
        this.displayLoanSuggestionsForm = true;
    }

    addSuggestedConditionsAtAnalyst(row) {
        this.addSuggestedCondition.emit(row);
    }

    deleteLoanSuggestedConditions(row) {
        this.conditionService.deleteLoanSuggestedConditions(row.suggestionid).subscribe((response: any) => {
            this.getSuggestedConditions(row.applicationId);
        });
    }

    showLoanSuggestionsForm() {
        this.clearControls();
        this.displayLoanSuggestionsForm = true;
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