import { animate, style, transition, trigger } from '@angular/animations';

export const slideDownTrigger = trigger('slideDown', [
	transition(':enter', [
		style({
			transform: 'translateY(-10%)'
		}),
		animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
	]),
])

export const slideLeftTrigger = trigger('slideLeft', [
	transition(':enter', [
		style({
			transform: 'translateX(100%)'
		}),
		animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
	]),
])

export const centerRevealTrigger = trigger('centerReveal', [
	transition(':enter', [
		style({
			transform: 'scale(.1)'
		}),
		animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
	]),
])

export const slideDownEnterOpacityLeaveTrigger = trigger('slideDownEnterOpacityLeave', [
	transition(':enter', [
		style({
			transform: 'translateY(-10%)'
		}),
		animate('300ms cubic-bezier(0.25, 0.8, 0.25, 1)')
	]),
	transition(':leave', animate(100, style({
		opacity: 0
	})))
])

export const opacityEnterOpacityLeaveTrigger = trigger('opacityEnterOpacityLeave', [
	transition(':enter', animate(100, style({
		opacity: 0
	}))),
	transition(':leave', animate(100, style({
		opacity: 0
	})))
])