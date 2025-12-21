import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { DepartmentService } from '../../services';
import { BranchService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
})
export class DepartmentUnitComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New Unit";
  departmentUnitForm: FormGroup;
  departmentUnits: any[];
  departments: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private branchService: BranchService,
    private departmentService: DepartmentService) { }

  ngOnInit() {
    this.getAllUnits();
    this.getAllDepartment();
    this.clearControls();
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New Unit";
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

  getAllUnits(): void {
    this.loadingService.show();
    this.departmentService.getUnits().subscribe((response: any) => {
      this.departmentUnits = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }

  editDepartmentUnit(index) {
    this.entityName = "Edit Department";
    var row = this.departmentUnits[index];
    this.selectedId = row.unitId;
    this.departmentUnitForm = this.fb.group({
      departmentUnitEmail: [row.unitEmail],
      departmentId: [row.departmentId],
      departmentUnitName: [row.unitName],
    });
    this.displayAddModal = true;
  }

  submitForm(formObj) {
    this.loadingService.show();
    let bodyObj = {
      departmentId: formObj.value.departmentId,
      unitEmail: formObj.value.departmentUnitEmail,
      unitName: formObj.value.departmentUnitName,
    }
    if (this.selectedId === null) {
      this.departmentService.saveUnit(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllUnits();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.departmentService.updateUnit(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllUnits();
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
    this.departmentUnitForm = this.fb.group({
      departmentUnitName: ['', Validators.required],
      departmentId: ['', Validators.required],
      departmentUnitEmail: ['', Validators.required],
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


  deleteDepartmentUnit(row) {
    const __this = this;
    swal({
        title: 'Delete Department Unit?',
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

        __this.departmentService.deleteUnit(row.unitId).subscribe((res) => {
                if (res.success == true) {
                  __this.finishGood(res.message);  
                   this.getAllUnits();
                }
            }, (err: any) => {
                __this.finishBad(JSON.stringify(err));
            });

    }, function (dismiss) {
        if (dismiss === 'cancel') {
            swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
        }
    });
}

  // deleteDepartmentUnit(row) {
  //   const __this = this;
  //   swal({
  //       title: 'Remove Compliance Timeline?',
  //       text: 'You won\'t be able to revert this!',
  //       type: 'question',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes',
  //       cancelButtonText: 'No, cancel!',
  //       confirmButtonClass: 'btn btn-success btn-move',
  //       cancelButtonClass: 'btn btn-danger',
  //       buttonsStyling: true,
  //   }).then(function () {

  //       __this.departmentService.deleteUnit(row.unitId).subscribe((res) => {
  //               if (res.success == true) {
  //                   __this.getAllUnits();
  //               }
  //           }, (err: any) => {
  //               __this.finishBad(JSON.stringify(err));
  //           });

  //   }, function (dismiss) {
  //       if (dismiss === 'cancel') {
  //           swal(GlobalConfig.APPLICATION_NAME, 'Operation cancelled', 'error');
  //       }
  //   });
  // }
}
