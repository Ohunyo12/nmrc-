import { Component, OnInit, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../../../../setup/services'; 
import { FormGroup,FormBuilder,Validators, FormArray } from '@angular/forms';  
import { IProductFees } from '../loanApplicationInfo.interface';
import { LoadingService } from 'app/shared/services/loading.service';

@Component({
    selector: 'product-fees',
    templateUrl: 'productfees.component.html'
})
export class ProductFeesComponent implements OnInit, OnChanges {
   
    @Input() productId: number;
    @Input() loanApplicationDetailId = 0;
    @Input() forModifyFacility = false;
    rowCount: number;
    fees: any[];
    
    rows: any;
    productFeesForms: FormGroup
    @Output() feesCollection= new EventEmitter< IProductFees[]>();
    @Input() editFee: boolean;
    disableRateField: any;
    constructor(
                private productServ: ProductService, private fb: FormBuilder, 
                private loadingSrv: LoadingService
               ) 
               { }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.loanApplicationDetailId > 0){
            this.getSavedFees(this.loanApplicationDetailId, this.forModifyFacility);
            return;
        }
        if(this.productId > 0){
        // if(this.productId != undefined && this.productId != null){
            this.getProductFees(this.productId); 
        }
    }

    ngOnInit() {        
        this.initProductFessForms();
             if(this.editFee) { this.disableRateField = false; }
             else { this.disableRateField = true; }
             
    }
    
    ClickDone() {
    const productFees: IProductFees[] =  this.productFeesForms.controls['fees'].value;
        this.feesCollection.emit(productFees);
    }

    getSavedFees(loanApplicationDetailId, forModifyFacility){
        if (loanApplicationDetailId > 0){
            this.fees = [];
            // this.productFeesForms.controls.fees
            this.initProductFessForms();
            this.loadingSrv.show();
            this.productServ.getSavedFacilityFees(loanApplicationDetailId, forModifyFacility)
                .subscribe((response: any) => {
                    this.loadingSrv.hide();
                    this.fees = response.result;             
                    this.getNoteFields(response.result);
                    this.renderCustomFields();
                });
        }
    }

    getProductFees(productId) {
        
        if(productId!= undefined || productId != null || productId != 0)
        {
            this.fees = [];
            this.productFeesForms.controls.fees
            this.initProductFessForms();
            this.loadingSrv.show();
            this.productServ.getProductsFees(productId)
                .subscribe((response: any) => {
                    this.loadingSrv.hide();
                    this.fees = response.result;             
                    this.getNoteFields(response.result);
                    this.renderCustomFields();
                });
        }
    }

    getControls(){
        // if (this.fees == null || this.fees == undefined){
        //     return new FormArray;
        // }
        let test = (this.productFeesForms.get('fees') as FormArray).controls;
        return test;
    }

    getNoteFields(controls) {    
        if (this.fees == null || this.fees == undefined){
            return;
        }
        // this.rows = Array.from(Array(Math.ceil(this.fees.length)).keys());
        this.rows = Array.from(Array(Math.ceil(this.fees.length / 2)).keys());
    }

    renderCustomFields() {
        if (this.fees == null || this.fees == undefined){
            return;
        }
        const control = <FormArray>this.productFeesForms.controls['fees'];
        this.fees.forEach((element) => {
            
            control.push(this.inifeesForms(element));
        });
        this.ClickDone();
    }

    initProductFessForms() {
        this.productFeesForms = this.fb.group({
            fees: this.fb.array([])             
        });
    }
    
    showPercentage: boolean = false;
    FeesForms: FormGroup;
    inifeesForms(element) {
        
        if(element.feeTypeId == 1) this.showPercentage = true;
            let control = this.fb.group({
            feeId: [element.feeId, Validators.required],
            feeName: [element.feeName, Validators.required],
            rate: [element.rate, Validators.required],
            feeDisplay:[element.feeDisplay]
        });
        return control;
    }


}