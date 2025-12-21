import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidationService } from '../../../shared/services/validation.service';
import { GeneralSetupService } from '../../../setup/services';
import { CompanyService } from '../../../setup/services/company.service';
import { CountryStateService } from '../../../setup/services/state-country.service';
// import { CustomerService } from '/../../../services/customer.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { CustomerService } from 'app/customer/services/customer.service';

@Component({
  selector: 'app-related-employer',
  templateUrl: './related-employer.component.html',
  styleUrls: ['./related-employer.component.scss']
})
export class RelatedEmployerComponent implements OnInit {
  displayRelatedEmployerForm: boolean = false;
  relatedEmployers: any[] = [];
  customerEmploymentHistoryForm: FormGroup;
  csForwardForm: FormGroup;
  customerId: any;
  selfEmployed: boolean;
  otherEmployer: boolean;
  employerName: string;
  activeCountry: boolean;
  selfEmployedCheck: boolean;
  states: any;
  countries: any;
  employerSubTypes: any;
  cities: any;
  showCsForward: boolean;
  selectedEmployerId: any;
  vote: number;
  forwardAction: number;
  defaultCities: any;

  constructor(private loadingService: LoadingService,
    private validationService: ValidationService,
    private fb: FormBuilder,
    private genSetupServ: GeneralSetupService,
    private companyService: CompanyService,
    private countryStateSrv: CountryStateService,
    private customerService: CustomerService,) { }

  ngOnInit() {
    this.loadingService.show();
    this.loadEmploymentHistoryForm();
    this.getStates();
    this.getCountries();
    this.getAllEmployerSubTypes();
    this.loadForwardForm();
    this.getCities();
    this.getAllLoginCompany();
    this.getAllPendingEmployers();
    this.loadingService.hide();
  }

