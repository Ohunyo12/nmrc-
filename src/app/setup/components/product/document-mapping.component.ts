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

import { ProductCategoryService, ChargeService, GeneralSetupService } from '../../services';
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
import { LoanService } from '../../services';

import { GlobalConfig } from '../../../shared/constant/app.constant';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { setupMaster } from 'cluster';

@Component({
    templateUrl: 'document-mapping.component.html',
    providers: [ValidationService, CustomerService, LoadingService]
})

export class DocumentMappingComponent implements OnInit {
    productDocumentMappingForm: FormGroup;
    displayProductDocumentMappingForm = false;
    itemPanelHeader = 'Create Product Document Mapping';
    
    message: any;
    cssClass: any;
    title: any;
    show: any;
    documentDefinitions: any[] = [];
    documentCategoriesData: any[] = [];
	productsData: any[] = [];
	sectorsData: any[] = [];
	SubSectorsData: any[] = [];
    productClassesData: any[] = [];
    documentTypesData: any[] = [];
    documentTypesData2: any[] = [];
    productDocumentMappingsData: any[] = [];
	buttonTitle = 'Add';
	isMappedToProduct = false;
	isMappedToProductClass = false;
	isMappedToSector = false;
	isMappedToSubSector = false;
     

    constructor(private productService: ProductService,
                private fb: FormBuilder,
                private camServ: CreditAppraisalService,
				private loadingService: LoadingService,
				private gen:GeneralSetupService) 
                { }

    ngOnInit() {
		this.getAllProductClasses();
		this.getAllProducts();
		this.getAllSectors();
		this.getAllSubSectors();
        this.getAllDocumentTypes();
        this.getAllProductDocumentMappings();
        this.getAllDocumentCategories();
        this.loadProductDocumentMappingForm();
    }

	getAllProductClasses() {
		this.loadingService.show();
		this.productService.getAllProductClasses().subscribe((response: any) => {
		this.loadingService.hide();
		this.productClassesData = response.result;
		});
    }

    getAllProducts() {
		this.loadingService.show();
		this.productService.getAllProducts().subscribe((response: any) => {
		this.loadingService.hide();
		this.productsData = response.result;
		});
	}
	
	getAllSectors() {
		this.loadingService.show();
		this.gen.getAllSectors().subscribe((response: any) => {
		this.loadingService.hide();
		this.sectorsData = response.result;
		this.sectorsData.sort();
		});
	}
	
	getAllSubSectors() {
		this.loadingService.show();
		this.gen.getAllSubSectors().subscribe((response: any) => {
		this.loadingService.hide();
		this.SubSectorsData = response.result;
		this.SubSectorsData.sort();
		});
    }
    
    getAllDocumentTypes() {
		this.loadingService.show();
		this.camServ.getDocumentType().subscribe((response: any) => {
		this.loadingService.hide();
		this.documentTypesData = response.result;
		});
    }
    
    getAllProductDocumentMappings() {
		this.loadingService.show();
		this.productService.getAllProductDocumentMappings().subscribe((response: any) => {
		this.loadingService.hide();
		this.productDocumentMappingsData = response.result;
		});
    }
    
    getAllDocumentCategories() {
		this.loadingService.show();
		this.camServ.getDocumentCategories().subscribe((response: any) => {
		this.loadingService.hide();
		this.documentCategoriesData = response.result;
		});
	}

    loadProductDocumentMappingForm() {
		this.itemPanelHeader = 'Create Product Document Mapping';
		this.productDocumentMappingForm = this.fb.group({
		productDocMapId: '',
		productId: '',
		productClassId: '',
		operationId: '',
		sectorId:'',
		subSectorId: '',
		mapToSector: false,
		mapToSubSector: false,
		mapToProductClass: false,	
		mapToProduct: false,
		mapToOperation: false,
		documentCategoryId: '',
		documentTypeId: ['', Validators.required],  
		required: false,
	    });
	}

	isMapToSector(): boolean {
		return this.isMappedToSector;
	}

	isMapToSubSector(): boolean {
		return this.isMappedToSubSector;
	}

	isMapToProductClass(): boolean {
		// console.log('isMapToProductClass', this.isMappedToProductClass);
		return this.isMappedToProductClass;
	}

	isMapToProduct(): boolean {
		// console.log('isMapToProduct', this.isMappedToProduct);
		return this.isMappedToProduct;
	}
	
	setProductClassInput(event) {
		//console.log(event.target.checked);
		if (event.target.checked) {
			this.isMappedToProductClass = true;
			this.productDocumentMappingForm.controls['productClassId'].setValidators(Validators.required);
		} else {
			this.isMappedToProductClass = false;
			this.productDocumentMappingForm.controls['productClassId'].setValidators(null);
		}
		this.productDocumentMappingForm.controls['productClassId'].updateValueAndValidity();
	}

