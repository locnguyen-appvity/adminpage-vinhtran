import { Component, Input, OnChanges, ElementRef, OnDestroy } from '@angular/core';
import { CapitalizeFirstPipe } from './capitalize-first.pipe';

@Component({
	selector: 'error-validate',
	templateUrl: './error-validate.component.html',
	providers: [CapitalizeFirstPipe]
})

export class ErrorValidateComponent implements OnChanges, OnDestroy {
	@Input() errors: any = [];
	@Input() dirty: boolean = false;
	@Input() lowerCase: boolean = true;
	@Input() controlName: string = "";
	public message = "";

	constructor(private el: ElementRef,
		private capitalizeFirstPipe: CapitalizeFirstPipe) {
	}

	ngOnChanges() {
		if (this.dirty || this.errors) {
			for (let err in this.errors) {
				switch (err) {
					case "required":

						if (this.lowerCase) {
							this.message = this.capitalizeFirstPipe.transform(`${this.controlName} bắt buộc phải nhập.`);
						}
						else {
							this.message = `${this.controlName} bắt buộc phải nhập.`;
						}
						break;
					default:
						this.message = this.errors[err];
						break;
				}
			}
		}
	}

	private _releaseComponentProperties(): void {
		this.errors = null;
		this.dirty = null;
		this.lowerCase = null;
		this.controlName = null;
		this.message = null;
	}

	ngOnDestroy(): void {
		this._releaseComponentProperties();
	}
}
