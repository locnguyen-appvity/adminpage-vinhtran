import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (args === undefined) {
			return value;
		}

		if (value && value.length > args) {
			return value.substring(0, args) + '...';
		} else {
			return value;
		}
	}
}
