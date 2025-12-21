import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'app/shared/services/loading.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomerService } from 'app/customer/services/customer.service';
import { RequestJobTypeService, StaffRealTimeSearchService } from 'app/setup/services';
import { Subject } from 'rxjs';
import swal from 'sweetalert2';

@Component({
    templateUrl: 'job-type-admin.component.html'
})
export class JobTypeAdminComponent implements OnInit {
    customerRelationshipTypes: any[];
    displayJobAdminForm: boolean = false;
    entityName: string = 'New Customer Relationship Type';
    jobAdminForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = 0;
    jobTypeList: any;
    jobTypeAdminStaffList: any;
    displaySearchModal: boolean;
    levelStaffForm: any;
    searchResults: Object;
    searchTerm$ = new Subject<any>();
    searchedName: any;
    staffId: any;
    reasignmentId: number;

    constructor(private loadingService: LoadingService, 
        private fb: FormBuilder, 
        private customerService: CustomerService,
        private realSearchSrv: StaffRealTimeSearchService,
        private requestJobTypeService: RequestJobTypeService) {
            this.realSearchSrv.search(this.searchTerm$).subscribe(results => {
                if (results != null) {
                    this.searchResults = results.result;
                }
            });
         }

    ngOnInit() {
        this.getJobType();
        this.getJobTypeAdminStaff();
        this.clearControls();
    }

    getJobType() {
        this.loadingService.show();
        this.requestJobTypeService.getJobTypes().subscribe((response: any) => {
            this.loadingService.hide();
            this.jobTypeList = response.result;
        }, (err) => {
            this.loadingService.hide();
        });
    }
  
    getJobTypeAdminStaff() { 
      this.requestJobTypeService.getJobTypeReasignmentAdminStaff().subscribe((response: any) => {
          this.jobTypeAdminStaffList = response.result;
      }, (err) => {
          this.loadingService.hide();
      });
    }

    clearForm(){
        this.displayJobAdminForm=false;
        this.clearControls();
        this.searchedName = null;
        this.reasignmentId = 0;
    }

    clearControls() {
        this.jobAdminForm = this.fb.group({
            jobTypeId: [0, Validators.required],
            staffId: ['', Validators.required],
            searchedName: [''],
        });
    }
     CreateNew() {
       this.displayJobAdminForm =true;
       this.reasignmentId = 0;
    }
    jobTypeId: number;
    selectedStaff: number;
    submitForm() {
             
        let body = {
        //   jobTypeId: form.value.jobTypeId,
        jobTypeId: this.jobTypeId,
          staffId: this.staffId,
          reasignmentId:this.reasignmentId
        }; 
        
        if(this.reasignmentId <= 0) {
            
            this.loadingService.show();
            
            this.requestJobTypeService.assignJobTypeToStaff(body).subscribe((res) => {
                if (res.success == true) { 
                    swal('Fintrak Credit 360',res.message, 'success');
                    this.displayJobAdminForm = false;
                    this.getJobTypeAdminStaff();
                    this.reasignmentId = 0;
                } else {  
                    swal('Fintrak Credit 360',res.message, 'warning');
                }
                this.loadingService.hide();
            }, (err: any) => {  
                swal('Fintrak Credit 360',JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        }

        if(this.reasignmentId > 0){
            
            this.loadingService.show();
           
            this.requestJobTypeService.updateAssignJobTypeToStaff(body).subscribe((res) => {
                if (res.success == true) {
                    swal('Fintrak Credit 360',res.message, 'success');
                    this.displayJobAdminForm = false;
                    this.getJobTypeAdminStaff();
                    this.reasignmentId = 0;
                } else {
                    swal('Fintrak Credit 360',res.message, 'warning');
                }
                this.loadingService.hide();
            }, (err: any) => {
                swal('Fintrak Credit 360',JSON.stringify(err), 'error');
                this.loadingService.hide();
            });
        }
    }

    editEditJobTypeAdmin(index) {
        this.entityName = 'Edit Job Admin'
        this.reasignmentId = 0;
        var row = this.jobTypeAdminStaffList[index];

        this.selectedId = row.lookupId;
        this.jobAdminForm = this.fb.group({
            jobTypeId: [row.jobTypeId, Validators.required],
            staffId: [row.staffId, Validators.required],
            searchedName: [row.staffName, Validators.required],
        });

        this.staffId =row.staffId
        this.searchedName = row.staffName;
        this.reasignmentId = row.reasignmentId;
        this.displayJobAdminForm = true;
    }

    deleteMappedJobTypeHubStaff(index){
        var row = this.jobTypeAdminStaffList[index];
        this.requestJobTypeService.deleteAssignedJobTypeToStaff(row.reasignmentId).subscribe((res) => {
           if (res.success == true) {
               swal('Fintrak Credit 360', res.message,'success');
               this.loadingService.hide();
               this.reasignmentId = 0;
           } else {
               swal('Fintrak Credit 360', res.message,'warning');
               this.loadingService.hide();
           }
       }, (err: any) => {
           swal('Fintrak Credit 360', JSON.stringify(err),'error');
           this.loadingService.hide();
       });
   }

    openSearchBox(): void {
        this.displaySearchModal = true;
    }

    pickSearchedData(data) {
        this.searchedName = data.fullName;
        this.staffId =data.staffId
        this.jobAdminForm.controls['staffId'].setValue(data.staffId);
        this.displaySearchModal = false;
    }

    searchDB(searchString) {
        searchString.preventDefault;
        this.searchTerm$.next(searchString);
    }

    finishBad(message) {
        this.showMessage(message, 'error', "FintrakBanking");
        this.loadingService.hide();
    }

    finishGood(message) {
        this.displayJobAdminForm = false;
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