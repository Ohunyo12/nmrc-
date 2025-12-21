import { ValidationService } from '../../../shared/services/validation.service';
import { CountryStateService } from '../../services/state-country.service';
import { AccreditedConsultantsService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accredited-principals',
  templateUrl: './accredited-principals.component.html',
})
export class AccreditedPrincipalsComponent implements OnInit {

  principals: any[]; // <----?
  cities: any[];
  countries: any[];
  displayForm: boolean = false;
  entityName: string = 'New Solicitor Information';
  principalsForm: FormGroup;
  show: boolean = false; message: any; title: any; cssClass: any; // message box
  selectedId: number = null;
  constructor(
    private loadingService: LoadingService, private fb: FormBuilder,
    private accreditedConsultantsService: AccreditedConsultantsService, private countryStateSrv: CountryStateService
  ) { }

  ngOnInit() {
    this.getCities();
    this.getCountries();
    this.getAllPrincipals();
    this.clearControls();
  }
  getAllPrincipals(): void {
    this.loadingService.show();
    this.accreditedConsultantsService.getPrincipals().subscribe((response: any) => { // <----?
      this.principals = response.result; // <----?
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getCities() {
    this.countryStateSrv.getAllCities()
      .subscribe((response: any) => {
        this.cities = response.result;
      });
  }
  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response: any) => {
        this.countries = response.result;
      });
  }
  showForm() {
    this.clearControls();
    this.entityName = 'New Principal Information';
    this.displayForm = true;
  }

  clearControls() {
    this.selectedId = null;
    this.principalsForm = this.fb.group({
      principalsId: [0],
      principalsRegNumber: ['', Validators.required],
      name: ['', Validators.required],
      cityId: [''],
      countryId: [''],
      accountNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      principalsBVN: ['', [ Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
      address: [''],
    });
  }

  editPrincipal(index) {
    this.entityName = "Edit Principal Information"
    var row = this.principals[index];
    this.selectedId = row.principalsId; // <----?
    this.principalsForm = this.fb.group({
      principalsId: [row.principalsId, Validators.required],
      principalsRegNumber: [row.principalsRegNumber, Validators.required],
      name: [row.name],
      cityId: [row.cityId],
      countryId: [row.countryId],
      accountNumber: [row.accountNumber, Validators.required],
      principalsBVN: [row.principalsBVN],
      emailAddress: [row.emailAddress, Validators.compose([Validators.required, ValidationService.isEmail])],
      phoneNumber: [row.phoneNumber],
      address: [row.address],
    });
    this.displayForm = true;
  }

  submitForm(form) {
    this.loadingService.show();
    let body = form.value;
    if (this.selectedId === null) {
      this.accreditedConsultantsService.savePrincipals(body).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllPrincipals();
          this.displayForm = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.accreditedConsultantsService.updatePrincipals(body, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllPrincipals();
          this.selectedId = null;
          this.displayForm = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }

  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    // this.clearControls();
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
