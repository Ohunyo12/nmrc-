import { state } from '@angular/animations';
import { IAccreditedConsultantInfo, IAccreditedConsultantStateCovered, IStateCovered } from '../../models/accreditedConsultant';
import { AccreditedConsultantsService } from '../../services';
import { ValidationService } from '../../../shared/services/validation.service';
import { CountryStateService } from '../../services/state-country.service';
import { CollateralService } from '../../services/collateral.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accredited-solicitors',
  templateUrl: './accredited-solicitors.component.html',
})
export class AccreditedSolicitorsComponent implements OnInit {
  solicitors: any[]; // <----?
  cities: any[];
  states: IStateCovered[];
  statesTarget: IStateCovered[];
  countries: any[];
  consultants: any[];
  consultantsList: IAccreditedConsultantInfo;
  listOfStateCoverd: IAccreditedConsultantStateCovered;
  displayForm: boolean = false;
  displayconsultantTypeForm: boolean = false;
  displayCategory: boolean = false;
  displayAddButton: boolean = false;
  displayStaffId: boolean = false;
  entityName: string = 'New Solicitor Information';
  solicitorForm: FormGroup;
  consultantTypeForm: FormGroup;
  show: boolean = false; message: any; title: any; cssClass: any; // message box
  selectedId: number = null;
  accreditedConsultantType:any;
  disabledConsultantDropdown:boolean=false;
  get accreditedConsultantStates(): FormArray {
    return <FormArray>this.solicitorForm.get('accreditedConsultantStates');
  }
  constructor(
    private loadingService: LoadingService, private fb: FormBuilder,
    private accreditedConsultantsService: AccreditedConsultantsService, private countryStateSrv: CountryStateService
  ) { }

