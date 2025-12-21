import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { ProductService, GeneralSetupService } from '../../services';
import { CustomerService } from '../../../customer/services/customer.service';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import swal from 'sweetalert2';

@Component({
  selector: 'app-product-class',
  templateUrl: './product-class.component.html',
})
export class ProductClassComponent implements OnInit {
  panelHeader: string;
  customerTypes: any[];
  productClassData: any[];
  productClassProcess: any[];
  productClassTypes: any[];
  displayAddUpdateModal: boolean = false;
  productClassForm: FormGroup;
  businessUnit: any;
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private productService: ProductService,
    private customerService: CustomerService, 
    private genSetupServ: GeneralSetupService,
    ) { }

  ngOnInit() {
    this.loadDropDown();
    this.productClassList();
    this.clearControls();
    this.getProfileBusinessUnits();
  }

  productClassList() {
    this.loadingService.show()
    this.productClassData = [];
    this.productService.getAllProductClassification().subscribe((data) => {
      this.productClassData = data.result;
      this.loadingService.hide()
    });
  }
  loadDropDown() {
    this.productService.getAllProductProcess().subscribe((data) => {
      this.productClassProcess = data.result;
    });

    this.productService.getAllProductClassType().subscribe((data) => {
      this.productClassTypes = data.result;
    });

    this.customerService.getAllCustomerTypes().subscribe((response: any) => {
      this.customerTypes = response.result;
    });
  }
  clearControls() {
    this.productClassForm = this.fb.group({
      productClassId: [0],
      productClassName: ['', Validators.required],
      productClassTypeId: ['', Validators.required],
      productClassProcessId: ['', Validators.required],
      //customerTypeId: ['', Validators.required],
      businessUnitId:['',Validators.required],
      globalSla: ['', Validators.required]
    });
  }
  showModalForm() {
    this.clearControls();
    this.panelHeader = "New Product Classification";
    this.displayAddUpdateModal = true;
  }
  editProductClass(index, event) {
    event.preventDefault();
    this.panelHeader = "Edit Product Classification";
    const row = index;
    this.productClassForm = this.fb.group({
      productClassId: [row.productClassId],
      productClassName: [row.productClassName, Validators.required],
      productClassTypeId: [row.productClassTypeId, Validators.required],
      productClassProcessId: [row.productClassProcessId, Validators.required],
      // customerTypeId: [row.customerTypeId, Validators.required],
      businessUnitId:[row.businessUnitId,Validators.required],
      globalSla: [row.globalSla, Validators.required]
    });

    this.displayAddUpdateModal = true;
  }

  submitForm(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    this.productService.addUpdateProductClassification(body).subscribe((res) => {
      if (res.success == true) {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.productClassList();
        this.displayAddUpdateModal = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }

  getProfileBusinessUnits(){
    this.genSetupServ.getProfileBusinessUnits().subscribe((response: any) => {
        this.businessUnit = response.result;
    });
}
}
