import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		CategoriesComponent
	],
	imports: [
		SharedModule,
	],
	exports: [CategoriesComponent]
})
export class CategoriesModule { }
