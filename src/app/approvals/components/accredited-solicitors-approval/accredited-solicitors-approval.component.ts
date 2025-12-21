import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { AccreditedConsultantsService, CountryStateService } from '../../../setup/services';
import { LoadingService } from 'app/shared/services/loading.service';
import { ValidationService } from 'app/shared/services/validation.service';
import swal from 'sweetalert2';
import { GlobalConfig } from 'app/shared/constant/app.constant';

@Component({
  selector: 'app-accredited-solicitors-approval',
  templateUrl: './accredited-solicitors-approval.component.html',
})
export class AccreditedSolicitorsApprovalComponent implements OnInit {
  solicitors: any[]; // <----?
  cities: any[];
  countries: any[];
  consultants: any[];
  displayForm: boolean = false;
  displayAddButton: boolean = false;
  entityName: string = 'New Solicitor Information';
  solicitorForm: FormGroup;
  show: boolean = false; message: any; title: any; cssClass: any; // message box
  selectedId: number = null;
  accreditedConsultantType:any;
  disabledConsultantDropdown:boolean=false;
  comment: string = null;
  approvalStatusId: number= null;
  selected: any = null;
  displayModalForm: boolean = false;
  panelHeader = 'Accredited Consultant Details';


  constructor(
    private loadingService: LoadingService, private fb: FormBuilder,
     private accreditedConsultantsService: AccreditedConsultantsService, 
     private countryStateSrv: CountryStateService
  ) { }

  ngOnInit() {
    this.getCities();
    this.getCountries();
    // //this.getAllSolicitor();
     this.getAccreditedConsultantType();

  }
  getAllSolicitor(): void {
    this.loadingService.show();
    this.accreditedConsultantsService.getSolicitorsAwaitingApproval(this.accreditedConsultantType).subscribe((response: any) => { // <----?
      this.solicitors = response.result; // <----?

      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getAccreditedConsultantType() {
    this.accreditedConsultantsService.getAccreditedConsultantType()
      .subscribe((response: any) => {
        this.consultants = response.result;
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
  view(item) {
    this.selected = item;
    this.displayModalForm = true;
    this.approvalStatusId =null;
    this.comment = null;
    this.selectedId = item.accreditedConsultantId;

  }


  showForm() {
    this.entityName = 'New Solicitor Information';
    this.displayForm = true;
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
  forward() {
    const __this = this;
    const status = +this.approvalStatusId == 2 ? 'Approve' : 'Disapprove';
  
    swal({
        title: status + ' Accredited Consultants?',
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
      __this.loadingService.show();

        const body = {
            targetId: __this.selected.accreditedConsultantId,
            approvalStatusId: __this.approvalStatusId,
            comment: __this.comment,
        }
        
        __this.accreditedConsultantsService.accreditedSolicitorGoForApproval(body).subscribe((res) => {
            if (res.success === true) {
              __this.loadingService.hide();
                swal(GlobalConfig.APPLICATION_NAME, 'Operation successful.', 'success');
                __this.refresh(); // refresh
            } else {
              __this.loadingService.hide(1000);
              swal(GlobalConfig.APPLICATION_NAME, res.message, 'error');
            }
        });
  
    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
        }
    });
  }
  refresh() {
    this.getAllSolicitor();
    this.displayModalForm = false;
    this.approvalStatusId = null;
    this.comment = null;
  }
}
