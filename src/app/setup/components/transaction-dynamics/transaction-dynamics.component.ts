import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingService } from '../../../shared/services/loading.service';
import { ConditionPrecedentService, StaffRoleService } from '../../services';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { ProductService } from '../../services';

@Component({
    templateUrl: 'transaction-dynamics.component.html'
})
export class TransactionDynamicsComponent implements OnInit {
    
    list: any[];
    products: any[];
    displayAddModal: boolean = false;
    entityName: string = 'Transaction Dynamics';
    addForm: FormGroup;
    show: boolean = false; message: any; title: any; cssClass: any; // message box
    selectedId: number = null;

    constructor(
        private fb: FormBuilder, 
        private loadingService: LoadingService, 
        private productService: ProductService,
        private conditionService: ConditionPrecedentService,
        private staffRole: StaffRoleService,
    ) { }

    ngOnInit() {
        this.refresh();
        this.getAllProducts();
        this.clearControls();
        // this.apiTest(); // <------------------------------- development only
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

    refresh(): void {
        this.loadingService.show();
        this.conditionService.getAllTransactionDynamics().subscribe((response: any) => {
            this.list = response.result;
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
            dynamics: ['', Validators.required],
            productId: [''],
            isExternal: [false],

        });
    }

    submitForm(form) { 
        let body = {
            dynamics: form.value.dynamics,
            productId: form.value.productId,
            isExternal: form.value.isExternal,

        };
        this.loadingService.show();
        if (this.selectedId === null) { 
            this.conditionService.saveTransactionDynamics(body).subscribe((res) => {
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
            this.conditionService.updateTransactionDynamics(body, this.selectedId).subscribe((res) => {
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
        this.selectedId = row.dynamicsId;
        this.addForm = this.fb.group({
            dynamics: [row.dynamics, Validators.required],
            productId: [row.productId],
            isExternal:[row.isExternal],
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
            dynamics: ['wert off data', Validators.required],
            isExternal: [false],
            corporate: [false],
            retail: [false],
            productId: [''],
        });
        this.submitForm(form);
        this.refresh();
        this.selectedId = 2; // change
        this.submitForm(form);
        this.selectedId = null;
    }
    // =============================================    

    
}