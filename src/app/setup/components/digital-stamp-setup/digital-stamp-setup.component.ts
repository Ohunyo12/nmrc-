import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditAppraisalService } from 'app/credit/services';
import { DocumentService, StaffRoleService } from 'app/setup/services';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-digital-stamp-setup',
	templateUrl: './digital-stamp-setup.component.html',
	styleUrls: ['./digital-stamp-setup.component.scss']
})
export class DigitalStampSetupComponent implements OnInit {


	staffRole = [];
	files: FileList;
	file: File;
	@ViewChild('fileInput', { static: false }) fileInput: any;
	itemPanelHeader = 'New Digital Stamp';
	buttonTitle = 'Add';
	documentForm: FormGroup;
	selectedId: null;
	displayModalForm: boolean;
	stamps: any[];
	fileDocument: any;
	binaryFile: string;
	selectedDocument: any;
	displayDocument: boolean;
	displayApproveModal: any;
	documentContent: any;
	updateFromEditor: number = 0;
    displayViewModal: boolean;
    editMode: boolean;
	
	show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedStampId: any;

	constructor(private fb: FormBuilder,
		private staffRolServ: StaffRoleService,
		private camServ: CreditAppraisalService,
		private docServ: DocumentService,
		private loadingService: LoadingService) { }

	ngOnInit() {
		this.clearControls();
		this.getAllStaffRole();
		this.getAllDigitalStamps();
	}

	getAllDigitalStamps(): void {
		this.loadingService.show();
		this.docServ.getAllDigitalStamps().subscribe((response: any) => {

			this.stamps = response.result;
			this.loadingService.hide();
		}, (err) => {
			this.loadingService.hide(1000);
		});
	}

	showAddModal() {
        this.editMode = true;
		this.clearControls();
		this.displayModalForm = true;
	}
	onFileChange(event) {
		this.files = event.target.files;
		this.file = this.files[0];
	}

	clearControls() {
		this.selectedId = null;
        this.ckeditorChanges = null;


		this.documentForm = this.fb.group({
			stampName: ['', Validators.required],
			staffRoleId: ['', Validators.required],
			digitalStamp: [''],
		});

	}

	getAllStaffRole() {
		this.staffRolServ.getStaffRoles().subscribe((response: any) => {
			this.staffRole = response.result;
		});
	}

	fileExtention(name: string) {
        var regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

	

	saveSection() {
        this.updateFromEditor++;
        let __this = this;
        setTimeout(function () {
            __this.submitSectionForm();
        }, 2000);
    }

	ckeditorChanges: any;
    contentChange(updates) { this.ckeditorChanges = updates; }  

	hideModal(){
		this.displayApproveModal.emit(true);
	}

	submitSectionForm(form = this.documentForm){

        this.documentContent = this.ckeditorChanges; // on save click
        this.loadingService.show();
        let body = {
            stampName: form.value.stampName,
			staffRoleId: form.value.staffRoleId,
			digitalStamp: this.documentContent
        };
        ////console.log("body",body);
        
            this.docServ.uploadDigitalStampFile(body).subscribe((res) => {
                this.ckeditorChanges = null; // cleanup

                if (res.success == true) {
                    this.clearControls();
                    this.finishGood(res.message);
                    this.getAllDigitalStamps();
                   this.displayModalForm = false;
                } else {
                    this.finishBad(res.message);
                    ////console.log('BAD!', JSON.stringify(res.message));
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        
        
    }

    editDigitalStamp(row) {
        this.editMode = true;
        this.selectedStampId = row.digitalStampId;
       

        this.documentForm = this.fb.group({
            stampName: [row.stampName, Validators.required],
            staffRoleId: [row.staffRoleId, Validators.required],
           

            digitalStamp: [''],
        });
        this.documentContent = row.digitalStamp; // primeng editor loaded from the documentContent two-way binding
        
        //this.documentSectionForm.value.templateDocument = row.templateDocument;
        ////console.log(JSON.stringify(row));
        this.displayModalForm = true;

    }

    viewDigitalStamp(row) {
        this.editMode = false;
        this.selectedStampId = row.digitalStampId;
       

        this.documentForm = this.fb.group({
            stampName: [row.stampName, Validators.required],
            staffRoleId: [row.staffRoleId, Validators.required],
           

            digitalStamp: [''],
        });
        this.documentContent = row.digitalStamp; // primeng editor loaded from the documentContent two-way binding
        
        //this.documentSectionForm.value.templateDocument = row.templateDocument;
        ////console.log(JSON.stringify(row));
        this.displayModalForm = true;
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

    removeDigitalStamp(row) {
        let selectedStampId = row.digitalStampId;
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
            __this.docServ.deleteDigitalStamp(selectedStampId).subscribe((response: any) => {
                __this.loadingService.hide();
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    __this.getAllDigitalStamps();

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
	

}



