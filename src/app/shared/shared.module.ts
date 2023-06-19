import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Angular Flex Layout Module
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedConfig, SHARED_CONFIG } from './config';
import { SimpleBaseComponent } from './simple.base.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InitialsPipe } from './initials.pipe';
import { TruncatePipe } from './truncate.pipe';
import { MatDividerModule } from '@angular/material/divider';
import { ToastSnackbarAppModule } from '../controls/toast-snackbar/toast-snackbar.module';
import { SafeHtmlPipe } from './safehtml.pipe';
@NgModule({
	imports: [
		CommonModule,
		FlexLayoutModule,
		LayoutModule,
		MatTooltipModule,
		MatButtonModule,
		MatDividerModule,
		ToastSnackbarAppModule
	],
	declarations: [
		SimpleBaseComponent,
		InitialsPipe,
		TruncatePipe,
		SafeHtmlPipe
	],
	exports: [
		RouterModule,
		CommonModule,
		FlexLayoutModule,
		SimpleBaseComponent,
		LayoutModule,
		MatTooltipModule,
		MatIconModule,
		MatButtonModule,
		InitialsPipe,
		TruncatePipe,
		MatDividerModule,
		ToastSnackbarAppModule,
		SafeHtmlPipe
	],
	
})

export class SharedModule {
	static forRoot(config: SharedConfig): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [
				{
					provide: SHARED_CONFIG,
					useValue: config
				}
			],
		};
	}

	constructor() {
	}
}
