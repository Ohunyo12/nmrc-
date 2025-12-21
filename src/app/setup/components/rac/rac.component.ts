import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from 'app/shared/services/loading.service';
import { RacService } from 'app/setup/services/rac.service';
import { ApprovalService, StaffRoleService, CurrencyService, ProductService } from 'app/setup/services';
import { Subject } from 'rxjs';
import { GlobalConfig } from 'app/shared/constant/app.constant';
import swal from 'sweetalert2';
@Component({
  selector: 'app-rac',
  templateUrl: './rac.component.html',
 // styleUrls: ['./rac.component.scss']
})
export class RacComponent implements OnInit {
  @Input() panel: boolean = false;
  @Input() label: string = '';
  RacDefinitions: any;
  //RacItems: any;
  RacOptions: any;
  RacOptionItems: any;
  inputTypes: any;
  conditionOperators: any;
  definedFunctions: any;
  products: any;
  operations: any;
  approvalLevels: any;
  staffRoles: any;
  controlOption: any;
  activeTabindex: any;
  displaySearchModal: boolean=false;
  racSearchInput: any;
  searchTerm$ = new Subject<any>();
  searchResults: any;
  racItemSearched: any[]=[];
  racItemId: any;
  selectedRacItem: any[];
  racCategorysForType: any;
  categoryType: any[];
  productClass: any;
  productControl: number;
  PRODUCTCLASS: string = 'PRODUCTCLASS';
  PRODUCT: string = 'PRODUCT';
  CREDITCARD: string = 'CREDITCARD';
  OPERATION: string = 'OPERATION';
  hideProduct: boolean = false;
  showCurrency: boolean = false;
  customers: any;
  
  

  @Input() set reload(value: number) { if (value > 0) 
    this.getRacCategorys(); 
    this.getRacDefinitions();
    this.getRacItems();
    this.getRacOptions();
    this.getRacOptionItems();
    this.getInputType();
    this.getConditionOperator();
    this.getDefinedFunction();
    this.getProduct();
    this.getOperations();
    //this.getApprovalLevels();
    this.getStaffRoles();
    this.getControlOption();
    this.getCustomerType();
  }

  formState: string = 'New';
  selectedId: number = null;

  racCategorys: any[] = [];
  racCategoryForm: FormGroup;
  displayRacCategoryForm: boolean = false;



    racDefinitions: any[] = [];
    racDefinitionForm: FormGroup;
    displayRacDefinitionForm: boolean = false;

    racItems: any[] = [];
    racItemForm: FormGroup;
    displayRacItemForm: boolean = false;

    racOptions: any[] = [];
    racOptionForm: FormGroup;
    displayRacOptionForm: boolean = false;

    racOptionItems: any[] = [];
    racOptionItemForm: FormGroup;
    displayRacOptionItemForm: boolean = false;

    racCategoryTypeForm:FormGroup;
    racCategoryTypes: any[] = [];
    displayRacCategoryTypeForm: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private loadingService: LoadingService,
    private racService: RacService,
    private approvalService: ApprovalService,
    private staffRoleService: StaffRoleService,
    private currencyService: CurrencyService,
    private productClassService: ProductService

  ) { 


    this.racService.racItemSearchObservable(this.searchTerm$)
      .subscribe((results: any ) => {
        this.searchResults = results.result;
      });
    
  }

  ngOnInit() {
    this.clearControls();
    this.getRacCategorys(); 
    this.getRacDefinitions();
    this.getRacItems();
    this.getRacOptions();
    this.getRacOptionItems();
    this.getInputType();
    this.getConditionOperator();
    this.getDefinedFunction();
    this.getProduct();
    this.getOperations();
    this.GetApprovapLevel();
    this.getStaffRoles();
    this.getControlOption();
    this.getRacCategoryTypes();
    this.getAllCurrencyByDefault();
    this.getProductClass();
    this.getCustomerType();
  }

  
  saveRacCategory(form) {
    let body = {
        categoryName: form.value.categoryName,
    };
    this.loadingService.show();
    if (this.selectedId === null) {
        this.racService.saveCategory(body).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) this.reloadGrid();
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    } else {
        this.racService.updateCategory(body, this.selectedId).subscribe((response: any) => {
            this.loadingService.hide();
            if (response.success == true) this.reloadGrid();
            else this.finishBad(response.message);
        }, (err: any) => {
            this.loadingService.hide();
            this.finishBad(JSON.stringify(err));
        });
    }
}


