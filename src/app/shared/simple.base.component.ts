import { OnDestroy, Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedPropertyService } from './shared-property.service';
import { CommonUtility } from './common.utility';

@Component({
    selector: 'simple-base',
    template: ''
})
export class SimpleBaseComponent implements OnDestroy {
    private _id: string = '';
    get ID() {
        return this._id;
    }
    set ID(id: string) {
        this._id = id;
    }

    private _loading: boolean = false;
    get showLoading() {
        return this._loading;
    }
    set showLoading(loading: boolean) {
        this._loading = loading;
    }

    private _dataProcessing: boolean = false;
    get dataProcessing() {
        return this._dataProcessing;
    }
    set dataProcessing(dataProcessing: boolean) {
        this._dataProcessing = dataProcessing;
        if (this.sharedService) {
            this.sharedService.sharedData({ action: 'show-loading-profile-info', data: dataProcessing });
        }
    }

    public subscription: any = {};
    public unsubscribe = new Subject<void>();
    public basePermissions: any;
    public ready: boolean = false;
    public offset: number = 7;
    public imageUrl: any = "./assets/icons/ic_image_48dp.svg";

    constructor(public sharedService: SharedPropertyService) { }

    isNullOrEmpty(data: any) {
       return CommonUtility.isNullOrEmpty(data);
    }

    isNullOrEmptyZero(data: any) {
       return CommonUtility.isNullOrEmptyZero(data);
    }

    trackByFn(index: number) {
        return index;
    }

    sideNavMain() {
        this.sharedService.sharedData({ action: 'side-nav-toggle' });
    }

    ngOnDestroy() {
        this.sharedService.sharedData({ action: 'show-loading-profile-info', data: false });
        if (this.subscription) {
            for (let key in this.subscription) {
                let sub = this.subscription[key];
                if (!this.isNullOrEmpty(sub)) {
                    if (key === 'redux') {
                        sub();
                    }
                    else if (typeof (sub) !== 'boolean') {
                        sub.unsubscribe();
                    }
                }
            }
        }
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
