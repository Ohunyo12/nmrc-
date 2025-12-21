import { Component, OnInit } from '@angular/core';
import { LoanService } from 'app/setup/services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-batch-posting-main',
  templateUrl: './batch-posting-main.component.html',
  styleUrls: ['./batch-posting-main.component.scss']
})
export class BatchPostingMainComponent implements OnInit {
  searchInfo:any;
  startDate: Date;
  endDate: Date;
  batchPostingList: any;
  isLms: boolean;
  constructor(private loanService:LoanService) { }

  ngOnInit() {

    this.startDate = new Date();
    this.endDate = new Date();
  }
  getBatchPostingDetails() {
    let data ={
      startDate:this.startDate,
      endDate:this.endDate,
      searchInfo:this.searchInfo

    }
    this.loanService.getBatchPostingMain(data).subscribe((data) => {
      if (data.success==true){
        this.batchPostingList = data.result;
        }else{
          swal('FinTrak Credit 360', "No Record Found", 'error');
        }
  
    });
  }
  
}
