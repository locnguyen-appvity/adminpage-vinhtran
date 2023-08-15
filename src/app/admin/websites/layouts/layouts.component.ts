import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-layouts',
	templateUrl: './layouts.component.html',
	styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent extends SimpleBaseComponent {

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
