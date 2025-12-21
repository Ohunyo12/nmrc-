import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CasaService } from '../../../customer/services/casa.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-casa-account-balance',
  templateUrl: './casa-account-balance.component.html',
  providers: [CasaService]
})
export class CasaAccountBalanceComponent implements OnInit {
  accountNumberText:any;
  accountBalance: any;
  displaySearchModal:boolean;
  @Output() closeWindow = new EventEmitter<boolean>();
  @Input() showCASAAccountBanlancePopup = true;
  @Input() accountNumber:number;
  constructor( private casaSrv: CasaService,) { }

  ngOnInit() {
    this.accountNumberText = this.accountNumber;
    
  }

  GetAccountBalance(){

        this.casaSrv.getCustomerAccountBalance(this.accountNumberText).subscribe((data) => {
            if(data.result != undefined){
                this.accountBalance = data.result;
                if(this.accountBalance.hasBalance==false)
                {
                  this.accountBalance="";
                  swal('Fintrak Credit 360',"User unauthorised",'error');
                }
            }
            if(!data.success){
                swal('Fintrak Credit 360',data.message,'error');
            }
                
        }, err => {});
  }

  closeAccountBalanceWindow(){
    this.closeWindow.emit(true);
  }
}
