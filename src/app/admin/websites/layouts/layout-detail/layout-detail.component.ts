import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ToastSnackbarAppComponent } from 'src/app/controls/toast-snackbar/toast-snackbar.component';
import { centerRevealTrigger, slideDownTrigger } from 'src/app/shared/animations';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SharedService } from 'src/app/shared/shared.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';

@Component({
    selector: 'app-layout-detail',
    templateUrl: './layout-detail.component.html',
    styleUrls: ['./layout-detail.component.scss'],
    animations: [slideDownTrigger, centerRevealTrigger],
})
export class LayoutDetailComponent extends SimpleBaseComponent implements AfterViewInit {

    @ViewChild('templateOptions', { static: true }) templateOptions: TemplateRef<any>;
    @ViewChild('originRef', { static: true }) originRef: ElementRef;

    public localItem: any = {
        rows:[]
    };
    public title: string = "Danh Sách Giáo Xứ";
    public statusLabel: any = {
        title: "Tạo Mới",
        class: 'draft-label'
    }
    private overlayRef: OverlayRef;
    public templatePortal: TemplatePortal<any>;
    public editMode: boolean = true;

    constructor(
        private service: SharedService,
        public sharedService: SharedPropertyService,
        private overlayPositionBuilder: OverlayPositionBuilder,
        public overlay: Overlay,
        public router: Router,
        public snackbar: MatSnackBar,
        public activeRoute: ActivatedRoute,
        private _viewContainerRef: ViewContainerRef,
        public dialog: MatDialog
    ) {
        super(sharedService);

    }

    ngAfterViewInit(): void {
        const positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.originRef)
            .withPositions([{
                originX: 'center',
                originY: 'top',
                overlayX: 'center',
                overlayY: 'bottom',
                offsetY: 104,
            }]);

        this.overlayRef = this.overlay.create({ positionStrategy });
    }


    routeToBack() {
        this.router.navigate([`/admin/websites/layouts/list`]);
    }

    getLayout() {
        this.service.getLayout(this.ID).pipe(take(1)).subscribe({
            next: (res: any) => {
                if (res) {
                    this.localItem = res;
                }
            }
        })
    }

    onSave(status: string) {
        let dataJSON = {

        }
        let request: any;
        if (!this.isNullOrEmpty(this.ID)) {
            request = this.service.updateLayout(this.ID, dataJSON);
        }
        else {
            request = this.service.createLayout(dataJSON)
        }
        request.pipe(take(1)).subscribe({
            next: () => {
                let snackbarData: any = {
                    key: 'saved-item',
                    message: 'Lưu Thành Công'
                };
                this.showInfoSnackbar(snackbarData);
                this.routeToBack();
            }
        })
    }

    showInfoSnackbar(dataInfo: any) {
        this.snackbar.openFromComponent(ToastSnackbarAppComponent, {
            duration: 5000,
            data: dataInfo,
            horizontalPosition: 'start'
        });
    }

    closeSectionOptions() {
        this.overlayRef.detach();
    }

    openSectionOptions() {
        this.templatePortal = new TemplatePortal(this.templateOptions, this._viewContainerRef);
        this.overlayRef.attach(this.templatePortal);
    }

    addRow(rowType: string) {
        let row = {};
        switch (rowType) {
            case 'view_1':
                row = {
                    type: 'view_1',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '100%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
            case 'view_2':
                row = {
                    type: 'view_2',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '50%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '50%',
                            index: 1,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
            case 'view_3':
                row = {
                    type: 'view_3',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '33.33%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '33.33%',
                            index: 1,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '33.33%',
                            index: 2,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
            case 'view_4':
                row = {
                    type: 'view_4',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '30%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '70%',
                            index: 1,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
            case 'view_5':
                row = {
                    type: 'view_5',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '25%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '25%',
                            index: 1,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '25%',
                            index: 2,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '25%',
                            index: 3,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
            case 'view_6':
                row = {
                    type: 'view_6',
                    index: this.localItem.rows.length,
                    cells: [
                        {
                            type: '',
                            id: 0,
                            size: '70%',
                            index: 0,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        },
                        {
                            type: '',
                            id: 0,
                            size: '30%',
                            index: 1,
                            widgetId: '',
                            added: false,
                            edited: false,
                            config: {}
                        }
                    ]
                };
                this.localItem.rows.push(row);
                break;
        }
        this.overlayRef.detach();
    }


}
