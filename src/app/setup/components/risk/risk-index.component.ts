import { Component, OnInit } from '@angular/core';
import { DataTableModule, TreeTableModule, TreeNode, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RiskIndex } from '../../models/risk-index';
import { RiskIndexService } from '../../services';
import { ProductService } from '../../services';

@Component({
    templateUrl: 'risk-index.component.html',
})
export class RiskIndexComponent implements OnInit {

    selectedAssessmentTitleId?: number;
    selectedId?: number;
    productIsSelected: boolean = false;
    showTitleForm: boolean = false;
    showIndexForm: boolean = false;
    displayRiskIndexList: boolean = false;
    displayIndexDetails: boolean = true;
    titleForm: FormGroup;
    riskIndexForm: FormGroup;
    filterForm: FormGroup;
    filteredRiskIndexes: any[];
    riskIndexes: any[];
    products: any[];
    assessmentTitles: any[];
    formState: string = 'New';
    show: boolean = false; message: any; title: any; cssClass: any;
    availableWeight?: number = null; // default
    riskTypes = [
        { 'riskTypeId': '1', 'riskTypeName': 'Obligor', },
        { 'riskTypeId': '2', 'riskTypeName': 'Staff', },
        { 'riskTypeId': '3', 'riskTypeName': 'Product', },
    ];
    indexTypes = [
        { 'indexTypeId': '1', 'indexTypeName': 'Category', },
        { 'indexTypeId': '2', 'indexTypeName': 'Question', },
        { 'indexTypeId': '3', 'indexTypeName': 'Answer', },
    ];
    itemLevels = [
        { 'id': '1', 'levelName': 'Level 1', },
        { 'id': '2', 'levelName': 'Level 2', },
        { 'id': '3', 'levelName': 'Level 3', },
        { 'id': '4', 'levelName': 'Level 4', },
        { 'id': '5', 'levelName': 'Level 5', },
        { 'id': '6', 'levelName': 'Level 6', },
        { 'id': '7', 'levelName': 'Level 7', },
        { 'id': '8', 'levelName': 'Level 8', },
        { 'id': '9', 'levelName': 'Level 9', },
    ];

    constructor(
        private loadingService: LoadingService, private validationService: ValidationService,
        private fb: FormBuilder, private riskIndexService: RiskIndexService,
        private productService: ProductService
    ) { }

// development

    categories: any[];
    indexFields: any[]; // raw from service
    titleIndex?: number;


    submitForm(obj){}



    getColor(level) {
        let styles = {};
        switch(level) { 
            case 2: { styles = { 'background-color': '#404040' }; break; } 
            case 3: { styles = { 'background-color': '#606060' }; break; } 
            case 4: { styles = { 'background-color': '#808080' }; break; } 
            case 5: { styles = { 'background-color': '#A0A0A0' }; break; } 
            case 6: { styles = { 'background-color': '#8b4513' }; break; } 
            case 7: { styles = { 'background-color': '#ca641c' }; break; } 
            case 8: { styles = { 'background-color': '#e78c4b' }; break; } 
            case 9: { styles = { 'background-color': '#f0b78f' }; break; } 
            default: { styles = { 'background-color': '#808080' }; break; } 
        } 
        return styles;
    }
	
    selectAssessment() {
        this.displayRiskIndexList = true;
        this.titleIndex = 0;
        this.getCategories();
    }

    getCategories() {
        this.categories = [];
        let childrenCount: number;
        const list = this.riskIndexes.filter(x => x.riskAssessmentTitleId == this.selectedAssessmentTitleId);
        list.forEach(e => {
            childrenCount = list.filter(x => x.parentId === e.riskId).length;
            if (childrenCount > 0) {
                this.categories.push(e);
            }
        });
        ////console.log('list..', list); ////console.log('categories..', this.categories);
    }

// development ends

    ngOnInit() {
        this.clearSearchForm();
        this.clearControls();
        this.loadDropdowns();
    }

    clearSearchForm() {
        this.filterForm = this.fb.group({
            riskAssessmentTitleId: ['', Validators.required],
        });
    }

    loadDropdowns() {
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
        this.refreshTitleSelect();
    }

    getParent(id) {
        let model = this.riskIndexes.find(x => x.riskId == id);
        return (model == null) ? null : model.name;
    }

