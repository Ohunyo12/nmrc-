import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LimitMaintenanceService } from '../../services/limit-maintenance.service';
import { CurrencyService } from 'app/setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';


@Component({
  selector: 'app-collections-retail-cron-setup',
  templateUrl: './collections-retail-cron-setup.component.html'
})
export class CollectionsRetailCronSetupComponent implements OnInit {
  selectedId: number = null;
  selectedComputationId: number = null;
  cronDisplayAddModal: boolean = false;
  computationDisplayAddModal: boolean = false;
  entityName: string = "Retail Collections Cron Setup";
  cronForm: FormGroup;
  computationForm: FormGroup;
  cronList: any[];
  computationList: any[];
  commissionPayableValue: number;
  show: boolean = false; message: any; title: any; cssClass: any;
  cron: any;
  
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private currencyService: CurrencyService,
    private LimitMaintenanceService: LimitMaintenanceService) { }

  ngOnInit() {
    this.getAllCronJobs();
    this.getAllComputationVariables();
    this.cronClearControls();
    this.computationClearControls();
  }

  getAllCronJobs(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllCronJobs().subscribe((response: any) => {
      this.cronList = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllComputationVariables(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllComputationVariables().subscribe((response: any) => {
      this.computationList = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

 
  cronClearControls() {
    this.selectedId = null;
    this.cronForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
      cronNature: ['', Validators.required],
    });
  }

  computationClearControls() {
    this.selectedComputationId = null;
    this.computationForm = this.fb.group({
      vat: ['', Validators.required],
      wht: ['', Validators.required],
      commissionPayable: ['', Validators.required],
      commissionPayableLimit: ['', Validators.required],
      commissionRateExternal: ['', Validators.required],
      recoveredAmountBelow: ['', Validators.required],
      commissionRateExternal2: ['', Validators.required],
      recoveredAmountAbove: ['', Validators.required],
      recoveredAmountExternalAbove: ['', Validators.required],
      recoveredAmountExternalBelow: ['', Validators.required],
    });
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.cronClearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }

  editCron(row) {
    this.entityName = "Edit Cron Job Setup";
    this.selectedId = row.cronJobId;
    this.cronForm = this.fb.group({
      startDate:  new Date(row.startDate),
      startTime: [row.startTime],
      endDate: new Date(row.endDate),
      endTime: [row.endTime],
      cronNature: [row.cronNature],
    });
    this.cronDisplayAddModal = true;
  }

  editComputation(row) {
    this.entityName = "Edit Computation Variables Setup";
    this.selectedComputationId = row.computationVariableId;
    this.computationForm = this.fb.group({
      vat: [row.vat],
      wht: [row.wht],
      commissionPayable: [row.commissionPayable],
      commissionPayableLimit: [row.commissionPayableLimit],
      commissionRateExternal: [row.commissionRateExternal],
      recoveredAmountBelow: [row.recoveredAmountBelow],
      commissionRateExternal2: [row.commissionRateExternal2],
      recoveredAmountAbove: [row.recoveredAmountAbove],
      recoveredAmountExternalAbove: [row.recoveredAmountExternalAbove],
      recoveredAmountExternalBelow: [row.recoveredAmountExternalBelow],
    });
    this.computationDisplayAddModal = true;
  }

	addNewCronJob() {
		this.entityName = "New Cron Job Setup";
		this.cronClearControls();
		this.cronDisplayAddModal = true;
	}

  addComputation() {
		this.entityName = "New Computation Setup";
		this.computationClearControls();
		this.computationDisplayAddModal = true;
	}

	submitFormCronJob(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (!(this.selectedId > 0)) {
		this.LimitMaintenanceService.addRetailCollectionCronJob(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllCronJobs();
			this.cronDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateRetailCollectionCronJob(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllCronJobs();
			this.cronDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
	}

  submitFormComputation(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (this.selectedComputationId == null) {
		this.LimitMaintenanceService.addRetailCollectionComputationVariables(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedComputationId = null;
			this.finishGood(res.message);
			this.getAllComputationVariables();
			this.computationDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateRetailCollectionComputationVariables(bodyObj, this.selectedComputationId).subscribe((res) => {
			if (res.success == true) {
			this.selectedComputationId = null;
			this.finishGood(res.message);
			this.getAllComputationVariables();
			this.computationDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
	}

	deleteCron(row) {
    const __this = this;
    swal({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
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
      __this.LimitMaintenanceService.deleteRetailCollectionCronJob(row.cronJobId).subscribe((res) => {
		if (res.success == true) {
			__this.finishGood(res.message);
			__this.getAllCronJobs();
		} else {
			__this.finishBad(res.message);
		}
		}, (err: any) => {
      __this.finishBad(JSON.stringify(err));
		});
  }, function (dismiss) {
    if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
});
	}

  deleteComputation(row) {
    const __this = this; 
    swal({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
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
      __this.LimitMaintenanceService.deleteRetailCollectionComputationVariables(row.computationVariableId).subscribe((res) => {
		if (res.success == true) {
			__this.finishGood(res.message);
			__this.getAllComputationVariables();
		} else {
			__this.finishBad(res.message);
		}
		}, (err: any) => {
      __this.finishBad(JSON.stringify(err));
		});
  }, function (dismiss) {
    if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
    }
});
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