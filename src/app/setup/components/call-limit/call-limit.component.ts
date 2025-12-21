import { LoanService } from '../../../credit/services/loan.service';
import { StaffRoleService } from '../../services';
import { CallMemoService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
@Component({
  selector: 'app-call-limit',
  templateUrl: './call-limit.component.html',
})
export class CallLimitComponent implements OnInit {
  entityName: string = "New Call Limit";
  selectedId: number;
  callLimitsTableData: any[];
  callLimitTypes: any[];
  staffRoles: any[];
  frequencies: any[];
  callLimitForm: FormGroup;
  displayCallLimitModal: boolean = false;
  displayLoanSearchBtn: boolean = false;
  constructor(private fb: FormBuilder, private loadingService: LoadingService,
    private callMemoService: CallMemoService, private staffRoleService: StaffRoleService,
  ) { }

  ngOnInit() {
    this.loadAllCallLimit();
    this.clearControls();
    this.loadJobTitles();
    this.loadFrequencyTypes();
    this.loadAllCallLimitType();
  }
  loadJobTitles() {
    this.staffRoleService.getStaffRoles().subscribe((response: any) => {
      this.staffRoles = response.result;
    });
  }
  loadFrequencyTypes() {
    this.callMemoService.getFrequencyTypes()
      .subscribe((res) => {
        this.frequencies = res.result;
      });
  }
  loadAllCallLimitType() {
    this.callMemoService.getAllCallLimitType().subscribe((data) => {
      this.callLimitTypes = data.result;
    }, (err) => {
    });
  }
  clearControls() {
    this.selectedId = null;
    this.callLimitForm = this.fb.group({
      callLimitId: [0],
      jobTitleId: ['', Validators.required],
      maximumAmount: ['', Validators.required],
      minimumAmount: ['', Validators.required],
      frequencyId: ['', Validators.required],
      callLimitTypeId: ['', Validators.required],
    });
  }
  loadAllCallLimit() {
    this.callMemoService.getAllCallLimit().subscribe((data) => {
      this.callLimitsTableData = data.result;
    }, (err) => {
    });
  }
  showCallLimitForm() {
    this.clearControls();
    this.displayCallLimitModal = true;
  }
  editCallLimit(index) {
    this.entityName = "Edit Call Limit";
    let row = this.callLimitsTableData[index];
    this.selectedId = row.callLimitId;
    this.callLimitForm = this.fb.group({
      callLimitId: [row.callLimitId, Validators.required],
      jobTitleId: [row.jobTitleId, Validators.required],
      maximumAmount: [row.maximumAmount, Validators.required],
      minimumAmount: [row.minimumAmount, Validators.required],
      frequencyId: [row.frequencyId, Validators.required],
      callLimitTypeId: [row.callLimitTypeId, Validators.required],
    });
    this.displayCallLimitModal = true;
  }

  submitCallLimitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.callMemoService.addCallLimit(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.loadAllCallLimit();
          this.loadingService.hide();
          swal('Fintrak Banking', res.message, 'success');
          this.displayCallLimitModal = false;
        } else {
          swal('Fintrak Banking', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('Fintrak Banking', JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else {
      this.callMemoService.updateCallLimit(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.loadingService.hide();
          this.selectedId = null;
          this.loadAllCallLimit();
          swal('Fintrak Banking', res.message, 'success');
          this.displayCallLimitModal = false;
        } else {
          swal('Fintrak Banking', res.message, 'error');
          this.loadingService.hide();
        }
      }, (err: any) => {
        swal('Fintrak Banking', JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
  }
}
