import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-dioceses',
	templateUrl: './dioceses.component.html',
	styleUrls: ['./dioceses.component.scss']
})
export class DiocesesComponent extends SimpleBaseComponent {
	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
