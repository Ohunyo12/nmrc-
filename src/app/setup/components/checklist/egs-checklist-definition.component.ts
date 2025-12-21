import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ValidationService } from '../../../shared/services/validation.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { ChecklistService } from '../../services';
import swal from 'sweetalert2';
import { GlobalConfig, ChecklistTypeEnum, CheckListStatusEnum } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-egs-checklist-definition',
  templateUrl: './egs-checklist-definition.component.html',
})
export class EgsChecklistDefinitionComponent implements OnInit {
  ESGchecklistDefData: any[];
  displayESGChecklistForm: boolean = false;
  ESGChecklistDefForm: FormGroup;
  ESGCategoryForm: FormGroup;
  categoryList: any[];
  subCategoryList: any[];
  selectedChecklistItem: any;
  showChecklistItemData: boolean = false;
  unmappedChecklistItems: any[];
  mappedChecklistItems: any[];
  currentCategoryId: number;
  displayESGCategoryForm = false;
  ESGCategoryFormState = 'Add New Category';
  categorySelection: any;
  yesCheckListScoresData: any[] = [];
  noCheckListScoresData: any[] = [];

  constructor(private fb: FormBuilder, private validationService: ValidationService,
    private loadingService: LoadingService, private checklistService: ChecklistService) { }

	ngOnInit() {
		this.initializeControl();
		this.loadESGChecklistDefinition();
		this.loadCategories();
		this.getCheckListScores();
		this.mappedChecklistItems = [];
	}
	
	initializeControl() {
		this.ESGChecklistDefForm = this.fb.group({
		esgChecklistDefinitionId: [0],
		checklistItemId: [''],
		// esgSubCategoryId: ['', Validators.required],
		esgCategoryId: ['', Validators.required],
		// isCompulsory: [''],
		// itemDescription: ['', Validators.required]
		});

		this.ESGCategoryForm =this.fb.group({
			esgCategoryId: [''],
			esgCategoryName: ['', Validators.required],
			subCategoryName: [''],
			subCategoryId: ['']
			});
	}

	getCheckListScores() {
		this.loadingService.show();
		this.checklistService.getCheckListScores(ChecklistTypeEnum.EnvironmentalandSocialChecklist).subscribe((response: any) => {
		this.loadingService.hide();
		let scores: any[] = response.result;
		this.yesCheckListScoresData = scores.filter(x => x.checkListStatusId == Number(CheckListStatusEnum.Yes));
		this.noCheckListScoresData = scores.filter(x => x.checkListStatusId == Number(CheckListStatusEnum.No));
		});
	}

	loadCategories() {
		this.loadingService.show();
		this.checklistService.getESGCategories().subscribe((response: any) => {
		this.categoryList = response.result;
		this.loadingService.hide();
		});
	}

	loadESGChecklistDefinition() {
		this.loadingService.show();
		this.checklistService.getESGChecklistDefinition().subscribe((response: any) => {
		this.ESGchecklistDefData = response.result;
		this.loadChecklistItem();
		this.loadingService.hide();
		});
	}

	loadChecklistItem() {
		this.checklistService.GetAllChecklistItemBycheckListTypeId(ChecklistTypeEnum.EnvironmentalandSocialChecklist).subscribe((response: any) => {
			this.mappedChecklistItems = [];
			let scores: any[] = response.result;
			if(this.ESGchecklistDefData == null || this.ESGchecklistDefData == undefined){
				this.unmappedChecklistItems = scores;
				this.mappedChecklistItems = [];
			}else{
				this.mappedChecklistItems = this.ESGchecklistDefData.filter(c => c.esgCategoryId == this.currentCategoryId);
				this.unmappedChecklistItems = scores.filter(x => this.mappedChecklistItems.findIndex(d => d.checklistItemId == x.checkListItemId) == -1);
			}
			
			for (let c of this.unmappedChecklistItems) {
					c.yesChecklistScoresId = 0;
					c.noChecklistScoresId = 0;
			}
		
			this.showChecklistItemData = true;
		});
	}

	onSelectedCategoryChange(evt) {
		this.currentCategoryId = evt;
		this.loadSubcategories(evt);
		this.loadESGChecklistDefinition();
	}

	loadSubcategories(evt) {
		this.loadingService.show();
		this.checklistService.getESGsubCategories(evt).subscribe((response: any) => {
			this.subCategoryList = response.result;
			this.loadingService.hide();
		});
	}

	onSubCategoryChange(evt) {
	this.mappedChecklistItems = [];
		this.mappedChecklistItems = this.ESGchecklistDefData.filter(c => c.esgCategoryId == this.currentCategoryId 
			&& c.esgSubCategoryId == evt);
	}

	editChecklistItemMapping(index, evt) {

	}

	showESGChecklistDefinitionForm() {
		this.initializeControl();
		this.displayESGChecklistForm = true;
	}

	selectedChecklistIsValid(): boolean{
		if (this.selectedChecklistItem == null || this.selectedChecklistItem == undefined || this.selectedChecklistItem.length <= 0){
			return false;
		}
			if(this.selectedChecklistItem.findIndex(d => d.yesChecklistScoresId <= 0 || d.noChecklistScoresId <= 0) == -1){
				return true;
			}
			return false;
	}

