import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators, FormGroup } from "@angular/forms";
import { LoadingService } from "../../../shared/services/loading.service";
import { StaffService } from "../../services/staff.service";
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { DepartmentService } from "../../../setup/services/department.service";
import { MisInfoService } from "../../../setup/services/misinfo.service";
import { JobTitleService } from "../../../setup/services/jobtitle.service";
import { StaffRoleService } from "../../../setup/services/staff-role.service";
import { BranchService } from "../../../setup/services/branch.service";
import swal from 'sweetalert2';
import { Subject } from "rxjs";
import { StaffRealTimeSearchService } from "../../../setup/services/staff-realtime-search.service";
import { log } from "util";

@Component({
    templateUrl: 'staff-signature.component.html'
})

export class StaffSignatureComponent implements OnInit {
    displaySearchModal: boolean;

    staffSignatureForm: FormGroup;

    display = false;
    show = false;
    message: any;
    title: any;
    cssClass: any;
    sensitivities: any[];
    companies: any[];
    branches: any[];
    branchLoaded = false;
    departments: any[];
    staffDataset: any[];
    states: any[];
    cities: any[];
    isUpdate = true;
    cityLoaded = false;
    jobTitles: any[];
    misInfo: any[];
    ranks: any[];

    selectedStaff: any = {};

    uploadFileTitle: string = null;
    files: FileList;
    file: File;
    supportingDocuments: any[];
    @ViewChild('fileInput', {static: false}) fileInput: any;

    displayAddModal = false; searchTerm$ = new Subject<any>(); searchResults: any[] = [];
    searchedStaff: string; disableBtn = false;

    binaryFile: string;
    selectedDocument: string;
    displayDocument: boolean = false;

    constructor(private fb: FormBuilder, private loadingService: LoadingService,
        private staffService: StaffService, private deptService: DepartmentService,
        private misInfoService: MisInfoService, private branchService: BranchService,
        private jobTitleService: JobTitleService, private staffSearchSrv: StaffRealTimeSearchService,
        private rankService: StaffRoleService) {
        this.staffSearchSrv.search(this.searchTerm$).subscribe(results => {
            if (results != null) {
                this.searchResults = results.result;
            }
        });
    }

    ngOnInit() {
        this.loadingService.show();
        this.getAllStaffSignatures();
    }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.searchedStaff = `${data.firstName} ${data.lastName}`;
        this.selectedStaff = data;
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        this.searchTerm$.next(searchString);
    }

    initializeForm() {
        this.staffSignatureForm = this.fb.group({
            companyId: [0],
            branchId: ['', Validators.required],
            staffId: [''],
            staffCode: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            departmentId: ['', Validators.required],
            jobTitleId: ['', Validators.required],
            rankId: ['', Validators.required],
            gender: ['', Validators.required],

        });
    }

    getAllStaffSignatures() {
        this.staffService.getAllStaffSignatures().subscribe((val) => {
            this.staffDataset = val.result;
            // if (this.selectedStaff != {}) {
            //     let doc = this.staffDataset.find(x => x.staffCode == this.selectedStaff.staffCode);
            //     if (doc != null) { this.binaryFile = doc.fileData; }
            // }
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide();
        });
    }

    editStaff(row) {
        this.selectedStaff = row;
        this.searchedStaff = row.staffName;
        this.binaryFile = row.fileData;
        this.display = true;
    }

    showDialog() {
        this.refresh();
        this.display = true;
    }

    hideModal() {
        this.display = false;
        this.refresh();
    }

    refresh() {
        this.searchedStaff = '';
        this.selectedStaff = {};
        this.binaryFile = null;
        // this.files = null;
    }

    onFileChange(event) {
        this.files = event.target.files;
        this.file = this.files[0];
    }

    fileExtention(name: string) {
        const regex = /(?:\.([^.]+))?$/;
        return regex.exec(name)[1];
    }

    uploadFile() {

        if (this.file !== undefined || this.uploadFileTitle != null) {
            const body = {
                staffCode: this.selectedStaff.staffCode,
                documentTypeId: '1',
                fileName: this.file.name,
                fileExtension: this.fileExtention(this.file.name),
            };
            this.loadingService.show();
            this.staffService.uploadFile(this.file, body).then((response: any) => {

                if (response.success === true) {
                    this.getAllStaffSignatures();
                    swal('FinTrak Credit 360', "Added Successfully" , 'success');
                    this.hideModal();
                } else {
                    this.showError(response.message);
                    swal('FinTrak Credit 360', "Saving singature has failed with error : " + response.message , 'error');
                }
                // this.getSupportingDocuments(this.selectedStaff.staffCode);
            }, (error) => {
                this.loadingService.hide(1000);
            });
        }
    }

    // getSupportingDocuments(staffCode: string) {
    //     this.loadingService.show();
    //     this.staffService.getSupportingDocumentByStaffCode(staffCode).subscribe((response: any) => {
    //         this.supportingDocuments = [];
    //         this.supportingDocuments = response.result;
    //         // if  (this.supportingDocuments.length > 0) {
    //         //     this.disableBtn = true;
    //         // }
    //         this.loadingService.hide();
    //     }, (err) => {
    //         this.loadingService.hide();
    //     });
    // }

    viewDocument(id: number) {
        let doc = this.supportingDocuments.find(x => x.documentId == id);
        if (doc != null) {
            this.binaryFile = doc.fileData;
            this.selectedDocument = doc.documentTitle;
            this.displayDocument = true;
        }
    }


    showSuccess(message) {
        this.searchedStaff = ''; 
        this.searchResults = [];
        this.getAllStaffSignatures();
        this.display = false;
        this.isUpdate = true;
        this.loadingService.hide();
    }

    showError(message) {
        swal(`${GlobalConfig.APPLICATION_NAME}`, message, 'error');
        this.loadingService.hide();
    }

    
}