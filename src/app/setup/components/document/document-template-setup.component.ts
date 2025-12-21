import { DocumentService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { EditorModule, SharedModule } from 'primeng/primeng';
import { ProductService } from '../../services';
import { ApprovalService , StaffRoleService  } from '../../services';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { ValidationService } from '../../../shared/services/validation.service';

@Component({
    selector: 'document-template-setup',
    templateUrl: 'document-template-setup.component.html'
})

export class DocumentTemplateSetupComponent implements OnInit {

    documents: any[];
    sections: any[];
    roles: any[];

    selectedTemplateId:any;
    selectedTemplateSectionId:any;
    selectedTemplateSectionRoleId:any;

    displayModalForm: boolean = false;
    displayModalSection: boolean = false;
    displayModalSectionForm: boolean = false;
    displayModalSectionRole: boolean = false;
    displayModalSectionRoleForm: boolean = false;

    entityName: string = 'Document Template Setup';
    sectionName: string = 'Section Setup';
    sectionRoleName: string = 'Section Role Setup';

    documentForm: FormGroup;
    documentSectionForm: FormGroup;
    documentSectionRoleForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    selectedsectionid: number = null;

    selectedsectionroleid: number = null;
        displayFilterForm: boolean = true;
    filterForm: FormGroup;
    displayList: boolean = true;
    staffRole = [];
    levels = [];
    documentContent: any;
    Operations =[];
    documentTypes = [
        { 'id': '1', 'name': 'CAM', },
        { 'id': '2', 'name': 'Offer Letter', },
    ];

    constructor(private loadingService: LoadingService, private fb: FormBuilder,
        private documentService: DocumentService,
        private staffRolServ: StaffRoleService,
        private approvalService: ApprovalService,
        private productService: ProductService) { }

    ngOnInit() {
        this.getAllOperations();
        this.getAllStaffRole();
this.getAllDocuments();
        this.clearControls();
    }
    getOperationName(id) {
        let model = this.Operations.find(x => x.lookupId == id);
        return (model == null) ? null : model.lookupName;
    }
    getStaffRoleName(id) {
        let model = this.staffRole.find(x => x.staffRoleId == id);
        return (model == null) ? null : model.staffRoleName;
    }
    getAllDocuments(): void {
        this.loadingService.show();
        this.documentService.getAllDocumentTemplate().subscribe((response: any) => { // <----?
            ////console.log("x---", response.result)
          this.documents = response.result; // <----?
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }
      getAllStaffRole() {
        this.staffRolServ.getStaffRoles().subscribe((response: any) => {
          this.staffRole = response.result;
        });
      }
      getAllOperations() {
        this.documentService.getOperationID().subscribe((response: any) => {
          this.Operations = response.result;
        });
      }
    refreshDocument(documentId) {
        this.documentService.getDocumentByLevelId(documentId).subscribe((response: any) => {
            this.documents = response.result;
        });
    }
    showAddModal() {
        this.clearControls();
        this.displayModalForm = true;
    }
    showSectionModal() {
        this.clearControls();
        this.displayModalSection = true;
    }
    showAddSectionRoleModal()
    {
        this.clearControls();
        this.displayModalSectionRoleForm = true;
    }
    clearControls() {
        this.selectedId = null;
        this.selectedsectionid =null;
        this.selectedsectionroleid=null;
        
        this.documentForm = this.fb.group({
            templateName: ['', Validators.required],
            // productClassId: ['', Validators.required],
            staffRoleId: ['', Validators.required],
            operationId: ['', Validators.required],            
            // documentTypeId: ['', Validators.required],
        });
        this.documentSectionForm = this.fb.group({
            title: ['', Validators.required],
            position: ['', Validators.required],
            canEdit: [''],
            description: [''],
            templateDocument: [''],
        });
        this.documentSectionRoleForm = this.fb.group({
            staffRoleId: ['', Validators.required],
        });
        this.documentContent = ''; // primeng editor loaded from the documentContent two-way binding
    }


    // ckeditor
    ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }   

    editDocument(row) {
        // var row = this.documents[index];
        this.selectedId = row.templateId;
        this.documentForm = this.fb.group({
            templateName: [row.templateName, Validators.required],
            // productClassId: [row.productClassId, Validators.required],
            staffRoleId: [row.staffRoleId, Validators.required],
            operationId: [row.operationId, Validators.required],

            //templateDocument: [''], // left empty cuz of a bug in the primeng editor
            // documentTypeId: [row.documentTypeId, Validators.required],
        });
        //this.documentContent = row.templateDocument; // primeng editor loaded from the documentContent two-way binding
        // this.documentForm.value.templateDocument = row.templateDocument;
        ////console.log(JSON.stringify(row));
        this.displayModalForm = true;

    }
    editDocumentSection(row) {
        // var row = this.documents[index];
        this.selectedTemplateId = row.templateId;
        this.selectedsectionid = row.templateSectionId;

        this.documentSectionForm = this.fb.group({
            title: [row.title, Validators.required],
            position: [row.position, Validators.required],
            canEdit: [row.canEdit],
            description: [row.description],

            templateDocument: [''],
        });
        this.documentContent = row.templateDocument; // primeng editor loaded from the documentContent two-way binding
        
        //this.documentSectionForm.value.templateDocument = row.templateDocument;
        ////console.log(JSON.stringify(row));
        this.displayModalSectionForm = true;

    }
    showAddSectionModal() {
        this.clearControls();
        this.displayModalSectionForm = true;
    }
    sectionDocument(row) {
        this.getAllSetionByDocuments(row.templateId);
        this.displayModalSection = true;
    }
    
    getAllSetionByDocuments(templateId): void {
        this.selectedTemplateId = templateId;
        this.loadingService.show();
        this.documentService.getAllDocumentTemplateSection(templateId).subscribe((response: any) => { // <----?
            ////console.log("x---", response.result)
          this.sections = response.result; // <----?
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }
      getAllRoleBySection(templateSectionId): void {
        this.selectedTemplateSectionId = templateSectionId;
        this.loadingService.show();
        this.documentService.getAllDocumentTemplateSectionRole(templateSectionId).subscribe((response: any) => { // <----?
          this.roles = response.result; // <----?
          this.loadingService.hide();
        }, (err) => {
          this.loadingService.hide(1000);
        });
      }
      roleDocumentSection(row) {
        this.getAllStaffRole();
        this.getAllRoleBySection(row.templateSectionId);
        this.displayModalSectionRole = true;
    }
    removeDocument(row) {
        let templateId = row.templateId;
        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record!',
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
            __this.documentService.removedocumenttemplate(templateId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllDocuments();

                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
    submitForm(form) {
        this.loadingService.show();
        let body = {
            templateName: form.value.templateName,
            // productClassId: form.value.productClassId,
            staffRoleId: form.value.staffRoleId,
            operationId: form.value.operationId,
            // documentTypeId: form.value.documentTypeId,
        };
        ////console.log('template..', body.templateDocument);
        if (this.selectedId === null) {
            this.documentService.savedocumenttemplate(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllDocuments();
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.documentService.updatedocumenttemplate(body, this.selectedId).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllDocuments();
                    this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
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

    submitSectionForm(form = this.documentSectionForm){

        this.documentContent = this.ckeditorChanges; // on save click
        this.loadingService.show();
        let body = {
            title: form.value.title,
            position: form.value.position,
            templateDocument: this.documentContent,
            templateId: this.selectedTemplateId,
            canEdit: form.value.canEdit,
            description: form.value.description,

        };
        ////console.log("body",body);
        if (this.selectedsectionid === null) {
            this.documentService.savedocumenttemplatesection(body).subscribe((res) => {
                this.ckeditorChanges = null; // cleanup

                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSetionByDocuments(this.selectedTemplateId);
                   this.displayModalSectionForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.documentService.updatedocumenttemplatesection(body, this.selectedsectionid).subscribe((res) => {
                this.ckeditorChanges = null; // cleanup

                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllSetionByDocuments(this.selectedTemplateId);
                    this.displayModalSectionForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }

        
    }

    removeDocumentSection(row) {
        let templatesectionId = row.templateSectionId;
        let templateId = row.templateId;
        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record!',
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
            __this.documentService.removedocumenttemplatesection(templatesectionId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllSetionByDocuments(templateId);

                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }

    submitSectionRoleForm(form){
        this.loadingService.show();
        let body = {
            staffRoleId: form.value.staffRoleId,
            templateSectionId: this.selectedTemplateSectionId,
        };
        ////console.log("body",body);
        if (this.selectedsectionroleid === null) {
            this.documentService.savedocumenttemplatesectionrole(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllRoleBySection(this.selectedTemplateSectionId);
                   this.displayModalSectionRoleForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else {
            this.documentService.updatedocumenttemplatesectionrole(body, this.selectedsectionroleid).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.getAllRoleBySection(this.selectedTemplateSectionId);
                    this.displayModalSectionRoleForm = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }



        
    }
    removeDocumentSectionRole(row) {
        let sectionRoleId = row.sectionRoleId;
        let selectedTemplateSectionId = row.templateSectionId;
        const __this = this;

        swal({
            title: 'Are you sure?',
            text: 'You want to delete this record!',
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
            __this.documentService.removedocumenttemplatesectionrole(sectionRoleId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllRoleBySection(selectedTemplateSectionId);

                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                }
            }, (err) => {
                __this.loadingService.hide();
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Operation cancelled', 'error');
            }
        });
    }
    editDocumentSectionRole(row){
         // var row = this.documents[index];
         this.selectedsectionroleid = row.sectionRoleId;
         this.selectedTemplateSectionId = row.templateSectionId;
         this.documentSectionRoleForm = this.fb.group({
            staffRoleId: [row.staffRoleId, Validators.required],
         });

         this.displayModalSectionRoleForm = true;
    }

    updateFromEditor: number = 0;
    
    saveSection() {
        this.updateFromEditor++;
        let __this = this;
        setTimeout(function () {
            __this.submitSectionForm();
        }, 2000);
    }

    getNewDocumentValue(content) {
        this.documentContent = content;
    }
}