  loadEmploymentHistoryForm() {
    this.customerEmploymentHistoryForm = this.fb.group({
      //placeOfWorkId: [0],

      employerName: ['', Validators.required],
      employerAddress: ['', Validators.required],
      employerStateId: ['', Validators.required],
      employerCountryId: ['', Validators.required],
      officePhone: ['', [Validators.minLength(11), Validators.maxLength(20), Validators.pattern(/^[0-9\s]*$/), Validators.required]],
      establishmentDate: ['', Validators.required],
      employerState: ['',],
      employerSubTypeId: ['', Validators.required],
      employerCityId: ['', Validators.required],

      active: [''],
      emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],

      //previousEmployer: ['', Validators.required],
      //customerId: [this.customerId, Validators.required],

      // yearOfEmployment: [''],
      // totalWorkingExperience: [''],
      // yearsOfCurrentEmployment: [''],
      // terminalBenefits: [''],
      // annualIncome: [''],
      // monthlyIncome: [''],
      // expenditure: ['']
    });
  }

  loadForwardForm() {
    this.csForwardForm = this.fb.group({
      forward: [''],
      comment: ['', Validators.required]
    });
  }

  getCities() {
    this.countryStateSrv.getAllCities()
      .subscribe((response: any) => {
        this.cities = response.result;
        this.defaultCities = this.cities;
      });
  }

  getStates() {
    this.countryStateSrv.getStates()
      .subscribe((response: any) => {
        this.states = response.result;
      });
  }

  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response: any) => {
        this.countries = response.result;
      });
  }

  employerlist: any[];

  loadEmployer() {
    this.genSetupServ.getEmployersList().subscribe((employers) => {
      this.employerlist = employers.result;
    });
  }

  getAllPendingEmployers() {
    this.genSetupServ.getPendingEmployers().subscribe((employers) => {
      this.relatedEmployers = employers.result;
    });
  }

  getAllEmployerSubTypes() {
    this.genSetupServ.getAllEmployerSubTypes().subscribe((response: any) => {
      this.employerSubTypes = response.result;
    });
  }

  onSelfEmployedChecked(event) {
    const employerNameControl = this.customerEmploymentHistoryForm.get('employerName');

    if (event == true) {
      this.selfEmployed = true;
      this.otherEmployer = false;
      employerNameControl.clearValidators();
      this.customerEmploymentHistoryForm.get('employerName').setValue('Self Employed');

    } else {
      this.customerEmploymentHistoryForm.get('employerName').setValue('');
      this.selfEmployed = false;
    }

    employerNameControl.updateValueAndValidity();
  }

  onOtherEmployerChecked(event) {
    const employerNameControl = this.customerEmploymentHistoryForm.get('employerName');

    if (event == true) {
      if (this.employerName === 'Self Employed') {
        this.customerEmploymentHistoryForm.get('employerName').setValue('');
      }
      else {
        this.customerEmploymentHistoryForm.get('employerName').setValue(this.employerName);
      }
      this.otherEmployer = true;
      this.selfEmployed = false;
      employerNameControl.setValidators(Validators.required);
    } else {
      this.customerEmploymentHistoryForm.get('employerName').setValue('');
      this.otherEmployer = false;
    }

    employerNameControl.updateValueAndValidity();
  }

  loggedInCompany: any;
  loginCountryId: any;

  getAllLoginCompany() {
    this.companyService.getAllLoginCompany().subscribe(response => {
      this.loggedInCompany = response.result;
      this.loginCountryId = this.loggedInCompany.countryId
     // console.log("loginCountryId: ", this.loginCountryId);
    });
  }

  onEmploymentStateChange() {
    let stateId = this.customerEmploymentHistoryForm.value.employerStateId;
    this.cities = this.defaultCities.filter(O => O.stateId == stateId);
    //console.log("stateId: ", stateId);
    //console.log("cities: ", this.cities);
  }

  onEmploymentCountryChange() {
    const employeeStateIdControl = this.customerEmploymentHistoryForm.get('employerStateId');
    const employeeStateControl = this.customerEmploymentHistoryForm.get('employerState');
    let countryId = this.customerEmploymentHistoryForm.value.employerCountryId;

    if (countryId == this.loginCountryId) {
      this.activeCountry = true;
      employeeStateIdControl.setValidators(Validators.required);
      employeeStateControl.clearValidators();

    }
    else {
      this.activeCountry = false;
      employeeStateControl.setValidators(Validators.required);
      employeeStateIdControl.clearValidators();
    }
    employeeStateControl.updateValueAndValidity();
    employeeStateIdControl.updateValueAndValidity();
  }

  addNewRelatedEmployer() {
    this.displayRelatedEmployerForm = true;
  }

  approveRelatedEmployer(row) {
    this.showCsForward = true;
    this.selectedEmployerId = row.employerId;
    this.forward();
  }

  submitRelatedEmployer(formObj) {
    var bodyObj = {
      employerName: formObj.value.employerName,
      address: formObj.value.employerAddress,
      phoneNumber: formObj.value.officePhone,
      emailAddress: formObj.value.emailAddress,
      employerSubTypeId: formObj.value.employerSubTypeId,
      cityId: formObj.value.employerCityId,
      countryId: formObj.value.employerCountryId,
      establishmentDate: formObj.value.establishmentDate,
      stateId: formObj.value.employerStateId
    }

    // const bodyObj = formObj.value;
    this.loadingService.show();
    this.genSetupServ.addEmployer(bodyObj).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success === true) {
        this.getAllPendingEmployers();
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        this.displayRelatedEmployerForm = false
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        this.displayRelatedEmployerForm = true
      }
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.displayRelatedEmployerForm = false
    });
  }

  decline() {
		this.showCsForward = true;
		this.vote = 2;
		this.forwardAction = 3;
	}

	forward() {
		this.showCsForward = true;
		this.vote = 1;
		this.forwardAction = 2;
  }
  
  goForApproval() {
    const __this = this;
    swal({
      title: 'Are you sure?',
      text: 'You want to submit?',
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

      let body = {
        forwardAction: __this.forwardAction,
        comment: __this.csForwardForm.controls['comment'].value,
        employerId: __this.selectedEmployerId,
        vote: __this.vote,
      };
      __this.genSetupServ.forwardRelatedEmployerForApproval(body).subscribe((res) => {
          __this.loadingService.hide();
          if (res.success === true) {
            __this.getAllPendingEmployers();
            __this.loadForwardForm();;
            __this.showCsForward = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`,
              '<br/> ' + res.message, 'success');
          } else {
            __this.showCsForward = false;
            swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
            __this.loadingService.hide();
          }
        }, (err) => {
          __this.showCsForward = false;
          __this.loadingService.hide();
          swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

}
