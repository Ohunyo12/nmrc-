import { DepartmentService } from '../../services';
import { BranchService } from '../../services';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
import { DocumentService, StaffRoleService } from 'app/setup/services';
import { ProductService} from 'app/setup/services';


@Component({
  selector: 'app-house-expense-debit-ratio-setup',
  templateUrl: './house-expense-debit-ratio-setup.component.html',
})
export class HousingExpenseDebitRatioComponent implements OnInit {
  selectedId: number = null;
  displayAddModal: boolean = false;
  entityName: string = "New House Expense Debit Ratio";
  houseExpenseForm: FormGroup;
  
  branches: any[];
  employmentType : any[];
  departments: any[];
  products: any[];
  show: boolean = false; message: any; title: any; cssClass: any;
  downPayments: any;
  debitRatios: any;
  debiRatios: any;
  constructor(private loadingService: LoadingService, private fb: FormBuilder,
    private branchService: BranchService,
    private departmentService: DepartmentService,
  private docServ: DocumentService,
  private productService: ProductService,
  private loadingSrv: LoadingService,
) { }

  ngOnInit() {
    this.getBranches();
    this.getAllDepartment();
    this.getAllproducts();  
    this.clearControls();
    this.loadDebitRatios();
  }
  showAddModal() {
    this.clearControls();
    this.entityName = "New House Expense Debit Ratio";
    this.displayAddModal = true;
  }
   loadDebitRatios(): void {
 this.debiRatios = [
  {
    productId: 'Personal Loan',
    minAmt: 50000,
    maxAmt: 200000,
    maxPTI: 40,
    maxDTI: 50
  },
  {
    productId: 'Mortgage Loan',
    minAmt: 200000,
    maxAmt: 1000000,
    maxPTI: 35,
    maxDTI: 45
  },
  {
    productId: 'Auto Loan',
    minAmt: 100000,
    maxAmt: 500000,
    maxPTI: 30,
    maxDTI: 40
  },
  {
    productId: 'Business Loan',
    minAmt: 300000,
    maxAmt: 5000000,
    maxPTI: 50,
    maxDTI: 60
  }
];
}

  getAllDepartment(): void {
    this.loadingService.show();
    this.departmentService.getDepartments().subscribe((response: any) => {
      this.debitRatios = response.result;
      this.loadingService.hide();
    }, (err) => {
      this.loadingService.hide(1000);
    });
  }
  getBranches() {
    this.branchService.get().subscribe((response: any) => {
      this.branches = response.result;
    });
  }

      getAllproducts() {
        this.loadingSrv.show();
        this.productService.getAllProducts()
            .subscribe((res) => {
                this.products =  res.result;
            
                this.products.slice;
                this.loadingSrv.hide();
            }, (err) => {
                this.loadingSrv.hide();
            });
    }
  editHouseDebitRatio(index) {
    this.entityName = "Edit Down Payment";
    var row = this.debitRatios[index];
    this.selectedId = row.debiRatiosId; 
    this.houseExpenseForm = this.fb.group({
      // branchName: [row.branchName],
      debiRatiosId: [row.debiRatiosId],
      minAmt: [row.minAmt],
      productId: [row.productId],
      // departmentCode: [row.departmentCode],
      //employmentTypeId: [row.employmentTypeId],
      maxAmt: [row.maxAmt],
      maxPTI : [row.maxPTI],
       maxDTI : [row.maxDTI]  
    });
    this.displayAddModal = true;
  }
  submitForm(formObj) {
    this.loadingService.show();
    const bodyObj = formObj.value;
    if (this.selectedId === null) {
      this.departmentService.save(bodyObj).subscribe((res) => {
        if (res.success == true) {
          this.finishGood(res.message);
          this.getAllDepartment();
          this.loadDebitRatios();
          this.displayAddModal = false;
        } else {
          this.finishBad(res.message);
        }
      }, (err: any) => {
        this.finishBad(JSON.stringify(err));
      });
    } else {
      this.departmentService.update(bodyObj, this.selectedId).subscribe((res) => {
        if (res.success == true) {
          this.selectedId = null;
          this.finishGood(res.message);
          this.getAllDepartment();
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
    this.houseExpenseForm = this.fb.group({
      // branchName: [''],
      debiRatiosId: [''],
      productId: ['', Validators.required],
      minAmt : ['', Validators.required],
      // departmentCode: ['', Validators.required],
      //employmentTypeId: ['', Validators.required],
      maxAmt: ['', Validators.required],
  maxPTI: [
    '',
    [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]
  ],
    maxDTI: [
    '',
    [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]
  ]    
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

      removeHouseDebitRatio(row) {
          let selectedDebitRatioId = row.debitRatiosId;
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
              __this.docServ.deleteDebiRatio(selectedDebitRatioId).subscribe((response: any) => {
                  __this.loadingService.hide();
                  if (response.success === true) {
                      swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
                      __this.getAllDepartment();
                      this.loadDebitRatios();
  
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
