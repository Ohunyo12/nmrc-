import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LimitMaintenanceService } from '../../services/limit-maintenance.service';
import { CurrencyService } from 'app/setup/services';
//import { LimitMaintenanceService } from 'app/setup/services/';

@Component({
  selector: 'app-limitmaintenance',
  templateUrl: './limitmaintenance.component.html',
})
export class LimitMaintenanceComponent implements OnInit {
  selectedId: number = null;
  currencyLimitId: number = null;
  groupLimitId: number = null;
  riskRatingId = 0;
  branchDisplayAddModal: boolean = false;
  companyDisplayAddModal: boolean = false;
  obligorDisplayAddModal: boolean = false;
  sectorDisplayAddModal: boolean = false;
  globalSectorDisplayAddModal: boolean = false;
  entityName: string = "New MonitoringSetup";
  branchLimitForm: FormGroup;
  companyLimitForm: FormGroup;
  obligorLimitForm: FormGroup;
  sectorLimitForm: FormGroup;
  globalSectorLimitForm: FormGroup;
  singleObligorLimitForm: FormGroup;
  currencyLimitForm: FormGroup;
  groupLimitForm: FormGroup;
  messageTypes: any[];
  products: any[];
  branchLimits: any[];
  companyLimits: any;
  obligorLimits: any[];
  sectorLimits: any[];
  globalSectorLimits: any[];
  currencyLimits: any[];
  groupLimits: any[];
  currencies: any[];
  currencyDisplayAddModal: boolean = false;
  groupDisplayAddModal: boolean = false;
  show: boolean = false; message: any; title: any; cssClass: any;
  singleObligorLimitModal: boolean;
  shareHolderFund: any;
  singleObligorValue: number;
  companyId: any;
  singleObligorLimit = [];
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private currencyService: CurrencyService,
    // private branchService: BranchService,
    private LimitMaintenanceService: LimitMaintenanceService) { }

  ngOnInit() {
    this.getAllBranchLimits();
    this.getAllCompanyLimits();
    this.getAllSectorLimits();
    this.getAllObligorLimits();
    this.getAllCurrencyLimits();
    this.getAllGroupLimits();
    this.getProductCurrencies();
    this.branchLimitsClearControls();
    this.companyLimitsClearControls();
    this.sectorLimitsClearControls();
    this.obligorLimitsClearControls();
    this.singleObligorClearControls();
    this.currencyLimitsClearControls();
    this.groupLimitsClearControls();
    this.getAllGlobalSectorLimits();
    this.globalSectorLimitsClearControls();
  }

  showBranchAddModal() {
    this.branchLimitsClearControls();
    this.entityName = "Branch Limit";
    this.branchDisplayAddModal = true;
  }

  showCompanyAddModal() {
    this.companyLimitsClearControls();
    this.entityName = "Company Limit";
    this.companyDisplayAddModal = true;
  }

  showObligorAddModal() {
    this.companyLimitsClearControls();
    this.entityName = "Obligor Limit";
    this.obligorDisplayAddModal = true;
  }

  showSectorAddModal() {
    this.sectorLimitsClearControls();
    this.entityName = "sectorLimits";
    this.sectorDisplayAddModal = true;
  }

  getAllBranchLimits(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllBranchLimits().subscribe((response) => {
      this.branchLimits = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllCompanyLimits(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllCompanyLimits().subscribe((response) => {
      this.companyLimits = response.result;
      this.shareHolderFund = this.companyLimits[0].shareHoldersFund;
      this.companyId = this.companyLimits[0].companyId;
      this.PopulateSingleObligorLimit(this.companyLimits[0]);
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  PopulateSingleObligorLimit(companyLimits) {
    var calclulatedObligorPercent = ((+companyLimits.singleObligorLimit) * 100) / +companyLimits.shareHoldersFund;
    this.singleObligorLimit = [{

      obligorLimit: companyLimits.singleObligorLimit,
      obligorPerecent: calclulatedObligorPercent,
    }];
  }

  getAllObligorLimits(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllObligorLimits().subscribe((response) => {
      this.obligorLimits = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getAllSectorLimits(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllSectorLimits().subscribe((response) => {
      this.sectorLimits = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAllGlobalSectorLimits(): void {
    this.loadingService.show();
    this.LimitMaintenanceService.getAllGlobalSectorLimits().subscribe((response) => {
      this.globalSectorLimits = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editBranchLimit(row) {
    this.entityName = "Edit BranchLimit";
    ////console.log('yes', row)
    try {
      this.branchLimitForm.controls['branchId'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.selectedId = row.branchId;
    this.branchLimitForm = this.fb.group({
      branchCode: [row.branchCode],
      branchName: [row.branchName],
      branchLimit: [row.branchLimit]

    });
    this.branchDisplayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value; {
      this.LimitMaintenanceService.updateBranchLimits(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllBranchLimits();
          this.branchDisplayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  branchLimitsClearControls() {
    this.selectedId = null;
    try {
      this.branchLimitForm.controls['branchId'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.branchLimitForm = this.fb.group({
      branchCode: ['', Validators.required],
      branchName: ['', Validators.required],
      branchLimit: ['', Validators.required],
    });
  }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.branchLimitsClearControls();
    this.companyLimitsClearControls();
    this.currencyLimitsClearControls();
    this.groupLimitsClearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
  }



  editCompanyLimits(index) {
    this.entityName = "Edit Company Limit";
    var row = this.companyLimits[index];
    ////console.log('yes', row)
    try {
      this.companyLimitForm.controls['companyId'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.selectedId = row.companyId;
    this.companyLimitForm = this.fb.group({
      companyName: [row.companyName],
      shareHoldersFund: [row.shareHoldersFund],
      companyLimit: [row.companyLimit]

    });
    this.companyDisplayAddModal = true;
  }
  submitFormCompanyLimits(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value; {
      this.LimitMaintenanceService.updateCompanyLimits(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllCompanyLimits();
          this.companyDisplayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  companyLimitsClearControls() {
    this.selectedId = null;
    try {
      this.companyLimitForm.controls['companyId'].setValue(null);
    } catch (error) {
      ////console.log('The system resolved a form-control error');
    }
    this.companyLimitForm = this.fb.group({
      companyName: ['', Validators.required],
      shareHoldersFund: ['', Validators.required],
      companyLimit: ['', Validators.required],
    });
  }

	addNewSector() {
		this.entityName = "New Sector Limit";
		this.sectorLimitsClearControls();
		this.sectorDisplayAddModal = true;
	}

	editSectorLimits(index) {
		this.entityName = "Edit Sector Limit";
		var row = this.sectorLimits[index];
		////console.log('no', row)
		try {
		this.sectorLimitForm.controls['sectorId'].setValue(null);
		} catch (error) {
		////console.log('The system resolved a form-control error');
		}
		this.selectedId = row.sectorId;
		this.sectorLimitForm = this.fb.group({
		sectorCode: [row.sectorCode],
		sectorName: [row.sectorName],
		sectorLimit: [row.sectorLimit]

		});
		this.sectorDisplayAddModal = true;
	}




  editGlobalSectorLimits(row) {
		this.entityName = "Edit Global Sector Limit";
		this.selectedId = row.id;
		this.globalSectorLimitForm = this.fb.group({
      percentageSectorLimit: [row.percentageSectorLimit]
		});
		this.globalSectorDisplayAddModal = true;
	}


	submitFormSectorLimits(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		if (!(this.selectedId > 0)) {
		this.LimitMaintenanceService.addSector(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllSectorLimits();
			this.sectorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}else{
		this.LimitMaintenanceService.updateSectorLimits(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.selectedId = null;
			this.finishGood(res.message);
			this.getAllSectorLimits();
			this.sectorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
	}



  submitFormGlobalSectorLimits(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		this.LimitMaintenanceService.updateGlobalSectorLimits(bodyObj, this.selectedId).subscribe((res) => {
			if (res.success == true) {
			this.finishGood(res.message);
			this.getAllGlobalSectorLimits();
      this.selectedId = null;
			this.globalSectorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		
	}

	deleteSector(row) {
		this.LimitMaintenanceService.deleteSector(row.sectorId).subscribe((res) => {
		if (res.success == true) {
			this.finishGood(res.message);
			this.getAllSectorLimits();
		} else {
			this.finishBad(res.message);
		}
		}, (err: any) => {
		this.finishBad(JSON.stringify(err));
		});
	}

	sectorLimitsClearControls() {
		this.selectedId = null;
		try {
		this.sectorLimitForm.controls['sectorId'].setValue(null);
		} catch (error) {
		////console.log('The system resolved a form-control error');
		}
		this.sectorLimitForm = this.fb.group({
		sectorCode: ['', Validators.required],
		sectorName: ['', Validators.required],
		sectorLimit: ['', Validators.required],
		});
	}

  globalSectorLimitsClearControls() {
		this.selectedId = null;
		this.globalSectorLimitForm = this.fb.group({
    percentageSectorLimit: ['', Validators.required],
		});
	}

	obligorLimitsClearControls() {
		this.riskRatingId = 0;
		this.obligorLimitForm = this.fb.group({
		riskRatingId: 0,
		riskRating: '',
		description: '',
		isInvestmentGrade: false,
		maxShareholderPercentage: ''
		});
  }
  
  currencyLimitsClearControls() {
		this.currencyLimitForm = this.fb.group({
      currencyLimitValue: ['', Validators.required],
      currencyLimitName: ['', Validators.required],
      description: [''],
		});
  }
  
  groupLimitsClearControls() {
		this.groupLimitForm = this.fb.group({
      groupName: ['', Validators.required],
      groupLimit: ['', Validators.required],
      limitNumber: ['', Validators.required],
      description: [''],
		});
	}

	addCurrencyLimit() {
		this.entityName = "New Currency Limit";
		this.currencyLimitsClearControls();
		this.currencyDisplayAddModal = true;
  }
  
  addGroupLimit() {
		this.entityName = "New Group Limit";
		this.groupLimitsClearControls();
		this.groupDisplayAddModal = true;
  }
  
  getProductCurrencies(): void {
    this.currencyService.getAllCurrencies().subscribe((data) => {
        this.currencies = data.result;
    });
}

  addObligorLimit() {
		this.entityName = "New Obligor Limit";
		this.obligorLimitsClearControls();
		this.obligorDisplayAddModal = true;
	}

	editObligorLimits(index, event) {
		event.preventDefault();
		this.entityName = "Edit Obligor Risk Rating";
		const row = index;
		this.riskRatingId = row.riskRatingId;
		this.obligorLimitForm = this.fb.group({
		riskRatingId: [row.riskRatingId],
		riskRating: [row.riskRating],
		description: [row.description],
		isInvestmentGrade: [row.isInvestmentGrade],
		maxShareholderPercentage: [row.maxShareholderPercentage]
		});
		this.obligorDisplayAddModal = true;
  }
  
  editCurrencyLimits(index, event) {
		event.preventDefault();
		this.entityName = "Edit Currency Limit";
		const row = index;
		this.currencyLimitId = index.currencyLimitId;
		this.currencyLimitForm = this.fb.group({
    currencyLimitValue: [row.currencyLimitValue],
    currencyLimitName: [row.currencyLimitName],
    description: [row.description],
		});
		this.currencyDisplayAddModal = true;
  }

  editGroupLimits(index, event) {
		event.preventDefault();
		this.entityName = "Edit Group Limit";
		const row = index;
		this.groupLimitId = index.groupLimitId;
		this.groupLimitForm = this.fb.group({
    groupName: [row.groupName],
    groupLimit: [row.groupLimitValue],
    description: [row.description],
    limitNumber: [row.limitNumber]
		});
		this.groupDisplayAddModal = true;
  }

	submitFormObligorLimits(formObj) {
		this.loadingService.show();
		const bodyObj = formObj.value; 
		{
		this.LimitMaintenanceService.addUpdateObligorLimits(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.finishGood(res.message);
			this.getAllObligorLimits();
			this.obligorDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
	}

	deleteObligor(row) {
		this.LimitMaintenanceService.deleteObligor(row.riskRatingId).subscribe((res) => {
		if (res.success == true) {
			this.finishGood(res.message);
			this.getAllObligorLimits();
		} else {
			this.finishBad(res.message);
		}
		}, (err: any) => {
		this.finishBad(JSON.stringify(err));
		});
  }
  
  deleteCurrencyLimit(row) {
		this.LimitMaintenanceService.deleteCurrencyLimit(row.currencyLimitId).subscribe((res) => {
		if (res.success == true) {
			this.finishGood(res.message);
			this.getAllCurrencyLimits();
		} else {
			this.finishBad(res.message);
		}
		}, (err: any) => {
		this.finishBad(JSON.stringify(err));
		});
  }
  
  deleteGroupLimit(row) {
		this.LimitMaintenanceService.deleteGroupLimit(row.groupLimitId).subscribe((res) => {
		if (res.success == true) {
			this.finishGood(res.message);
			this.getAllCurrencyLimits();
		} else {
			this.finishBad(res.message);
		}
		}, (err: any) => {
		this.finishBad(JSON.stringify(err));
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

  singleObligorClearControls() {
    this.selectedId = null;
    
    this.singleObligorLimitForm = this.fb.group({
      obligorLimitValue: ['', Validators.required],
      obligorLimitPercent: ['', Validators.required],
    });
  }

  editObligorLimit(index, event){
    event.preventDefault();
    this.entityName = "Edit Obligor Limit";
    this.singleObligorLimitForm = this.fb.group({
      obligorLimitValue: [index.obligorLimit],
      obligorLimitPercent: [index.obligorPerecent],
      limitNumber: [index.limitNumber],
    });
    this.singleObligorLimitModal = true;

  }

  updateObligorLimitValue() {
    var value = this.singleObligorLimitForm.controls['obligorLimitPercent'].value;
    this.singleObligorValue = (+(value) * +(this.shareHolderFund)) / 100;
    this.singleObligorLimitForm.controls['obligorLimitValue'].setValue(this.singleObligorValue);
  }

  submitObligorLimtForm(singleObligorLimitForm) {
  var body = {
    singleObligorLimit: singleObligorLimitForm.value.obligorLimitValue,
  };

  this.LimitMaintenanceService.updateSingleObligorLimits(body, this.companyId).subscribe((res) => {
		if (res.success == true) {
      this.finishGood(res.message);
      this.singleObligorLimitModal = false;
			this.getAllCompanyLimits();
		} else {
			this.finishBad(res.message);
		}
		}, (err: any) => {
		this.finishBad(JSON.stringify(err));
		});
  }


  submitCurrencyLimtForm(currencyLimitForm) {
    this.loadingService.show();
    var bodyObj = {
      currencyLimitName: currencyLimitForm.value.currencyLimitName,
      currencyLimitValue: currencyLimitForm.value.currencyLimitValue,
      description: currencyLimitForm.value.description,
    };
    
   if(this.currencyLimitId == null){
    this.LimitMaintenanceService.addCurrencyLimits(bodyObj).subscribe((res) => {
			if (res.success == true) {
			this.finishGood(res.message);
			this.getAllCurrencyLimits();
			this.currencyDisplayAddModal = false;
			} else {
			this.finishBad(res.message);
			}
		}, (err: any) => {
			this.finishBad(JSON.stringify(err));
		});
		}
   else{
      this.LimitMaintenanceService.updateCurrencyLimits(bodyObj, this.currencyLimitId).subscribe((res) => {
      if (res.success == true) {
        this.finishGood(res.message);
        this.currencyDisplayAddModal = false;
        this.loadingService.hide();
        this.getAllCurrencyLimits();
      } else {
        this.finishBad(res.message);
      }
      }, (err: any) => {
      this.finishBad(JSON.stringify(err));
      });
    }
  }

    getAllCurrencyLimits(): void {
      this.loadingService.show();
      this.LimitMaintenanceService.getAllCurrencyLimits().subscribe((response) => {
        this.currencyLimits = response.result;
        this.loadingService.hide();
      }, (err) => {
        this.loadingService.hide(1000);
      });
    }

    submitGroupLimtForm(groupLimitForm) {
      this.loadingService.show();
      var bodyObj = {
        groupName: groupLimitForm.value.groupName,
        groupLimitValue: groupLimitForm.value.groupLimit,
        description: groupLimitForm.value.description,
        limitNumber: groupLimitForm.value.limitNumber
      };
     if(this.groupLimitId == null){
      this.LimitMaintenanceService.addGroupLimits(bodyObj).subscribe((res) => {
        if (res.success == true) {
        this.finishGood(res.message);
        this.getAllGroupLimits();
        this.groupDisplayAddModal = false;
        } else {
        this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
      }
     else
        this.LimitMaintenanceService.updateGroupLimits(bodyObj, this.groupLimitId).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.groupDisplayAddModal = false;
          this.loadingService.hide();
          this.getAllGroupLimits();
        } else {
          this.finishBad(res.message);
        }
        }, (err: any) => {
        this.finishBad(JSON.stringify(err));
        });
      }
  
      getAllGroupLimits(): void {
        this.loadingService.show();
        this.LimitMaintenanceService.getAllGroupLimits().subscribe((response) => {
          this.groupLimits = response.result;
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }

}
