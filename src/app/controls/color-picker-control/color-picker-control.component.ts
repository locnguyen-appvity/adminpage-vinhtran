import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Cmyk, ColorPickerService } from 'ngx-color-picker';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-color-picker-control',
	templateUrl: './color-picker-control.component.html',
	styleUrls: ['./color-picker-control.component.scss']
})
export class ColorPickerControlComponent extends SimpleBaseComponent implements OnChanges {

	@Output() valueChange: EventEmitter<any> = new EventEmitter();
	@Input() value: string = '#5bbfea';

	public toggle: boolean = false;

	public rgbaText: string = 'rgba(165, 26, 214, 0.2)';

	public colorList = [
		{ key: "flame", value: "#e45a33", friendlyName: "Flame" },
		{ key: "orange", value: "#fa761e", friendlyName: "Orange" },
		{ key: "infrared", value: "#ef486e", friendlyName: "Infrared" },
		{ key: "male", value: "#4488ff", friendlyName: "Male Color" },
		{ key: "female", value: "#ff44aa", friendlyName: "Female Color" },
		{ key: "paleyellow", value: "#ffd165", friendlyName: "Pale Yellow" },
		{ key: "gargoylegas", value: "#fde84e", friendlyName: "Gargoyle Gas" },
		{ key: "androidgreen", value: "#9ac53e", friendlyName: "Android Green" },
		{ key: "carribeangreen", value: "#05d59e", friendlyName: "Carribean Green" },
		{ key: "bluejeans", value: "#5bbfea", friendlyName: "Blue Jeans" },
		{ key: "cyancornflower", value: "#1089b1", friendlyName: "Cyan Cornflower" },
		{ key: "warmblack", value: "#06394a", friendlyName: "Warm Black" },
	];


	public presetValues: string[] = [];

	public selectedColor: string = '';

	public cmykColor: Cmyk = new Cmyk(0, 0, 0, 0);

	constructor(
		public sharedService: SharedPropertyService,
		public vcRef: ViewContainerRef,
		private cpService: ColorPickerService) {
		super(sharedService);
		this.presetValues = this.getColorValues();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value']) {
			this.selectedColor = this.value;
		}
	}

	colorPickerChange(event: any) {
		this.selectedColor = event;
	}

	colorPickerClose(event: any) {
		if (this.selectedColor != this.value) {
			this.valueChange.emit({ action: 'value-change', data: this.selectedColor })
		}
	}

	getColorValues() {
		return this.colorList.map(c => c.value);
	}


	public onEventLog(event: string, data: any): void {
		console.log(event, data);
	}

	public onChangeColorCmyk(color: string): Cmyk {
		const hsva = this.cpService.stringToHsva(color);

		if (hsva) {
			const rgba = this.cpService.hsvaToRgba(hsva);

			return this.cpService.rgbaToCmyk(rgba);
		}

		return new Cmyk(0, 0, 0, 0);
	}

	public onChangeColorHex8(color: string): string {
		const hsva = this.cpService.stringToHsva(color, true);

		if (hsva) {
			return this.cpService.outputFormat(hsva, 'rgba', null);
		}

		return '';
	}

}
