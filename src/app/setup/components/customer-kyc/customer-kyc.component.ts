
import { LoadingService } from '../../../shared/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { EditorModule, SharedModule } from 'primeng/primeng';
import { ProductService } from '../../services';
import { ApprovalService } from '../../services';
import swal from 'sweetalert2';
import { CustomerService } from "../../../customer/services/customer.service";
import { GlobalConfig } from '../../../shared/constant/app.constant';

@Component({
    templateUrl: 'customer-kyc.component.html'
})

export class CustomerKYCComponent implements OnInit {
    [x: string]: any;
    kyc: any[] = []; product: any[] = []; displayModalForm = false; positions: any[];
    selectedId: number = null;
    entityName = 'KYC Item'; kycitemform: FormGroup; kycObject: any[];
    constructor(private productServ: ProductService,
        private loadingSrv: LoadingService,
        private fb: FormBuilder, private customerServ: CustomerService) { }

    // tslint:disable-next-line:member-ordering
    allPositions = [
        { 'id': '1', 'name': 'Position 1', },
        { 'id': '2', 'name': 'Position 2', },
        { 'id': '3', 'name': 'Position 3', },
        { 'id': '4', 'name': 'Position 4', },
        { 'id': '5', 'name': 'Position 5', },
        { 'id': '6', 'name': 'Position 6', },
        { 'id': '7', 'name': 'Position 7', },
        { 'id': '8', 'name': 'Position 8', },
        { 'id': '9', 'name': 'Position 9', }
    ];
    ngOnInit(): void {
        this.KYCItemsForms();
        this.getAllProducts();
        this.getAllKYC();
        this.getLevels();
    }

    filterPositions(list: any[], filter: boolean = true) {
        this.positions = this.allPositions;
        if (filter) {
            list.forEach(element => {
                this.positions = this.positions.filter(x => x.id != element.position)
            });
        }
    }

    onSubmitKycItemForm(kycitemform) {
        const bodyObj = kycitemform.value;
        if (this.selectedId === null) { // creating a new group
            this.customerServ.addKyc(bodyObj).subscribe((response: any) => {
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getAllKYC();
                    this.displayModalForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        } else {
            this.customerServ.updateKYCItem(bodyObj, this.selectedId).subscribe((response: any) => {
                if (response.success === true) {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                    this.getAllKYC();
                    this.displayModalForm = false;
                } else {
                    swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
                }
            }, (err) => {
                swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
            });
        }
    }
    getLevels() {
        this.positions = this.allPositions;
    }

    showDisplayModalForm() {
        this.displayModalForm = true;
    }
    hideDisplayModalForm() {
        this.displayModalForm = false;
    }
    getAllProducts() {
        this.productServ.getAllProducts()
            .subscribe((res) => {
                this.product = res.result;
            });
    }

    getAllKYC() {
        this.customerServ.getAllKyc()
            .subscribe((res) => {
                this.kycObject = res.result;
            });
    }
    editKYCItem(evt, index) {
        evt.preventDefault;
        const row = this.kycObject[index];
        this.selectedId = row.kYCItemId;
        this.kycitemform = this.fb.group({
            kYCItemId: [row.kYCItemId],
            productId: [row.productId, Validators.required],
            productName: [row.productName, Validators.required],
            displayOrder: [row.displayOrder, Validators.required],
            isMandatory: [row.isMandatory],
            item: [row.item, Validators.required]
        })
        this.displayModalForm = true;
    }
    KYCItemsForms() {
        this.kycitemform = this.fb.group({
            kYCItemId: new FormControl(''),
            productId: new FormControl('', Validators.required),
            productName: new FormControl('', Validators.required),
            displayOrder: new FormControl('', Validators.required),
            isMandatory: new FormControl(''),
            item: new FormControl('', Validators.required)
        });
    }
}

