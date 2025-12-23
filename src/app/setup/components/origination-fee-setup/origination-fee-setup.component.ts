import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'app/setup/services';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-origination-fee-setup',
  templateUrl: './origination-fee-setup.component.html',
  styleUrls: ['./origination-fee-setup.component.scss']
})
export class OriginationFeeSetupComponent implements OnInit {
  displayCreateEditModal: boolean;
  originationFeeFormGroup: FormGroup;
  originationId: any;
  originationFeeData: any[] = [];
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

        this.getAllOriginationFeeSetup();
      });
  }


  getAllOriginationFeeSetup() {
    this.loadingService.show();

    this.productService.getAllOriginationFeeSetup().pipe(
      finalize(() => this.loadingService.hide())).subscribe((data: any) => {
        const fees = data.result;

        console.log('origination fees:', fees);

        this.originationFeeData = fees.map(fee => {
          const productId = fee.productid;
          const originationId = fee.id;
          const percentage = fee.percentage;

          return {
            originationId: Number(originationId),
            productTypeId: Number(productId),
            percentage: Number(percentage),
            productName: this.productMap.get(productId) || 'Unknown Product'
          };
        });

        console.log('Final Origination Fee Data:', this.originationFeeData);
      },
        error => {
          console.error('Error loading origination fees', error);
        }
      );
  }


  loadForms() {
    this.originationFeeFormGroup = this.fb.group({
      originationId: [''],
      productTypeId: ['', Validators.required],
      originationFee: ['', Validators.required]
    });
  }

  editOriginationFeeSetup(row) {
    this.displayCreateEditModal = true;

    this.originationFeeFormGroup = this.fb.group({
      originationId: [row.originationId],
      productTypeId: [row.productTypeId, Validators.required],
      originationFee: [row.percentage, Validators.required]
    });
    console.log('Form value after patch:', this.originationFeeFormGroup.value);
  }



  deleteOriginationFeeSetup(row) {
    this.loadingService.show();
    this.originationId = row.originationId;

    this.productService.deleteOriginationFeeSetup(row.originationId).pipe(finalize(() => this.loadingService.hide())).subscribe(
      (res: any) => {
        this.displayCreateEditModal = false;

        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }

        this.getAllOriginationFeeSetup();
      },
      (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      }
    );
  }

  submitOriginationFeeSetupForm(form) {

    this.loadingService.show();
    let bodyObj = {
      PRODUCTID: form.value.productTypeId,
      PERCENTAGE: form.value.originationFee

    };

    const selectedId = form.value.originationId;
    if (!selectedId) { // creating a new group
      this.productService.addOriginationFeeSetup(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllOriginationFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
      this.productService.updateOriginationFeeSetup(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllOriginationFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();
    // this.displayCreateEditModal = false;
  }
}



