import { Component, OnInit } from '@angular/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RiskRating } from '../../models/risk-rating';
import { RiskRatingService } from '../../services';
import { ProductService } from '../../services';

@Component({
    templateUrl: 'risk-scoring.component.html',
})
export class RiskScoringComponent implements OnInit {

    model: RiskRating;
    riskRatings: any[];
    displayModalForm: boolean = false;
    displayModalDetails: boolean = false;
    formState: string = 'New';
    entityName: string = 'Risk Scoring';
    createUpdateForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    products: any[];

    constructor(
        private fb: FormBuilder,
        private productService: ProductService,
        private loadingService: LoadingService,
        private validationService: ValidationService,
        private riskRatingService: RiskRatingService,
    ) { }

    ngOnInit() {
        this.getAll();
        this.clearControls();
        this.loadDropdowns();
    }

    loadDropdowns() {
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
    }

    getAll(): void {
        this.loadingService.show();
        this.riskRatingService.get().subscribe((response: any) => {
            this.riskRatings = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

    showModalForm() {
        this.clearControls();
        this.displayModalForm = true;
        this.formState = "New";
    }

    clearControls() {
        this.selectedId = null;
        this.createUpdateForm = this.fb.group({
            rating: ['', Validators.required],
            maxRange: ['', Validators.required],
            minRange: ['', Validators.required],
            advicedRate: [''],
            ratesDescription: [''],
            productId: ['', Validators.required],
        });
    }

    submitForm(form) {
        this.loadingService.show();
        let body = {
            rates: form.value.rating, // TAKE NOTE OF THE PROPERTY DIFFERENCE!!!
            maxRange: form.value.maxRange,
            minRange: form.value.minRange,
            advicedRate: form.value.advicedRate,
            ratesDescription: form.value.ratesDescription,
            productId: form.value.productId,
        };
        if (this.selectedId == null) {
            this.riskRatingService.save(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.riskRatingService.update(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    editRow(row) {
        this.selectedId = row.riskRatingId;
        this.createUpdateForm = this.fb.group({
            rating: [row.rates, Validators.required],
            maxRange: [row.maxRange, Validators.required],
            minRange: [row.minRange, Validators.required],
            advicedRate: [row.advicedRate],
            ratesDescription: [row.ratesDescription],
            productId: [row.productId, Validators.required],
        });
        this.displayModalForm = true;
        this.formState = "Edit";
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayModalForm = false;
        this.clearControls();
        this.loadingService.hide();
        this.showMessage(message, 'success', "FintrakBanking");
        this.getAll();
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