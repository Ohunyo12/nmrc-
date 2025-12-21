import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RiskIndexService } from '../../../setup/services/risk-index.service';
import { RiskAssessmentService } from '../../services/risk-assessment.service';
import { ProductService } from '../../../setup/services/product.service';

import { CustomerRealTimeSearchService } from '../../services/customer-realtime-search.service';
import { StaffRealTimeSearchService } from '../../../setup/services/staff-realtime-search.service';
import { Subject } from 'rxjs';


@Component({
    styles: [`
        table {
            border: 1px solid white;
            margin-bottom: 0px;
        }
    `],
    templateUrl: 'risk-assessment.component.html'
})

export class RiskAssessmentComponent implements OnInit {

    showAssessmentForm: boolean = false;
    disableNext: boolean = false;
    disablePrevious: boolean = true;
    disableFinish: boolean = true;
    indexFields: any[]; // raw from service
    // riskIndexes: any[] = []; // locally built
    assessmentTitles: any[];
    riskFactors: any[];
    titleIndex?: number;

    currentTitleName?: string;
    currentTitleId?: number = null;
    
    riskAssessmentTitleId: number = null; // x
    // productId?: number = null;
    // selectedApplicationId: number;
    targetId: number; // RENAME TO TARGETID AS IS USED 
    body: any = {}
	checkboxItems: any[] = [];

    assessmentForm: FormGroup;
    products: any[];
    categories: any[];
    
    titleAssessmentForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any;

    applicationSelection: any;
    showAssessmentTypeForm: boolean = false;
    assessmentTypeForm: FormGroup;
    selectedPersonName: string;
    productIsSelected: boolean = false;
    currentPageNumber: number = 0;

    loanApplications: any[] = [];
    riskFactorTitles: any[] = [];

    riskTypes = [
        { 'riskTypeId': '1', 'riskTypeName': 'Obligor', },
        { 'riskTypeId': '2', 'riskTypeName': 'Staff', },
        { 'riskTypeId': '3', 'riskTypeName': 'Product', },
    ];

    constructor( 
        private fb: FormBuilder, 
        private productService: ProductService,
        private loadingService: LoadingService, 
        private riskIndexService: RiskIndexService, 
        private validationService: ValidationService,
        private assessmentService: RiskAssessmentService,
        private realSearchSrvC: CustomerRealTimeSearchService,
        private realSearchSrv: StaffRealTimeSearchService,
    ) {
        this.realSearchSrv.search(this.searchTerm$).subscribe(response => {
            if (response != null) {
                this.searchResults = response.result;
            }
        });

        this.realSearchSrvC.searchForCustomerRealTime(this.searchTermC$).subscribe(response => {
            if (response != null) {
                this.searchResultsC = response.result;
            }
        });
    }

    ngOnInit() { 
        this.initializeForms();
        this.loadDropdowns();
        this.getAssessmentResults();
    }

    loadDropdowns() {
        this.riskIndexService.getRiskAssessmentIndexTitle().subscribe((response: any) => {
            this.assessmentTitles = response.result;
        });
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
    }

    onSelectedApplicationChange(){
        this.showAssessmentTypeForm = true;
        this.showAssessmentForm = false;
    }

