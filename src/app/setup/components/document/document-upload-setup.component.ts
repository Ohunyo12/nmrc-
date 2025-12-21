import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, RequiredValidator, FormBuilder, } from '@angular/forms';
import { DocumentService, ProductService } from 'app/setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { CreditAppraisalService } from 'app/credit/services';

@Component({
  selector: 'app-document-upload-setup',
  templateUrl: './document-upload-setup.component.html',
})
export class DocumentUploadSetupComponent implements OnInit {
  
  displayDocumentTypeForm: boolean = false;
  displayProductDocumentMappingForm = false;
  displayDocumentCategoryForm = false;
  documentCategoriesData: any[] = [];
  documentTypesData: any[] = [];
  productDocumentMappingsData: any[] = [];
  documentCategoryForm: FormGroup;
  documentTypeForm: FormGroup;
  productDocumentMappingForm: FormGroup;
  productsData: any[] = [];

  itemPanelHeader = 'Create Document Category';
  buttonTitle = 'Add';

	constructor(private fb:FormBuilder,
				private productService: ProductService,
				private camServ: CreditAppraisalService,
				private docServ: DocumentService,
				private loadingService: LoadingService) { }

  ngOnInit() {
	  this.getAllProducts();
	  this.loadDocumentCategoryForm();
	  this.loadDocumentTypeForm();
	  this.loadProductDocumentMappingForm();
	  this.getAllDocumentCategories();
	  this.getAllDocumentTypes();
	//   this.getAllProductDocumentMappings();
  }

  	getAllProducts() {
		this.loadingService.show();
		this.productService.getAllProducts().subscribe((response: any) => {
		this.loadingService.hide();
		this.productsData = response.result;
		});
	}

	getAllDocumentCategories() {
		this.loadingService.show();
		this.camServ.getDocumentCategories().subscribe((response: any) => {
		this.loadingService.hide();
		this.documentCategoriesData = response.result;
		});
	}

	getAllDocumentTypes() {
		this.loadingService.show();
		this.camServ.getDocumentType().subscribe((response: any) => {
		this.loadingService.hide();
		this.documentTypesData = response.result;
		});
	}

	showProductDocumentMappingForm() {
		this.loadProductDocumentMappingForm();
		this.displayProductDocumentMappingForm = true;
	}      
	
	showDocumentTypeForm() {
		this.loadDocumentTypeForm();
		this.displayDocumentTypeForm = true;
	}

	showDocumentCategoryForm() {
		this.loadDocumentCategoryForm();
		this.displayDocumentCategoryForm = true;
	}

	loadDocumentCategoryForm() {
		this.itemPanelHeader = 'Create Document Category';
		this.documentCategoryForm = this.fb.group({
		documentCategoryId: '',
		documentCategoryName: ['', Validators.required],
		});
	}

	loadDocumentTypeForm() {
		this.itemPanelHeader = 'Create Document Type';
		this.documentTypeForm = this.fb.group({
			documentCategoryId: ['', Validators.required],
			documentTypeId: '',
			documentTypeName: ['', Validators.required],
		});
	}

	loadProductDocumentMappingForm() {
		this.itemPanelHeader = 'Create Product Document Mapping';
		this.productDocumentMappingForm = this.fb.group({
		productDocMapId: '',
		productId: ['', Validators.required],
		documentTypeId: ['', Validators.required],  
		required: ['', Validators.required],
	});
	}

	editDocumentCategory(index) {
		this.buttonTitle = 'save';
		this.itemPanelHeader = 'Edit Document Category';
		let row = index;
		this.documentCategoryForm.patchValue({
		documentCategoryId: row.documentCategoryId,
		documentCategoryName: row.documentCategoryName,
		});
		this.displayDocumentCategoryForm = true;
	}

	editDocumentType(index) {
		this.buttonTitle = 'save';
		this.itemPanelHeader = 'Edit Document Type';
		const row = index;
		this.documentTypeForm.patchValue({
		documentCategoryId: row.documentCategoryId,
		documentTypeId: row.documentTypeId,
		documentTypeName: row.documentTypeName,
	});
		this.displayDocumentTypeForm = true;
	}

	editProductDocMap(index) {
		this.buttonTitle = 'save';
		this.itemPanelHeader = 'Edit Product Document Mapping';
		const row = index;
		this.productDocumentMappingForm.patchValue({
		productDocMapId: row.productDocMapId,
		productId: row.productId,
		documentTypeId: row.documentTypeId,  
		required: row.required
	});
	this.displayProductDocumentMappingForm = true;
	}

	submitDocumentCategoryForm(form) {
	this.loadingService.show();
	let bodyObj = {
		documentCategoryId: form.value.documentCategoryId,
		documentCategoryName: form.value.documentCategoryName
	};

	let selectedId = form.value.documentCategoryId;

	if (!(selectedId > 0)) {
		this.docServ.addDocumentCategory(bodyObj).subscribe((response: any) => {
			this.loadingService.hide();
			if (response.success == true) {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				this.getAllDocumentCategories();
				this.displayDocumentCategoryForm = false;
			} else {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
			}
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
	} else {
		this.docServ.updateDocumentCategory(bodyObj, selectedId).subscribe((response: any) => {
			this.loadingService.hide();
			if (response.success == true) {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				this.getAllDocumentCategories();
				this.displayDocumentCategoryForm = false;
			} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
			}
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
	}
	}

	submitDocumentTypeForm(form) {
		this.loadingService.show();
		let bodyObj = {
			documentCategoryId: form.value.documentCategoryId,
			documentTypeId: form.value.documentTypeId,
			documentTypeName: form.value.documentTypeName,
		};
	
		let selectedId = form.value.documentTypeId;
	
		if (!(selectedId > 0)) {
			this.docServ.addDocumentType(bodyObj).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
					this.getAllDocumentTypes();
					this.displayDocumentTypeForm = false;
				} else {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		} else {
			this.docServ.updateDocumentType(bodyObj, selectedId).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success == true) {
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
					this.getAllDocumentTypes();
					this.displayDocumentTypeForm = false;
				} else {
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		}
	}

}

 
  