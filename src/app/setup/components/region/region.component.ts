import swal from 'sweetalert2';
import { GlobalConfig } from '../../../shared/constant/app.constant';
import { LoadingService } from '../../../shared/services/loading.service';
import { BranchService, StaffRoleService } from '../../services';
import { LoanApplicationService } from '../../../credit/services/loan-application.service';
import { FormBuilder, Validator, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
})
export class RegionComponent implements OnInit {
  // staffSearchText(arg0: any): any {
  //   throw new Error("Method not implemented.");
  // }
  regions: any[];
  displayRegionModal: boolean = false;
  entityName: string = 'New Region';
  regionForm: FormGroup;
  regionStaffForm: FormGroup;
  staffList: any[];
  staffLists: any[];
  displaySearchModal: boolean;
  displayModalRegionStaff: boolean = false;
  displayAddRegionStaffModal: boolean = false;
  selectedRegionId:any;
  regionStaffs: any[];
  staffTypeList: any[];
  selectedId: number = null;
  searchResults: any;
  staffSearched: any;
  staffSearchText:any;
  constructor(private fb: FormBuilder,
    private loanAppService: LoanApplicationService,
    private branchService: BranchService,
    private loadingService: LoadingService, 
    private staffRolServ: StaffRoleService,) { }

  ngOnInit() {
    this.clearControl();
    this.getAllStaffs();
    this.getAllRegion();
    this.GetAllRegionStaffType();
  }
  openSearchBox(): void {
    this.displaySearchModal = true;
  }
  StaffSearch(){
    this.getAllStaff();
    this.staffRolServ.StaffSearch(this.staffSearchText).subscribe((respone) => {
        this.searchResults = respone.result;
    })
  }
  pickSearchedData(item) {
    this.staffSearched = this.searchResults.filter(x => x.staffId == item.staffId);
    this.staffList= this.staffList.filter(x => x.staffId == this.staffSearched[0].staffId);
    this.regionStaffForm.controls['houStaffId'].setValue(this.staffSearched[0].staffId);
    //this.searchParamemter = this.staffSearched[0].staffId;
    this.displaySearchModal = false;
  }
  getAllRegion() {
    this.branchService.getAllRegion().subscribe((res) => {
      this.regions = res.result;
    });
  }
  showAddRegionStaffModal() {
    this.clearRegionStaffControl();
    this.displayAddRegionStaffModal = true;
}
  getAllStaff() {
    this.loanAppService.getOfficers().subscribe((res) => {
      this.staffList = res.result;
    });
  }
  getAllStaffs() {
    this.loanAppService.getOfficers().subscribe((res) => {
      this.staffLists = res.result;
    });
  }
  GetAllRegionStaffType() {
    this.branchService.getAllRegionStaffType().subscribe((res) => {
      this.staffTypeList = res.result;
    });
  }
  showAddModal() {
    this.clearControl();
    this.displayRegionModal = true;
  }
  clearControl() {
    this.regionForm = this.fb.group({
      regionId: [0],
      regionName: ['', Validators.required],
      regionTypeId: ['', Validators.required]
      // houStaffId: ['', Validators.required]
    });
    this.regionStaffForm = this.fb.group({
      staffRegionId:[0],
      regionId:[''],
      regionStaffTypeId: ['', Validators.required],
      houStaffId: ['', Validators.required]
    });
  }
  clearRegionStaffControl() {
    this.regionStaffForm = this.fb.group({
      staffRegionId:[0],
      regionId:[this.selectedRegionId],
      regionStaffTypeId: ['', Validators.required],
      houStaffId: ['', Validators.required]
    });
  }
  editRegion(index, evt) {
    evt.preventDefault();
    this.entityName = 'Edit Region';
    const row = index;
    this.regionForm = this.fb.group({
      regionId: [row.regionId],
      regionName: [row.regionName, Validators.required],
      regionTypeId: [row.regionTypeId, Validators.required]
      // houStaffId: [row.houStaffId, Validators.required]
    });
    this.displayRegionModal = true;
  }
  editRegionStaff(row) {
    // evt.preventDefault();
    this.entityName = 'Region Supervisors';
    this.selectedId = row.regionId;
    // const row = index;
    this.regionStaffForm = this.fb.group({
      staffRegionId: [row.staffRegionId],
      regionId:[row.regionId],
      regionStaffTypeId: [row.regionStaffTypeId, Validators.required],
       houStaffId: [row.houStaffId, Validators.required]
      // houStaffId: [row.houStaffId, Validators.required]
    });
    this.staffList= this.staffLists.filter(x => x.staffId == row.houStaffId);
    this.displayAddRegionStaffModal = true;
  }
  RegionSupervisor(row) {
    this.getAllRegionSupervisor(row.regionId);
    this.displayModalRegionStaff = true;
}
getAllRegionSupervisor(regionId): void {

  this.selectedRegionId = regionId;
  this.loadingService.show();
  this.branchService.getAllRegionSupervisor(regionId).subscribe((response: any) => { // <----?
    this.regionStaffs = response.result; // <----?
    this.loadingService.hide();
  }, (err) => {
    this.loadingService.hide(1000);
  });
}
  submitForm(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    this.branchService.saveRegion(body).subscribe((res) => {
      if (res.success == true) {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.getAllRegion();
        this.displayRegionModal = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
  submitRegionStaffForm(formObj) {
    this.loadingService.show();
    let body = formObj.value;
    this.branchService.saveRegionStaff(body).subscribe((res) => {
      if (res.success == true) {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'success');
        this.getAllRegionSupervisor(this.selectedRegionId);
        this.displayAddRegionStaffModal = false;
      } else {
        this.loadingService.hide();
        swal(`${GlobalConfig.APPLICATION_NAME}`, res.message, 'error');
      }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
    });
  }
  removeRegionStaff(row) {
    this.loadingService.show();

    this.branchService.deleteRegionStaff(row.staffRegionId).subscribe((response: any) => {
        if (response.success == true) {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'success');
            this.getAllRegionSupervisor(this.selectedRegionId);
          } else {
            this.loadingService.hide();
            swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
        }
    }, (err: any) => {
      this.loadingService.hide();
      swal(`${GlobalConfig.APPLICATION_NAME}`, err, 'error');
   });
}
}
