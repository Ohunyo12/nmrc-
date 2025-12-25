

import { DepartmentService } from '../../services';
import { BranchService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { DocumentService, StaffRoleService } from 'app/setup/services';
import { ProductService} from 'app/setup/services';
import { GeneralSetupService } from '../../services';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-down-payment-setup',
  templateUrl: './down-payment-setup.component.html',

})
export class DownPaymentComponent implements OnInit {

  employmentTypeMap: { [key: number]: string } = {
  0: 'SelfEmployed',
  1: 'Employed',
  2: 'Unemployed'
};
    displayCreateEditModal: boolean;
 productMap = new Map<number, string>();

  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New down payment";
  downPaymentForm: FormGroup;
  
  branches: any[];
  employmentType : any[];
  departments: any[];
  products: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  downPayments: any;
  downPaymentss: any[];
  selectedDownpaymentId: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private branchService: BranchService,
    private departmentService: DepartmentService,
  private docServ: DocumentService,
  private productService: ProductService,
  private loadingSrv: LoadingService,
    private generalSetupService: GeneralSetupService,

) { }

  ngOnInit() {
    this.loadingService.show();
    this.loadForms();
    this.getProductTypes();
    this.loadingService.hide();
    this.getAllDownPayment();
  }

  showModalForm() {
    this.loadForms();
    this.displayCreateEditModal = true;
  }

  getProductTypes() {
    this.loadingService.show();

    this.productService.getProductTypes().pipe(
      finalize(() => this.loadingService.hide())).subscribe((response: any) => {
        this.products = response.result;

        this.products.forEach(p => {
          this.productMap.set(p.productId, p.productName);
        });



       
      });
  }


  getAllDownPayment() {
    this.loadingService.show();

    this.generalSetupService.getAllDownPayment().pipe(
      finalize(() => this.loadingService.hide())).subscribe((data: any) => {
        const downPayments = data.result;


        this.downPayments = downPayments.map(downPayments => {
          const downPaymentId = downPayments.id;
          const productId = downPayments.productid;

          const minAmount = downPayments.minamount;
          const maxAmount = downPayments.maxamount;
          const percentage = downPayments.percentage;
          const employmentTypeId = Number(downPayments.employmenttypeid);

          return {
            downPaymentId: Number(downPaymentId),
            employmentTypeId:employmentTypeId,
            productId: Number(productId),
    
            productName: this.productMap.get(productId) || 'Unknown Product',
            minAmount:minAmount,
            maxAmount: maxAmount,
            percentage: Number(percentage),
              employmentTypeName:
              this.employmentTypeMap[employmentTypeId] || 'Unknown'
          };
        });

      },
        error => {
      
        }
      );
  }


  loadForms() {
    this.downPaymentForm = this.fb.group({
      downPaymentId: [null],
      productId: ['', Validators.required],
      MINAMOUNT : ['', Validators.required],
      employmentTypeId: [null, Validators.required],
      MAXAMOUNT: ['', Validators.required],
      PERCENTAGE: ['', Validators.required],
    });
  }

  editDownPayment(row) {
    this.entityName = "Edit Down Payment";
    this.displayCreateEditModal = true;

    this.downPaymentForm = this.fb.group({
      downPaymentId: [row.downPaymentId],
  
      productId: [row.productId, Validators.required],
      MINAMOUNT : [row.minAmount, Validators.required],
      employmentTypeId: [row.employmentTypeId, Validators.required],
      MAXAMOUNT: [row.maxAmount, Validators.required],
      PERCENTAGE: [row.percentage, Validators.required],
    });
   
  }



  removeDownpayment(row) {

    this.loadingService.show();
    this.selectedDownpaymentId = row.downPaymentId;

 this.generalSetupService.deleteDownpayment(row.downPaymentId).pipe(
      finalize(() => this.loadingService.hide())).subscribe(
      (res: any) => {
        this.displayCreateEditModal = false;

        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }

        this.getAllDownPayment();
      },
      (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      }
    );
  }

  submitForm(form) {
    this.loadingService.show();
    let bodyObj = {
      
      PRODUCTID: form.value.productId,
   EMPLOYMENTTYPEID: Number(form.value.employmentTypeId),
      MINAMOUNT: form.value.MINAMOUNT,
      MAXAMOUNT: form.value.MAXAMOUNT,
      PERCENTAGE: form.value.PERCENTAGE
    };

    const selectedId = form.value.downPaymentId;

    if (!selectedId) { // creating a new group
      this.generalSetupService.saveDownPayment(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllDownPayment();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
       this.generalSetupService.updateDownPayment(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllDownPayment();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();

  }
}




