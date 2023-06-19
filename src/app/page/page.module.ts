import { NgModule } from '@angular/core';
import { PageComponent } from './page.component';
import { SharedModule } from '../shared/shared.module';
import { PageRoutingModule } from './page-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MainMenuModule } from '../widgets/main-menu/main-menu.module';
import { TopHeaderModule } from '../widgets/top-header/top-header.module';
import { FooterModule } from '../widgets/footer/footer.module';
import { MainHeaderModule } from '../widgets/main-header/main-header.module';

@NgModule({
  declarations: [
    PageComponent
  ],
  imports: [
    SharedModule,
    PageRoutingModule,
    MatSidenavModule,
    MainMenuModule,
    TopHeaderModule,
    FooterModule,
    MainHeaderModule
  ]
})
export class PageModule {
 
 }
