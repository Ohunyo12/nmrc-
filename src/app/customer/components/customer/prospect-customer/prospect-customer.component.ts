import { FormGroup, FormBuilder } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-prospect-customer',
  templateUrl: './prospect-customer.component.html',
})
export class ProspectCustomerComponent implements OnInit {
  selectedCustomer: any = {};
  customerId: number = null;
  finalCustomerId: number = null;
  displaySearchModal: boolean = false;
  stagingSearch: string;
  searchResults: any[];
  displayProspects: boolean = false;
  displayProspectDetails: boolean = false;
  prospectCustomers: any[];
  filteredProspectCustomers: any[] = [];
  prospectCustomerSelection: any = {};
  prospectCustomerSelectionCode: any;
  prospectFullName: string;
  propspectCustomerForm: FormGroup;
  customerTypes: any[];
  isCorporate: boolean = false;
  isProspectConversion: boolean = true;


  _filterProspect = '';
  get filterProspect(): string {
    return this._filterProspect;
  }
  set filterProspect(value: string) {
    this._filterProspect = value;
    this.filteredProspectCustomers = this.filterProspect ? this.performFilter(this.filterProspect) : this.prospectCustomers;
  }

  constructor(private loadingService: LoadingService,
    private customerService: CustomerService,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.displayProspects = true;
    this.getAllProspectCustomer();
    this.initialiseControl();
  }
  initialiseControl() {
    this.propspectCustomerForm = this.fb.group({
      customerCode: [''],
      prospectCode: [''],
      customerTypeId: [''],
      prospectTypeId: [''],
      firstName: [''],
      middleName: [''],
      lastName: [''],
      prospectFirstName: [''],
      prospectMiddleName: [''],
      prospectLastName: [''],
    });
  }
  getAllProspectCustomer() {
    this.loadingService.show();
    this.customerService.getAllProspectCustomer().subscribe(response => {
      this.loadingService.hide();
      this.prospectCustomers = response.result;
      this.filteredProspectCustomers = response.result;
    });
    this.customerService.getAllCustomerTypes().subscribe((response) => {
      this.customerTypes = response.result;
    });
  }

  searchCustomerWithAccountNumber(accountNumber, isProspectConversion) {
    this.loadingService.show();
    this.customerService.searchCustomerStagingRealtime(accountNumber, isProspectConversion).subscribe(response => {
      this.loadingService.hide();
      if (response.success == true) {
        this.searchResults = response.result;
      } else {
        // Merge duplicate customer records
        if (response.message.toLowerCase().includes('account number is already attached')) {
          this.mergeDuplicateCustomers(accountNumber);
        }
        else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');
        }

        this.prospectCustomerSelection = null;
      }
    });
  }

  mergeDuplicateCustomers(accountNumber) {
    const __this = this;

    swal({
      title: 'There are duplicate records for the customer on Credit360!',
      text: 'Do you want to merge them?',
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
      __this.customerService.mergeDuplicateCustomers(accountNumber, __this.prospectCustomerSelectionCode).subscribe(response => {
        __this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');

        // if (response.success == true) {
        // }
      });

    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  selectedSearchCustomer(selected) {
    this.prospectCustomerSelection = selected;

    
    this.initialiseControl();
    this.prospectFullName = this.prospectCustomerSelection.customerName;
    this.customerId = this.finalCustomerId;
    this.selectedCustomer = selected;
    this.ValidateNewCustomer(selected.customerCode);
    this.propspectCustomerForm.get('firstName').setValue(selected.firstName);
    this.propspectCustomerForm.get('middleName').setValue(selected.middleName);
    this.propspectCustomerForm.get('lastName').setValue(selected.lastName);
    this.propspectCustomerForm.get('customerCode').setValue(selected.customerCode);
    this.propspectCustomerForm.get('customerTypeId').setValue(selected.customerTypeId);

    this.propspectCustomerForm.get('prospectFirstName').setValue(this.prospectCustomerSelection.firstName);
    this.propspectCustomerForm.get('prospectMiddleName').setValue(this.prospectCustomerSelection.middleName);
    this.propspectCustomerForm.get('prospectLastName').setValue(this.prospectCustomerSelection.lastName);
    this.propspectCustomerForm.get('prospectCode').setValue(this.prospectCustomerSelection.customerCode);
    this.propspectCustomerForm.get('prospectTypeId').setValue(this.prospectCustomerSelection.customerTypeId);
    selected.customerTypeId == 2 ? this.isCorporate = true : this.isCorporate = false
    this.displaySearchModal = false;
    this.displayProspects = false;
    this.displayProspectDetails = true;
  }
  ValidateNewCustomer(customerCode) {
    this.loadingService.show();
    this.customerService.ValidateNewCustomer(customerCode).subscribe((response) => {
      this.loadingService.hide();
      if (response.success == true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
        this.displaySearchModal = false;
        this.displayProspects = true;
      }
    });
  }

  onSelectedProspectChanged(row) {
    this.prospectCustomerSelection = row.data;
    this.finalCustomerId = row.data.customerId;
    this.prospectCustomerSelectionCode = row.data.customerCode;
    this.displaySearchModal = true;
  }

  searchList(searchTerm) {
    this.prospectCustomers = this.prospectCustomers.filter(x => x.fff == searchTerm);
  }
  colseSearchModal() {
    this.displaySearchModal = false;
  }
  backToList() {
    this.prospectCustomerSelection = null;
    this.displaySearchModal = false;
    this.displayProspectDetails = false;
    this.displayProspects = true;
  }
  submitUpdateProspectDetails(formObj) {
    if (this.selectedCustomer.customerTypeId != this.prospectCustomerSelection.customerTypeId) {
      swal(`${GlobalConfig.APPLICATION_NAME}`, 'Prospect customer type not the same as Flexcube customer type.', 'error');
      return;
    }
    this.loadingService.show();
    const bodyObj = formObj.value;
    let body = {
      customerId: this.customerId,
      customerCode: bodyObj.customerCode,
      customerTypeId: bodyObj.customerTypeId,
      firstName: bodyObj.firstName,
      middleName: bodyObj.middleName,
      lastName: bodyObj.lastName,
    }
    this.customerService.updateProspectToCustomer(body, this.customerId).subscribe((response) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getAllProspectCustomer();
        this.prospectCustomerSelection = null;
        this.displaySearchModal = false;
        this.displayProspectDetails = false;
        this.displayProspects = true;
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
    });
  }
  performFilter(filterBy: string) {
    filterBy = filterBy.toLocaleLowerCase();
    return this.prospectCustomers.filter((prospect) =>
      prospect.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
      prospect.customerCode.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
}
