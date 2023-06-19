import { Component, Input, ElementRef, Self, Optional, HostBinding, OnDestroy, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, NgControl, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { LinqService } from 'src/app/shared/linq.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
	selector: 'se-chip-simple',
	templateUrl: './se-chip-simple.component.html',
	styleUrls: ['./se-chip-simple.component.scss'],
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: SEChipSimpleComponent
		}
	],
	host: {
		'[id]': 'id',
		'[attr.aria-describedby]': 'describedBy'
	}
})
export class SEChipSimpleComponent extends SimpleBaseComponent implements MatFormFieldControl<any[]>, OnChanges, OnDestroy {
	@Input() placeholder_input: string = '';
	@Input() target: string = '';

	@Input() type: string = '';
	@Input() single: boolean = false;
	@Input() spinnerProcess: boolean = false;
	@Input() isRequired: boolean = false;
	public chips: any = [];
	public ctrlSearch: FormControl;
	public ctrlChip: FormControl;
	public currentValue: string = "";
	@Input() selectedItems: any[] = [];
	@Input() defaultItems: any[] = [];
	public addOnBlur = false;
	public separatorKeysCodes: number[] = [ENTER, COMMA];

	//Custom Form Control
	public focused = false;
	public errorState = false;
	public controlType = 'se-chip-control';
	// private orginalValue: any;
	onChange = (value: any) => { };
	onTouched = () => { };
	public stateChanges = new Subject<void>();

	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	@Output() valueChangeRemoveSelected: EventEmitter<any> = new EventEmitter();

	//Control
	public autofilled?: boolean;
	public userAriaDescribedBy?: string;
	@Input() readonly: boolean;

	@Input() get value(): any[] {
		return this.chips;
	}

	set value(value: any[]) {
		this.chips = value;
		this.ctrlChip.setValue(this.chips ? this.chips.join(',') : "");
		this.stateChanges.next();
	}

	static nextId = 0;
	@HostBinding() id = `se-chip-control-${SEChipSimpleComponent.nextId++}`;

	private _placeholder: string;
	@Input() get placeholder() {
		return this._placeholder;
	}
	set placeholder(plh) {
		this._placeholder = plh;
		this.stateChanges.next();
	}

	get empty() {
		return this.chips.length === 0;
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
		this._disabled ? this.ctrlSearch.disable() : this.ctrlSearch.enable();
		this.stateChanges.next();
	}

	constructor(public sharedService: SharedPropertyService,
		public linq: LinqService,
		public service: SharedService,
		@Optional() @Self() public ngControl: NgControl,
		private fm: FocusMonitor,
		private elRef: ElementRef<HTMLElement>) {
		super(sharedService);
		// Replace the provider from above with this.
		if (this.ngControl != null) {
			// Setting the value accessor directly (instead of using
			// the providers) to avoid running into a circular import.
			this.ngControl.valueAccessor = this;
		}
		fm.monitor(elRef.nativeElement, true).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (origin) => {
				this.focused = !!origin;
				this.stateChanges.next();
			}
		});
		this.chips = [];
		this.ctrlSearch = new FormControl('');
		this.ctrlChip = new FormControl('');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedItems'] && this.selectedItems) {
			this.chips = this.selectedItems.concat([]);
			this.ctrlChip.setValue(this.chips.join(','));
		}
		if (changes['isRequired']) {
			if (this.isRequired) {
				this.ctrlChip.setValidators(Validators.required);
			}
			else {
				this.ctrlChip.clearValidators();
			}
			this.ctrlChip.updateValueAndValidity();
		}
	}

	selectedOption() {
		if (this.disabled || this.readonly || this.isNullOrEmpty(this.ctrlSearch.value)) {
			return;
		}
		let currentItem = this.ctrlSearch.value;
		let existItem = this.chips.find((chip: any) => chip === currentItem);
		if (this.isNullOrEmpty(existItem)) {
			if (this.single) {
				this.chips = [currentItem];
				this.valueChangeRemoveSelected.emit({ action: 'selected-value', data: currentItem });
			}
			else {
				if (!this.isExistItem(currentItem)) {
					this.chips.push(currentItem);
					this.valueChangeRemoveSelected.emit({ action: 'selected-value', data: currentItem });
				}
			}
			this.onChange(this.chips);
			this.errorState = false;
			this.stateChanges.next();
			this.valueChange.emit({ action: 'change-value', data: this.chips });
		}
		this.ctrlChip.setValue(this.chips.join(','));
		// this.isSelected = true;
		this.ctrlSearch.setValue('');
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

	isExistItem(item: any) {
		if (this.chips && this.chips.length > 0 && item !== null) {
			for (let chip of this.chips) {
				if (chip == item) {
					return true;
				}
			}
		}
		return false;
	}

	removeChip(chip: any) {
		if (this.disabled || this.readonly) {
			return;
		}
		for (let i = 0; i < this.chips.length; i++) {
			if (chip == this.chips[i]) {
				let itemRemove = this.chips[i];
				this.chips.splice(i, 1);
				this.onChange(this.chips);
				this.errorState = false;
				this.stateChanges.next();
				this.valueChangeRemoveSelected.emit({ action: 'remove-value', data: itemRemove });
				this.valueChange.emit({ action: 'change-value', data: this.chips });
				break;
			}
		}
		this.ctrlChip.setValue(this.chips.join(','));
	}

	writeValue(value: any) {
		if (value === null || value === undefined) {
			return;
		}
		if (value && value.length === 0) {
			//Skip this value
			return;
		}
		this.value = value;
	}

	onContainerClick(event: MouseEvent) {
		if ((event.target as Element).tagName.toLowerCase() != 'input') {
			this.elRef.nativeElement.querySelector('input').focus();
		}
	}

	private _releaseComponentProperties(): void {
		this.placeholder_input = null;
		this.target = null;
		this.single = null;
		this.spinnerProcess = null;
		this.chips = null;
		this.currentValue = null;
		this.addOnBlur = null;
		this.separatorKeysCodes = null;
		this.focused = null;
		this.errorState = null;
		this.controlType = null;
		// this.orginalValue = null;
		this.onChange = null;
		this.onTouched = null;
		this.value = null;
		this.placeholder = null;
		this.required = null;
		this.disabled = null;
		this.ctrlChip = null;
		this.ctrlSearch = null;
		this.stateChanges = null;
	}

	ngOnDestroy() {
		this.stateChanges.complete();
		this.fm.stopMonitoring(this.elRef.nativeElement);
		super.ngOnDestroy();
		this._releaseComponentProperties();
	}
}
