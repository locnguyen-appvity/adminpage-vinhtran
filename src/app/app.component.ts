import { Component, ViewChild } from '@angular/core';
import { SimpleBaseComponent } from './shared/simple.base.component';
import { SharedPropertyService } from './shared/shared-property.service';
import { distinctUntilChanged, share, shareReplay, takeUntil } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends SimpleBaseComponent {

    public appSetting: MatSidenav;
	@ViewChild('appSetting') set elemOnHTML(elemOnHTML: MatSidenav) {
		if (!!elemOnHTML) {
			this.appSetting = elemOnHTML;
		}
	}

    constructor(
        public override sharedService: SharedPropertyService,
		private titleService: Title,
		public router: Router,
    ) {
        super(sharedService);
        this.actionsAsync();
		this.titleService.setTitle("Giáo Phận Phú Cường");

		// this.router.events.pipe(shareReplay({
		// 	bufferSize: 1,
		// 	refCount: true,
		// }), takeUntil(this.unsubscribe)).subscribe((event: any) => {
		// 	console.log("event........",event);
		// 	console.log(location.origin);
		// 	console.log(location.href);
		// 	console.log(location.pathname);
		// });
    }

    actionsAsync() {
		this.sharedService.dataItemObs.pipe(distinctUntilChanged(), share(), shareReplay({
			bufferSize: 1,
			refCount: true,
		}), takeUntil(this.unsubscribe)).subscribe((res: any) => {
			if (res.action === 'closed-panel-setting') {
				this.appSetting.close();
			}
		})
	}
}
