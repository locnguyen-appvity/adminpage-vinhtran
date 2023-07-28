import { NgModule } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LoginPageModule } from './login-page/login-page.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './shared/redux/store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenIntercept } from './auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { SettingWorkspaceModule } from './setting-workspace/setting-workspace.module';
import { HashLocationStrategy, LocationStrategy, provideImgixLoader } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({ state: reducer },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false
        }
      }),
      MatSidenavModule,
      LoginPageModule,
      SettingWorkspaceModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenIntercept, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideImgixLoader('http://admin.gppc.tuhoinusongthanhthe.org/')
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private mdIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    this.mdIconRegistry.addSvgIcon('ic_settings_24px', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/ic_settings_24px.svg'));
  }
}