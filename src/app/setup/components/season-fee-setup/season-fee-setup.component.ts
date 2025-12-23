import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'app/setup/services';
import { CollateralService } from 'app/setup/services/collateral.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import { finalize } from 'rxjs/operators';
import swal from 'sweetalert2';

@Component({
  selector: 'app-season-fee-setup',
  templateUrl: './season-fee-setup.component.html',
  styleUrls: ['./season-fee-setup.component.scss']
})
export class SeasonFeeSetupComponent implements OnInit {
  displayCreateEditModal: boolean;
  seasonFeeFormGroup: FormGroup;
  seasonId: any;
  seasonFeeData: any[] = [];
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

        this.getAllSeasonFeeSetup();
      });
  }


  getAllSeasonFeeSetup() {
    this.loadingService.show();

    this.productService.getAllSeasonFeeSetup().pipe(
      finalize(() => this.loadingService.hide())).subscribe((data: any) => {
        const fees = data.result;

        console.log('season fees:', fees);

        this.seasonFeeData = fees.map(fee => {
          const productId = fee.productid;
          const seasonId = fee.id;
          const duration = fee.duration;

          return {
            seasonId: Number(seasonId),
            productTypeId: Number(productId),
            duration: Number(duration),
            productName: this.productMap.get(productId) || 'Unknown Product'
          };
        });

        console.log('Final Season Fee Data:', this.seasonFeeData);
      },
        error => {
          console.error('Error loading season fees', error);
        }
      );
  }


  loadForms() {
    this.seasonFeeFormGroup = this.fb.group({
      seasonId: [''],
      productTypeId: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  editSeasonFeeSetup(row) {
    this.displayCreateEditModal = true;

    this.seasonFeeFormGroup = this.fb.group({
      seasonId: [row.seasonId],
      productTypeId: [row.productTypeId, Validators.required],
      duration: [row.duration, Validators.required]
    });
    console.log('Form value after patch:', this.seasonFeeFormGroup.value);
  }



  deleteSeasonFeeSetup(row) {
    this.loadingService.show();
    this.seasonId = row.seasonId;

    this.productService.deleteSeasonFeeSetup(row.seasonId).pipe(
      finalize(() => this.loadingService.hide())).subscribe(
      (res: any) => {
        this.displayCreateEditModal = false;

        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }

        this.getAllSeasonFeeSetup();
      },
      (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
      }
    );
  }

  submitSeasonFeeSetupForm(form) {
    this.loadingService.show();
    let bodyObj = {
      PRODUCTID: form.value.productTypeId,
      DURATION: form.value.duration
    };

    const selectedId = form.value.seasonId;
    if (!selectedId) { // creating a new group
      this.productService.addSeasonFeeSetup(bodyObj).subscribe((res) => {
        this.loadingService.hide();
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
          this.displayCreateEditModal = false;
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllSeasonFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    } else { // updating an existing group
      this.productService.updateSeasonFeeSetup(bodyObj, selectedId).subscribe((res) => {
        this.loadingService.hide();
        this.displayCreateEditModal = false;
        if (res.success === true) {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        } else {
          swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
        }
        this.getAllSeasonFeeSetup();
      }, (err) => {
        swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');
        this.loadingService.hide();
      });
    }
    this.loadForms();
    // this.displayCreateEditModal = false;
  }
}