    getAssessmentResults() {
        this.loadingService.show();
        this.assessmentService.getAssessmentResult().subscribe((response: any) => {
            this.assessmentResults = response.result;
            this.loadingService.hide();
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    continueAssessment(row) {
        this.initializeForms();
        this.targetId = row.targetId;
        this.assessmentTypeForm.controls['riskAssessmentTitleId'].setValue(row.riskAssessmentTitleId);
        this.submitAssessmentTypeForm(this.assessmentTypeForm);
        //this.assessmentTypeForm.controls['riskTypeId'].setValue();
    }

    submitAssessmentTypeForm(form) { //  Start Assessment
        if (this.assessmentTypeForm.invalid) { return; }
        this.loadingService.show();
        this.riskAssessmentTitleId = form.value.riskAssessmentTitleId;
        this.assessmentService.getAssessment(form.value.riskAssessmentTitleId, this.targetId).subscribe((res) => {
            this.indexFields = res.result;
            this.finishGood(res.message);
            this.getRiskFactorTitles();
            this.selectAssessment();
            this.showAssessmentTypeForm = false;
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    closeAssessmentForm() { 
        // TODO WARNING CODE BEFORE CLOSE
        this.showAssessmentForm = false;
        this.getAssessmentResults();
    }

    getRiskFactorTitles() {
        this.riskFactors = [];
        let factors = this.indexFields.filter(x => x.parentId < 1);
        factors.forEach(row => {
            this.riskFactors.push({ id: row.riskId, name: row.name });
        });
    }

    selectAssessment() {
        this.showAssessmentForm = true;
        this.titleIndex = 0;
        this.updateTitleInfo();
        // this.getAssessmentRiskIndexes();
        // this.getCategories();
        // this.renderCheckboxes();
    }

    updateTitleInfo() {
        this.currentPageNumber = this.titleIndex + 1; 
        if (this.riskFactors[this.titleIndex] === undefined)
        {
            this.showAssessmentForm = false;
        } else {
            this.currentTitleId = this.riskFactors[this.titleIndex].id; 
            this.currentTitleName = this.riskFactors[this.titleIndex].name; 
            this.getAssessmentRiskIndexes(this.currentTitleId, true);
        }
    }

    // recursion
    stack: number[] = [];
    heap: number[] = [];
    currentIndexes: any[] = [];

    getAssessmentRiskIndexes(parentId = this.currentTitleId, entry=false) { 
        if (entry == true) {
            this.currentIndexes = [];
            this.heap = [];
        }
        let children = this.indexFields.filter(x => x.parentId == +parentId);
        children.forEach(child => { 
           if (this.heap.indexOf(child.riskId) == -1) {
                this.currentIndexes.push(child);
                this.stack.push(child.riskId);
                this.heap.push(child.riskId);
            }
        });
        if (this.stack.length > 0) {
            this.getAssessmentRiskIndexes(this.stack.pop());
        } else {
            this.getCategories();
        }
    }

    getCategories() {
        this.categories = this.currentIndexes.filter(x => x.parentId > 0 && x.indexTypeId < 3);
        this.renderCheckboxes();
    }
    
    renderCheckboxes() {
       // this.assessmentForm.controls['indexFields'] = this.fb.array([]); // clear boxes
        this.initializeForms();
        const optionControls = <FormArray>this.assessmentForm.controls['indexFields'];
        this.currentIndexes.forEach((element) => { 
                optionControls.push(this.createOptionControl(element));
        });
    }

    initializeForms() {
        this.assessmentForm = this.fb.group({
            indexFields: this.fb.array([])
        });
        this.assessmentTypeForm = this.fb.group({
            riskAssessmentTitleId: ['', Validators.required], // 17--------------------------------hard coding
            riskTypeId: [''],
            // productId: [''], // SET AT TITLE DEFINITION
        });
    }

    createOptionControl(element) {
        return this.fb.group({
            riskId: [element.riskId],
            assessmentId: [element.assessmentId],
            titleId: [element.titleId],
            parentId: [element.parentId],
            name: [element.name],
            description: [element.description],
            level: [element.level],
            weight: [element.weight],
            score: [element.score],
            selected: [element.selected],
        });
    }

    save(form, command = 'save') {
        if (form.value.indexFields.some(x => x.selected == true) == false) return; // empty answers
        let body = {
            command: command,
            titleIndex: this.titleIndex,
            titleId: this.currentTitleId, // ----------------refactor name to riskfactor
            riskAssessmentTitleId: +this.riskAssessmentTitleId,
            targetId: this.targetId,
            indexFields: form.value.indexFields,
        };
        this.loadingService.show();
        this.assessmentService.save(body).subscribe((res) => {
            this.updateIndexes(res.result);
            // this.indexFields = res.result;
            // this.getAssessmentRiskIndexes();
            this.updateTitleInfo();
            //this.setButtonStates();
            // this.renderCheckboxes();
            // this.getCategories();
            this.finishGood(res.message);
            if (command == 'finish') { this.finishRating() }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    // end form

    updateIndexes(fromApi: any[]) {
        let row: any;
        if (fromApi !== undefined) {
            fromApi.forEach(item => {
                row = this.indexFields.find(x => x.riskId == item.riskId);
                row.score = item.score;
                row.selected = item.selected;
                row.assessmentId = item.assessmentId;
            });
        }
    }

    // buttons

    finishRating() {
        // TODO: close out
        this.showAssessmentForm = false;
        this.getAssessmentResults();
    }

    nextTitle() {
        if ( this.riskFactors[this.titleIndex + 1] !== undefined ) {
            this.titleIndex = this.titleIndex + 1;
            this.save(this.assessmentForm, 'next');
            this.navigate();
        }
    }

    previousTitle() {
        if ( this.riskFactors[this.titleIndex - 1] !== undefined ) {
            this.titleIndex = this.titleIndex - 1;
            this.save(this.assessmentForm, 'previous');
            this.navigate();
        }
    }

    navigate() {
        this.updateTitleInfo();
        // this.getCategories();
        // this.renderCheckboxes();
        this.setButtonStates();
    }

    setButtonStates() {
        this.disablePrevious = false;
        this.disableNext = false;
        if (this.titleIndex == 0) {
            this.disablePrevious = true;
        }
        if ( this.riskFactors[this.titleIndex + 1] === undefined ) {
            this.disableNext = true;
        }
    }

    // end buttons

    // on checked 

    onCheckboxChange(id, i) {
        let index: number;
        let options = this.assessmentForm.controls.indexFields.value; // whole array of object
        let option = options[i]; // the selected object
        if (option.selected === true) { // unselect other options
            let otherOptions = options.filter(x => x.parentId == option.parentId && x.selected == true && x.riskId != option.riskId);
            otherOptions.forEach(element => {
                index = options.findIndex(item => item.riskId === element.riskId);
                this.assessmentForm.controls.indexFields['controls'][index].controls.selected.patchValue(false);
            });
        }
    }

    hasNoChild(id: number) {
        // tslint:disable-next-line:radix
        if (this.currentIndexes.filter(x => parseInt(x.parentId) == id).length > 0) { 
            return false;        
        }
        return true;
    }

    getColor(level) {
        let styles = {};
        switch(level) { 
            case 2: { 
                styles = { 'background-color': '#404040' };
                break; 
            } 
            case 3: { 
                styles = { 'background-color': '#606060' };
                break; 
            } 
            case 4: { 
                styles = { 'background-color': '#808080' };
                break; 
            } 
            case 5: { 
                styles = { 'background-color': '#A0A0A0' };
                break; 
            } 
            case 6: { 
                styles = { 'background-color': '#8b4513' };
                break; 
            } 
            case 7: { 
                styles = { 'background-color': '#ca641c' };
                break; 
            } 
            case 8: { 
                styles = { 'background-color': '#e78c4b' };
                break; 
            } 
            case 9: { 
                styles = { 'background-color': '#f0b78f' };
                break; 
            } 
            default: { 
                styles = { 'background-color': '#808080' };
                break; 
            } 
        } 
        return styles;
    }

    // result getAssessmentResult

    assessmentResults: any[] = [];

    newAssessment() {
        if (this.showAssessmentForm == true) this.closeAssessmentForm();
        this.selectedPersonName = null;
        this.showAssessmentTypeForm = true;
    }

    assessmentType: string = null;

    onAssessmentTitleChange(id) {
        const title = this.assessmentTitles.find(x => x.riskAssessmentTitleId == id);
        this.assessmentTypeForm.controls['riskTypeId'].setValue(title.riskTypeId);
        if (title.riskTypeId == 3) { this.targetId = title.productId; }
        if (title.riskTypeId == 2) { this.openSearchBox(2); } // 2 SEARCH FOR STAFF
        if (title.riskTypeId == 1) { this.openSearchBox(1); } // 1 SEARCH FOR OBLIGOR
    }

    // --------------- REALTIME SEARCH ----------------------

    searchResults: Object;
    searchResultsC: Object;
    searchTerm$ = new Subject<any>();
    searchTermC$ = new Subject<any>();
    displaySearchModal: boolean = false;
    displaySearchModalC: boolean = false;
    selectedInput: number = 1;

    openSearchBox(input = 1): void {
        if (input == 1) this.displaySearchModalC = true;
        if (input == 2) this.displaySearchModal = true;
        this.selectedInput = input;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        if (this.selectedInput == 1) this.searchTermC$.next(searchString);
        if (this.selectedInput == 2) this.searchTerm$.next(searchString);
    }

    pickSearchedData(data) {
        if (this.selectedInput == 1) { // customer
            this.targetId = data.customerId;
            this.selectedPersonName = data.customerName;       
        }
        if (this.selectedInput == 2) { // staff
            this.targetId = data.staffId;
            this.selectedPersonName = data.fullName;                  
        }
        this.displaySearchModal = false;
        this.displaySearchModalC = false;
    }

    // message

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
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