  ngOnInit() {
    this.getCities();
    this.getStates()
    this.getCountries();
    //this.getAllSolicitor();
    this.getAccreditedConsultantType();
    this.clearControls();

  }
  getAllSolicitor(): void {
    this.loadingService.show();
    this.accreditedConsultantsService.getSolicitors(this.accreditedConsultantType).subscribe((response) => { // <----?
      this.solicitors = response.result; // <----?
      if(this.accreditedConsultantType == 4){
        this.displayCategory = true;
      }else{
        this.displayCategory = false; 
      }
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  getAccreditedConsultantType() {
    this.accreditedConsultantsService.getAccreditedConsultantType()
      .subscribe((response) => {
        this.consultants = response.result;
      });
  }
  getCities() {
    this.countryStateSrv.getAllCities()
      .subscribe((response) => {
        this.cities = response.result;
      });
  }
  getStates() {
    this.countryStateSrv.getStates()
      .subscribe((response) => {
        this.states = response.result;
        this.statesTarget = [];
      });
  }
  getCountries() {
    this.countryStateSrv.getAllCountries()
      .subscribe((response) => {
        this.countries = response.result;
      });
  }
  showForm() {
    this.clearControls();
    this.entityName = 'New Solicitor Information';
    this.getStates()
    this.displayForm = true;
  }
  showconsultantTypeForm() {
    this.clearconsultantTypeForm();
    this.displayconsultantTypeForm = true;
  }
  ShowAddMoreStates() {
    this.displayAddButton = true;
  }
  clearconsultantTypeForm(){
    this.consultantTypeForm=this.fb.group({
      consultantType:['',Validators.required]
    })
  }
  clearControls() {
    this.selectedId = null;   
    this.solicitorForm = this.fb.group({
      accreditedConsultantId: [0],
      registrationNumber: ['', Validators.required],
      name: ['', Validators.required],
      firmName: ['', Validators.required],
      accreditedConsultantTypeId: ['', Validators.required],
      cityId: [''],
      countryId: [''],
      accountNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/)]],
      solicitorBVN: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(11), Validators.maxLength(11)]],
      emailAddress: ['', Validators.compose([Validators.required, ValidationService.isEmail])],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^0|[0-9]\d*$/), Validators.minLength(9)]],
      address: [''],
      coreCompetence: [''],
      dateOfEngagement: [''],
      category: [''],
      staffId: [''],
      agentCategory: [''],
      accreditedConsultantStates: this.fb.array([this.stateCovered()])
    });
    this.clearconsultantTypeForm();
  }


  addStateCovered(): void {
    this.accreditedConsultantStates.push(this.stateCovered());
  }
  stateCovered(): FormGroup {
    return this.fb.group({
      accreditedConsultantStateCoveredID: [0],
      stateId: ['']
    });
  }


  removeItem(evt, i) {
    evt.preventDefault();
    var delrow = this.consultantsList.accreditedConsultantStates[i];
    if (delrow.accreditedConsultantStateCoveredID != 0) {
      this.deleteStateCover(delrow.accreditedConsultantStateCoveredID)
    }
    this.accreditedConsultantStates.controls.splice(i, 1);
  }

  stateList:any[];
  editSolicitor(index) {
    this.clearControls();
    this.statesTarget = [];
    this.entityName = "Edit Solicitor Information"
    const row = index;
    this.consultantsList = row;
   
    if(this.consultantsList.accreditedConsultantStates != null || this.consultantsList.accreditedConsultantStates != undefined){
      this.stateList = this.consultantsList.accreditedConsultantStates;
    }else{
      this.stateList = [0];
    }

    this.selectedId = row.accreditedConsultantId; 
    this.solicitorForm = this.fb.group({
      accreditedConsultantId: [row.accreditedConsultantId, Validators.required],
      registrationNumber: [row.registrationNumber, Validators.required],
      name: [row.name, Validators.required],
      firmName: [row.firmName, Validators.required],
      accreditedConsultantTypeId: [row.accreditedConsultantTypeId, Validators.required],
      cityId: [row.cityId],
      countryId: [row.countryId],
      accountNumber: [row.accountNumber, Validators.required],
      solicitorBVN: [row.solicitorBVN, Validators.required],
      emailAddress: [row.emailAddress, Validators.compose([Validators.required, ValidationService.isEmail])],
      phoneNumber: [row.phoneNumber],
      address: [row.address],
      coreCompetence: [row.coreCompetence],
      dateOfEngagement: new Date(row.dateOfEngagement),
      category: [row.category],
      staffId: [row.staffCode],
      agentCategory: [row.agentCategory],
      accreditedConsultantStates: [this.stateList]
      // accreditedConsultantStates: [row.accreditedConsultantStates]
    });
    this.setFormArrayValue(this.stateList);
    //this.displayAddButton = true;
    this.displayForm = true;
    //this.disabledConsultantDropdown=true;
  }

  removeDuplicatedCategories(prodCategories: any[], toBeRemoved: any[]): any[] {
    let ret: any[] = []; // new array to be returned
    for (let pc of prodCategories) {
      let isDup: boolean = false;
      for (let toRem of toBeRemoved) {
        if (pc.id === toRem.id) {
          isDup = true;
          break;
        }
      }
      if (!isDup) ret.push(pc); // append non-duplicated
    }
    return ret;
  }
  setFormArrayValue(consult: IAccreditedConsultantStateCovered[]) {
    let targetlist = [];
    consult.forEach((role: IAccreditedConsultantStateCovered) => {
      targetlist.push({
        stateId: role.stateId,
        stateName: role.stateName,
        accreditedConsultantStateCoveredID: role.accreditedConsultantStateCoveredID
      })
    });
    this.statesTarget = targetlist;
    //Compare two array and return the difference
    let stateDiff: any[] = []; // new array to be returned
    for (let state of this.states) {
      let isDup: boolean = false;
      for (let target of this.statesTarget) {
        if (state.stateId === target.stateId) {
          isDup = true;
          break;
        }
      }
      if (!isDup) stateDiff.push(state); // append non-duplicated
    }
    this.states = stateDiff;
    // const stateCover = consult.map(con => this.fb.group(con));
    // const StateCoverArray = this.fb.array(stateCover);
    // this.solicitorForm.setControl('accreditedConsultantStates', StateCoverArray);
  }

  deleteStateCover(id) {
    if (id != 0) {
      this.accreditedConsultantsService.deleteSolicitorsState(id).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllSolicitor();
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }

  deleteSolicitor(id) {
    if (id != 0) {
      this.accreditedConsultantsService.deleteSolicitor(id).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllSolicitor();
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }


  submitForm(form) {
    this.loadingService.show();
    let bodyObj = [];
    this.statesTarget.forEach((role: IAccreditedConsultantStateCovered) => {
      bodyObj.push({
        stateId: role.stateId,
        accreditedConsultantStateCoveredID: role.accreditedConsultantStateCoveredID
      })
    });
    let body = {
      accreditedConsultantId: form.value.accreditedConsultantId,
      registrationNumber: form.value.registrationNumber,
      name: form.value.name,
      firmName: form.value.firmName,
      accreditedConsultantTypeId: form.value.accreditedConsultantTypeId,
      cityId: form.value.cityId,
      countryId: form.value.countryId,
      accountNumber: form.value.accountNumber,
      solicitorBVN: form.value.solicitorBVN,
      emailAddress: form.value.emailAddress,
      phoneNumber: form.value.phoneNumber,
      address: form.value.address,
      category: form.value.category,
      staffId: form.value.staffId,
      dateOfEngagement: form.value.dateOfEngagement,
      agentCategory: form.value.agentCategory,
      coreCompetence: form.value.coreCompetence,
      accreditedConsultantStates: bodyObj
    }
    if (this.selectedId === null) {
      this.accreditedConsultantsService.saveSolicitors(body).subscribe((res) => {
        if (res.success == true) {
          this.solicitorForm.reset();
          this.finishGood(res.message);
          this.accreditedConsultantType=form.value.accreditedConsultantTypeId;
          this.getAllSolicitor();
          this.statesTarget = [];
          this.displayForm = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.accreditedConsultantsService.updateSolicitors(body, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.solicitorForm.reset();
          this.finishGood(res.message);
          this.getAllSolicitor();
          this.selectedId = null;
          this.statesTarget = [];
          this.displayForm = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }

  getConsultantType(typeId) {
        if(typeId == 4){
          this.displayCategory = true;
        }else{this.displayCategory = false;}
    }

    getCategoryType(typeId) {
      if(typeId == "internal"){
        this.displayStaffId = true;
      }else{this.displayStaffId = false;}
  }

  submitconsultantTypeForm(form){
    this.loadingService.show();
    let body = {
      name: form.value.consultantType,
    }
    this.accreditedConsultantsService.saveConsultantTypes(body).subscribe((res) => {
      if (res.success == true) {
        this.finishGood(res.message);
        this.getAccreditedConsultantType();
        this.clearconsultantTypeForm();
        this.displayconsultantTypeForm = false;
      } else {
        this.finishBad(res.message);
      }
    }, (err: any) => {
      this.finishBad(JSON.stringify(err));
    });

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
