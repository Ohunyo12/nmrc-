import { Directive, ElementRef, forwardRef, Input, Renderer } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CHECKBOX_LIST_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxListValueAccessorDirective),
  multi: true
};

@Directive({
  selector: `
    input[type=checkbox][formControl][asList],
    input[type=checkbox][formControlName][asList],
    input[type=checkbox][ngModel][asList]
`,
  host: {
    '(change)': 'internalChange($event.target.checked)',
    '(blur)': 'onTouched()'
  },
  providers: [CHECKBOX_LIST_VALUE_ACCESSOR]
})
export class CheckboxListValueAccessorDirective implements ControlValueAccessor {
  @Input()
  public value: any;

  // This holds onto a copy of the incoming array (from the form control).
  // We need it in order to do array operations after a change.
  // TODO: Not super happy about doing it this way, but it's reliable and I don't have another good idea yet.
  private arrayRef: any[] = [];

  public onChange = (_: any) => { };

  public onTouched = () => { };

  public internalChange(checked: boolean) {
    const pos: number = this.arrayRef.indexOf(this.value);
    if (pos === -1 && checked) {
      this.arrayRef.push(this.value);
    } else if (pos > -1 && !checked) {
      this.arrayRef.splice(pos, 1);
    }
    this.onChange(this.arrayRef);
  }

  constructor(
    private renderer: Renderer,
    private elementRef: ElementRef
  ) { }

  private setInputValue(checked: boolean): void {
    this.renderer.setElementProperty(
      this.elementRef.nativeElement,
      'checked',
      checked
    );
  }

  public writeValue(array: any[]): void {
    if (array === null || array === undefined || !Array.isArray(array)) {
      return this.setInputValue(false);
    }

    this.arrayRef = array;
    const containsThis: boolean = (array.indexOf(this.value) > -1);
    return this.setInputValue(containsThis);
  }

  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.renderer.setElementProperty(
      this.elementRef.nativeElement,
      'disabled',
      isDisabled
    );
  }
}

