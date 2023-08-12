import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { SharedPropertyService } from 'src/app/shared/shared-property.service';
import { SimpleBaseComponent } from 'src/app/shared/simple.base.component';
import { DialogSelectedImgsComponent } from '../dialog-selected-imgs/dialog-selected-imgs.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject, fromEvent, takeUntil, timer } from 'rxjs';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
@Component({
	selector: 'se-editor-control',
	templateUrl: './editor-control.component.html',
	styleUrls: ['./editor-control.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => EditorControlComponent)
		}
	],
	host: {
		'[id]': 'id',
		'[attr.aria-describedby]': 'describedBy'
	}
})
export class EditorControlComponent extends SimpleBaseComponent implements ControlValueAccessor, AfterViewInit, OnChanges {

	public editorCtrl: any;
	@ViewChild('editorCtrl') set elemOnHTML(elemOnHTML: any) {
		if (!!elemOnHTML) {
			this.editorCtrl = elemOnHTML;
		}
	}
	@Input() config: any;

	public configEditor: any = {
		toolbarSticky: false,
		// readonly: true,
		// toolbar: false,
		buttons: [
			"bold", "italic", "underline", "|", "fontsize", "font", "brush", "|",
			"align", "indent", "indent", "outdent", "|",
			"link", "table", "|",
			"strikethrough", "eraser", "|",
			"ul", "paragraph", "classSpan", "lineHeight",
			"|", "superscript", "subscript"
			, "|", "video",
			{
				name: 'insertImageCustom',
				tooltip: 'Insert image',
				icon: 'image'
			},
			, {
				name: 'insertFile',
				tooltip: 'Insert file',
				icon: 'file'
			},
			"|", "cut", "undo", "redo", "source"
		],
		buttonsXS: [
			"bold", "italic", "underline", "|", "fontsize", "font", "lineHeight", "|",
			"align", "indent", "indent", "outdent", "|",
			"link", "table", "|",
			"strikethrough", "eraser", "|",
			"ul", "paragraph", "classSpan",
			"|", "superscript", "subscript"
			, "|", "video",
			{
				name: 'insertImageCustom',
				tooltip: 'Insert image',
				icon: 'image'
			},
			, {
				name: 'insertFile',
				tooltip: 'Insert file',
				icon: 'file'
			},
			"|", "cut", "undo", "redo", "source"
		],
		buttonsSM: [
			"bold", "italic", "underline", "|", "fontsize", "font", "lineHeight", "|",
			"align", "indent", "indent", "outdent", "|",
			"link", "table", "|",
			"strikethrough", "eraser", "|",
			"ul", "paragraph", "classSpan",
			"|", "superscript", "subscript"
			, "|", "video",
			{
				name: 'insertImageCustom',
				tooltip: 'Insert image',
				icon: 'image'
			},
			, {
				name: 'insertFile',
				tooltip: 'Insert file',
				icon: 'file'
			},
			"|", "cut", "undo", "redo", "source"
		],
		buttonsMD: [
			"bold", "italic", "underline", "|", "fontsize", "font", "lineHeight", "|",
			"align", "indent", "indent", "outdent", "|",
			"link", "table", "|",
			"strikethrough", "eraser", "|",
			"ul", "paragraph", "classSpan",
			"|", "superscript", "subscript"
			, "|", "video",
			{
				name: 'insertImageCustom',
				tooltip: 'Insert image',
				icon: 'image'
			},
			, {
				name: 'insertFile',
				tooltip: 'Insert file',
				icon: 'file'
			},
			"|", "cut", "undo", "redo", "source"
		]
		// buttons: ["bold,italic,underline,|,fontsize,font,|,align,indent,outdent,|,link,table,|,strikethrough,eraser,|,ul,ol,paragraph,classSpan,lineHeight,|,superscript,subscript,|,file,image,video,|,cut,undo,redo,source"]
	}

