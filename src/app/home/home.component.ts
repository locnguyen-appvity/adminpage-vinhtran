import { Component } from '@angular/core';
import { SimpleBaseComponent } from '../shared/simple.base.component';
import { SharedPropertyService } from '../shared/shared-property.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SimpleBaseComponent {
	public searchResult: boolean = true;

	constructor(
		public override sharedService: SharedPropertyService
	) {
		super(sharedService);

	}
}
