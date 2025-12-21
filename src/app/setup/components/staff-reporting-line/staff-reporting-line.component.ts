import { Component, OnInit } from '@angular/core';
import { StaffRoleService } from '../../services/staff-role.service';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-staff-reporting-line',
  templateUrl: './staff-reporting-line.component.html',
  //styleUrls: ['./staff-reporting-line.component.scss']
})
export class StaffReportingLineComponent implements OnInit {
  // staffSearchText(arg0: any): any {
  //   throw new Error("Method not implemented.");
  // }
  staffSearchText:any;
  staffReportings:any;
  searchParamemter:any;
  supervisorCode:any;
  supervisorName:any;
  supervisorBranch:any;
  supervisorEmail:any;
  SupervisorReportings: any;
  staffEmail: any;
  staffBranch: any;
  staffName: any;
  staffCodeNo: any;
  username: any;
  teamUnit: any;
  costCent: any;
  dept: any;
  region: any;
  group: any;
  directorate: any;
  mis: any;
  staffInfo: any;
  displaySearchModal: boolean;
  searchTerm$: any;
  staffSearched: any;
  searchResults: any;
  accountBalanceModal:boolean=false;
  staffSearchValue:any
  constructor( private staffRolServ: StaffRoleService,private loadingService: LoadingService,) { }

  ngOnInit() {
   // this.getAllStaffReportTo('SN024899');
    this.getSupervisorDetail(null);
    this.getStaffInformation(null);
    this. getStaffMIS(null);
    this.getAllStaffReportTo();
  }
  getAllStaffReportTo() {
    this.loadingService.show();
    let staffCode1 = this.searchParamemter;
    this.staffRolServ.StaffReportingTo(staffCode1).subscribe((response: any) => {
      this.staffReportings = response.result;

      this.loadingService.hide();
    });
  }


  getStaffReportingAndSupervisor(){
    this.loadingService.show();
    let staffCode1 = this.searchParamemter;
    this.staffRolServ.StaffSupervosorReporting(staffCode1).subscribe((response: any) => {
      this.staffReportings = response.result;
      this.getSupervisorDetail(staffCode1);
      this.getStaffInformation(staffCode1);
      this. getStaffMIS(staffCode1);
     this.loadingService.hide();
    });
  }
  getSupervisorDetail(staffCode:string){
    this.loadingService.show();
    this.staffRolServ.StaffSupervosor(staffCode).subscribe((response: any) => {
      this.SupervisorReportings = response.result;
    
      if(this.SupervisorReportings!=null){
      this.supervisorCode=this.SupervisorReportings.staffCode;
      this.supervisorName=this.SupervisorReportings.firstName;
      this.supervisorBranch=this.SupervisorReportings.branchName;
      this.supervisorEmail=this.SupervisorReportings.email;
      }
      this.loadingService.hide();
    });
  }

  getStaffInformation(staffCode:string){
    this.loadingService.show();
    this.staffRolServ.StaffInformation(staffCode).subscribe((response: any) => {
      this.staffInfo = response.result;
    
      if(this.staffInfo!=null){
      this.staffCodeNo=this.staffInfo.staffCode;
      this.staffName=this.staffInfo.firstName;
      this.staffBranch=this.staffInfo.branchName;
      this.staffEmail=this.staffInfo.email;
      }
      this.loadingService.hide();
    });
  }
  getStaffMIS(staffCode:string){
    this.loadingService.show();
    this.staffRolServ.StaffMIS(staffCode).subscribe((response: any) => {
      this.mis = response.result;
    
      if(this.mis!=null){
      this.username=this.mis.username;
      this.teamUnit=this.mis.teamUnit;
      this.costCent=this.mis.costCent;
      this.dept=this.mis.dept;
      this.region=this.mis.region;
      this.group=this.mis.group;
      this.directorate=this.mis.directorate;
      }
      this.loadingService.hide();
    });
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  searchDB(searchString) {
    this.searchTerm$.next(searchString);
  }

  pickSearchedData(item) {
    this.staffSearched = this.searchResults.filter(x => x.staffId == item.staffId);
    this.searchParamemter = this.staffSearched[0].staffCode;
    this.displaySearchModal = false;
  }
  StaffSearch(){
    this.staffRolServ.StaffSearch(this.staffSearchValue).subscribe((respone) => {
        this.searchResults = respone.result;
    })
  }

  closeCollateralDetaits(event) {
    if (event)
        this.displaySearchModal=false;
}

  GetBalance()
  {
    this.accountBalanceModal=true;
  }
}
