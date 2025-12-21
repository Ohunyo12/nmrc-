import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoanService } from 'app/credit/services/loan.service';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import { LoadingService } from 'app/shared/services/loading.service';
import swal from 'sweetalert2';
import { ReportService } from '../service/report.service';

@Component({
  selector: 'app-employer-related-loans-report',
  templateUrl: './employer-related-loans-report.component.html',
  styleUrls: ['./employer-related-loans-report.component.scss']
})
export class EmployerRelatedLoansReportComponent implements OnInit {

	startDate: Date;
  	endDate: Date;
	employerRelatedLoans = [];
	displayCommentForm: boolean = false;
	displayModalForm: boolean = false;

	constructor(
		private fb:FormBuilder,
		private loadingService: LoadingService,
		private reportServ: ReportService
	) { }

	ngOnInit() {
		this.startDate = new Date();
    	this.endDate = new Date();
	}

	GetFacilities():void {
		let data = {
		  startDate : this.startDate,
		  endDate : this.endDate,
	
		}
		this.loadingService.show();
		this.reportServ.GetEmployerRelatedData(data).subscribe((response: any) => {
			if(response.success == true)
			{
				this.employerRelatedLoans = response.result;
			}        
			this.loadingService.hide();
		}, (err: any) => {    
		  swal(`${GlobalConfig.APPLICATION_NAME}`, JSON.stringify(err), 'error');  
		  this.loadingService.hide(1000);
		});
	  }
}
