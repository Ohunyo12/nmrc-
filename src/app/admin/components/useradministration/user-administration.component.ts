import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services';
import { Subject } from 'rxjs';
import { LazyLoadEvent } from 'primeng/primeng';
import { LoadingService } from '../../../shared/services/loading.service';
import swal from 'sweetalert2';
import { AppConstant, GlobalConfig } from '../../../shared/constant/app.constant';
import { log } from 'util';
 
@Component({
   // selector: 'selector-name',
    templateUrl: 'user-administration.component.html'
})

export class UserAdministrationComponent implements OnInit {
    [x: string]: any;
activeUsers:any[] = [];
selectedItem: any[] = [];
itemTotal: number;
multiSortMeta: any = [];
filters: any = [];
searchBox: any = '';
showSaveButton: boolean = false;
searchTerm$ = new Subject<any>();
    constructor( private adminService: AdminService,  private loadingService: LoadingService,) {
        // this.auditService.getActiveUsers(this.searchTerm$)
        // .subscribe(results => {
        //     this.activeUsers = results.result;
        //     this.itemTotal = results.count;
        // });
     }

    ngOnInit() {
       this.getActiveUsers(1, 10);
     }

getActiveUsers(page, itemTotal){
    this.loadingService.show();
    this.adminService.getActiveUsers(page, itemTotal).subscribe((response: any) =>{

        this.activeUsers = response.result;
        this.itemTotal = response.count;
        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000);

    });
}
activeSelectedItem(){
    this.showSaveButton = true;
}
saveChanges(event, data){
    data.accountStatus = this.accountStatus;
    data.lockStatus = this.lockStatus;

    this.adminService.updateActiveUsers(data).subscribe((res)=> {
        if(res.success) swal(GlobalConfig.APPLICATION_NAME, res.message, 'success');
        else swal(GlobalConfig.APPLICATION_NAME, res.message, 'warning');
    },(err)=> {
        swal(GlobalConfig.APPLICATION_NAME, err.message, 'error'); 
    })
}
lockStatus: boolean = false;
accountStatus: boolean = false;
activeState(event){
   this. accountStatus = true;
}

lockState(event){

   this.lockStatus = true;
    
}

loadData(event: LazyLoadEvent) {

    this.loadingService.show();
    this.adminService.getActiveUsers(event.first, event.rows).subscribe((response: any) =>{

        
        this.activeUsers = response.result;
        this.itemTotal = response.count;
        this.loadingService.hide();
    }, (err) => {
        this.loadingService.hide(1000);

    });
}
}