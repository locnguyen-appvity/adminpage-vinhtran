import { Directive, ElementRef, AfterViewInit, OnDestroy } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
	selector: "[appCustomScroll]",
	exportAs: "appCustomScroll"
})
export class CustomScrollDirective implements AfterViewInit, OnDestroy {
	public leftBtn: boolean = false;
	public rightBtn: boolean = true;
	private left: number;
	private offsetWidth: number;
	private scrollWidth: number;
	private unsubscribe = new Subject<void>();

	constructor(private eleRef: ElementRef) { }

	private onScrollEvent() {
		this.left = this.eleRef.nativeElement.scrollLeft;
		this.offsetWidth = this.eleRef.nativeElement.offsetWidth;
		this.scrollWidth = this.eleRef.nativeElement.scrollWidth;
		if (this.left === 0) {
			this.leftBtn = false;
		}
		if (this.left > 0) {
			this.leftBtn = true;
		}
		if (this.left > this.scrollWidth - this.offsetWidth - 1) {
			this.rightBtn = false;
		}
		else {
			this.rightBtn = true;
		}
	}

	ngDoCheck() {
		this.left = this.eleRef.nativeElement.scrollLeft;
		this.offsetWidth = this.eleRef.nativeElement.offsetWidth;
		this.scrollWidth = this.eleRef.nativeElement.scrollWidth;
		if (this.left < this.scrollWidth - this.offsetWidth - 1) {
			this.rightBtn = true;
		}
	}

	ngAfterViewInit(): void {
		fromEvent(this.eleRef.nativeElement, 'scroll').pipe(takeUntil(this.unsubscribe)).subscribe({
			next: () => {
				this.onScrollEvent();
			}
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.unsubscribe = null;
		this.leftBtn = null;
		this.rightBtn = null;
		this.left = null;
		this.offsetWidth = null;
		this.scrollWidth = null;
	}
}