	setProductInput(event) {
		if (event.target.checked) {
			this.isMappedToProduct = true;
			this.productDocumentMappingForm.controls['productId'].setValidators(Validators.required);
		} else {
			this.isMappedToProduct = false;
			this.productDocumentMappingForm.controls['productId'].setValidators(null);
		}
		this.productDocumentMappingForm.controls['productId'].updateValueAndValidity();
	}

	setSectorInput(event) {
		if (event.target.checked) {
			this.isMappedToSector = true;
			this.productDocumentMappingForm.controls['sectorId'].setValidators(Validators.required);
		} else {
			this.isMappedToSector = false;
			this.productDocumentMappingForm.controls['sectorId'].setValidators(null);
		}
		this.productDocumentMappingForm.controls['sectorId'].updateValueAndValidity();
	}

	setSubSectorInput(event) {
		if (event.target.checked) {
			this.isMappedToSubSector = true;
			this.productDocumentMappingForm.controls['subSectorId'].setValidators(Validators.required);
		} else {
			this.isMappedToSubSector = false;
			this.productDocumentMappingForm.controls['subSectorId'].setValidators(null);
		}
		this.productDocumentMappingForm.controls['subSectorId'].updateValueAndValidity();
	}

    showProductDocumentMappingForm() {
		this.loadProductDocumentMappingForm();
		this.displayProductDocumentMappingForm = true;
			this.isMappedToProductClass = false;
			this.isMappedToProduct = false;
			this.isMappedToSubSector = false;
			this.isMappedToSector = false;
	}
    
    editProductDocMap(index) {
		//console.log(index);
		this.buttonTitle = 'save';
		this.itemPanelHeader = 'Edit Product Document Mapping';
		const row = index;
		this.isMappedToProductClass = row.mapToProductClass,
		this.isMappedToProduct = row.mapToProduct,
		this.documentTypesData2 = this.documentTypesData.filter(c => c.documentCategoryId == row.documentCategoryId);
		this.productDocumentMappingForm.patchValue({
            productDocMapId: row.productDocMapId,
			productId: row.productId,
			sectorId: row.sectorId,
			subSectorId: row.subSectorId,
			productClassId: row.productClassId,
			operationId: row.operationId,
			mapToProductClass: row.mapToProductClass,
			mapToProduct: row.mapToProduct,
			mapToOperation: row.mapToOperation,
			mapToSector: row.mapToSector,
			mapToSubSector: row.mapToSubSector,
            documentCategoryId: row.documentCategoryId,
            documentTypeId: row.documentTypeId,  
            required: row.required
        });
        this.displayProductDocumentMappingForm = true;
	}

	removeProductDocumentMapping(id) {
		this.productService.removeProductDocumentMapping(id).subscribe((response: any) => {
			this.loadingService.hide();
			if (response.success == true) {
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
					this.getAllProductDocumentMappings();
			} else {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
			}
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
	}
    // getAllDocumentDefinition() {
    //     this.productService.getDocumentDefinition().subscribe(results => {
    //         if (results.success == true) {
    //             this.documentDefinitions = results.result;
    //         } else {

    //         }
    //     });
    // }

    filterDocumenttypes(documentCategoryId) {
        this.documentTypesData2 = this.documentTypesData.filter(c => c.documentCategoryId == documentCategoryId);
    }

    submitProductDocumentMappingForm(form) {
		this.loadingService.show();
		let bodyObj = {
				productDocMapId: form.value.productDocMapId,
				productId: form.value.productId,
				productClassId: form.value.productClassId,
				operationId: form.value.operationId,
				sectorId: form.value.sectorId,
				subSectorId: form.value.subSectorId,
				mapToSubSector: form.value.mapToSubSector,
				mapToSector: form.value.mapToSector,
				mapToProductClass: form.value.mapToProductClass,
				mapToProduct: form.value.mapToProduct,
				mapToOperation: form.value.mapToOperation,
				documentTypeId: form.value.documentTypeId,  
				required: form.value.required,
		};
	
		let selectedId = form.value.productDocMapId;
	
		if (!(selectedId > 0)) {
			this.productService.addProductDocumentMapping(bodyObj).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
						swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
						this.getAllProductDocumentMappings();
						this.displayProductDocumentMappingForm = false;
				} else {
					this.loadingService.hide();
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		} else {
			this.productService.updateProductDocumentMapping(bodyObj, selectedId).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
						swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
						this.getAllProductDocumentMappings();
						this.displayProductDocumentMappingForm = false;
					} else {
						swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
					}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		}
	}

    
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
