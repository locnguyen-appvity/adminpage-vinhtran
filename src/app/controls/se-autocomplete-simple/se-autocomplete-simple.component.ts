import { Component, Input, HostBinding, OnDestroy, Optional, Self, ElementRef, OnChanges, Output, EventEmitter, ViewChild, SimpleChanges, AfterViewInit } from '@angular/core';
import { FormControl, NgControl, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { map, startWith, takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject, Observable, of, timer } from 'rxjs';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { LinqService } from 'src/app/shared/linq.service';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { GlobalSettings } from 'src/app/shared/global.settings';
// declare let jQuery: any;

@Component({
	selector: 'se-autocomplete-simple',
	templateUrl: './se-autocomplete-simple.component.html',
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: AutocompleteSimpleComponent
		}
	],
	host: {
		'[id]': 'id',
		'[attr.aria-describedby]': 'describedBy'
	}
})
export class AutocompleteSimpleComponent implements MatFormFieldControl<string>, OnChanges, OnDestroy, AfterViewInit {
	@Input() placeHolder: string = '';
	@Input() mode: string = '';
	@Input() autocomplete: boolean = false;
	@Input() optgroup: boolean = false;
	@Input() keyValue: string = 'id';
	@Input() keyValueEmit: string = 'name';
	@Input() keyTitle: string = 'name';
	@Input() items$: Observable<any>;
	@Input() items: any;
	@Input() topValue: number = 0;
	@Input() target: string = '';
	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	@Output() onChangeValue: EventEmitter<any> = new EventEmitter();
	@Output() onSelectItem: EventEmitter<any> = new EventEmitter();
	@Output() valueChangeSelect: EventEmitter<any> = new EventEmitter();
	public trigger: any;
	@ViewChild('trigger', { read: MatAutocompleteTrigger, static: false }) set triggerOnHTML(elemOnHTML: MatAutocompleteTrigger) {
		if (!!elemOnHTML) {
			this.trigger = elemOnHTML;
		}
	}
	private _unsubscribe$ = new Subject<void>();
	// public items: Array<any>;
	public groupItems: Subject<Array<any>>;
	public filteredItems: Subject<Array<any>>;
	//Private Property
	public inputControl: FormControl;
	public focused = false;
	public errorState = false;
	public controlType = 'multi-select';
	onChange = (value: any) => { };
	onTouched = () => { };
	public stateChanges = new Subject<void>();
	private isSelected: boolean = false;
	public originalValue: string = "";

	constructor(public linq: LinqService,
		public sharedService: SharedPropertyService,
		@Optional() @Self() public ngControl: NgControl,
		fm: FocusMonitor,
		elRef: ElementRef<HTMLElement>) {
		// Replace the provider from above with this.
		if (this.ngControl != null) {
			// Setting the value accessor directly (instead of using
			// the providers) to avoid running into a circular import.
			this.ngControl.valueAccessor = this;
		}
		fm.monitor(elRef.nativeElement, true).subscribe({
			next: (origin) => {
				this.focused = !!origin;
				this.stateChanges.next();
			}
		});
		this.items = [];
		this.groupItems = new Subject<[]>();
		this.filteredItems = new Subject<[]>();
		this.inputControl = new FormControl('');
		this.inputControl.setAsyncValidators([this.validateInputValidator()]);

	}

