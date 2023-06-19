import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'initialsName'
})
export class InitialsPipe implements PipeTransform {
	transform(value: any): any {
		if (value) {
			let regex = /(?!\bmr\.?\b|\bmiss\b|\blord\b|\bdr\b)((?:\s)|(?:^))(\b[a-z])/ig;
			let arrValues = value.match(regex);
			if (arrValues == null) {
				return '';
			}
			let matches = [...arrValues];
			if (matches && matches.length > 2) {
				matches = [matches[0], matches[matches.length - 1]];
			}
			let result: string = '';
			matches.map((char: string) => {
				result += char.trim().toUpperCase();
			});
			return result;
		}
		else {
			return value;
		}
	}
}
