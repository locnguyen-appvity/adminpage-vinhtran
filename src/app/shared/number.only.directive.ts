import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from "@angular/core";
import { fromEvent, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
    selector: "[matInput][se-number-only]"
})

export class NumberOnlyDirective implements AfterViewInit, OnDestroy {
    @Input() maxLength: number;
    // Allow decimal numbers. The \. is only allowed once to occur
    private regex: RegExp = new RegExp(/^[0-9]+$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Enter', 'Home', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'CapsLock', 'Shift', 'Control', 'Alt', 'Meta', 'ContextMenu', 'NumLock', 'Escape', 'Delete'];
    private unsubscribe = new Subject<void>();

    constructor(private el: ElementRef) {
    }

    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        let current: string = this.el.nativeElement.value;
        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        let next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex) || (this.maxLength > 0 && next.length > this.maxLength)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    ngAfterViewInit(): void {
        fromEvent(this.el.nativeElement, 'keydown').pipe(takeUntil(this.unsubscribe)).subscribe({
            next: (evt: any) => {
                this.onKeyDown(evt);
            }
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.unsubscribe = null;
        this.regex = null;
        this.specialKeys = null;
        this.maxLength = null;
    }
}
