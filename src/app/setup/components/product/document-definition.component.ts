import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
    DropdownModule, CheckboxModule, SelectItem, TabViewModule, RadioButtonModule,
    SpinnerModule, ChipsModule
} from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import { ValidationService } from '../../../shared/services/validation.service';

import { ProductGroup } from '../../models/product-group';
import { ProductType } from '../../models/product-type';
import { ProductCategory } from '../../models/product-category';
import { ChartOfAccount } from '../../models/chartofaccount';
import { Company } from '../../models/company';
import { Currency } from '../../models/general-setup';
import { DealClassification } from '../../models/deal-classification';
import { ProductFeeEdit } from '../../models/productFeeEdit';
import { ProductClass } from '../../models/product-class';
import { LoanScheduleType } from '../../models/loan-schedule-type';

import { ProductCategoryService, ChargeService } from '../../services';
import { ProductGroupService } from '../../services';
import { CustomerType } from '../../../customer/models/customer';
import { CustomerService } from '../../../customer/services/customer.service';
import { ChartOfAccountService } from '../../services';
import { CompanyService } from '../../services';
import { ProductService } from '../../services';
import { CurrencyService } from '../../services';
import { DealClassificationService } from '../../services';
import { ProductFeeService } from '../../services';
import { CollateralService } from '../../services';


import { GlobalConfig } from '../../../shared/constant/app.constant';
import * as _ from 'lodash';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'document-definition.component.html',
    providers: [ValidationService, CustomerService, LoadingService]
})

export class DocumentDefinitionComponent implements OnInit {
    documentDefinitions: any[] = [];
    displayDocumentDefinitionForm: boolean = false;
    documentDefinitionForm: FormGroup;

    message: any;
    cssClass: any;
    title: any;
    show: any;

    constructor(private productService: ProductService,
                private fb: FormBuilder, 
                private loadingService: LoadingService,
    ) {
        
    }

    ngOnInit() {
       this.getAllDocumentDefinition(); 
       this.documentDefinitionForm = this.fb.group({
        documentTitle: ['', Validators.required],
        inUse: ['false'],     
    });
    }


    getAllDocumentDefinition() {
        this.productService.getDocumentDefinition().subscribe(results => {
            if (results.success == true) {
  
                this.documentDefinitions = results.result;
            } else {

            }
        });
    }

    saveDocumentDefinition(form) {
        var body = {
            documentTitle: form.value.documentTitle,
            inUse: form.value.inUse,

        }
        this.productService.addDocumentDefinition(body).subscribe((response: any) => {
            if (response.success == true) {
                this.displayDocumentDefinitionForm=false;
                this. getAllDocumentDefinition();
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Saved Successfully!', 'success');             
            } else {
                this.finishBad(response.message);
            }
        }, (err: any) => {
            this.finishBad(JSON.stringify(err));
        });

    }


    showDocumentDefinitionForm() {
        //this.clearControls();
        //this.selectedId = null;
        this.displayDocumentDefinitionForm = true;
    }

    clearControls() {


    };

    finishBad(message) {
        this.showMessage(message, 'error', "Fintrak Banking");
        this.loadingService.hide();
    }

    showMessage(message: string, cssClass: string, title: string) {
        this.message = message;
        this.title = title;
        this.cssClass = cssClass;
        this.show = true;
    }

   
}