    submitTitleForm(form) {
        if (this.titleForm.invalid) {
            return;
        }
        this.loadingService.show();
        let body = {
            riskTitle: form.value.riskTitle,
            riskTypeId: form.value.riskTypeId,
            productId: form.value.productId,
        };
        this.riskIndexService.saveAssessmentTitle(body).subscribe((res) => {
            if (res.success == true) {
                this.finishGood(res.message);
                this.refreshTitleSelect();
            } else {
                this.finishBad(res.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });
    }

    refreshTitleSelect() {
        this.loadingService.show();
        this.riskIndexService.getAllRiskAssessmentTitle().subscribe((response: any) => {
            if (response.success == true) {
                this.assessmentTitles = response.result;
                this.loadingService.hide();
            } else {
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));

        });
    }

    // list

    getRiskIndexes(id) {
        ////console.log('selected titleId: ', id);
        this.loadingService.show();
        this.riskIndexService.getRiskAssessmentIndexByTitle(id).subscribe((response: any) => {
            if (response.success == true) {
                this.riskIndexes = response.result;
                this.selectAssessment();
                this.displayRiskIndexList = true;
                this.loadingService.hide();
            } else {
                this.displayRiskIndexList = false;
                this.loadingService.hide();
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.displayRiskIndexList = false;
            this.loadingService.hide(1000);
            this.finishBad(JSON.stringify(err));
        });
        ////console.log('new indexes: ', JSON.stringify(this.riskIndexes));
        
    }

    refreshList() {
        this.getRiskIndexes(this.selectedAssessmentTitleId);
    }

    // forms

    clearControls() {
        this.selectedId = null;
        this.availableWeight = null; // -----------------------default
        this.titleForm = this.fb.group({
            riskTitle: ['', Validators.required],
            productId: [''],
            riskTypeId: ['', Validators.required],
        });
        this.riskIndexForm = this.fb.group({
            // riskId: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required],
            weight: ['', [Validators.required, this.validateWeight()]],
            itemLevel: ['', Validators.required],
            riskAssessmentTitleId: [this.selectedAssessmentTitleId, Validators.required],
            parentId: [''],
            indexTypeId: ['', Validators.required],
        });
    }

    editRiskIndex(index) {
        var row = this.riskIndexes[index];
        this.onItemLevelChange(row.itemLevel);
        this.onParentChange(row.parentId);
        this.selectedId = row.riskId;
        this.riskIndexForm = this.fb.group({
            name: [row.name, Validators.required],
            description: [row.description, Validators.required],
            weight: [row.weight, [Validators.required, this.validateWeight()]], 
            itemLevel: [row.itemLevel, Validators.required],
            riskAssessmentTitleId: [row.riskAssessmentTitleId],
            parentId: [row.parentId],
            indexTypeId: [row.indexTypeId],
        });
        this.showIndexForm = true;
    }

    submitIndexForm(form) {
        if (this.riskIndexForm.invalid) {
            return;
        }
        this.loadingService.show();
        let body = {
            name: form.value.name,
            description: form.value.description,
            weight: form.value.weight,
            itemLevel: form.value.itemLevel,
            riskAssessmentTitleId: form.value.riskAssessmentTitleId,
            parentId: form.value.parentId,
            indexTypeId: form.value.indexTypeId,
        };
        if (this.selectedId === null) {
            this.riskIndexService.save(body).subscribe((response: any) => {
                if (response.success == true) {
                    this.loadingService.hide();
                    //this.finishGood(response.message);
                    this.showIndexForm = false;
                    this.refreshList();
                } else {
                    this.displayRiskIndexList = false;
                    this.loadingService.hide();
                    this.finishBad(response.message);
                }
            }, (err: any) => {
                // this.displayRiskIndexList = false;
                this.loadingService.hide(1000);
                this.finishBad(JSON.stringify(err));
            });
        } else { // update selected
            this.riskIndexService.update(body, this.selectedId).subscribe((response: any) => {
                if (response.success == true) {
                    this.loadingService.hide();
                    //this.finishGood(response.message);
                    this.showIndexForm = false;
                    this.refreshList();
                } else {
                    this.displayRiskIndexList = false;
                    this.loadingService.hide();
                    this.finishBad(response.message);
                }
            }, (err: any) => {
                // this.displayRiskIndexList = false;
                this.loadingService.hide(1000);
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    displayTitleForm() {
        this.clearControls();
        this.showTitleForm = true;
        this.formState = "New";
    }

    displayIndexForm() {
        this.clearControls();
        this.showIndexForm = true;
        this.formState = "New";
    }

    selectedIndexTypeId?: number = null;

    validateWeight() { // todo: validate factors to within 100%
        return (control: FormControl) => {
            if (this.availableWeight == null) { return null; }
            if (this.selectedIndexTypeId == null) { return null; }
            if (+this.selectedIndexTypeId == 3) { return null; }
            if (
                +control.value > this.availableWeight 
                || 0 > +control.value 
                || 0 > this.availableWeight 
                || isNaN(control.value)
               ) {
                ////console.log('error..'+control.value+' av..'+this.availableWeight);
                return { error: true };
            }
            ////console.log('weight validated..', control.value > this.availableWeight);
            ////console.log('v..'+control.value +'av..'+ this.availableWeight);
            return null;
        }
    }

    // on changes

    onAssessmentTitleChange(id) {
        this.selectedAssessmentTitleId = id;
        if (id === '') { 
            this.displayRiskIndexList = false; 
            this.riskIndexes = [];
            return; 
        }
        this.getRiskIndexes(id);
        // this.displayRiskIndexList = true; // TODO REMOVE THIS LINE
    }

    onParentChange(id) {
        if (id === '' || (+this.selectedIndexTypeId == 3)) { 
            this.availableWeight = null; 
            this.riskIndexForm.get('weight').updateValueAndValidity();
            return;            
        }
        var sum = this.riskIndexes
                        .filter(x => x.parentId == +id)
                        .map(x => x.weight) // converts the object array to int array
                        .reduce((a,b) => a + b, 0); // a is previous value, b is next value
        var parent = this.riskIndexes
                        .find(x => x.riskId == id);
        if (parent != null) {
            var parentWeight = parent.weight || null;
            this.availableWeight = parentWeight - sum;
        } else {
            this.availableWeight = null;
        }
        this.riskIndexForm.get('weight').updateValueAndValidity();
    }

    onIndexTypeChange(id) {
        this.selectedIndexTypeId = id;
        this.onParentChange(this.riskIndexForm.value.parentId); // update valid weight
    }

    onRiskTypeChange(id) {
        let productControl = this.titleForm.controls['productId'];
        if (id == 3) {
            this.productIsSelected = true;
            productControl.setValidators([Validators.required]);
        } else {
            this.productIsSelected = false;
            productControl.setValidators(null);
            productControl.setValue("");
        }
        productControl.updateValueAndValidity();
    }

    onItemLevelChange(id) {
        this.filteredRiskIndexes = this.riskIndexes.filter(x => x.itemLevel == (id - 1));
    }



    // messages

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.showTitleForm = false;
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
        // this.getAll();
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