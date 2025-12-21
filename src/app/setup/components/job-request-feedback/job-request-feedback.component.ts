import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestJobTypeService } from '../../services';
import { JobService } from '../../../credit/services';
import { LoadingService } from '../../../shared/services/loading.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-job-request-feedback',
  templateUrl: './job-request-feedback.component.html',
})
export class JobRequestFeedbackComponent implements OnInit {
  jobRequestFeedbackTableData: any[];
  displayJobRequestFeedbackModal: boolean = false;
  entityName: string;
  jobRequestFeedbackForm: FormGroup;
  jobTypes: any[];
  requestStatus: any[];
  constructor(private jobTypeService: RequestJobTypeService,
    private fb: FormBuilder,
    private jService: JobService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.initializeControl();
    this.getJobTypes();
    this.getRequestStatus();
    this.getJobRequestFeedback();
  }

  getJobTypes() {
    this.jobTypeService.getJobTypes().subscribe((response: any) => {
      this.jobTypes = response.result;
    });
  }
  getRequestStatus() {
    this.jobTypeService.getRequestStatus().subscribe((response: any) => {
      this.requestStatus = response.result;
    });
  }
  getJobRequestFeedback() {
    this.loadingService.show();
    this.jobTypeService.getJobRequestFeedback().subscribe((response: any) => {
      this.jobRequestFeedbackTableData = response.result;
      this.loadingService.hide();
    });
  }
  initializeControl() {
    this.jobRequestFeedbackForm = this.fb.group({
      jobStatusFeedbackId: [0],
      jobStatusFeedbackName: ['', Validators.required],
      requestStatusId: ['', Validators.required],
      jobTypeId: ['', Validators.required],
    });
  }
  showJobRequestFeedbackForm() {
    this.entityName = "Add New Job Request Feedback";
    this.initializeControl();
    this.displayJobRequestFeedbackModal = true;
  }
  editJobRequestFeedback(index) {
    this.initializeControl();
    this.entityName = "Edit Job Request Feedback";
    const row = index;
    this.jobRequestFeedbackForm = this.fb.group({
      jobStatusFeedbackId: [row.jobStatusFeedbackId],
      jobStatusFeedbackName: [row.jobStatusFeedbackName, Validators.required],
      requestStatusId: [row.requestStatusId, Validators.required],
      jobTypeId: [row.jobTypeId, Validators.required],
    });
    this.displayJobRequestFeedbackModal = true;
  }
  submitJobRequestFeedbackForm(formObj) {
    const bodyObj = formObj.value;
    this.jobTypeService.addUpdateJobFeedback(bodyObj).subscribe((res) => {
      this.loadingService.hide();
      if (res.success === true) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
      this.getJobRequestFeedback();
      this.displayJobRequestFeedbackModal = false;
    }, (err) => {
      swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      this.loadingService.hide();
    });
  }
}