getCustomerType() {
  this.racService.getCustomerType().subscribe((response: any) => {
      this.customers = response.result;
  });
}

getRacCategorys() {
    this.racService.getCategories().subscribe((response: any) => {
      
        this.racCategorys = response.result;
        this.racCategorysForType = response.result;
    });
}

getRacCategory(row) {
  this.racService.getCategory(row.racCategoryId).subscribe((response: any) => {
      this.racCategorys = response.result;
  });
}

deleteRacCategory(row) {
    this.racService.deleteCategory(row.racCategoryId).subscribe((response: any) => {
        if (response.result == true) this.reloadGrid();
    });
}

reloadGrid() {
    this.displayRacCategoryForm = false;
    this.getRacCategorys();

    this.displayRacDefinitionForm = false;
    this.getRacDefinitions();

    this.displayRacItemForm = false;
    this.getRacItems();

    this.displayRacOptionForm = false;
  this.getRacOptions();

  this.displayRacOptionItemForm = false;
  this.getRacOptionItems();

  this.getRacCategoryTypes();
}

// ----------------------CATEGORIES form ----------------------

clearControls() {
    this.formState = 'New';
    this.racCategoryForm = this.fb.group({
        categoryName: ['', Validators.required],
    });

    this.racDefinitionForm = this.fb.group({
      productId: ['', Validators.required],
      productClassId: ['', Validators.required],
      racCategoryId: ['', Validators.required],
      isActive: [false],
      isRequired: [false],
      racItemId: ['', Validators.required],
      racInputTypeId: ['', Validators.required],
      racOptionId: [''],
      conditionalOperatorId: ['', Validators.required],
      definedFunctionId: ['', Validators.required],
      requireUpload: [false],
      operationId: ['', Validators.required],
      approvalLevelId: [''],
      roleId: [''],
      controlAmount : [''],
      controlAmountMax: [''],
      controlOptionId: [''],
      racCategoryTypeId: [''],
      showAtDrawDown:[false],
      requireComment: [false],
      currencyId:[''],
      currencyBase:[''],
      isRacTierControlKey:[false],
      searchBasePlaceholder: ['', Validators.required],
      employmentType: [''],
      customerTypeId: [''],
  });

  this.racCategoryTypeForm = this.fb.group({
    subCategoryType: ['', Validators.required],
    racCategoryTypeId: ['', Validators.required]
  });

  this.racItemForm = this.fb.group({
    criteria: ['', Validators.required],
    description: ['', Validators.required],
});

this.racOptionForm = this.fb.group({
  optionName: ['', Validators.required],
});

this.racOptionItemForm = this.fb.group({
  label: ['', Validators.required],
  key: ['', Validators.required],
  racOptionId :['',Validators.required],
  isSystemDefined: ['', Validators.required],
});

}

editRacCategory(row) {
    this.clearControls();
    this.formState = 'Edit';
    this.selectedId = row.racCategoryId;
    this.racCategoryForm = this.fb.group({
        categoryName: [row.categoryName, Validators.required],
    });
    this.displayRacCategoryForm = true;
}

currencies:any;
productSelected: boolean;
getCurrenciesbyProduct(id) { 

  if(id >0) {
    this.productSelected = true;
    this.currencyService.getAllCurrenciesbyProduct(id).subscribe((res: any) => {
      this.currencies = res.result;
    }, (err) => {
    });
  } else { this.getAllCurrencyByDefault();}
}

