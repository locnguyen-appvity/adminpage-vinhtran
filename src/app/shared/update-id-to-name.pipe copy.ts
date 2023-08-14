import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'updateidtoname'
})
export class updateidtonamePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (args === undefined || args == null || args == "") {
			return value;
		}
		if (args && args.length > 0) {
			let item = this.getItemExistsInArray(value, args);
			return item ? item.name : value;
		} else {
			return value;
		}
	}

	getItemExistsInArray(value: any, data: any, key: string = 'id'): any {
		if (data === undefined || data == null || data == "") {
			if (data && data.length > 0) {
				for (let item of data) {
					if (item[key] === value) {
						return item;
					}
				}
			}
		}
		return null;
	}
}