	ngAfterViewInit(): void {
		if (this.mode == 'search-runtime') {
			this.inputControl.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this._unsubscribe$)).subscribe({
				next: (value: any) => {
					if (this.isSelected || this.originalValue == value) {
						this.originalValue = value;
						this.isSelected = false;
						return;
					}
					this.onChangeValue.emit(value);
				}
			});
		}
		else {
			if (this.mode == 'emit-change') {
				this.inputControl.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), takeUntil(this._unsubscribe$)).subscribe({
					next: (value: any) => {
						if (this.isSelected || this.originalValue == value) {
							this.originalValue = value;
							return;
						}
						this.onChangeValue.emit(value);
					}
				});
			}
			this.inputControl.valueChanges.pipe(startWith(''), map((value: string) => this._filter(value))).subscribe({
				next: (res: any) => {
					let items = res;
					if (items && items.length > 0 && this.topValue > 0) {
						items = this.linq.Enumerable().From(items).Take(this.topValue).ToArray();
					}
					if (this.isSelected) {
						this.isSelected = false;
						return;
					}
					if (this.optgroup) {
						items = this.groupData(items);
					}
					this.filteredItems.next(items);
				}
			});
		}
	}

	groupData(items: any) {
		return this.linq.Enumerable().From(items).GroupBy("$.groupName", null, (key: any, data: any) => {
			let _key = this.isNullOrEmpty(key) ? 'empty' : key;
			return {
				groupName: _key,
				controls: data.source,
			}
		}).OrderBy("$.groupName").ToArray();
	}

	validateInputValidator(): AsyncValidatorFn {
		return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
			let err: ValidationErrors = null;
			if (control.dirty && this.isNullOrEmpty(control.value)) {
				if (this.required) {
					this.errorState = true;
					err = { required: 'error' };
				}
				else {
					this.errorState = false;
				}
				if (this.ngControl.control) {
					this.ngControl.control.setErrors(err);
				}
				this.onChange('');
				this.stateChanges.next();
				return of(err);
			}
			if (this.isNullOrEmpty(control.value)) {
				return of(err);
			}
			if (this.items && ((this.autocomplete && this.items.length > 0))) {
				let value = control.value;
				const defaultItem = this.items.find((item: any) => {
					return item[this.keyTitle] === value;
				});
				if (defaultItem === null || defaultItem === undefined) {
					// this.valueChange.emit(value);
					this.onChange(value);
					this.errorState = false;
					err = null;
				}
				else {
					this.errorState = false;
					err = null;
				}
				this.ngControl.control.setErrors(err);
				this.stateChanges.next();
				return of(err);
			}
			return of(null);
		};
	}

	_filter(value: any): any {
		if(this.items){
			if (typeof (value) === 'string') {
				const filterValue = value.toLowerCase();
				if (this.isNullOrEmpty(filterValue)) {
					return this.items;
				}
				return this.items.filter((item: any) => item[this.keyTitle].toLowerCase().includes(filterValue));
			}
			else {
				return [];
			}
		}
		else {
			return [];
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['items$']) {
			if (this.items$ !== undefined) {
				this.items$.pipe(takeUntil(this._unsubscribe$), distinctUntilChanged()).subscribe({
					next: (res: any) => {
						this.items = res;
						if (this.optgroup && res && res.length > 0) {
							let arrItems = this.groupData(res);
							this.groupItems.next(arrItems);
							this.filteredItems.next(arrItems);
						}
						this.updateAutoCompleteControl();
					}
				});
			}
		}
		if (changes['items']) {
			if (this.optgroup && this.items && this.items.length > 0) {
				let arrItems = this.groupData(this.items);
				this.groupItems.next(arrItems);
				this.filteredItems.next(arrItems);
			}
			this.updateAutoCompleteControl();
		}
	}

	updateAutoCompleteControl() {
		if (this.items && this.autocomplete && this.items.length > 0) {
			const defaultItem = this.items.find((item: any) => {
				return item[this.keyValue] === this.value;
			});
			if (defaultItem) {
				this.originalValue = defaultItem[this.keyTitle];
				this.inputControl.setValue(defaultItem[this.keyTitle]);
			}
		}
	}

	@Input() readonly: boolean = false;

	@Input() get value(): any {
		return this.inputControl.value;
	}

	writeValue(value: any) {
		this.value = value;
	}

	set value(value: any) {
		if (typeof (value) === 'string') {
			if (!this.isNullOrEmpty(value)) {
				value = value.replace(/\+/, '');
			}
		}
		this.originalValue = value;
		if (this.items && ((this.autocomplete && this.items.length > 0))) {
			if (this.errorState) {
				this.errorState = false;
				this.ngControl.control.setErrors(null);
				this.stateChanges.next();
			}
			const defaultItem = this.items.find((item: any) => {
				return item[this.keyValue] === value;
			});
			if (defaultItem) {
				this.originalValue = defaultItem[this.keyTitle];
				this.inputControl.setValue(defaultItem[this.keyTitle]);
			}
			else {
				this.inputControl.setValue(value);
			}
			return;
		}
		this.inputControl.setValue(value);
		this.stateChanges.next();
	}

	static nextId = 0;
	@HostBinding() id = `multi-select-${AutocompleteSimpleComponent.nextId++}`;

	private _placeholder: string;
	@Input() get placeholder() {
		return this._placeholder;
	}
	set placeholder(plh) {
		this._placeholder = plh;
		this.stateChanges.next();
	}

	get empty() {
		let value = this.inputControl.value;
		return this.isNullOrEmpty(value);
	}

	@HostBinding('class.floating')
	get shouldLabelFloat() {
		return this.focused || !this.empty;
	}

	private _required = false;
	@Input() get required() {
		return this._required;
	}
	set required(req) {
		this._required = coerceBooleanProperty(req);
		this.stateChanges.next();
	}

	private _disabled = false;
	@Input() get disabled(): boolean {
		return this._disabled;
	}
	set disabled(value: boolean) {
		this._disabled = coerceBooleanProperty(value);
		this._disabled ? this.inputControl.disable() : this.inputControl.enable();
		this.stateChanges.next();
	}

	@HostBinding('attr.aria-describedby') describedBy = '';
	setDescribedByIds(ids: string[]) {
		this.describedBy = ids.join(' ');
	}

	registerOnChange(fn: (value: any) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => {}): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	clearValue() {
		timer(500).pipe(takeUntil(this._unsubscribe$)).subscribe({
			next: () => {
				this.originalValue = '';
				this.inputControl.setValue('');
				this.valueChange.emit('');
				this.onChange('');
				let err: ValidationErrors = null;
				if (this.required) {
					this.errorState = true;
					err = { required: 'error' };
				}
				else {
					this.errorState = false;
				}
				this.ngControl.control.setErrors(err);
				this.stateChanges.next();
				this.onSelectItem.emit(null);
				if (this.trigger) {
					this.trigger.openPanel();
				}
			}
		});
	}

	onValueChange(valueItem: any): void {
		this.isSelected = true;
		if (this.autocomplete) {
			if (this.items && this.items.length > 0) {
				const defaultItem = this.items.find((item: any) => {
					return item[this.keyValue] === valueItem;
				});
				let value = null;
				if (defaultItem) {
					value = defaultItem[this.keyValueEmit];
					this.originalValue = defaultItem[this.keyTitle];
					this.inputControl.setValue(defaultItem[this.keyTitle]);
					this.onSelectItem.emit(defaultItem);
				}
				this.valueChangeSelect.emit(defaultItem[this.keyValue]);
				this.valueChange.emit(value);
				this.onChange(value);
				let err: ValidationErrors = null;
				this.ngControl.control.setErrors(err);
				this.errorState = false;
				this.stateChanges.next();
				return;
			}
		}
		else {
			const defaultItem = this.items.find((item: any) => {
				return item[this.keyValue] === valueItem;
			});
			if (defaultItem) {
				this.onSelectItem.emit(defaultItem);
			}
		}
		this.originalValue = valueItem;
		this.valueChange.emit(valueItem);
		let err: ValidationErrors = null;
		this.onChange(valueItem);
		this.ngControl.control.setErrors(err);
		this.errorState = false;
		this.stateChanges.next();
	}

	trackByFn(index: number) {
		return index;
	}

	isNullOrEmpty(data: any) {
		return this.sharedService.isNullOrEmpty(data);
	}

	openDropdownAuto() {
		if (this.trigger) {
			if (this.isNullOrEmpty(this.inputControl.value)) {
				let items = this.items;
				if (items && items.length > 0 && this.topValue > 0) {
					items = this.linq.Enumerable().From(items).Take(this.topValue).ToArray();
				}
				if (this.optgroup) {
					items = this.groupData(items);
				}
				this.filteredItems.next(items);
			}
			if (this.target === 'device-config') {
				this.trigger._onChange(this.inputControl.value);
			}
			this.trigger.openPanel();
		}
	}

	onContainerClick(event: MouseEvent) {
		let target: any = event.target;
		if (target) {
			if (target.tagName === 'INPUT') {
				target.focus();
			}
			// else {
			// 	let input = jQuery(target).find(`input[type='text']`)[0];
			// 	if (input) {
			// 		input.focus();
			// 	}
			// }
			setTimeout(() => {
				this.openDropdownAuto();
			}, 20);
		}
	}

	public displayFn(item: any): string | undefined {
		return item ? item : undefined;
	}

	ngOnDestroy(): void {
		if (this.filteredItems) {
			this.filteredItems.complete();
		}
		if (this._unsubscribe$ && this._unsubscribe$.unsubscribe) {
			this._unsubscribe$.next();
			this._unsubscribe$.complete();
		}
	}
}
