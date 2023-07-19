import { Component } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'app-appointments',
	templateUrl: './appointments.component.html',
	styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent extends SimpleBaseComponent {

	constructor(public override sharedService: SharedPropertyService) {
		super(sharedService);
	}

}
