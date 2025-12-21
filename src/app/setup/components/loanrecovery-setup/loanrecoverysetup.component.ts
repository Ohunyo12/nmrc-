import { LoanRecoverySetupService } from '../../services/loan-recovery-setup.service';
//import { LoanRecoverySetupService } from 'app/setup/services/';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loanrecoverysetup',
  templateUrl: './loanrecoverysetup.component.html',
})
export class LoanRecoverySetupComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New LoanRecoverySetup";
  loanRecoverySetupForm: FormGroup;
  productTypes: any[];
  casas: any[];
  agents: any[];
  loanRecoverySetups: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    // private branchService: BranchService,
    private loanRecoverySetupService: LoanRecoverySetupService) { }

  ngOnInit() {
    this.GetAllProductType();
    this.getAllLoanRecoverySetup();
    this.GetAllCasa();
    this.GetAllAgent();
    this.clearControls();

  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New LoanRecoverySetup";
    this.displayAddModal = true;
  }

  GetAllProductType(): void {
    this.loadingService.show();
    this.loanRecoverySetupService.GetAllProductType().subscribe((response: any) => {
      this.productTypes = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


  GetAllCasa(): void {
    this.loadingService.show();
    this.loanRecoverySetupService.GetAllCasa().subscribe((response: any) => {
      this.casas = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


  GetAllAgent(): void {
    this.loadingService.show();
    this.loanRecoverySetupService.GetAllAgent().subscribe((response: any) => {
      this.agents = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


  getAllLoanRecoverySetup(): void {
    this.loadingService.show();
    this.loanRecoverySetupService.getAllLoanRecoverySetups().subscribe((response: any) => {
      this.loanRecoverySetups = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editLoanRecoverySetup(index) {
    this.entityName = "Edit LoanRecoverySetup";
    var row = this.loanRecoverySetups[index];
    try {
      this.loanRecoverySetupForm.controls['recoveryPlanId'].setValue(null);
    } catch (error) {
    }
    this.selectedId = row.recoveryPlanId;
    this.loanRecoverySetupForm = this.fb.group({
      loanId: [row.loanId],
      productTypeId: [row.productTypeId],
      casaAccountId: [row.casaAccountId],
      agentId: [row.agentId],
      amountOwed: [row.amountOwed, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      writeOffAmount: [row.writeOffAmount, [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      recoveryPlanId: [row.recoveryPlanId],

    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.loanRecoverySetupService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllLoanRecoverySetup();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.loanRecoverySetupService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllLoanRecoverySetup();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  clearControls() {
    this.selectedId = null;
    try {
      this.loanRecoverySetupForm.controls['recoveryPlanId'].setValue(null);
    } catch (error) {
    }
    this.loanRecoverySetupForm = this.fb.group({
      loanId: ['', Validators.required],
      productTypeId: ['', Validators.required],
      casaAccountId: ['', Validators.required],
      agentId: ['', Validators.required],
      amountOwed: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      writeOffAmount: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      recoveryPlanId: ['', Validators.required],
    });
  }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, 'success', "FintrakBanking");
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
