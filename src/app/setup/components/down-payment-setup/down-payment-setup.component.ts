

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
      this.productMap.clear();
        this.products.forEach(p => {
          this.productMap.set(Number(p.productId), p.productName);
        });


     // ✅ NOW load down payments
      this.getAllDownPayment();
       
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
  const productId = form.value.productId;
  const minAmount = form.value.MINAMOUNT;
  const maxAmount = form.value.MAXAMOUNT;
  const percentage = form.value.PERCENTAGE;



    if (!productId) {
    swal(
      `${GlobalConfig.APPLICATION_NAME}`,
      'Product is required.',
      'warning'
    );
    return;
  }

if (maxAmount <= minAmount) {
    swal(
      `${GlobalConfig.APPLICATION_NAME}`,
      'Maximum amount must be greater than minimum amount.',
      'warning'
    );
    return; // ⛔ stop submission
  }

      if (!percentage) {
    swal(
      `${GlobalConfig.APPLICATION_NAME}`,
      'Percentage is required.',
      'warning'
    );
    return;
  }

  this.loadingService.show();

  let bodyObj = {
    PRODUCTID: form.value.productId,
    EMPLOYMENTTYPEID: Number(form.value.employmentTypeId),
    MINAMOUNT: minAmount,
    MAXAMOUNT: maxAmount,
    PERCENTAGE: form.value.PERCENTAGE
  };

  const selectedId = form.value.downPaymentId;

  if (!selectedId) {
    this.generalSetupService.saveDownPayment(bodyObj).subscribe(
      (res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllDownPayment();
      },
      (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      }
    );
  } else {
    this.generalSetupService.updateDownPayment(bodyObj, selectedId).subscribe(
      (res) => {
        this.loadingService.hide();
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
        this.loadingService.hide();
      }
    );
  }

  this.loadForms();
}
// submitForm(form) {
//   const productId = Number(form.value.productId);
//   const employmentTypeId = Number(form.value.employmentTypeId);
//   const minAmount = form.value.MINAMOUNT;
//   const maxAmount = form.value.MAXAMOUNT;
//   const percentage = Number(form.value.PERCENTAGE);
//   const selectedId = form.value.downPaymentId;


//   if (!productId) {
//     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Product is required.', 'warning');
//     return;
//   }



//   if (maxAmount <= minAmount) {
//     swal(
//       `${GlobalConfig.APPLICATION_NAME}`,
//       'Maximum amount must be greater than minimum amount.',
//       'warning'
//     );
//     return;
//   }

//   if (!percentage || percentage <= 0) {
//     swal(`${GlobalConfig.APPLICATION_NAME}`, 'Percentage is required.', 'warning');
//     return;
//   }

//   const bodyObj = {
//     PRODUCTID: productId,
//     EMPLOYMENTTYPEID: employmentTypeId,
//     MINAMOUNT: minAmount,
//     MAXAMOUNT: maxAmount,
//     PERCENTAGE: percentage
//   };

//   this.loadingService.show();

//   const request$ = !selectedId
//     ? this.generalSetupService.saveDownPayment(bodyObj)
//     : this.generalSetupService.updateDownPayment(bodyObj, selectedId);

//   request$.subscribe(
//     (res) => {
     

//       if (res.success) {
//         swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
//         this.displayCreateEditModal = false;

//         // ✅ Reload forms ONLY on success
//         this.loadForms();
//         this.getAllDownPayment();
//          this.loadingService.hide();
//       } else {
//         swal(`${GlobalConfig.APPLICATION_NAME}`, res.message || 'Operation failed', 'error');
//       }
//     },
// (err) => {
//   this.loadingService.hide();

//   let errorMessage = 'Down payment already setup for this product and employment type';

//   if (err.error) {
//     if (typeof err.error === 'string') {
//       errorMessage = err.error;
//     } else if (err.error.message) {
//       errorMessage = err.error.message;
//     }
//   } else if (err.message) {
//     errorMessage = err.message;
//   }

//   swal(
//     `${GlobalConfig.APPLICATION_NAME}`,
//     errorMessage,
//     'error'
//   );
// }



//   );
//    this.loadForms();
// }
}




