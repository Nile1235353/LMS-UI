// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import { routes } from './app/app-routing.module';
// import { provideRouter } from '@angular/router';
// if (environment.production) {
//   enableProdMode();
// }

// bootstrapApplication(AppComponent,{
//   providers: [provideRouter(routes)]
// })
//   .catch((err) => console.error(err));
// function registerLicense(arg0: string) {
//   throw new Error('Function not implemented.');
// }

import { enableProdMode } from '@angular/core';
import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes),
      provideHttpClient(),
      provideClientHydration()
],
}).catch(err => console.error(err));



