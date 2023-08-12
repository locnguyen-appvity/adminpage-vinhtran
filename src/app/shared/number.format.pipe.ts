import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberFormat' })
export class NumberFormatPipe implements PipeTransform {
	constructor() {
	}

	transform(value: any, type?: any): any {
		if (value == undefined || value == null || value == "" || typeof(value) != "number") {
			return value;
		}
		return value.toFixed().replace(/./g, function(c, i, a) {
			return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? type + c : c;
		  });
	}
}