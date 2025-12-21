import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { LimitMaintenanceService } from '../../services/limit-maintenance.service'

@Component({
  selector: 'app-ibl-checklist-setup',
  templateUrl: './ibl-checklist-setup.component.html',
  styleUrls: ['./ibl-checklist-setup.component.scss']
})
export class IblChecklistSetupComponent implements OnInit {
  selectedId: number = null;
  contractorDisplayAddModal: boolean = false;
 
  contractorOptionDisplayAddModal: boolean = false;
  entityName: string = "New MonitoringSetup";
  IBLChecklistForm: FormGroup;
  IBLChecklistOptionForm: FormGroup;
  messageTypes: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  IBLChecklists: any[] = [];
  contractorCriteriaOptions: any[] = [];
  criteriaList: any[] = [];
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private LimitMaintenanceService: LimitMaintenanceService) { }

  ngOnInit() {
     this.getAllIBLChecklist();
	 this.getAllCriteriaList();
	 this.getAllIBLChecklistOption();
     this.IBLChecklistClearControls();
	 this.IBLChecklistClearOptionControls();
  }


  IBLChecklistClearControls() {
		this.selectedId = null;
		this.IBLChecklistForm = this.fb.group({
		checklist: ['', Validators.required],
		
		});
  }

  IBLChecklistClearOptionControls() {
	this.selectedId = null;
	this.IBLChecklistOptionForm = this.fb.group({
		iblChecklistId: ['', Validators.required],
	optionName: ['', Validators.required],
    //optionValue: ['', Validators.required],
	});
}
 

	addNewContractorCriteria() {
		this.entityName = "New IBL Checklist";
		this.IBLChecklistClearControls();
		this.contractorDisplayAddModal = true;
  }

  addNewContractorCriteriaOption() {
	this.entityName = "New IBL Checklist Option";
	this.IBLChecklistClearOptionControls();
	this.contractorOptionDisplayAddModal = true;
}
  
  editContractorCriteria(row) {
    this.entityName = "Edit IBL Checklist";
    this.selectedId = row.iblChecklistId;
    this.IBLChecklistForm = this.fb.group({
      checklist: [row.checklist],
      

    });
    this.contractorDisplayAddModal = true;
  }

  editContractorCriteriaOption(row) {
    this.entityName = "Edit IBL Checklist Option";
    this.selectedId = row.optionId;
    this.IBLChecklistOptionForm = this.fb.group({
      iblChecklistId: [row.iblChecklistId],
      optionName: [row.optionName],
     // optionValue: [row.optionValue],
    });
    this.contractorOptionDisplayAddModal = true;
  }


  getAllIBLChecklist(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllIBLChecklist().subscribe((response: any) => {
      this.IBLChecklists = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllIBLChecklistOption(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllIBLChecklistOption().subscribe((response: any) => {
      this.contractorCriteriaOptions = response.result;
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


  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.IBLChecklistClearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }

  
  submitContractorCriteriaForm(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (this.selectedId == null) {
		this.LimitMaintenanceService.addIblChecklist(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.IBLChecklistForm.reset();
			this.finishGood(res.message);
			this.getAllIBLChecklist();
			this.contractorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateIBLChecklist(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllIBLChecklist();
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
	this.LimitMaintenanceService.addIBLChecklistOption(bodyObj).subscribe((res) => {
		if (res.success == true) {
		this.selectedId = null;
		this.IBLChecklistOptionForm.reset();
		this.finishGood(res.message);
		this.getAllIBLChecklistOption();
		this.contractorOptionDisplayAddModal = false;
		} else {
		this.finishBad(res.message);
		}
	}, (err: any) => {
		this.finishBad(JSON.stringify(err));
	});
	}else{
	this.LimitMaintenanceService.updateIBLChecklistOption(bodyObj, this.selectedId).subscribe((res) => {
		if (res.success == true) {
		this.selectedId = null;
		this.finishGood(res.message);
		this.getAllIBLChecklistOption();
		this.contractorOptionDisplayAddModal = false;
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
