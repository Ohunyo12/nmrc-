import { LoadingService } from '../../services/loading.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../../../admin/services';
import swal from 'sweetalert2';
import { GlobalConfig } from '../../constant/app.constant';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
})
export class TwoFactorAuthComponent implements OnInit {
  @Input('display') displayTwoFactorAuth: boolean = false;
  @Input('redirect') returnUrl: string;
  @Output() emitLogout: EventEmitter<any> = new EventEmitter<any>();
  twoFactorAuthStaffCode: string;
  twoFactorAuthForm: FormGroup;
  //userSpecific: boolean;
  @Input() set staffCode(value: string) {
    if (value != null) {
      this.initializeControl();

       this.twoFactorAuthForm.get('twoFactorAuthStaffCode').setValue(value);
    }
  }
  constructor(private loadingService: LoadingService,
    private fb: FormBuilder,
    private router: Router,
    private authorizationService: AuthorizationService) { }

  ngOnInit() {
    this.initializeControl();
  }
  initializeControl() {
    this.twoFactorAuthForm = this.fb.group({
      twoFactorAuthStaffCode: ['', Validators.required],
      twoFactorAuthPassCode: ['', Validators.required]
    })
  }
  submitForAuthentication(formObj) {
      this.loadingService.show();
    let body = formObj.value;

    this.authorizationService.authenticateUser(body.twoFactorAuthStaffCode, body.twoFactorAuthPassCode).subscribe((response: any) => {
      this.loadingService.hide();
      // console.log("StaffCode: ", body.twoFactorAuthStaffCode);

      if (response.success == true) {
          this.router.navigate([this.returnUrl]);
          swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'info');   
      } else {
        swal(`${GlobalConfig.APPLICATION_NAME}`, response.message, 'error');
      }
    });

  }
  approveEvent: any;
  closeModal() {
    this.displayTwoFactorAuth = false
    this.emitLogout.emit(null);
  }
}
