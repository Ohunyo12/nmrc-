import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingService } from '../../../../shared/services/loading.service';
import { CustomerService } from '../../../services/customer.service';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../../../shared/constant/app.constant';

@Component({
  selector: 'app-director-related-customer',
  templateUrl: './director-related-customer.component.html',
})
export class DirectorRelatedCustomerComponent implements OnInit {
  directorRelatedCustomerList: any[] = [];

  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  @Input('show') displayDirectorRelatedCustomer: boolean = false;
  @Input('bvn') set directorBVN(value: number) {
    if (value > 0) this.getDirectorRelatedCustomer(value);
  }
  constructor(private loadingService: LoadingService,
    private customerService: CustomerService, ) { }

  ngOnInit() {
  }
  getDirectorRelatedCustomer(bvn) {
    this.loadingService.show();
    this.customerService.getDirectorRelatedCustomer(bvn).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {
        this.directorRelatedCustomerList = response.result;
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'warning');
        this.closeInfo()
      }

    });
  }
  closeInfo() {
    this.directorRelatedCustomerList = null;
    this.closeModal.emit(false);
  }
}
