import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConditionPrecedentService, StaffRoleService } from '../../services';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ProductService } from '../../services';
import { Alert } from 'selenium-webdriver';
import { LoanApplicationService } from 'app/credit/services';

@Component({
    templateUrl: 'condition-precedent.component.html'
})
export class ConditionPrecedentComponent implements OnInit {
    
    conditions: any[] = [];
    products: any[] = [];
    complianceTimelines: any[] = [];
    displayAddModal: boolean = false;
    showOrHide: boolean = false;
    entityName: string = 'Condition';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;
    //isSubsequent:boolean= true;
    checkBoxValue: boolean = false;

    sectors:any[];
    subSectors:any[] = [];

    responseTypes: any[] = [
        { responseTypeId: 1, responseType: 'Waived, Provided or Deffered' },
        { responseTypeId: 2, responseType: 'Yes or No' },
        { responseTypeId: 3, responseType: 'Low, Medium, High' },
    ];
    isSubsequentCheck = true;
    constructor(
        private loadingService: LoadingService, 
        private fb: FormBuilder, 
        private productService: ProductService,
        private conditionService: ConditionPrecedentService,
        private loanAppService: LoanApplicationService,
        private staffRole: StaffRoleService,
    ) { }

    ngOnInit() {
        this.refresh();
        this.loadDropdowns();
        this.clearControls();
        this.getUserRole();
        // this.apiTest(); // <------------------------------- development only
        
        var timelineSelect = document.getElementById("timelineId");
        timelineSelect.setAttribute("disabled", "true");
    }

    userisAnalyst:boolean = false;
    userIsRelationshipManager = false;
    userIsAccountOfficer = false;
    userIsAccountOfficer2 = false;
    staffRoleRecord: any;
    
    getUserRole() {
        this.staffRole.getStaffRoleByStaffId().subscribe((res)=>{
            this.staffRoleRecord = res.result;
                if(this.staffRoleRecord.staffRoleCode == 'AO' || this.staffRoleRecord.staffRoleCode == 'AO / RO'
                || this.staffRoleRecord.staffRoleCode == 'PMU'
                || this.staffRoleRecord.staffRoleCode == 'RMO'
                || this.staffRoleRecord.staffRoleCode == 'CP'
                || this.staffRoleRecord.staffRoleCode == 'RO'
                || this.staffRoleRecord.staffRoleCode == 'BM') { 
                    this.userIsAccountOfficer = true; 
                }
            });
    }

    loadDropdowns() {
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        });
        this.conditionService.getAllComplianceTimeline().subscribe((response: any) => {
            this.complianceTimelines = response.result;
        });

        this.loanAppService.getSector().subscribe((response: any) => {
            this.sectors = response.result;
        });

        this.GetFilteredSubsector();
    }

    filteredSubsector: any[]; 
    GetFilteredSubsector() {
        this.filteredSubsector = [];
        this.loanAppService.getSubSector().subscribe((response: any) => {
            this.Subsectors = response.result;
        });
    }

    Subsectors:any;
    onSectorClassChange(id) {
        if (id == '' || id == null) {
            this.filteredSubsector = [];
            return;
        }
        this.filteredSubsector = this.Subsectors.filter(x => x.sectorId == id);
    }

    refresh(): void {
        this.loadingService.show();
        this.conditionService.getAllConditionsPrecedent().subscribe((response: any) => {
            this.conditions = response.result;
            this.loadingService.hide();
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }

    getAllProducts(): void {
        this.productService.getAllProducts().subscribe((response: any) => {
            this.products = response.result;
        }, (err) => {
            this.loadingService.hide(1000);
        });        
    }


    showAddModal() {
        this.clearControls();
        this.displayAddModal= true; 
    }

    clearControls() {
        this.selectedId = null;
        this.addForm = this.fb.group({
            condition: ['', Validators.required],
            responseTypeId: ['', Validators.required],
            isExternal: [false],
            corporate: [true],
            retail: [true],
            isSubsequent: [false], 
            productId: [''],
            timelineId: [''], 
            sectorId:[''],
            subSectorId:[''],
        });
    }

    
    isSubsequentChanged(value) {
        this.disableTimelineSelect(value);
    }

    disableTimelineSelect(value) {
        var timelineSelect = document.getElementById("timelineId");

        if (value == true) {
            timelineSelect.setAttribute("disabled", "true");
           // console.log("value ", value);
        }
        else {
            timelineSelect.removeAttribute("disabled");
           // console.log("value ", value);
        }
    }

    checkValue(event: any){
        // console.log(event);
     }

    submitForm(form) { 
        let body = {
            condition: form.value.condition,
            responseTypeId: form.value.responseTypeId,
            isExternal: form.value.isExternal,
            corporate: form.value.corporate,
            retail: form.value.retail,
            productId: form.value.productId,
            timelineId: form.value.timelineId,
            isSubsequent: form.value.isSubsequent,
            sectorId:form.value.sectorId,
            subSectorId:form.value.subSectorId,
        };
        this.loadingService.show();
        if (this.selectedId === null) { 
            this.conditionService.save(body).subscribe((res) => {
                if (res.success == true) {
                    this.finishGood(res.message);
                    this.refresh();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        } else { 
            this.conditionService.update(body, this.selectedId).subscribe((res) => {
            if (res.success == true) {
                    this.finishGood(res.message);
                    this.refresh();
                    this.displayAddModal = false;
                } else {
                    this.finishBad(res.message);
                }
            }, (err: any) => {
                this.finishBad(JSON.stringify(err));
            });
        }
    }

    edit(row) {
        this.selectedId = row.conditionId;
        this.addForm = this.fb.group({
            condition: [row.condition, Validators.required],
            responseTypeId: [row.responseTypeId, Validators.required],
            isExternal: [row.isExternal, Validators.required],
            corporate: [row.corporate, Validators.required],
            retail: [row.retail, Validators.required],
            productId: [row.productId],
            timelineId: [row.timelineId],
            isSubsequent: [row.isSubsequent],
            subSectorId:[row.subSectorId],
            sectorId:[row.sectorId],
            
        });
        this.displayAddModal = true;
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

    // ==============DEVELOPMENT ONLY===============    
    apiTest() { 
        let form = this.fb.group({
            condition: ['wert off data', Validators.required],
            isExternal: [false],
            corporate: [false],
            retail: [false],
            productId: [''],
            responseTypeId: [''],
        });
        this.submitForm(form);
        this.refresh();
        this.selectedId = 2; // change
        this.submitForm(form);
        this.selectedId = null;
    }
    // =============================================    


    deleteCondition(row) {
        const __this = this;
        swal({
            title: 'Delete Condition?',
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
    
            __this.conditionService.deleteCondition(row.conditionId).subscribe((res) => {
                    if (res.success == true) {
                      __this.finishGood(res.message);  
                       __this.refresh();
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
    

    
}