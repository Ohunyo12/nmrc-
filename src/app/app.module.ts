import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutes } from './app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BankingSharedModule } from "./shared/shared.module";
import {
    DataTableModule, SharedModule, DialogModule,
    DropdownModule, CheckboxModule, CalendarModule, RadioButtonModule,
    PanelModule, ChartModule, AutoCompleteModule,
} from 'primeng/primeng';
// import { GMapModule } from 'primeng/components/gmap/gmap';

import { AuthGuard } from './admin/guard/authentication.guard';
import { AppConfigService } from './shared/services/app.config.service';
import { AppConfig } from './shared/constant/app.config';
import { AuthHttp } from './admin/services/token.service';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/layout/mainlayout.component';
import { AuthLayoutComponent } from './shared/layout/authlayout.component';
import { AppMenuComponent, AppSubMenuComponent } from './shared/common/app.menu.component';
import { AppTopBarComponent } from './shared/common/app.topbar.component';
import { AppFooterComponent } from './shared/common/app.footer.component';
import { InlineProfileComponent } from './shared/common/app.profile.component';

import { NotificationService } from './shared/services/notification.service';
import { MenuVisibiltyService } from './shared/services/role-menu.service';
import { AuthenticationService } from './admin/services/authentication.service';
import { DashboardComponent } from './dashboard/app.dashboard.component';

import { PushNotificationsService, PushNotificationsModule } from 'ng-push';
import { ConfirmDeactivateGuard } from './admin/guard/confirm-deactivate.guard';
import { ToggleButtonModule } from 'primeng/components/togglebutton/togglebutton';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { ProgressBarModule } from 'primeng/components/progressbar/progressbar';
import { AdminService } from './admin/services';

 
//import { IdleTimeoutService } from 'app/shared/services/IdleTimeoutService.service';
//import { DialogService } from 'app/shared/services/dialog.service';
// import { FormatMoneyDirective } from './shared/directives/formatmoney.onblur.directive';
import { HelperService } from './shared/services/helpers.service';
import { PasswordSettingComponent } from './profile/password-reset/password-reset.component';
import { LoadingService } from './shared/services/loading.service';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { HttpClientModule } from '@angular/common/http';



export function initConfig(config: AppConfig) {
    return () => config.load();
}

@NgModule({
    imports: [
        ReactiveFormsModule,
        BrowserModule,
        FormsModule,
        // HttpClientModule ,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        DataTableModule,
        SharedModule,
        DialogModule,
        BankingSharedModule,
        CheckboxModule,
        CalendarModule,
        PanelModule,
        ChartModule,
        ToggleButtonModule,
        SplitButtonModule,
        AutoCompleteModule,
        SelectButtonModule,
        RadioButtonModule,
        InputSwitchModule,
        ProgressBarModule,
        PushNotificationsModule,
        DropdownModule
    ],
    declarations: [
        AppComponent,
        MainLayoutComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        InlineProfileComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AuthLayoutComponent,
        DashboardComponent,
        PasswordSettingComponent

       
        
        //PasswordValidation
        //CKEDITOR,
        // FormatMoneyDirective,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AppConfigService, AppConfig, Title,
        { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
        AuthGuard,
        AuthenticationService,
        MenuVisibiltyService,
        AuthHttp, PushNotificationsService, PushNotificationsService,
        NotificationService, ConfirmDeactivateGuard, AdminService, LoadingService, DashboardService,
        HelperService,
        
        // IdleTimeoutService
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