racFlow(value: string) {

  const productClassIdControl = this.racDefinitionForm.get('productClassId');
  const productIdControl = this.racDefinitionForm.get('productId');
  this.hideProduct = false;
  this.showCurrency = false;

  if(value == 'PRODUCTCLASS') {
    this.productControl = 1;
    productIdControl.clearValidators();
  }
  else if(value == 'PRODUCT') {
    this.productControl = 2;
    productClassIdControl.clearValidators();
  }
  else if(value == 'CREDITCARD') {
    this.productControl = 3;
    productIdControl.clearValidators();
    productClassIdControl.clearValidators();
    this.hideProduct = true;
    this.showCurrency = true;
  }
  else if(value == 'OPERATION') {
    this.productControl = 4;
    productIdControl.clearValidators();
    productClassIdControl.clearValidators();
    this.hideProduct = true;
    this.showCurrency = false;
  }
  productIdControl.updateValueAndValidity();
  productClassIdControl.updateValueAndValidity();
}

getAllCurrencyByDefault(){
  this.currencyService.getAllCurrencies().subscribe((res: any) => {
      this.currencies = res.result;
  }, (err) => {
  });
}

currencyCustomBaseSelected: boolean;
onCurrencyBaseChange(value: string){
  if (value == '' || value == null || value == undefined){return;}
  if(value == 'LCY'){
    const currency = this.racCategoryForm.controls['currencyId'];
  //  if (currency != undefined)
    currency.setValue(1);
    currency.updateValueAndValidity();
  }

  if(value == 'CUSTOM'){ this.currencyCustomBaseSelected = true;}
  else {this.currencyCustomBaseSelected = false;}
  
}

// onProductChanged(id: number){
//   this.getCurrenciesbyProduct(id);
// }

showRacCategoryForm() {
  this.selectedId = null;
  this.displayRacCategoryForm=true
}


