import { Component, OnInit } from '@angular/core';
import { OverrideService } from '../../../../../credit/services/override.service';
import { CustomerService } from '../../../../../customer/services/customer.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { GeneralSetupService } from '../../../../../setup/services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalConfig } from '../../../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { error } from 'selenium-webdriver';
@Component({
  selector: 'app-approve-override',
  templateUrl: './approve-override.component.html',
  //  styleUrls: ['./approve-override.component.scss']
})
export class
  ApproveOverrideComponent implements OnInit {
  overrideList: any[] = [];
  selectedRequest: any = {};
  approvalStatusData: any[];
  displayApprovalModal: boolean = false;
  formData: FormGroup;
  saveStatus: boolean = false;



  constructor(private overrideServ: OverrideService, private customerService: CustomerService,
    private loadingServ: LoadingService, private genSetupService: GeneralSetupService, private fb: FormBuilder) { }

  ngOnInit() {
    this.initiatFormData();
    this.getOverrideAwaitingApproval();
    this.getAllApprovalStatus();
  }
  getOverrideAwaitingApproval() {
    this.loadingServ.show();
    this.overrideServ.getOverridesAwaitingApproval().subscribe((response: any) => {
      this.overrideList = response.result;
      this.loadingServ.hide(400)
    })
  }
  initiatFormData() {
    this.formData = this.fb.group({
      overrideDetailId: [this.selectedRequest.overrideDetailId],
      statusComment: ['', Validators.required],
      operationId: [this.selectedRequest.operationId],
      approvedStatusId: ['', Validators.required]

    });
  }
  hideModal() {
    /// if (this.saveStatus)
    this.getOverrideAwaitingApproval();
    this.displayApprovalModal = false;
  }
  customerName: string;
  getCustomerName(customerCode) {
   
  }
  approveOverride(col) {
    this.selectedRequest = col;

    this.formData.patchValue({
      overrideDetailId: this.selectedRequest.overrideDetailId,
      operationId: this.selectedRequest.operationId,
    });
    // this.initiatFormData();
    this.displayApprovalModal = true;

  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      let tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }

  goForApproval() {
    let data = this.formData.value
    this.overrideServ.approveOverRideRequest(data).subscribe((res) => {
      if (res.result) {
        this.displayApprovalModal = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.getOverrideAwaitingApproval();
      }
      }, (err) => {
       
    });
    this.saveStatus = true;
  }



}
