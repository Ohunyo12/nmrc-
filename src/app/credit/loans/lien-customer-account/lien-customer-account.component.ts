import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { CasaService } from 'app/customer/services/casa.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-lien-customer-account',
  templateUrl: './lien-customer-account.component.html'
})
export class LienCustomerAccountComponent implements OnInit {

  stagingSearch: string;
  customerAccountData: any[];
  customerSelection: any;
  activeIndex: number;
  showSubmitModal: boolean = false;
  casaLienForm: FormGroup;
  casaLienTypes: any[];
  isLienPresent: boolean = false;
  sourceReferenceNumber: any;
  casaAccountId: any;
  casaAccountLoans: any;
  casaAccountLienData: any[];
  selectedCasaLien: any;
  accountNumber: any;
  lienReferenceNumber: any;


  constructor(private fb: FormBuilder, 
              private loadingService: LoadingService, 
              private casaService: CasaService) { }

  ngOnInit() {
    this.loadCasaForm();
    this.getAllCasaLienTypes();
  }

  loadCasaForm() {
    this.casaLienForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      lienTypeId: ['', Validators.required],
      loanId: ['', Validators.required],      
    });
}

  submitTabChange(event) {
    this.activeIndex = event.index;
  }

  getAllCasaLoans(casaAccountId: number) {
    this.loadingService.show();
    this.casaService.getAllCasaLoans(casaAccountId).subscribe(response => {
      if (response.success == true) {
        if (response.result == []) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
        }
        
        this.casaAccountLoans = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
      this.loadingService.hide();
    });
  }

  getAllCasaLiens(accountNumber: string) {
    this.loadingService.show();
    this.casaService.getAllCasaLiens(accountNumber).subscribe(response => {
      if (response.success == true) {
        this.casaAccountLienData = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
      this.loadingService.hide();
    });
  }

  getAllCasaLienTypes() {
    this.loadingService.show();
    this.casaService.getAllCasaLienTypes().subscribe(response => {
      if (response.success == true) {
        this.casaLienTypes = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
      this.loadingService.hide();
    });
  }


  searchCustomerCasaLien(accountNumber: string) {
    this.loadingService.show();
    this.casaService.searchCustomerCasaLien(accountNumber).subscribe(response => {
      this.loadingService.hide();
      this.stagingSearch = null;
      if (response.success == true) {
        this.customerAccountData = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
      }
    });
  }

  onSelectedChanged(row) {
    this.showSubmitModal = true;
    this.customerSelection = row.data;
    this.casaAccountId = this.customerSelection.casaAccountId;
    this.accountNumber = this.customerSelection.productAccountNumber;
    this.sourceReferenceNumber = this.customerSelection.sourceReferenceNumber;
    const casaLoanControl = this.casaLienForm.get('loanId');
    this.getAllCasaLiens(this.accountNumber);

    // if (this.customerSelection.lienAmount > 0) {
    //   this.isLienPresent = true;
    // }

    if (this.sourceReferenceNumber != null) {
      casaLoanControl.clearValidators();
    }
    else {
      casaLoanControl.setValidators(Validators.required);
    }

    casaLoanControl.updateValueAndValidity();
    // console.log(row.data);
  }

  onCasaLienSelectedChanged(row) {
    this.selectedCasaLien = row.data;
    this.isLienPresent = true;
    this.lienReferenceNumber = this.selectedCasaLien.lienReferenceNumber;

  }

  submitCasaLien(casaLienForm) {
    let body = {
      description: casaLienForm.value.description,
      lienAmount: casaLienForm.value.amount,
      lienTypeId: casaLienForm.value.lienTypeId,
      lienReferenceNumber: this.customerSelection.lienReferenceNumber,
      productAccountNumber: this.customerSelection.productAccountNumber,
      sourceReferenceNumber: this.sourceReferenceNumber != null ? this.sourceReferenceNumber : this.casaAccountLoans.filter(x => x.loanId == casaLienForm.value.loanId)[0].loanReferenceNumber
    }

    // if (this.sourceReferenceNumber != null) {
    //   body.sourceReferenceNumber = this.sourceReferenceNumber;
    // }
    // else {
    //   body.sourceReferenceNumber = this.casaAccountLoans.filter(x => x.loanId == casaLienForm.value.loanId)[0].loanReferenceNumber;
    // }

    this.loadingService.show();
    this.casaService.addCasaLien(body).subscribe(response => {
      this.loadingService.hide();

      if (response.success == true) {
        // this.activeIndex = 2;
        // this.getAllCasaLiens(this.accountNumber);
        this.loadCasaForm();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
      
      this.showSubmitModal = false;
    });
  }

  removeCasaLien() {
    let body = {
      lienReferenceNumber: this.lienReferenceNumber,
    }

    this.loadingService.show();
    this.casaService.removeCasaLien(body).subscribe(response => {
      this.loadingService.hide();
      if (response.success == true) {
        this.getAllCasaLiens(this.accountNumber);
        this.selectedCasaLien = null;
        this.isLienPresent = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });
  }

  onLienTypeChange() {
    if (this.sourceReferenceNumber == null) {
      this.getAllCasaLoans(this.casaAccountId);
    }
  }

}