	public currentValue: string = '';
	public editorFormCtrl: FormControl;
	constructor(public sharedService: SharedPropertyService,
		public dialog: MatDialog) {
		super(sharedService);
		this.editorFormCtrl = new FormControl("");
		this.editorFormCtrl.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe((valueForm: any) => {
			if (this.sharedService.isChangedValue(this.currentValue, valueForm)) {
				this.currentValue = valueForm;
				this.onChange(valueForm);
				this.stateChanges.next();
			}
		})
	}

	public stateChanges = new Subject<void>();
	@Input() get value(): any {
		return this.editorFormCtrl ? this.editorFormCtrl.value : "";
	}

	set value(value: any) {
		this.currentValue = value;
		this.editorFormCtrl.setValue(value);
		this.stateChanges.next();
	}

	@Input() get readonly(): any {
		return this.readonly;
	}

	set readonly(value: any) {
		if (this.editorCtrl) {
			this.editorCtrl.config.readonly = value;
			if (value) {
				this.editorCtrl.toolbar = false;
			}
		}
	}

	private _required = false;
	@Input() get required() {
		return this._required;
	}
	set required(req) {
		this._required = coerceBooleanProperty(req);
		this.stateChanges.next();
	}

	writeValue(obj: any): void {
		this.value = obj;
	}

	onChange = (value) => { };
	onTouched = () => { };

	registerOnChange(onChange: any) {
		this.onChange = onChange;
	}

	registerOnTouched(onTouched: any) {
		this.onTouched = onTouched;
	}

	public disabled: boolean = false;
	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['config']) {
			if (!this.isNullOrEmpty(this.config)) {
				this.configEditor = Object.assign(this.configEditor, this.config);
			}
		}
	}

	ngAfterViewInit(): void {
		this.unsubscribe['add-custom-button'] = timer(500, 500).pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				if (this.editorCtrl && this.editorCtrl.elementRef && this.editorCtrl.elementRef.nativeElement) {
					this.unsubscribe['add-custom-button'].complete();
					this.unsubscribe['add-custom-button'].unsubscribe();
					let seft = this;
					if (this.editorCtrl.elementRef.nativeElement.querySelector('.jodit-ui-group__insertImageCustom')) {
						fromEvent(this.editorCtrl.elementRef.nativeElement.querySelector('.jodit-ui-group__insertImageCustom'), 'click').pipe(takeUntil(this.unsubscribe)).subscribe({
							next: (evt: any) => {
								seft.openDialogImg();
							}
						});
					}
					if (this.editorCtrl.elementRef.nativeElement.querySelector('.jodit-ui-group__insertFile')) {
						this.editorCtrl.elementRef.nativeElement.querySelector('.jodit-ui-group__insertFile').addEventListener('click', function () {
							// seft.openDialogImg();
						});
					}
				}
			}
		})
	}

	openDialogImg() {
		let config: any = {
			data: {
				entityID: "",
				entityType: "",
				hasGetData: false
			}
		};
		config.disableClose = true;
		config.panelClass = 'dialog-form-xxl';
		config.maxWidth = '90vw';
		config.autoFocus = true;
		let dialogRef = this.dialog.open(DialogSelectedImgsComponent, config);
		dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe)).subscribe({
			next: (res: any) => {
				// console.log("DialogSelectedImgsComponent..........",res);êww
				// return;
				if (res && res.data && res.data.length > 0) {
					let imgs = []
					for (let file of res.data) {
						imgs.push(`<p style="text-align: center;"><img src="${file.imageUrl}" width="400" style="max-width: 80%;"></p>`)
					}
					this.onInsertHTML(imgs.join('<br>'));
				}
			}
		})
	}

	onInsertHTML(value: string) {
		if (this.editorCtrl && this.editorCtrl.editor && this.editorCtrl.editor.s) {
			this.editorCtrl.editor.s.insertHTML(value);
		}
	}

}

