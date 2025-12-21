import { DepartmentService } from '../../services';
import { BranchService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
})
export class DepartmentComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New Department";
  departmentForm: FormGroup;
  branches: any[];
  departments: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private branchService: BranchService,
    private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getBranches();
    this.getAllDepartment();
    this.clearControls();
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New Department";
    this.displayAddModal = true;
  }
  getAllDepartment(): void {
    this.loadingService.show();
    this.departmentService.getDepartments().subscribe((response: any) => {
      this.departments = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getBranches() {
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
  }
  editDepartment(index) {
    this.entityName = "Edit Department";
    var row = this.departments[index];
    this.selectedId = row.departmentId;
    this.departmentForm = this.fb.group({
      branchName: [row.branchName],
      departmentId: [row.departmentId],
      branchId: [row.branchId],
      departmentCode: [row.departmentCode],
      departmentName: [row.departmentName],
      description: [row.description],
    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.departmentService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllDepartment();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.departmentService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllDepartment();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  clearControls() {
    this.selectedId = null;
    this.departmentForm = this.fb.group({
      branchName: [''],
      departmentId: [''],
      branchId: ['', Validators.required],
      departmentCode: ['', Validators.required],
      departmentName: ['', Validators.required],
      description: ['', Validators.required],
    });
  }
  finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
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
