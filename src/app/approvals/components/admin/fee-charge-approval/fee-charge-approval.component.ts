import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { ChargeService, ApprovalService, GeneralSetupService } from '../../../../setup/services';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
  selector: 'app-fee-charge-approval',
  templateUrl: './fee-charge-approval.component.html',
})
export class FeeChargeApprovalComponent implements OnInit {
  feeChargeApprovalData: any[];
  displayFeeChargeModal: boolean = false;
  activeIndex: number = 0;
  approvalWorkflowData: any[];
  approvalStatusData: any[];
  selectedFeeChargeData: any = {};

  chargeFeeDetailType: any[];
  feeTypes: any[];
  postingTypes: any[];
  constructor(
    private loadingService: LoadingService,
    private chargeService: ChargeService,
    private approvalService: ApprovalService,
    private genSetupService: GeneralSetupService,
  ) { }

  ngOnInit() {
    this.getChargeFeeAwaitingApproval();
    this.loadDropdowns();
    this.getAllApprovalStatus();
  }

  getAllApprovalStatus(): void {
    this.genSetupService.getApprovalStatus().subscribe((response: any) => {
      const tempData = response.result;
      this.approvalStatusData = tempData.slice(2, 4);
    });
  }

  loadDropdowns() {
    this.chargeService.getChargeFeeDetailType().subscribe((response: any) => {
      this.chargeFeeDetailType = response.result;
    });
    this.chargeService.getFeeTypes().subscribe((response: any) => {
      this.feeTypes = response.result;
    });
    this.chargeService.getPostingTypes().subscribe((response: any) => {
      this.postingTypes = response.result;
    });
  }

  getFeeTypeById(id) {
    let item = this.feeTypes != null ? this.feeTypes.find(x => x.lookupId == id) : [];
    if (item != undefined) { return item.lookupName; }
    return 'n/a';
  }

  getFeeDetailTypeById(id) {
    let item = this.chargeFeeDetailType != null ? this.chargeFeeDetailType.find(x => x.lookupId == id) : [];
    if (item != undefined) { return item.lookupName; }
    return 'n/a';
  }

  getPostingTypeById(id) {
    let item = this.postingTypes != null ? this.postingTypes.find(x => x.lookupId == id) : [];
    if (item != undefined) { return item.lookupName; }
    return 'n/a';
  }

  getChargeFeeAwaitingApproval() {
    this.chargeService.getChargeFeeAwaitingApproval().subscribe((response: any) => {
      this.feeChargeApprovalData = response.result;
    })
  }

  goForApproval(selectedChargeFee, $event) {

    let bodyObj = {
      targetId: selectedChargeFee.loanReviewOperationId,
      approvalStatusId: selectedChargeFee.approvalStatusId,
      comment: selectedChargeFee.comment,
      loanChargeFeeId: selectedChargeFee.loanChargeFeeId,
      feeAmount: selectedChargeFee.amount,
      feeRate: selectedChargeFee.rate
    };

    const __this = this;

    swal({
      title: 'Are you sure?',
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
      __this.chargeService.goForApproval(bodyObj).subscribe((response: any) => {
        __this.loadingService.hide();
        if (response.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
          __this.getChargeFeeAwaitingApproval();;
          __this.displayFeeChargeModal = false;
        } else {
          __this.displayFeeChargeModal = true;
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
        }
      }, (err) => {
        __this.loadingService.hide();
        __this.displayFeeChargeModal = false;
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      });
    }, function (dismiss) {
      if (dismiss === 'cancel') {
        swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
      }
    });
  }

  viewFeeCharge(index, event) {
    event.preventDefault();
    this.selectedFeeChargeData = {};
    this.selectedFeeChargeData = index;

    const dataObj = this.selectedFeeChargeData;
    this.approvalService.getApprovalTrailByOperation(dataObj.operationId, dataObj.loanReviewOperationId).subscribe((res) => {
      this.approvalWorkflowData = res.result;
    });

    this.displayFeeChargeModal = true;
  }

  handleChange(e) {
    this.activeIndex = e.index;
  }

  hideModal() {
    this.displayFeeChargeModal = false;
  }
  
}
