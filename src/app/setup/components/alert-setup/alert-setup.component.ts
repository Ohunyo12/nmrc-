import { DocumentService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
  selector: 'app-alert-setup',
  templateUrl: './alert-setup.component.html',
  styleUrls: ['./alert-setup.component.scss']
})
export class AlertSetupComponent implements OnInit {
  [x: string]: any;
  timeFroms:any;
  activeTabindex: number = 0;
  alerts: any[] = [];
  loadAlerts: any[] = [];
  frequencies: any[] = [];
  operations: any[] = [];
  loadAlertsPlaceHolders: any[] = [];
  alertTemplate: any;
  alertTitle: any;
  businessOwner: any;
  senderName: any;
  defaultEmail: any;
  senderEmail: any;
  levelCode: any;
  levelGroup: any;
  emailList: any;
  alertLevelId: any;
  bindingMethod: any;
  alertTitleId: any;
  alertLevelGroupId: any;
  levelGroupName: any;
  frequency: any;
  condition: any;
  lastRunDate: any;
  nextRunDate: any;
  alertInterval: any;
  conditionTitle: any;
  description: any;
  levelgroupName: any;
  staffRole: any;

  selectedTemplateId: any;
  isDisabled: boolean = false;
  displayModalForm: boolean = false;
  displayModalSection: boolean = false;
  displayModalPreview: boolean = false;
  displayModalLevel: boolean = false;
  displayModalLevelGroup: boolean = false;
  displayModalLevelGroupMapping: boolean = false;
  displayModalSetup: boolean = false;
  displayModalConditionForm: boolean = false;

  entityName: string = "Alert Template Setup";

  alertTitleForm: FormGroup;
  alertLevelForm: FormGroup;
  alertPreviewForm: FormGroup;
  alertLevelGroupForm: FormGroup;
  alertLevelGroupMappingForm: FormGroup;
  alertSetupForm: FormGroup;
  alertConditionForm: FormGroup;
  show: boolean = false;
  message: any;
  title: any;
  cssClass: any;
  selectedId: number = null;
  levelCodes: any[] = [];
  displayFilterForm: boolean = true;
  filterForm: FormGroup;
  displayList: boolean = true;
  levels: any[] = [];
  levelGroups: any[] = [];
  levelGroupMapping: any[] = [];
  alertSetups: any[] = [];
  ckEditorContent: any;
  conditions: any[] = [];
  templateType: any;
  triggerSource: any;
  type: any;
  formular: any;
  operationId: any;
  targetOption: any;
  templateTypeName: any;
  templateStatus: boolean = false;

  alertPlaceholderForm: FormGroup;
  displayModalPlaceholder: boolean = false;
  displayModalBindingMethod: boolean = false;
  alertBindingMethodForm: FormGroup;
  alertsForDropdown: any[] = [];
  alertsMethods:any[] = [];
  alertsBindingMethod: any[];

  constructor(
    private loadingService: LoadingService,
    private fb: FormBuilder,
    private documentService: DocumentService,
  ) {}

  ngOnInit() {
    this.clearControls();
    this.getAllAlertsBindingMethods();
    this.getAllAlerts();
    this.getAllLevel();
    this.getAllAlertLevel();
    this.getAllAlertLevelGroup();
    this.getAllAlertLevelGroupMapping();
    this.getAllAlertSetup();
    this.getAlerts();
    this.getAllFrequency();
    this.getAllConditions();
    this.getAllOperations();
    this.getAllAlertPlaceHolders();
    this.getAllAlertsForDropdown();
    this.getAllBindingMethods();
  }

  validateBinding(binding) {
    this.loadAlertsPlaceHolders = this.loadAlertsPlaceHolders.filter(x=>x.alertTitleId == binding);
  }

  onTabChange(e) {
    this.activeTabindex = e.index;
}


