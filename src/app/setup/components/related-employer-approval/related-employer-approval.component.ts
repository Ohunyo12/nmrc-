import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { GeneralSetupService } from '../../../setup/services';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { CustomerService } from 'app/customer/services/customer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-related-employer-approval',
  templateUrl: './related-employer-approval.component.html',
})
export class RelatedEmployerApprovalComponent implements OnInit {
  relatedEmployers: any[] = [];
  showCsForward: boolean;
  selectedEmployerId: any;
  csForwardForm: FormGroup;
  forwardAction: any;
  vote: any;

  constructor(private genSetupServ: GeneralSetupService,
              private loadingService: LoadingService,
              private fb: FormBuilder,) 
              { }

  ngOnInit() {
    this.loadingService.show();
    this.loadForwardForm();
    this.getRelatedEmployersWaitingForApproval();
    this.loadingService.hide();
  }

  approveRelatedEmployer(row) {
    this.showCsForward = true;
    this.selectedEmployerId = row.employerId;
    this.forward();
  }
  
  getRelatedEmployersWaitingForApproval() {
    this.genSetupServ.getRelatedEmployersWaitingForApproval().subscribe((employers) => {
      this.relatedEmployers = employers.result;
    });
  }

  loadForwardForm() {
    this.csForwardForm = this.fb.group({
      forward: [''],
      comment: ['', Validators.required]
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
            __this.getRelatedEmployersWaitingForApproval();
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
