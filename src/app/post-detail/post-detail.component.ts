import { Component } from '@angular/core';
import { SimpleBaseComponent } from '../shared/simple.base.component';
import { SharedPropertyService } from '../shared/shared-property.service';
import { SharedService } from '../shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
	selector: 'app-post-detail',
	templateUrl: './post-detail.component.html',
	styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent extends SimpleBaseComponent {

	public localItem: any;
	public type: string = 'post';

	constructor(
		public sharedService: SharedPropertyService,
		public router: Router,
		public activeRoute: ActivatedRoute
	) {
		super(sharedService);
		if(this.router.url.includes("suy-niem")){
			this.type = 'contemplation';
		}
		this.ID = this.activeRoute.parent.snapshot.paramMap.get("id");
	}

}
