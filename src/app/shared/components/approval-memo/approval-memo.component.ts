import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService } from 'app/credit/services/credit-appraisal.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-approval-memo',
  templateUrl: './approval-memo.component.html',
  styleUrls: ['./approval-memo.component.scss']
})
export class ApprovalMemoComponent implements OnInit {

	@Input() OPERATION_ID = 0;
	@Input() targetId = 0;//for memo DB because the structure of some components are already faulty
	@Input() targetIdForWorkFlow = 0;
	@Input() customerId = 0;
	@Input() referenceNumber = "";
	@Input() label = "";
	@Input() showControls = false;
	@Input() allowTemplateToLoad = false;
	canLoadDocument = false;


	displayDocumentation = false;
	editMode = false;
	sectionContent: any;
	sectionDescription: any;
	selectedSectionId: number;
	selectedSectionIdIndex: number;
	documentationSections = [];
	documentations = [];
	documentTemplates = [];
    documentSectionForm: FormGroup;
    appendForm: FormGroup;
	ckeditorChanges: any;
	displayAppendModal = false;
	isLoadTemplate = false;

    constructor(
        private camService: CreditAppraisalService,
        private loadingService: LoadingService,
        private fb: FormBuilder,

	) { }

	ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add '${implements OnChanges}' to the class.
        if (this.OPERATION_ID > 0 && this.targetId > 0){
			this.getDocumentTemplate(false);
        	this.loadDefaultDocumentTemplate();
        }
    }

    ngOnInit(): void {
		this.clearControls();
	}
	
	clearControls() {
        this.documentSectionForm = this.fb.group({
            sectionId: ['', Validators.required],
		});

		this.appendForm = this.fb.group({
            creditTemplateId: ['', Validators.required],
        });
	}

	getDocumentationSections() {
		if(this.OPERATION_ID <= 0 || this.targetId <= 0){
			return;
		}
        this.loadingService.show();
        this.documentationSections = [];
        this.camService.getDocumentSections(this.OPERATION_ID, this.targetId).subscribe((response: any) => {
            this.loadingService.hide();
            this.documentationSections = response.result;
            if (!isNullOrUndefined(this.documentationSections) && this.documentationSections.length > 0) {
                this.isLoadTemplate = true;
            }
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

	getDocumentTemplate(requireModal = true) {
		if(this.OPERATION_ID <= 0 || this.targetId <= 0){
			return;
		}
        this.clearControls();
        this.loadingService.show();
        this.documentTemplates = [];

        this.camService.getDocumentTemplates(this.OPERATION_ID).subscribe((response: any) => {
            this.documentTemplates = response.result;
            if(this.documentTemplates.some(t => t.canLoadDocument == true) == true){
                this.canLoadDocument = true;
            }
            if(requireModal == true) { 
                this.displayAppendModal = true; 
            } else if(response.success == true){
            // this.loadDefaultDocumentTemplate();
            }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

	loadDefaultDocumentTemplate() {  
        // if (this.documentTemplates.length > 0) {
        //     const body = {
        //         templateId: this.documentTemplates[0].templateId,
        //         operationId: this.OPERATION_ID,
        //         targetId: this.applicationSelection.loanApplicationId,
        //     };
        //     this.loadingService.show();
        //     this.camService.loadDocumentTemplate(body).subscribe((response: any) => { // heavy call!
        //     if(response.success == true){
        //       this.isLoadTemplate = true;
        //     }
        //     this.loadingService.hide();
        //     this.displayAppendModal = false;
        //     if(response.success){
        //         this.preLoadDocument();
        //     }

        // }, (err) => {
        //         this.loadingService.hide(1000);
        //     });
        // }
        this.getDocumentationSections();
	}

	loadDocumentTemplate(form) {
		if(this.OPERATION_ID <= 0 || this.targetId <= 0){
			return;
		}
        const body = {
            templateId: form.value.creditTemplateId,
            operationId: this.OPERATION_ID,
            targetId: this.targetId,
        }

        this.loadingService.show();
        this.camService.loadDocumentTemplate(body).subscribe((response: any) => { // heavy call!
        this.loadingService.hide();
        if(response.success == true){
            this.isLoadTemplate = true;
        }
        this.displayAppendModal = false;
        ////console.log('loadDocumentTemplate -> ',response);
        this.getDocumentationSections();
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }
	
	preLoadDocument() {
		this.previewDocumentation(false);
	}

	previewDocumentation(print = false) {
		if(this.OPERATION_ID <= 0 || this.targetId <= 0|| this.customerId <= 0){
			return;
		}
        this.documentations = [];
        this.loadingService.show();
        this.camService.getDocumentationGeneric(this.OPERATION_ID, this.targetId, this.targetIdForWorkFlow, this.customerId).subscribe((response: any) => {
        this.documentations = response.result;
        this.loadingService.hide();
        if (print == false) this.displayDocumentation = true;
        else setTimeout(() => this.print(), 1000);
        }, (err) => {
            this.loadingService.hide(1000);
        });
    }

	nextSection(direction) {
        const max = this.documentationSections.length - 1;
        let index = direction == 1 ? this.selectedSectionIdIndex - 1 : this.selectedSectionIdIndex + 1;
        if (index > max) index = 0;
        if (index < 0) index = max;
        const sectionId = this.documentationSections[index].sectionId;
        this.documentSectionForm.controls['sectionId'].setValue(sectionId);
        this.onDocumentSectionChange(sectionId);
    }

	onDocumentSectionChange(sectionId) { 
		if(this.OPERATION_ID <= 0 || this.targetId <= 0|| this.customerId <= 0){
			return;
		}
        if(sectionId == null || sectionId == '') {
			// this.displayDocumentation = true; 
			this.sectionContent = "";
			this.sectionDescription ="";
			return;
		}
        if(sectionId > 0) {
             this.displayDocumentation = false 
            }
        this.loadingService.show();
        this.camService.getDocumentSectionGeneric(this.OPERATION_ID, this.targetId, this.targetIdForWorkFlow, sectionId, this.customerId).subscribe((response: any) => {
			if (response.result == null) {
				return;
			}
            this.editMode = (response.result.editable == true);
            this.sectionContent = response.result.templateDocument;
            this.sectionDescription = response.result.description;
            this.selectedSectionId = sectionId;
            this.selectedSectionIdIndex = this.documentationSections.findIndex(x => x.sectionId == sectionId);
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });
	}
	
	saveSection(alert = false) {
        this.sectionContent = this.ckeditorChanges; // on save click
        const body = {
            templateDocument: this.sectionContent,
            sectionId: this.selectedSectionId
        };
        this.camService.saveSection(body).subscribe((response: any) => {
            ////console.log('saved --> ', response);
            this.ckeditorChanges = null; // cleanup
            if (alert == true) {
                swal(`${GlobalConfig.APPLICATION_NAME}`, 'Document saved!', 'success');
            }
        });
    }
	
	print(): void {

        let printTitle = 'APPROVAL MEMO ' + this.label +' No.:' + this.referenceNumber;
        let printContents, popupWin;

        let content = '<div class="row">';
        this.documentations.forEach(x => {
            content = content + `<div class="col-md-12"><p><span style="font face: arial; size:12px">${x.templateDocument}</span></p></div>`;
        });
        content = content + '</div>';

        printContents = content;// document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
            <html>
                <head>
                <title style="font face: arial; size:12px">${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()" style="font face: arial; size:12px">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
	}

	printSelectedSection(): void {
            let printTitle = 'APPROVAL MEMO ' + this.label +' No.:' + this.referenceNumber;
            let printContents, popupWin;
            printContents = document.getElementById('print-selected-section').innerHTML;
            popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=100%');
            popupWin.document.open();
            popupWin.document.write(`
            <html>
                <head>
                <title>${printTitle}</title>
                <style>
                //........Customized style.......
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
            );
            popupWin.document.close();
     	}
	
    contentChange(updates) { 
		this.ckeditorChanges = updates; 
	}

	closeDocumentation() {
        this.displayDocumentation = false;
        this.documentations = [];
    }

    loadEditor(body) {
        this.sectionContent = body;
	}
	
	dialogHiding(event: Event) {
        const element = document.getElementsByTagName('html');
        element[0].style.overflow = "visible" ;
    }

    dialogShowing(event: Event) {
        const element = document.getElementsByTagName('html');
        element[0].style.overflow = "hidden" ;
    }

}
