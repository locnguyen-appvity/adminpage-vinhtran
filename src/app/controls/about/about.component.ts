import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalSettings } from 'src/app/shared/global.settings';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent extends SimpleBaseComponent implements OnInit, OnDestroy {
    public versions: any[];
    public productName = 'Audio Book';

    constructor(
        public dialogRef: MatDialogRef<AboutComponent>,
        public sharedService: SharedPropertyService
    ) {
        super(sharedService);
    }

    ngOnInit() {
        this.versions = new Array<any>();
        this.versions.push(GlobalSettings.Settings.Version);
    }


    private _releaseComponentProperites(): void {
        this.versions = null;
        this.productName = null;
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._releaseComponentProperites();
    }
}