saveRacDefinition(form) {
  this.loadingService.show();
  if (this.selectedId === null) {

    let body = {
      productId: form.value.productId,
      racCategoryId: form.value.racCategoryId,
      isActive: form.value.isActive,
      isRequired: form.value.isRequired,
      racItemId: this.racItemSearched[0].racItemId,
      racInputTypeId: form.value.racInputTypeId,
      racOptionId: form.value.racOptionId,
      conditionalOperatorId: form.value.conditionalOperatorId,
      definedFunctionId: form.value.definedFunctionId,
      requireUpload: form.value.requireUpload,
      operationId: form.value.operationId,
      approvalLevelId: form.value.approvalLevelId,
      roleId: form.value.roleId,
      controlAmount: form.value.controlAmount,
      controlAmountMax: form.value.controlAmountMax,
      controlOptionId: form.value.controlOptionId,
      racCategoryTypeId: form.value.racCategoryTypeId,
      showAtDrawDown: form.value.showAtDrawDown,
      requireComment: form.value.requireComment,
      currencyId:form.value.currencyId,
      currencyBase: form.value.currencyBase,
      isRacTierControlKey:form.value.isRacTierControlKey,
      productClassId:form.value.productClassId,
      searchBasePlaceholder:form.value.searchBasePlaceholder,
      employmentType: form.value.employmentType,
      customerTypeId: form.value.customerTypeId,
    };
      this.racService.saveDefinition(body).subscribe((response: any) => {
          this.loadingService.hide();
        if (response.success == true) {
          this.reloadGrid()
          this.activeTabindex = 0;
        }
        else { this.finishBad(response.message) };
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  } else {
    console.log('his.racItemSearched',this.racItemSearched);
    console.log('this.selectedRacItem',this.selectedRacItem);
    console.log('this.selectedRacItem',this.selectedRacItem[0]);
    let body = {
      productId: form.value.productId,
      racCategoryId: form.value.racCategoryId,
      isActive: form.value.isActive,
      isRequired: form.value.isRequired,
      racItemId: this.selectedRacItem[0].racItemId,
      racInputTypeId: form.value.racInputTypeId,
      racOptionId: form.value.racOptionId,
      conditionalOperatorId: form.value.conditionalOperatorId,
      definedFunctionId: form.value.definedFunctionId,
      requireUpload: form.value.requireUpload,
      operationId: form.value.operationId,
      approvalLevelId: form.value.approvalLevelId,
      roleId: form.value.roleId,
      controlAmountMax: form.value.controlAmountMax,
      controlAmount: form.value.controlAmount,
      controlOptionId: form.value.controlOptionId,
      racCategoryTypeId: form.value.racCategoryTypeId,
      showAtDrawDown: form.value.showAtDrawDown,
      requireComment: form.value.requireComment,
      currencyId:form.value.currencyId,
      currencyBase: form.value.currencyBase,
      isRacTierControlKey:form.value.isRacTierControlKey,
      productClassId:form.value.productClassId,
      searchBasePlaceholder:form.value.searchBasePlaceholder,
      employmentType: form.value.employmentType,
      customerTypeId: form.value.customerTypeId,
    };
  
    console.log('racrDefinitionUpdate', body);
    this.racService.updateDefinition(body, this.selectedId).subscribe((response: any) => {
      this.loadingService.hide();
      if (response.success == true) {this.reloadGrid()
        this.activeTabindex = 0; }
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  }
}

editRacDefinition(row) {
  console.log(this.productClass);
  console.log(row);
  this.clearControls();
  this.formState = 'Edit';
  this.selectedRacItem = this.racItems.filter(o=>o.racItemId==row.racItemId);
  this.selectedId = row.racDefinitionId;
  this.racDefinitionForm = this.fb.group({
      productId: [row.productId],
      racCategoryId: [row.racCategoryId, Validators.required],
      isActive: [row.isActive, Validators.required],
      isRequired: [row.isRequired, Validators.required],
      racItemId: [this.selectedRacItem[0].criteria, Validators.required],
      racInputTypeId: [row.racInputTypeId, Validators.required],
      racOptionId: [row.racOptionId],
      conditionalOperatorId: [row.conditionalOperatorId, Validators.required],
      definedFunctionId: [row.definedFunctionId, Validators.required],
      requireUpload: [row.requireUpload],
      operationId: [row.operationId, Validators.required],
      approvalLevelId: [row.approvalLevelId],
      roleId: [row.roleId],
      controlAmountMax : [row.controlAmountMax],
      controlAmount : [row.controlAmount], 
      controlOptionId: [row.controlOptionId],
      racCategoryTypeId: [row.racCategoryTypeId],
      showAtDrawDown: [row.showAtDrawDown],
      requireComment: [row.requireComment],
      currencyType: [row.currencyType],
      currencyId: [row.currencyId],
      isRacTierControlKey: [row.isRacTierControlKey],
      currencyBase: [row.currencyBase],
      productClassId: [row.productClassId],
      searchBasePlaceholder:[row.searchBasePlaceholder],
      employmentType: [row.employmentType],
      customerTypeId: [row.customerTypeId],
  });
  this.activeTabindex = 1;
  const productField = this.racDefinitionForm.controls['productId'];
  const productClassField = this.racDefinitionForm.controls['productClassId'];
  productClassField.disabled;
  productField.disable;
}

getRacDefinitions() {
  this.racService.getDefinitions().subscribe((response: any) => {
      this.racDefinitions = response.result;
      
  });
}

getControlOption() {
  this.racService.getOptionItems().subscribe((response: any) => {
      this.controlOption = response.result;
  });
}

getRacDefinition(row) {
  this.racService.getDefinition(row.racDefinitionId).subscribe((response: any) => {
      this.racDefinitions = response.result;
  });
}

deleteRacDefinition(row) {
  this.racService.deleteDefinition(row.racDefinitionId).subscribe((response: any) => {
      if (response.result == true) this.reloadGrid();
  });
}

// ----------------------DEFINITION form ----------------------


showRacDefinitionForm() {
  this.clearControls();
  this.selectedId = null;
  //this.displayRacDefinitionForm = true;
  this.activeTabindex = 1;
}




// ------------------- api-calls --------------------
 
saveRacItem(form) {
  let body = {
      criteria: form.value.criteria,
      description: form.value.description,
  };
  this.loadingService.show();
  if (this.selectedId === null) {
      this.racService.saveItem(body).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  } else {
      this.racService.updateItem(body, this.selectedId).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  }
}

getRacItems() {
  this.racService.getItems().subscribe((response: any) => {
      this.racItems = response.result;
  });
}

deleteRacItem(row) {
  this.racService.deleteItem(row.racItemId).subscribe((response: any) => {
      if (response.result == true) this.reloadGrid();
  });
}


// ---------------------- form ----------------------

editRacItem(row) {
  this.clearControls();
  this.formState = 'Edit';
  this.selectedId = row.racItemId;
  this.racItemForm = this.fb.group({
      criteria: [row.criteria, Validators.required],
      description: [row.description, Validators.required],
  });
  this.displayRacItemForm = true;
}

showRacItemForm() {
  this.clearControls();
  this.selectedId = null;
  this.displayRacItemForm = true;
}

// ---------------------- message ----------------------

show: boolean = false; message: any; title: any; cssClass: any;

finishGood() { this.loadingService.hide(); }

hideMessage(event) { this.show = false; }

finishBad(message) {
    this.showMessage(message, 'error', "FintrakBanking");
    this.loadingService.hide();
}

showMessage(message: string, cssClass: string, title: string) {
    this.message = message;
    this.title = title;
    this.cssClass = cssClass;
    this.show = true;
}

  getCategoryTypes(id) {
    this.racService.getCategoryType(id).subscribe((response: any) => {
      this.categoryType = response.result;
     // console.log(' this.categoryType', this.categoryType)
    })
  }

// ------------------- api-calls --------------------
 
saveRacOption(form) {
  let body = {
      optionName: form.value.optionName,
  };
  this.loadingService.show();
  if (this.selectedId === null) {
      this.racService.saveOption(body).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  } else {
      this.racService.updateOption(body, this.selectedId).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  }
}

getRacOptions() {
  this.racService.getOptions().subscribe((response: any) => {
      this.racOptions = response.result;
  });
}

deleteRacOption(row) {
  this.racService.deleteOption(row.racOptionId).subscribe((response: any) => {
      if (response.result == true) this.reloadGrid();
  });
}


// ---------------------- form ----------------------


editRacOption(row) {
  this.clearControls();
  this.formState = 'Edit';
  this.selectedId = row.racOptionId;
  this.racOptionForm = this.fb.group({
      optionName: [row.optionName, Validators.required],
  });
  this.displayRacOptionForm = true;
}

showRacOptionForm() {
  this.clearControls();
  this.selectedId = null;
  this.displayRacOptionForm = true;
}



// ------------------- api-calls --------------------
 
saveRacOptionItem(form) {
  let body = {
      label: form.value.label,
      key: form.value.key,
      isSystemDefined: form.value.isSystemDefined,
  };
  this.loadingService.show();
  if (this.selectedId === null) {
      this.racService.saveOptionItem(body).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  } else {
      this.racService.updateOptionItem(body, this.selectedId).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) this.reloadGrid();
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  }
}

getRacOptionItems() {
  this.racService.getOptionItems().subscribe((response: any) => {
      this.racOptionItems = response.result;
  });
}

deleteRacOptionItem(row) {
  this.racService.deleteOptionItem(row.racOptionItemId).subscribe((response: any) => {
      if (response.result == true) this.reloadGrid();
  });
}

// ---------------------- form ----------------------

editRacOptionItem(row) {
  this.clearControls();
  this.formState = 'Edit';
  this.selectedId = row.racOptionItemId;
  this.racOptionItemForm = this.fb.group({
      label: [row.label, Validators.required],
      key: [row.key, Validators.required],
      isSystemDefined: [row.isSystemDefined],
      racOptionId :[row.racOptionId,Validators.required],
  });
  this.displayRacOptionItemForm = true;
}

showRacOptionItemForm() {
  this.clearControls();
  this.selectedId = null;
  this.displayRacOptionItemForm = true;
}



getInputType() {
  this.racService.getInputTypes().subscribe((response: any) => {
   // console.log('getInputType',response.result);
    
      this.inputTypes = response.result;
  });
  
}
getConditionOperator() {
  this.racService.getConditionOperator().subscribe((response: any) => {
      this.conditionOperators = response.result;
  });
  
}

isBoundaryLimit: boolean;
onCondionOperationChange(value) {
  const controlAmountMax = this.racDefinitionForm.controls['controlAmountMax'];
  const controlAmount = this.racDefinitionForm.controls['controlAmount'];

  if(value == 7) {
    controlAmountMax.setValidators(Validators.required);
    controlAmount.setValidators(Validators.required);
    this.isBoundaryLimit = true;
  } 
  else { 
    this.isBoundaryLimit = false;
    controlAmountMax.clearValidators();
    controlAmount.clearValidators();
  }

  controlAmountMax.updateValueAndValidity();
  controlAmount.updateValueAndValidity();
}


getDefinedFunction() {
  this.racService.getDefineFunction().subscribe((response: any) => {
      this.definedFunctions = response.result;
  });
  
}

  onTabChange($event) {
    this.activeTabindex = $event.index;
  }
  
getProduct() {
  this.racService.getProducts().subscribe((response: any) => {    
      this.products = response.result;
  });
}

getProductClass() {
  this.productClassService.getAllProductClasses().subscribe((response: any) => {    
      this.productClass = response.result;
    //  console.log('productClass',this.productClass)
  });
}

getOperations(){
  this.approvalService.getAllOperations().subscribe((response: any) => {
    //console.log('getOperations',response.result)
    this.operations = response.result;
});
}

  GetApprovapLevel() {

  this.racService.getApprovalLevel().subscribe((response: any) => {
    this.approvalLevels = response.result;
  }, (err: any) => {
      this.loadingService.hide(1000);
      this.finishBad(JSON.stringify(err));
  });
}

getStaffRoles() {

  this.staffRoleService.StaffRoles().subscribe((response: any) => {    
      this.staffRoles = response.result;
  });
  
  }
  
 


  searchRac(searchString) {
    this.searchTerm$.next(searchString);
  }

  pickSearchedData(item) {

    this.racItemSearched = this.searchResults.filter(x => x.racItemId == item.racItemId);
    this.racItemId = this.racItemSearched[0].criteria;
    this.displaySearchModal = false;
    this.racDefinitionForm.controls["racItemId"].setValue(this.racItemId)
  }

  openSearchBox(): void {
    this.displaySearchModal = true;
  }

  getRacCategoryTypes() {
    this.racService.getRacCategoryTypes().subscribe((response: any) => {    
      this.racCategoryTypes = response.result;
  });
  }

  deleteRacCategoryType(row) {
    this.racService.deleteRacCategoryType(row.racCategoryTypeId).subscribe((response: any) => {
      if (response.result == true) this.reloadGrid();
  });
  }
  editRacCategoryType(row) {
    this.clearControls();
    this.formState = 'Edit';
    //console.log('CheckSubCategoryType', row);
    this.selectedId = row.racCategoryTypeId;
    this.racCategoryTypeForm = this.fb.group({
      subCategoryType: [row.racCategoryType, Validators.required],
      racCategoryTypeId: [row.racCategoryId, Validators.required]

    });
    this.displayRacCategoryTypeForm = true;
}

  cancelRacCategoryTypeForm() {
  this.displayRacCategoryTypeForm = false;
  this.clearControls();
}

  showRacCategoryTypeForm() {
    this.clearControls();
    this.displayRacCategoryTypeForm = true;

}

  addRacCategoryType(data) {
    let body = {
      racCategoryTypeId: data.value.racCategoryTypeId,
      racCategoryType: data.value.subCategoryType
  };
  this.loadingService.show();
  if (this.selectedId === null) {
      this.racService.saveRacCategoryType(body).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) 
          {
            this.displayRacCategoryTypeForm=false,
            this.clearControls(),
            this.reloadGrid()
          }
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  } else {
      this.racService.updateRacCategoryType(body, this.selectedId).subscribe((response: any) => {
          this.loadingService.hide();
          if (response.success == true) 
          {
            this.displayRacCategoryTypeForm=false,
            this.clearControls(),
            this.reloadGrid()
        }
          else this.finishBad(response.message);
      }, (err: any) => {
          this.loadingService.hide();
          this.finishBad(JSON.stringify(err));
      });
  }
  }

}