	deleteESGChecklistDefinition(index) {
		let __this = this;

		
			if (index != null) {

				swal({
					title: 'Are you sure?',
					text: 'Are you sure you want to delete?',
					type: 'question',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes',
					cancelButtonText: 'No, cancel!',
					confirmButtonClass: 'btn btn-success btn-move',
					cancelButtonClass: 'btn btn-danger',
					buttonsStyling: true,
				}).then(function () {
				__this.checklistService.deleteESGChecklistDefinition(index.esgChecklistDefinitionId).subscribe((response: any) => {
					let success = response.result;

					if(success==true)
					{
					swal('FinTrak Credit 360', "Record is deleted succesfully!  "  , 'success');
					}else{
					swal('FinTrak Credit 360', "Unable to delete record ", 'error');
					}
					__this.loadESGChecklistDefinition();
				});
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
					}
				});
				
			

			} 
		

	}


	submitESGChecklistDefForm(formObj) {
		this.loadingService.show();
		let body = [];
		let row = formObj.value;
		this.selectedChecklistItem.forEach(el => {
		let model = {
			esgChecklistDefinitionId: row.esgChecklistDefinitionId,
			checklistItemId: el.checkListItemId,
			// esgSubCategoryId: row.esgSubCategoryId,
			esgCategoryId: row.esgCategoryId,
			// checklistScoresId: el.checklistScoresId,
			// isCompulsory: row.isCompulsory,
			// itemDescription: row.itemDescription,
			yesChecklistScoresId: el.yesChecklistScoresId,
			noChecklistScoresId: el.noChecklistScoresId

		}
		body.push(model);
		})
		this.checklistService.addESGChecklistDefinition(body).subscribe((response: any) => {
		this.loadingService.hide();
		if (response.success === true) {
			// this.displayESGChecklistForm = false;
			this.loadESGChecklistDefinition();
			this.selectedChecklistItem = [];
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
		} else {
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
		}
		}, (err) => {
		this.loadingService.hide();
		swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
		});
	}
	  
  	saveESGCategory(formObj) {
		this.loadingService.show();
		let row = formObj.value;
		let model = {
			// esgSubCategoryId: row.esgSubCategoryId,
			esgCategoryId: row.esgCategoryId,
			esgCategoryName: row.esgCategoryName,
		};
		if (!(model.esgCategoryId > 0)) {
			this.checklistService.addESGCategory(model).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success === true) {
					this.loadCategories();
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		} else {
			this.checklistService.editESGCategory(model).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success === true) {
					this.loadCategories();
			swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		}
		
	}

	submitForSubCategory(formObj) {
		this.loadingService.show();
		let row = formObj.value;
		let model = {
			// esgSubCategoryId: row.esgSubCategoryId,
			esgCategoryId: row.esgCategoryId,
			esgCategoryName: row.esgCategoryName,
			esgSubCategoryName: row.subCategoryName,
			esgSubCategoryId: row.subCategoryId
		};
		if (!(model.esgSubCategoryId > 0)) {
			this.checklistService.addESGSubCategory(model).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success === true) {
					this.loadSubcategories(model.esgCategoryId);
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		} else {
			this.checklistService.editESGSubCategory(model).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success === true) {
					this.loadSubcategories(model.esgCategoryId);
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		}
	}

	showESGCategoryDefinitionForm() {
		this.displayESGCategoryForm = true;
	}

	resetESGCategoryForm() {
		this.ESGChecklistDefForm.reset();
		this.ESGCategoryForm.reset();
		this.ESGCategoryFormState = 'Add New Category';
	}

	editESGCategory(row) {
		this.ESGCategoryForm.controls['esgCategoryId'].setValue(row.esgCategoryId);
		this.ESGCategoryForm.controls['esgCategoryName'].setValue(row.esgCategoryName);
		this.ESGCategoryFormState = 'Update Category';
	}

	editESGSubCategory(row) {
		this.ESGCategoryForm.controls['subCategoryId'].setValue(row.esgCategoryId);
		this.ESGCategoryForm.controls['subCategoryName'].setValue(row.esgCategoryId);
		this.ESGCategoryForm.controls['esgCategoryId'].setValue(row.esgCategoryId);
		this.ESGCategoryForm.controls['esgCategoryName'].setValue(row.esgCategoryName);
	}

	deleteESGCategory(formObj) {
		const __this = this;
        swal({
            title: 'Are you sure?',
            text: 'as this will delete its sub-categories too',
            type: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-move',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: true,
        }).then(function () {
			__this.loadingService.show();
			let model = {
				// esgSubCategoryId: row.esgSubCategoryId,
				esgCategoryId: formObj.esgCategoryId,
				esgCategoryName: formObj.esgCategoryName,
			};
			if (model.esgCategoryId > 0) {
				__this.checklistService.deleteESGCategory(model.esgCategoryId).subscribe((response: any) => {
					__this.loadingService.hide();
					if (response.success === true) {
						__this.loadCategories();
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
					} else {
					swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
					}
				}, (err) => {
					__this.loadingService.hide();
					swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
				});
			} 
		}, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
		}

	deleteSubCategory(formObj) {
		this.loadingService.show();
		let model = {
			esgCategoryId: formObj.esgCategoryId,
			esgCategoryName: formObj.esgCategoryName,
			esgSubCategoryName: formObj.subCategoryName,
			esgSubCategoryId: formObj.subCategoryId
		};
		if (model.esgSubCategoryId > 0) {
			this.checklistService.deleteESGSubCategory(model.esgSubCategoryId).subscribe((response: any) => {
				this.loadingService.hide();
				if (response.success === true) {
					this.loadSubcategories(model.esgCategoryId);
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
				} else {
				swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
				}
			}, (err) => {
				this.loadingService.hide();
				swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
		} 
	}

	// 	loadESGCategory() {
	// 	this.loadingService.show();
	// 	this.checklistService.getESGCategory().subscribe((response: any) => {
	// 	  this.ESGchecklistDefData = response.result;
	// 	  this.loadingService.hide();
	// 	});
	// }
}
