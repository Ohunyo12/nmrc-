import { Subject } from 'rxjs';
import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { ChecklistService, ApprovalService, ProductService } from 'app/setup/services';
import { stringify } from 'querystring';

@Component({
  selector: 'app-checklist-item-simulation',
  templateUrl: './checklist-item-simulation.component.html'
})
export class ChecklistItemSimulationComponent implements OnInit {

    // @Output() lookupEvent = new EventEmitter();
    productData: any[];
    // searchTerm$ = new Subject<any>();
    productData2: any[];
    checklistSimulationDetails: any[];
    productId: number;
    constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private checklistService: ChecklistService,
    private productService: ProductService) {  }

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productData = [];
    this.productService.getAllProducts().subscribe((data) => {
      this.productData2 = data.result;
    //   this.productData2.forEach(data => {
    //   });
    });
  }

  searchDB(searchString) {
        // this.searchTerm$.next(searchString);
        this.productService.searchProductRealtime(searchString).subscribe(results => {
        this.productData2 = results.result;
            });
  }

  onProductTypeChanged(index) {
    const prodId = index;
    this.loadingService.show();
    this.checklistService.getChecklistItemSimulationDetails(prodId)
      .subscribe((response: any) => {
        this.loadingService.hide();
        this.checklistSimulationDetails = response.result;
      });
  }
}