  activeState(event, data) {
    const __this = this;

    __this.templateStatus = event.checked;
    swal({
      title: "Are you sure?",
      text: "You want to change the status of this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        data.isActive = __this.templateStatus;
        __this.documentService.updateActiveStatus(data).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlerts();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "error"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  getAllAlerts(): void {
    this.loadingService.show();
    this.documentService.getAllAlertTemplate().subscribe(
      (response) => {
        this.alerts = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }


   getAllBindingMethods(): void {
    this.loadingService.show();
    this.documentService.getBindingMethods().subscribe((response) => {
        this.alertsMethods = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertsForDropdown(): void {
    this.loadingService.show();
    this.documentService.getAllAlertTemplateForDropdown().subscribe(
      (response) => {
        this.alertsForDropdown = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }


   getAllAlertsBindingMethods(): void {
    this.loadingService.show();
    this.documentService.getAllAlertsBindingMethods().subscribe(
      (response) => {
        this.alertsBindingMethod = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAlerts(): void {
    this.loadingService.show();
    this.documentService.getAlerts().subscribe(
      (response) => {
        this.loadAlerts = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertPlaceHolders(): void {
    this.loadingService.show();
    this.documentService.getAllAlertPlaceHolders().subscribe(
      (response) => {
        this.loadAlertsPlaceHolders = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }


  getAllLevel(): void {
    this.loadingService.show();
    this.documentService.getAllLevel().subscribe(
      (response) => {
        this.levelCodes = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertLevel(): void {
    this.loadingService.show();
    this.documentService.getAllAlertLevel().subscribe(
      (response) => {
        this.levels = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertLevelGroup(): void {
    this.loadingService.show();
    this.documentService.getAllAlertLevelGroup().subscribe(
      (response) => {
        this.levelGroups = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertLevelGroupMapping(): void {
    this.loadingService.show();
    this.documentService.getAllAlertLevelGroupMapping().subscribe(
      (response) => {
        this.levelGroupMapping = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllAlertSetup(): void {
    this.loadingService.show();
    this.documentService.getAllAlertSetup().subscribe(
      (response) => {
        this.alertSetups = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllFrequency(): void {
    this.loadingService.show();
    this.documentService.getAllFrequency().subscribe(
      (response) => {
        this.frequencies = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllConditions(): void {
    this.loadingService.show();
    this.documentService.getAllConditions().subscribe(
      (response) => {
        this.conditions = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  getAllOperations(): void {
    this.loadingService.show();
    this.documentService.getAllOperations().subscribe(
      (response) => {
        this.operations = response.result;
        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
  }

  selectedAlert: any;

  activeSelectedItem() {}

  showAddModal() {
    this.clearControls();
    this.displayModalForm = true;
  }

  displayPlaceholderForm() {
    this.clearControls();
    this.displayModalPlaceholder = true;
  }

  displayBindingMethodForm() {
    this.clearControls();
    this.displayModalBindingMethod = true;
  }

  clearControls() {
    this.selectedId = null;
    this.alertTitleForm = this.fb.group({
      title: ["", Validators.required],
      // ckEditorContent: [''],
      businessOwner: ["", Validators.required],
      senderName: ["", Validators.required],
      senderEmail: ["", Validators.required],
      templateType: ["", Validators.required],
      defaultEmail: [""],
      bindingMethod: ["", Validators.required],
      frequency: ["", Validators.required],
      alertTime: ["", Validators.required],
      timeFrom: ["", Validators.required],
      timeTo: ["", Validators.required],

    });

    this.alertPreviewForm = this.fb.group({
      title: ["", Validators.required],
      businessOwner: ["", Validators.required],
      senderName: ["", Validators.required],
      senderEmail: ["", Validators.required],
      templateType: ["", Validators.required],
      defaultEmail: [""],
      bindingMethod: [""],
    });

    this.alertLevelForm = this.fb.group({
      staffRole: ["", Validators.required],
    });

    this.alertLevelGroupForm = this.fb.group({
      levelGroupName: ["", Validators.required],
      description: ["", Validators.required],
    });

    this.alertLevelGroupMappingForm = this.fb.group({
      levelCode: ["", Validators.required],
    });

    this.alertSetupForm = this.fb.group({
      alertTitle: ["", Validators.required],
      levelgroupName: ["", Validators.required],
      frequency: ["", Validators.required],
      condition: ["", Validators.required],
    });

    this.alertConditionForm = this.fb.group({
      triggerSource: ["", Validators.required],
      type: ["", Validators.required],
      formular: [""],
      operationId: ["", Validators.required],
      conditionTitle: ["", Validators.required],
      alertInterval: ["", Validators.required],
      lastRunDate: ["", Validators.required],
      nextRunDate: ["", Validators.required],
      actionForTrigger: ["", Validators.required],
    });

    this.alertPlaceholderForm = this.fb.group({
      bindingMethod: ["", Validators.required],
      partition: ["", Validators.required],
      placeHolder: ["", Validators.required],
      description: ["", Validators.required],
    });

    this.alertBindingMethodForm = this.fb.group({
      methodTitle: ["", Validators.required],
      methodName: ["", Validators.required],
    });


  }

  processLevel(d) {
    this.alertLevelGroupId = d.alertLevelGroupId;
    this.displayModalLevelGroup = false;
    this.displayModalLevel = true;
  }

  displayLevelGroupForm() {
    this.displayModalLevelGroup = true;
  }

  displayLevelGroupMappingForm(d) {
    this.alertLevelGroupId = d.alertLevelGroupId;
    this.displayModalLevelGroup = false;
    this.displayModalLevelGroupMapping = true;
  }

  displaySetupForm() {
    this.displayModalLevelGroup = false;
    this.displayModalLevel = true;
  }

  displaySetupRoleForm(d) {
    this.alertTitleId = d.alertTitleId;
    this.displayModalLevel = true;
  }

  displayConditionForm() {
    this.displayModalLevelGroup = false;
    this.displayModalConditionForm = true;
  }

  onSelectChange(target) {
    this.targetOption = target;
    if (this.targetOption == 1) {
      this.templateType == 1;
    } else {
      this.templateType = 2;
    }
  }

  // ckeditor
  contentChange(updates) {
    this.ckEditorContent = updates;
  }

  // Alert title Edit
  editTitle(d) {
    this.isDisabled = true;
    this.ckEditorContent = d.template;
    this.selectedId = d.alertTitleId;
    this.alertTitleForm.setValue({
      title: d.title,
      // ckEditorContent: d.template,
      businessOwner: d.businessOwner,
      senderName: d.senderName,
      senderEmail: d.senderEmail,
      templateType: d.templateType,
      defaultEmail: d.defaultEmail,
      bindingMethod: d.bindingMethod,
      frequency: [d.frequencyId, Validators.required],
      alertTime: d.alertTime,
      timeFrom: d.timeFrom,
      timeTo: d.timeTo,
    });
    this.displayModalForm = true;
  }

  editLevel(d) {
    this.selectedId = d.alertLevelId;
    this.alertLevelForm.setValue({
      levelCode: d.levelCode,
      emailList: d.emailList,
    });
    this.displayModalLevel = true;
  }

  editLevelGroup(d) {
    this.selectedId = d.alertLevelGroupId;
    this.alertLevelGroupForm.setValue({
      levelGroupName: d.levelGroupName,
      description: d.description,
    });
    this.displayModalLevelGroup = true;
  }

  editLevelGroupMapping(d) {
    this.selectedId = d.alertLevelGroupMapId;
    this.alertLevelGroupMappingForm.setValue({
      levelCode: d.levelCode,
    });
    this.displayModalLevelGroupMapping = true;
  }

  editAlertSetup(d) {
    this.selectedId = d.alertSetupId;
    this.alertSetupForm.setValue({
      alertTitle: d.titleId,
      levelgroupName: d.levelGroupId,
      frequency: d.frequencyId,
      condition: d.conditionId,
    });
    this.displayModalSetup = true;
  }

  editAlertCondition(d) {
    //console.log(d);
    this.selectedId = d.alertConditionId;
    this.alertConditionForm.setValue({
      conditionTitle: d.title,
      triggerSource: d.triggerSource,
      type: d.type,
      actionForTrigger: d.actionForTrigger,
      formular: d.formular,
      operationId: d.operationId,
      alertInterval: d.alertInterval,
      lastRunDate: new Date(d.lastRunDate),
      nextRunDate: new Date(d.nextRunDate),
    });
    this.displayModalConditionForm = true;
  }

  previewTitle(row) {
    this.loadingService.show();
    this.documentService.getAllAlertTemplateSection(row.alertTitleId).subscribe(
      (response) => {
        this.alertTitle = response.result.title;
        this.ckEditorContent = response.result.template;
        this.templateType = response.result.templateType;
        this.templateTypeName = response.result.templateTypeName;
        this.businessOwner = response.result.businessOwner;
        this.senderName = response.result.senderName;
        this.senderEmail = response.result.senderEmail;
        this.defaultEmail = response.result.defaultEmail;

        this.loadingService.hide();
      },
      (err) => {
        this.loadingService.hide(1000);
      }
    );
    this.displayModalPreview = true;
  }

  removeLevel(row) {
    let templateId = row.alertLevelId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeAlertLevel(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlertLevel();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  removeTitle(row) {
    let templateId = row.alertTitleId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeTitle(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlerts();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  removeLevelGroup(row) {
    let templateId = row.alertLevelGroupId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeLevelGroup(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlertLevelGroup();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  removeLevelGroupMapping(row) {
    let templateId = row.alertLevelGroupMapId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeLevelGroupMapping(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlertLevelGroup();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  removeAlertSetup(row) {
    let templateId = row.alertSetupId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeAlertSetup(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllAlertLevelGroup();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  removeAlertCondition(row) {
    let templateId = row.alertConditionId;
    const __this = this;

    swal({
      title: "Are you sure?",
      text: "You want to delete this record!",
      type: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, cancel!",
      confirmButtonClass: "btn btn-success btn-move",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true,
    }).then(
      function () {
        __this.loadingService.show();
        __this.documentService.removeAlertCondition(templateId).subscribe(
          (response) => {
            __this.loadingService.hide();
            if (response.success === true) {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
              __this.getAllConditions();
            } else {
              swal(
                `${GlobalConfig.APPLICATION_NAME}`,
                response.message,
                "success"
              );
            }
          },
          (err) => {
            __this.loadingService.hide();
            swal(
              `${GlobalConfig.APPLICATION_NAME}`,
              JSON.stringify(err),
              "error"
            );
          }
        );
      },
      function (dismiss) {
        if (dismiss === "cancel") {
          swal(
            `${GlobalConfig.APPLICATION_NAME}`,
            "Operation cancelled",
            "error"
          );
        }
      }
    );
  }

  submitForm(form) {
    this.loadingService.show();
    let dateTimeFrom = new Date(form.value.timeFrom);
    let dateTimeTo = new Date(form.value.timeTo);

    let timeFrom = dateTimeFrom.getHours()+":"+dateTimeFrom.getMinutes();
    let timeTo = dateTimeTo.getHours()+":"+dateTimeTo.getMinutes();
    let body = {
      title: form.value.title,
      template: this.ckEditorContent,
      businessOwner: form.value.businessOwner,
      senderName: form.value.senderName,
      senderEmail: form.value.senderEmail,
      templateType: form.value.templateType,
      defaultEmail: form.value.defaultEmail,
      bindingMethodId: form.value.bindingMethod,
      frequency: form.value.frequency,
      alertTime: form.value.alertTime,
      timeFrom: timeFrom,
      timeTo: timeTo,
    };

    if (this.selectedId === null) {
      this.documentService.saveAlertTemplate(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlerts();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updateAlertTemplate(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlerts();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  submitLevelForm(form) {
    this.loadingService.show();
    let body = {
      staffRoleId: form.value.staffRole,
      alertTitleId: this.alertTitleId,
    };

    if (this.selectedId === null) {
      this.documentService.saveLevel(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertLevel();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updateLevel(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertLevel();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  submitLevelGroupForm(form) {
    this.loadingService.show();
    let body = {
      levelGroupName: form.value.levelGroupName,
      description: form.value.description,
    };

    if (this.selectedId === null) {
      this.documentService.saveLevelGroup(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertLevelGroup();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updateLevelGroup(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertLevelGroup();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  submitLevelGroupMappingForm(form) {
    this.loadingService.show();
    let body = {
      levelCode: form.value.levelCode,
      levelGroupId: this.alertLevelGroupId,
    };

    if (this.selectedId === null) {
      this.documentService.saveLevelGroupMapping(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertLevelGroupMapping();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService
        .updateLevelGroupMapping(body, this.selectedId)
        .subscribe(
          (res) => {
            if (res.success == true) {
              this.finishGood(res.message);
              this.getAllAlertLevelGroupMapping();
              this.displayModalForm = false;
            } else {
              this.finishBad(res.message);
            }
          },
          (err: any) => {
            this.finishBad(JSON.stringify(err));
          }
        );
    }
  }

  submitSetupForm(form) {
    this.loadingService.show();
    let body = {
      titleId: form.value.alertTitle,
      levelGroupId: form.value.levelgroupName,
      frequencyId: form.value.frequency,
      conditionId: form.value.condition,
    };

    if (this.selectedId === null) {
      this.documentService.saveAlertSetup(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertSetup();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updateAlertSetup(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertSetup();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  submitConditionForm(form) {
    this.loadingService.show();
    let body = {
      triggerSource: form.value.triggerSource,
      type: form.value.type,
      formular: form.value.formular,
      operationId: form.value.operationId,
      title: form.value.conditionTitle,
      alertInterval: form.value.alertInterval,
      lastRunDate: form.value.lastRunDate,
      nextRunDate: form.value.nextRunDate,
      actionForTrigger: form.value.actionForTrigger,
    };

    if (this.selectedId === null) {
      this.documentService.saveAlertCondition(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllConditions();
            this.displayModalForm = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService
        .updateAlertCondition(body, this.selectedId)
        .subscribe(
          (res) => {
            if (res.success == true) {
              this.finishGood(res.message);
              this.getAllConditions();
              this.displayModalForm = false;
            } else {
              this.finishBad(res.message);
            }
          },
          (err: any) => {
            this.finishBad(JSON.stringify(err));
          }
        );
    }
  }

  finishBad(message) {
    this.showMessage(message, "error", "FintrakBanking");
    this.loadingService.hide();
  }

  finishGood(message) {
    this.clearControls();
    this.loadingService.hide();
    this.showMessage(message, "success", "FintrakBanking");
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

  submitPlaceholderForm(form) {
    this.loadingService.show();
    let body = {
      placeHolder: form.value.placeHolder,
      description: form.value.description,
      alertTitleId: form.value.bindingMethod,
      partition: form.value.partition,
    };

    if (this.selectedId === null) {
      this.documentService.savePlaceholder(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertPlaceHolders();
            this.displayModalPlaceholder = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updatePlaceholder(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlertPlaceHolders();
            this.displayModalPlaceholder = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  submitBindingMethodForm(form) {
    this.loadingService.show();
    let body = {
      methodTitle: form.value.methodTitle,
      methodName: form.value.methodName
    };

    if (this.selectedId === null) {
      this.documentService.saveBindingMethod(body).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlerts();
            this.displayModalBindingMethod = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    } else {
      this.documentService.updateBindingMethod(body, this.selectedId).subscribe(
        (res) => {
          if (res.success == true) {
            this.finishGood(res.message);
            this.getAllAlerts();
            this.displayModalBindingMethod = false;
          } else {
            this.finishBad(res.message);
          }
        },
        (err: any) => {
          this.finishBad(JSON.stringify(err));
        }
      );
    }
  }

  // Alert placeholder Edit
  editPlaceholder(d) {
    this.selectedId = d.placeHolderId
    this.alertPlaceholderForm.setValue({
      placeHolder: d.placeHolder,
      description: d.description,
      bindingMethod: d.alertTitleId,
      partition: d.partition,
    });
    this.displayModalPlaceholder = true;
  }

}
