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


@Component({
  selector: 'app-down-payment-setup',
  templateUrl: './down-payment-setup.component.html',
})
export class DownPaymentComponent implements OnInit {



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
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private branchService: BranchService,
    private departmentService: DepartmentService,
  private docServ: DocumentService,
  private productService: ProductService,
  private loadingSrv: LoadingService,
    private generalSetupService: GeneralSetupService,

) { }

  ngOnInit() {
    this.getBranches();
    this.getAllDownPayment();
    this.getAllproducts();  
    this.clearControls();
    this.loadDownPayment();

  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New Down Payment";
    this.displayAddModal = true;
  }
  getAllDepartment(): void {
    this.loadingService.show();
    this.departmentService.getDepartments().subscribe((response: any) => {
      this.downPayments = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }


getEmploymentType(employmenttypeid: any): string {
  //console.log(selectedId)
  const numId = Number(employmenttypeid);  // convert string to number
  switch(numId) {
    case 0: return 'Self Employed';
    case 1: return 'Employed';
    case 2: 
    case 3: return 'Unemployed';
    default: return 'Unknown';
  }
}


    getAllDownPayment(): void {
    //this.loadingService.show();
    this.generalSetupService.getAllDownPayment().subscribe((response: any) => {
      this.downPayments = response.result;
      console.log(this.downPayments)
      this.loadingService.hide();
    }, (err) => {
      //this.loadingService.hide(1000);
    });
  }
  getBranches() {
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
  }

    loadDownPayment(): void {
    this.downPaymentss = [
      {
        employmentTypeId: 'Employed',
        productId: 'Personal Loan',
        minAmt: 50000,
        maxAmt: 500000,
        percent: 30
      },
      {
        employmentTypeId: 'Employed',
        productId: 'Mortgage Loan',
        minAmt: 200000,
        maxAmt: 5000000,
        percent: 40
      },
      {
        employmentTypeId: 'Self Employed',
        productId: 'Car Loan',
        minAmt: 100000,
        maxAmt: 3000000,
        percent: 35
      },
      {
        employmentTypeId: 'Self Employed',
        productId: 'Salary Advance',
        minAmt: 20000,
        maxAmt: 200000,
        percent: 25
      }
    ];
  }

      getAllproducts() {
        this.loadingSrv.show();
        this.productService.getAllProducts1()
            .subscribe((res) => {
                this.products =  res.result;
            //console.log(res)
                this.products.slice;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
    }
  editDownPayment(rowIndex) {
    this.entityName = "Edit Down Payment";
    var row = this.downPayments[rowIndex];
    //console.log(row)
    this.selectedId = row.id; 
    this.downPaymentForm = this.fb.group({

      ID: [row.id],
      MINAMOUNT: [row.minamount],
      productId: [row.productid],
     
      employmentTypeId: [row.employmenttypeid],
      MAXAMOUNT: [row.maxamount],
  PERCENTAGE: [
    row.percentage,
    [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]
  ]
    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    console.log(bodyObj)
    if (this.selectedId === null) {
      this.generalSetupService.saveDownPayment(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllDownPayment();
          //this.loadDownPayment();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.generalSetupService.updateDownPayment(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllDownPayment();
         // this.loadDownPayment();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    }
  }
  clearControls() {
    this.selectedId = null;
    this.downPaymentForm = this.fb.group({
      // branchName: [''],
      ID: [''],
      productId: ['', Validators.required],
      MINAMOUNT : ['', Validators.required],
      // departmentCode: ['', Validators.required],
      employmentTypeId: ['', Validators.required],
      MAXAMOUNT: ['', Validators.required],
      PERCENTAGE: ['', Validators.required],
    });
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

      removeDownpayment(row) {
          let selectedDownpaymentId = row.id;
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
              __this.generalSetupService.deleteDownpayment(selectedDownpaymentId).subscribe((response: any) => {
                  __this.loadingService.hide();
                  if (response.success === true) {
                      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                      __this.getAllDownPayment();
                          //this.loadDownPayment();
  
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
