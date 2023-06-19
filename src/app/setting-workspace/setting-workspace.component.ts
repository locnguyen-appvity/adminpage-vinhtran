import { Component } from '@angular/core';
import { SharedPropertyService } from '../shared/shared-property.service';
import { SimpleBaseComponent } from '../shared/simple.base.component';

@Component({
    selector: 'app-setting-workspace',
    templateUrl: './setting-workspace.component.html',
    styleUrls: ['./setting-workspace.component.scss']
})
export class SettingWorkspaceComponent extends SimpleBaseComponent {

    public brandColor: string = "#0470a7";
    public brandLinkColor: string = "#0470a7";
    public brandICONColor: string = "#ffffff";
    public brandMainMenuColor: string = "#000";
    public brandBGColor: string = "#179ad6";
    constructor(
        public sharedService: SharedPropertyService
    ) {
        super(sharedService);
        let brandColor = localStorage.getItem('brand-color');
        if(!this.isNullOrEmpty(brandColor)){
            this.brandColor = brandColor;
            this.onSetBrandColor(this.brandColor);
        }
        let brandLinkColor = localStorage.getItem('brand-link-color');
        if(!this.isNullOrEmpty(brandLinkColor)){
            this.brandLinkColor = brandLinkColor;
            this.onSetBrandLinkColor(this.brandLinkColor);
        }
        let brandBGColor = localStorage.getItem('brand-bg-color');
        if(!this.isNullOrEmpty(brandBGColor)){
            this.brandBGColor = brandBGColor;
            this.onSetBrandBGColor(this.brandBGColor);
        }
        let brandICONColor = localStorage.getItem('brand-icon-color');
        if(!this.isNullOrEmpty(brandICONColor)){
            this.brandICONColor = brandICONColor;
            this.onSetBrandICONColor(this.brandICONColor);
        }
        let brandMainMenuColor = localStorage.getItem('color-text-main-menu');
        if(!this.isNullOrEmpty(brandMainMenuColor)){
            this.brandMainMenuColor = brandMainMenuColor;
            this.onSetBrandMainMenuTextColor(this.brandMainMenuColor);
        }
    }

    closedSetting() {
        this.sharedService.sharedData({ action: 'closed-panel-setting' });
    }

    valueChangeColor(event: any, target: string) {
        if (event && event.action == 'value-change') {
            if (!this.isNullOrEmpty(event.data)) {
                if (target == 'text') {
                    this.brandColor = event.data;
                }
                else  if (target == 'link') {
                    this.brandLinkColor = event.data;
                }
                else if(target == 'icon'){
                    this.brandICONColor = event.data;
                }
                else if(target == 'color-text-main-menu'){
                    this.brandMainMenuColor = event.data;
                }
                else {
                    this.brandBGColor = event.data;
                }
            }
        }
    }

    onSetBrandLinkColor(color: any) {
        let colorRgb = this.hexToRgb(color);
        document.documentElement.style.setProperty("--dynamic-link-colour", colorRgb);
    }

    onSetBrandColor(color: any) {
        let colorRgb = this.hexToRgb(color);
        document.documentElement.style.setProperty("--dynamic-colour", colorRgb);
    }
    
    onSetBrandICONColor(color: any) {
        let colorRgb = this.hexToRgb(color);
        document.documentElement.style.setProperty("--dynamic-icon-colour", colorRgb);
    }
    
    onSetBrandBGColor(color: any) {
        let colorRgb = this.hexToRgb(color);
        document.documentElement.style.setProperty("--dynamic-background-colour", colorRgb);
    }

    onSetBrandMainMenuTextColor(color: any) {
        let colorRgb = this.hexToRgb(color);
        document.documentElement.style.setProperty("--color-text-main-menu", colorRgb);
    }

    hexToRgb(hex) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : null;
    }

    onSaveSetting() {
        localStorage.setItem('brand-bg-color', this.brandBGColor);
        this.onSetBrandBGColor(this.brandBGColor);
        
        localStorage.setItem('brand-color', this.brandColor);
        this.onSetBrandColor(this.brandColor);

        localStorage.setItem('brand-link-color', this.brandLinkColor);
        this.onSetBrandLinkColor(this.brandLinkColor);

        localStorage.setItem('brand-icon-color', this.brandICONColor);
        this.onSetBrandICONColor(this.brandICONColor);

        localStorage.setItem('color-text-main-menu', this.brandMainMenuColor);
        this.onSetBrandMainMenuTextColor(this.brandMainMenuColor);

        this.closedSetting();
    }

}
