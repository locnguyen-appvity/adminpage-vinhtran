import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { PageService } from 'src/app/page/page.service';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
	selector: 'se-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends SimpleBaseComponent {

	public pictureUrl = './assets/images/logo-for-web.png';
	public itemApp = './assets/images/itemApp.jpg';
	public arrDioceses:any[] = [];

	constructor(
		public sharedService: SharedPropertyService,
		public service: PageService
		) {
		super(sharedService);
		this.getDioceses();
	}

	getDioceses() {
		this.arrDioceses = [];
		let options = {
			sort:'name asc'
		}
		this.service.getDioceses(options).pipe(take(1)).subscribe((res: any) => {
			if (res && res.value && res.value.length > 0) {
				this.arrDioceses = res.value;
			}
		})
	}


}
