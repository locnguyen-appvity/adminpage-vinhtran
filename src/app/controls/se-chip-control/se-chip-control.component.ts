import { Component, Input, ElementRef, Self, Optional, HostBinding, OnDestroy, OnChanges, Output, EventEmitter, SimpleChanges, AfterViewInit } from '@angular/core';
import { takeUntil, debounceTime, distinctUntilChanged, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormControl, NgControl, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { LinqService } from 'src/app/shared/linq.service';
import { SharedService } from 'src/app/shared/shared.service';
import { GlobalSettings } from 'src/app/shared/global.settings';

@Component({
	selector: 'se-chip-control',
	templateUrl: './se-chip-control.component.html',
	styleUrls: ['./se-chip-control.component.scss'],
	providers: [
		{
			provide: MatFormFieldControl,
			useExisting: SEChipControlComponent
		}
	],
	host: {
		'[id]': 'id',
		'[attr.aria-describedby]': 'describedBy'
	}
})
export class SEChipControlComponent extends SimpleBaseComponent implements MatFormFieldControl<any[]>, OnChanges, OnDestroy, AfterViewInit {
	@Input() placeholder_input: string = '';
	@Input() target: string = '';

	@Input() type: string = '';
	@Input() filter: string = '';
	@Input() loadDefaultData: boolean = true;
	@Input() hasShowAvatar: boolean = false;
	@Input() topValue: number = 0;
	@Input() roleSearch: string = '';

	@Input() single: boolean = false;
	@Input() spinnerProcess: boolean = false;
	@Input() isRequired: boolean = false;
	public chips: any = [];
	public ctrlSearch: FormControl;
	public ctrlChip: FormControl;
	public currentValue: string = "";
	public items$: Subject<any[]>;
	@Input() dataItems: any[] = [];
	@Input() selectedItems: any[] = [];
	@Input() defaultItems: any[] = [];
	public addOnBlur = false;
	public separatorKeysCodes: number[] = [ENTER, COMMA];
	private isSelected: boolean = false;

	//Custom Form Control
	public focused = false;
	public errorState = false;
	public controlType = 'se-chip-control';
	private orginalValue: any;
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
		this.orginalValue = value;
		this.stateChanges.next();
	}

	static nextId = 0;
	@HostBinding() id = `se-chip-control-${SEChipControlComponent.nextId++}`;

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
		this.items$ = new Subject<[]>();
		this.ctrlSearch = new FormControl('');
		this.ctrlChip = new FormControl('');
		this.ctrlSearch.valueChanges.pipe(debounceTime(GlobalSettings.Settings.delayTimer.valueChanges), distinctUntilChanged(), takeUntil(this.unsubscribe), takeUntil(this.unsubscribe)).subscribe({
			next: value => {
				if (value != this.currentValue) {
					this.currentValue = value;
					if (this.target == "load-lazy-data") {
						if (this.isSelected) {
							this.isSelected = false;
							return;
						}
						this.items$.next([]);
						if (!this.isNullOrEmpty(this.type)) {
							this.getAllDataItems(this.currentValue);
						}
						else {
							this.valueChange.emit({ action: 'search-value', data: value });
						}
					}
					else {
						let items = this._filter(value);
						if (this.defaultItems && this.defaultItems.length > 0) {
							items.unshift(...this.defaultItems);
						}
						this.items$.next(items);
					}
				}
			}
		});
	}

	private _filter(value: string): Array<string> {
		if (!this.isNullOrEmpty(value)) {
			const filterValue = value.toLowerCase();
			return this.dataItems.filter((item: any) => {
				return item.name.toLowerCase().includes(filterValue)
			});
		}
		return this.dataItems;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedItems'] && this.selectedItems) {
			this.chips = this.selectedItems.concat([]);
			this.ctrlChip.setValue(this.chips.map(it => it._id).join(','));
			this.updateAvatarChip();
		}
		if (changes['dataItems']) {
			this.items$.next(this.dataItems);
		}
		if (changes['filter']) {
			if (!this.isNullOrEmpty(this.type)) {
				this.getAllDataItems(this.currentValue);
			}
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

	updateAvatarChip() {
		if (this.chips && this.chips.length > 0 && this.hasShowAvatar) {
			for (let item of this.chips) {
				this.getAvatar(item);
			}
		}
	}

	getAvatar(dataItem: any) {
		// let key = 'User' + dataItem.id;
		// if (!this.isNullOrEmpty(this.sharedService.AvatarsInfo[key])) {
		// 	dataItem.pictureUrl = this.sharedService.AvatarsInfo[key].pictureUrl;
		// 	dataItem.hasAvatar = this.sharedService.AvatarsInfo[key].hasAvatar;
		// 	return;
		// }
		// dataItem.hasAvatar = false;
		// ((data: any) => {
		// 	this.service
		// 		.getAvatarExxon(data.id)
		// 		.pipe(takeUntil(this.unsubscribe))
		// 		.subscribe({
		// 			next: (resp: any) => {
		// 				if (!this.isNullOrEmpty(resp.body)) {
		// 					const info = resp.body;
		// 					data.pictureUrl = '';
		// 					if (info.value) {
		// 						data.pictureUrl = info.value;
		// 						data.hasAvatar = true;
		// 					}
		// 					this.sharedService.AvatarsInfo[key] = {
		// 						pictureUrl: data.pictureUrl,
		// 						hasAvatar: true
		// 					}
		// 				}
		// 			}
		// 		});
		// })(dataItem);
	}

	ngAfterViewInit(): void {
		if (!this.isNullOrEmpty(this.type) && this.loadDefaultData) {
			this.getAllDataItems('');
		}
	}

	getAllDataItems(val: string) {
		if (this.subscription['get_all_data']) {
			this.subscription['get_all_data'].unsubscribe();
		}
		this.spinnerProcess = true;
		let filter = this.getFilter(val);
		this.subscription['get_all_data'] = this.getDataItems(filter).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (users: any) => {
				let items = [];
				if (users && users.length > 0) {
					items = users;
					if (this.hasShowAvatar) {
						for (let item of items) {
							this.getAvatar(item);
						}
					}
				}
				if (this.defaultItems && this.defaultItems.length > 0) {
					items.unshift(...this.defaultItems);
				}
				this.dataItems = items;
				this.items$.next(items);
				this.getItemSelected(this.orginalValue);
				this.spinnerProcess = false;
				if (this.subscription['get_all_data']) {
					this.subscription['get_all_data'].unsubscribe();
				}
			}
		});
	}

	getFilter(searchValue: string) {
		let filter = '';
		if (!this.isNullOrEmpty(this.filter)) {
			filter = this.filter;
		}
		if (!this.isNullOrEmpty(searchValue)) {
			let quick = searchValue.replace("'", "`");
			quick = this.sharedService.handleODataSpecialCharacters(quick);
			let quickSearch = `contains(name, '${quick}')`;
			if (this.isNullOrEmpty(filter)) {
				filter = quickSearch;
			}
			else {
				filter = "(" + filter + ")" + " and (" + quickSearch + ")";
			}
		}
		return filter;
	}

	getDataItems(filter: string) {
		let request = new Observable();
		if (this.type == 'tags') {
			request = this.getTags(filter);
		}
		else if(this.type == 'authors') {
			request = this.getAuthors(filter);
		}
		else if(this.type == 'parables') {
			request = this.getParables(filter);
		}
		else if(this.type == 'categories') {
			request = this.getCategories(filter);
		}
		return request;
	}

	getTags(filter: string) {
		return new Observable(obs => {
			this.dataProcessing = true;
			this.service.getTags().pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						items = res.value;
					}
					obs.next(items);
					obs.complete();
					this.dataProcessing = false;
				}
			})
		})
	}

	getCategories(filter: string) {
		return new Observable(obs => {
			this.dataProcessing = true;
			this.service.getCategories().pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						items = res.value;
					}
					obs.next(items);
					obs.complete();
					this.dataProcessing = false;
				}
			})
		})
	}

	getAuthors(filter: string) {
		return new Observable(obs => {
			this.dataProcessing = true;
			this.service.getAuthors().pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.value && res.value.length > 0) {
						items = res.value;
					}
					obs.next(items);
					obs.complete();
					this.dataProcessing = false;
				}
			})
		})
	}

	getParables(filter: string) {
		return new Observable(obs => {
			this.dataProcessing = true;
			this.service.getParables().pipe(take(1)).subscribe({
				next: (res: any) => {
					let items = [];
					if (res && res.data && res.data &&  res.data.results && res.data.results.length > 0) {
						for(let item of res.data.results){
							item.name = item.quotation;
						}
						items = res.data.results;
					}
					obs.next(items);
					obs.complete();
					this.dataProcessing = false;
				}
			})
		})
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

	getItemSelected(ids: any) {
		if (this.isNullOrEmpty(ids) || ids.length === 0) {
			this.valueChange.emit({ action: 'loaded-item', data: [] });
			return;
		}
		for (let id of ids) {
			if (id !== null && !this.isExistItem({ id: id })) {
				let user = this.getItemInArray(id, this.dataItems);
				this.chips.push(user);
			}
			this.valueChange.emit({ action: 'loaded-user', data: this.chips });
		}
	}

	getItemInArray(id: number, items: any) {
		if (items && items.length > 0 && id !== null) {
			for (let item of items) {
				if (item.id === id) {
					return item;
				}
			}
		}
		return null;
	}

	isExistItem(item: any) {
		if (this.chips && this.chips.length > 0 && item !== null) {
			for (let chip of this.chips) {
				if (chip.id === item.id) {
					return true;
				}
			}
		}
		return false;
	}

	addNewItem($event: any) {
		if (this.disabled || this.readonly) {
			return;
		}
		if ($event.keyCode === 13 || $event.keyCode === 186 || $event.keyCode === 188 || $event.which === 1) {
			let zeroItem = this.dataItems[0];
			let existItem = this.chips.find((chip: any) => chip.id === zeroItem.id);
			if (this.isNullOrEmpty(existItem)) {
				let itemInfo = {
					name: zeroItem.name,
					id: zeroItem.id,
					pictureUrl: zeroItem.pictureUrl,
					hasAvatar: zeroItem.hasAvatar,
					status: 'add'
				};
				if (this.single) {
					this.chips = [itemInfo];
				}
				else {
					if (!this.isExistItem(itemInfo)) {
						this.chips.push(itemInfo);
					}
				}
				let items = [];
				this.chips.forEach((chip: any) => {
					items.push(chip.id);
				});
				this.onChange(items);
				this.errorState = false;
				this.stateChanges.next();
				this.valueChange.emit({ action: 'change-value', data: this.chips });
			}
			this.ctrlChip.setValue(this.chips.map(it => it.id).join(','));

			this.isSelected = true;
			this.ctrlSearch.setValue('');
		}
	}

	selectedOption(event: any) {
		if (this.disabled || this.readonly) {
			return;
		}
		let currentItem = event.option.value;
		let existItem = this.chips.find((chip: any) => chip.id === currentItem.id);
		if (this.isNullOrEmpty(existItem)) {
			for (let item of this.dataItems) {
				if (item.id == currentItem.id) {
					let addItem = {
						name: item.name,
						id: item.id,
						hasAvatar: currentItem.hasAvatar,
						pictureUrl: currentItem.pictureUrl,
						status: 'add'
					};
					if (this.single) {
						this.chips = [addItem];
						this.valueChangeRemoveSelected.emit({ action: 'selected-value', data: addItem });
					}
					else {
						if (!this.isExistItem(addItem)) {
							this.chips.push(addItem);
							this.valueChangeRemoveSelected.emit({ action: 'selected-value', data: addItem });
						}
					}
					let items = [];
					this.chips.forEach((chip: any) => {
						items.push(chip.id);
					});
					this.onChange(items);
					this.errorState = false;
					this.stateChanges.next();
					this.valueChange.emit({ action: 'change-value', data: this.chips });
					break;
				}
			}
		}
		this.ctrlChip.setValue(this.chips.map(it => it.id).join(','));

		this.isSelected = true;
		this.ctrlSearch.setValue('');
	}

	removeChip(chip: any) {
		if (this.disabled || this.readonly) {
			return;
		}
		for (let i = 0; i < this.chips.length; i++) {
			if (chip == this.chips[i].id) {
				let itemRemove = this.chips[i];
				this.chips.splice(i, 1);
				let items = [];
				this.chips.forEach((it: any) => {
					items.push(it.id);
				});
				this.onChange(items);
				this.errorState = false;
				this.stateChanges.next();
				this.valueChangeRemoveSelected.emit({ action: 'remove-value', data: itemRemove });
				this.valueChange.emit({ action: 'change-value', data: this.chips });
				break;
			}
		}
		this.ctrlChip.setValue(this.chips.map(it => it.id).join(','));
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
		this.items$ = null;
		this.addOnBlur = null;
		this.separatorKeysCodes = null;
		this.focused = null;
		this.errorState = null;
		this.controlType = null;
		this.orginalValue = null;
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
		if (this.items$) {
			this.items$.next([]);
			this.items$.complete();
		}
		this.stateChanges.complete();
		this.fm.stopMonitoring(this.elRef.nativeElement);
		super.ngOnDestroy();
		this._releaseComponentProperties();
	}
}
