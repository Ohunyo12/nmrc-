import { FeeConcessionService } from '../credit/services/fee-concession.service';
import { CustomerFSCaptionService } from '../setup/services/customer-fscaption.service';
import { GeneralSetupService } from '../setup/services/general-setup.service';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer.routing';
import { BankingSharedModule } from "../shared/shared.module";
import {
    DataTableModule, SharedModule, DialogModule,
    DropdownModule, CheckboxModule, TabViewModule, CalendarModule, RadioButtonModule,
    PanelModule, ConfirmDialogModule, AutoCompleteModule
} from 'primeng/primeng';
import {
    CustomerComponent, ProspectCustomerComponent,
    CustomerRelationshipTypeComponent, CasaComponent, KYCChecklistComponent, CustomerEditComponent
} from './components';
import { AuthHttp } from '../admin/services/token.service';
import { LoadingService } from '../shared/services/loading.service';
import { AuthenticationService } from '../admin/services/authentication.service';
import { LoanApplicationService } from '../credit/services/loan-application.service';
import { CompanyService } from '../setup/services/company.service';
import { CountryStateService } from '../setup/services/state-country.service';
import { ValidationService } from '../shared/services/validation.service';
import { CustomerService } from './services/customer.service';
import { CasaService } from './services/casa.service';
import { BranchService } from '../setup/services/branch.service';
import { CustomerGroupService } from './services/customer-group.service';
import { CustomSearchComponent } from '../shared/components/search/customer-search/custom-search.component';
//import { DirectorRelatedCustomerComponent } from './components/customer/director-related-customer/director-related-customer.component';



@NgModule({
    imports: [
        CustomerRoutingModule,
        CommonModule,
        DataTableModule,
        SharedModule,
        DialogModule,
        ReactiveFormsModule, FormsModule,
        BankingSharedModule,
        DropdownModule, CheckboxModule, TabViewModule,
        CalendarModule, RadioButtonModule, PanelModule, ConfirmDialogModule,
        AutoCompleteModule,
        // ColorPickerModule
    ],
    exports: [],
    declarations: [
        CustomerComponent, CasaComponent, CustomerRelationshipTypeComponent, KYCChecklistComponent, CustomerEditComponent, CustomSearchComponent, ProspectCustomerComponent,
    ],
    providers: [
        LoadingService, ValidationService, AuthenticationService, AuthHttp, CustomerService, BranchService,
        CustomerGroupService, CasaService, CountryStateService, CompanyService, LoanApplicationService, GeneralSetupService, CustomerFSCaptionService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerModule { }
