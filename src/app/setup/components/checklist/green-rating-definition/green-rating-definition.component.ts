import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from 'app/shared/services/validation.service';
import { LoadingService } from 'app/shared/services/loading.service';
import { ChecklistService } from 'app/setup/services';
import { LoanApplicationService } from 'app/credit/services/loan-application.service';
import swal from 'sweetalert2';
import { GlobalConfig, ChecklistTypeEnum, CheckListStatusEnum } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-green-rating-definition',
  templateUrl: './green-rating-definition.component.html'
})
export class GreenRatingDefinitionComponent implements OnInit {
	ESGchecklistDefData: any[] = [];
	displayESGChecklistForm: boolean = false;
	ESGChecklistDefForm: FormGroup;
	ESGCategoryForm: FormGroup;
	categoryList: any[] = [];
	subCategoryList: any[] = [];
	selectedChecklistItem: any[] = [];
	showChecklistItemData: boolean = false;
	unmappedChecklistItems: any[] = [];
	mappedChecklistItems: any[] = [];
	currentCategoryId: number;
	displayESGCategoryForm = false;
	ESGCategoryFormState = 'Add New Category';
	categorySelection: any;
	sectors: any[] = [];
	yesCheckListScoresData: any[] = [];
	noCheckListScoresData: any[] = [];
	sectorId: number;

  	constructor(private fb: FormBuilder, private validationService: ValidationService,
	private loadingService: LoadingService, private checklistService: ChecklistService,
	private loanAppService: LoanApplicationService) { }

	ngOnInit() {
		this.initializeControl();
		this.loadSectors();
		this.loadESGChecklistDefinition();
		this.getCheckListScores();
		this.mappedChecklistItems = [];
	}

	initializeControl() {
		this.ESGChecklistDefForm = this.fb.group({
			esgChecklistDefinitionId: 0,
			// checklistItemId: '',
			sectorId: ['', Validators.required],
			// checklistScoresId: ['', Validators.required],
			// isCompulsory: [''],
			// itemDescription: ['', Validators.required]
		});
	}

	loadSectors(){
		this.loadingService.show();
		this.loanAppService.getSector().subscribe((response: any) => {
			this.loadingService.hide();
			this.sectors = response.result;
        });
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

	loadESGChecklistDefinition() {
		this.loadingService.show();
		this.checklistService.getGreenRatingDefinition().subscribe((response: any) => {
		this.loadingService.hide();
		this.ESGchecklistDefData = [];
		this.ESGchecklistDefData = response.result;
		this.loadChecklistItem();
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
	}

	getCheckListScores() {
		this.loadingService.show();
		this.checklistService.getCheckListScores(ChecklistTypeEnum.GreenRating).subscribe((response: any) => {
		this.loadingService.hide();
		let scores: any[] = response.result;
		this.yesCheckListScoresData = scores.filter(x => x.checkListStatusId == Number(CheckListStatusEnum.Yes));
		this.noCheckListScoresData = scores.filter(x => x.checkListStatusId == Number(CheckListStatusEnum.No));
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
	}

	onSelectedSectorChange(sectorId: number){
		this.sectorId = sectorId;
		this.loadESGChecklistDefinition();
		// this.loadingService.show();
		// this.checklistService.GetAllChecklistItemBycheckListTypeId(ChecklistTypeEnum.GreenRating).subscribe((response: any) => {
		// this.loadingService.hide();
		// this.unmappedChecklistItems = response.result;
		// 		for (let c of this.unmappedChecklistItems) {
		// 			c.yesChecklistScoresId = 0;
		// 			c.noChecklistScoresId = 0;
		// 		}
		// 	if (this.ESGchecklistDefData == null || this.ESGchecklistDefData == undefined){
		// 		this.mappedChecklistItems = [];
		// 	}else{
		// 		this.mappedChecklistItems = this.ESGchecklistDefData.filter(c => c.sectorId == sectorId);
		// 	}
		// this.showChecklistItemData = true;
		// });
	}

	loadChecklistItem() {
		this.loadingService.show();
		this.checklistService.GetAllChecklistItemBycheckListTypeId(ChecklistTypeEnum.GreenRating).subscribe((response: any) => {
		this.loadingService.hide();
		this.mappedChecklistItems = [];
			let scores: any[] = response.result;
			if(this.ESGchecklistDefData == null || this.ESGchecklistDefData == undefined){
				this.unmappedChecklistItems = scores;
				this.mappedChecklistItems = [];
			}else{
				this.mappedChecklistItems = this.ESGchecklistDefData.filter(c => c.sectorId == this.sectorId);
				this.unmappedChecklistItems = scores.filter(x => this.mappedChecklistItems.findIndex(d => d.checklistItemId == x.checkListItemId) == -1);//take note of spelling!!!
			}
			
			for (let c of this.unmappedChecklistItems) {
					c.yesChecklistScoresId = 0;
					c.noChecklistScoresId = 0;
			}
		
			this.showChecklistItemData = true;
		}, (err) => {
			this.loadingService.hide();
			swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
			});
	}

	showESGChecklistDefinitionForm() {
		this.initializeControl();
		this.displayESGChecklistForm = true;
	}

	deleteESGChecklistDefinition(index) {
		let __this = this;
			if (index != null) {

				swal({
					title: 'Are you sure?',
					text: 'Are you sure you want to delete this Definition?',
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
			sectorId: row.sectorId,
			yesChecklistScoresId: el.yesChecklistScoresId,
			noChecklistScoresId: el.noChecklistScoresId
			// isCompulsory: row.isCompulsory,
			// itemDescription: row.itemDescription,
			// gradeScore: el.gradeScore
		}
		body.push(model);
		})
		this.checklistService.addGreenRatingDefinition(body).subscribe((response: any) => {
		this.loadingService.hide();
		if (response.success === true) {
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
}
