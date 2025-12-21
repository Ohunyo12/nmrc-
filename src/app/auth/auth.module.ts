import { AccessDeniedComponent } from './accessdenied.component';
import { NotFoundComponent } from './not-found.component';
import { ButtonWaitDirective } from '../shared/directives/please-wait-button';
import { BankingSharedModule } from "../shared/shared.module";
// import { MessageComponent } from './../shared/common/app.message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../admin/services/authentication.service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoginRoutingModule } from './auth.routing';
import { LoginComponent } from './login.component';
import { LoadingService } from '../shared/services/loading.service';
import { CommonModule } from '@angular/common';
import { DialogModule, MessagesModule } from 'primeng/primeng';
import { AuthorizationService } from '../admin/services';
import { PushNotificationsService } from 'ng-push';


@NgModule({
    imports: [LoginRoutingModule,
        ReactiveFormsModule,
        CommonModule, FormsModule, BankingSharedModule, DialogModule, MessagesModule],
    exports: [],
    declarations: [LoginComponent,
        ButtonWaitDirective, NotFoundComponent, AccessDeniedComponent],
    providers: [LoadingService, AuthenticationService, AuthorizationService, PushNotificationsService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule { }
