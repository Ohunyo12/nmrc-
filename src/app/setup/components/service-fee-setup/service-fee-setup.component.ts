import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'app/setup/services';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig, TenorType } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-service-fee-setup',
  templateUrl: './service-fee-setup.component.html',
  styleUrls: ['./service-fee-setup.component.scss']
})
export class ServiceFeeSetupComponent implements OnInit {
  displayCreateEditModal: boolean;
  serviceFeeFormGroup: FormGroup;
  serviceId: any;
  serviceFeeData: any[] = [];
  productTypes: any[] = [];
  productMap = new Map<number, string>();


  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private collateralService: CollateralService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.loadingService.show();
    this.loadForms();
    this.getProductTypes();
    this.loadingService.hide();
  }

  showModalForm() {
    this.loadForms();
    this.displayCreateEditModal = true;
  }

  getProductTypes() {
    this.loadingService.show();

    this.productService.getProductTypes().pipe(
      finalize(() => this.loadingService.hide())).subscribe((response: any) => {
        this.productTypes = response.result;

        this.productTypes.forEach(p => {
          this.productMap.set(p.productId, p.productName);
        });

        console.log('Product Map:', this.productMap);

        this.getAllServiceFeeSetup();
      });
  }


  getAllServiceFeeSetup() {
    this.loadingService.show();

    this.productService.getAllServiceFeeSetup().pipe(
      finalize(() => this.loadingService.hide())).subscribe((data: any) => {
        const fees = data.result;

        console.log('service fees:', fees);

        this.serviceFeeData = fees.map(fee => {
          const productId = fee.productid;
          const serviceId = fee.id;
          const percentage = fee.percentage;

          return {
            serviceId: Number(serviceId),
            productTypeId: Number(productId),
            percentage: Number(percentage),
            productName: this.productMap.get(productId) || 'Unknown Product'
          };
        });

        console.log('Final Service Fee Data:', this.serviceFeeData);
      },
        error => {
          console.error('Error loading Service fees', error);
        }
      );
  }


  loadForms() {
    this.serviceFeeFormGroup = this.fb.group({
      serviceId: [''],
      productTypeId: ['', Validators.required],
      serviceFee: ['', Validators.required]
    });
  }

  editServiceFeeSetup(row) {
    this.displayCreateEditModal = true;

    this.serviceFeeFormGroup = this.fb.group({
      serviceId: [row.serviceId],
      productTypeId: [row.productTypeId, Validators.required],
      serviceFee: [row.percentage, Validators.required]
    });
    console.log('Form value after patch:', this.serviceFeeFormGroup.value);
  }



  deleteServiceFeeSetup(row) {
    this.loadingService.show();
    this.serviceId = row.serviceId;

    this.productService.deleteServiceFeeSetup(row.serviceId).pipe(
      finalize(() => this.loadingService.hide())).subscribe(
      (res: any) => {
        this.displayCreateEditModal = false;

        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }

        this.getAllServiceFeeSetup();
      },
      (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      }
    );
  }

  submitServiceFeeSetupForm(form) {
    this.loadingService.show();
    let bodyObj = {
      PRODUCTID: form.value.productTypeId,
      PERCENTAGE: form.value.serviceFee
    };

    const selectedId = form.value.serviceId;
    if (!selectedId) { // creating a new group
      this.productService.addServiceFeeSetup(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllServiceFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
      this.productService.updateServiceFeeSetup(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllServiceFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();
    // this.displayCreateEditModal = false;
  }
}



