import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LimitMaintenanceService } from '../../services/limit-maintenance.service';

@Component({
  selector: 'app-contractor-criteria-setup',
  templateUrl: './contractor-criteria-setup.component.html'
})
export class ContractorCriteriaSetupComponent implements OnInit {

  selectedId: number = null;
  contractorDisplayAddModal: boolean = false;
  projectRistCriteriaDisplayAddModal: boolean = false;
  projectRistCategoryDisplayAddModal: boolean = false;
  contractorOptionDisplayAddModal: boolean = false;
  entityName: string = "New MonitoringSetup";
  contractorCriteriaForm: FormGroup;
  projectRiskCriteriaForm: FormGroup;
  projectRiskCategoryForm: FormGroup;
  contractorCriteriaOptionForm: FormGroup;
  messageTypes: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  projectCriterias: any[]= [];
  contractorCriterias: any[] = [];
  projectRiskRatingCategories: any[] = [];
  contractorCriteriaOptions: any[] = [];
  criteriaList: any[] = [];

  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private LimitMaintenanceService: LimitMaintenanceService) { }

  ngOnInit() {
     this.getAllContractorCriteria();
	 this. getAllProjectRiskRatingCategories();
	 this.getAllCriteriaList();
	 this.getAllContractorCriteriaOption();
	 this.getAllProjectRiskRatingCriteria();

     this.contractorCriteriaClearControls();
     this.projectRiskRatingCriteriaClearControls();
	 this.projectRiskCategoryClearControls();
	 this.contractorCriteriaClearOptionControls();
  }


  contractorCriteriaClearControls() {
		this.selectedId = null;
		this.contractorCriteriaForm = this.fb.group({
		criteria: ['', Validators.required],
		tierOne: ['', Validators.required],
    tierTwo: ['', Validators.required],
    tierThree: ['', Validators.required],
		});
  }

  contractorCriteriaClearOptionControls() {
	this.selectedId = null;
	this.contractorCriteriaOptionForm = this.fb.group({
	criteriaId: ['', Validators.required],
	optionName: ['', Validators.required],
    optionValue: ['', Validators.required],
	});
}

  projectRiskCategoryClearControls() {
		this.selectedId = null;
		this.projectRiskCategoryForm = this.fb.group({
		categoryName: ['', Validators.required]
		});
  }

	addNewContractorCriteria() {
		this.entityName = "New Contractor Criteria";
		this.contractorCriteriaClearControls();
		this.contractorDisplayAddModal = true;
  }

  addNewContractorCriteriaOption() {
	this.entityName = "New Contractor Criteria Option";
	this.contractorCriteriaClearOptionControls();
	this.contractorOptionDisplayAddModal = true;
}

  addNewProjectRiskRatingCategory() {
		this.entityName = "New Project Risk Rating Category";
		this.projectRiskCategoryClearControls();
		this.projectRistCategoryDisplayAddModal = true;
  }
  
  editContractorCriteria(row) {
    this.entityName = "Edit Contractor Criteria";
    this.selectedId = row.criteriaId;
    this.contractorCriteriaForm = this.fb.group({
      criteria: [row.criteria],
      tierOne: [row.tierOne],
      tierTwo: [row.tierTwo],
      tierThree: [row.tierThree]

    });
    this.contractorDisplayAddModal = true;
  }

  editContractorCriteriaOption(row) {
    this.entityName = "Edit Contractor Criteria Option";
    this.selectedId = row.optionId;
    this.contractorCriteriaOptionForm = this.fb.group({
      criteriaId: [row.criteriaId],
      optionName: [row.optionName],
      optionValue: [row.optionValue],
    });
    this.contractorOptionDisplayAddModal = true;
  }

  editProjectRiskRatingCategory(row) {
    this.entityName = "Edit Project Risk Rating Category";
    this.selectedId = row.categoryId;
    this.projectRiskCategoryForm = this.fb.group({
      categoryName: [row.categoryName]
    });
    this.projectRistCategoryDisplayAddModal = true;
  }


  getAllContractorCriteria(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllContractorCriteria().subscribe((response: any) => {
      this.contractorCriterias = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllContractorCriteriaOption(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllContractorCriteriaOption().subscribe((response: any) => {
      this.contractorCriteriaOptions = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllProjectRiskRatingCategories(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllProjectRiskRatingCategories().subscribe((response: any) => {
      this.projectRiskRatingCategories = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllCriteriaList(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllCriteriaList().subscribe((response: any) => {
      this.criteriaList = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


  projectRiskRatingCriteriaClearControls() {
		this.selectedId = null;
		this.projectRiskCriteriaForm = this.fb.group({
		criteria: ['', Validators.required],
		criteriaValue: ['', Validators.required],
    projectRiskRatingCategoryId: ['', Validators.required]
		});
  }
  
  addNewProjectRiskRatingCriteria() {
		this.entityName = "New Project Risk Rating Criteria";
		this.projectRiskRatingCriteriaClearControls();
		this.projectRistCriteriaDisplayAddModal = true;
  }
  
  editProjectRiskRatingCriteria(row) {
    this.entityName = "Edit Project Risk Rating Criteria";
    this.selectedId = row.projectRiskRatingCriteriaId;
    this.projectRiskCriteriaForm = this.fb.group({
      criteria: [row.criteria],
      criteriaValue: [row.criteriaValue],
      projectRiskRatingCategoryId: [row.projectRiskRatingCategoryId],
    });
    this.projectRistCriteriaDisplayAddModal = true;
  }

  getAllProjectRiskRatingCriteria(){
    this.loadingService.show();
    this.LimitMaintenanceService.getAllProjectRiskRatingCriteria().subscribe((response: any) => {
      this.projectCriterias = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

 

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.contractorCriteriaClearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }


	submitProjectRiskCriteriaForm(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (this.selectedId == null) {
		this.LimitMaintenanceService.addProjectRiskCriteria(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.projectRiskCriteriaForm.reset();
			this.finishGood(res.message);
			this.getAllProjectRiskRatingCriteria();
			this.projectRistCriteriaDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateProjectRiskCriteria(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllProjectRiskRatingCriteria();
			this.projectRistCriteriaDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
  }
  
  submitContractorCriteriaForm(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (this.selectedId == null) {
		this.LimitMaintenanceService.addContractorCriteria(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.contractorCriteriaForm.reset();
			this.finishGood(res.message);
			this.getAllContractorCriteria();
			this.contractorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateContractorCriteria(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllContractorCriteria();
			this.contractorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
  }

  submitContractorCriteriaOptionForm(formObj) {
	this.loadingService.show();
	const bodyObj = formObj.value; 
	if (this.selectedId == null) {
	this.LimitMaintenanceService.addContractorCriteriaOption(bodyObj).subscribe((res) => {
		if (res.success == true) {
		this.selectedId = null;
		this.contractorCriteriaOptionForm.reset();
		this.finishGood(res.message);
		this.getAllContractorCriteriaOption();
		this.contractorDisplayAddModal = false;
		} else {
		this.finishBad(res.message);
		}
	}, (err: any) => {
		this.finishBad(JSON.stringify(err));
	});
	}else{
	this.LimitMaintenanceService.updateContractorCriteriaOption(bodyObj, this.selectedId).subscribe((res) => {
		if (res.success == true) {
		this.selectedId = null;
		this.finishGood(res.message);
		this.getAllContractorCriteriaOption();
		this.contractorDisplayAddModal = false;
		} else {
		this.finishBad(res.message);
		}
	}, (err: any) => {
		this.finishBad(JSON.stringify(err));
	});
	}
}
  
  submitProjectRistRatingCategoryForm(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (this.selectedId == null) {
		this.LimitMaintenanceService.addProjectRistRatingCategoryForm(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.projectRiskCategoryForm.reset();
			this.finishGood(res.message);
			this.getAllProjectRiskRatingCategories();
			this.projectRistCategoryDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateProjectRistRatingCategoryForm(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllProjectRiskRatingCategories();
			this.projectRistCategoryDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
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
