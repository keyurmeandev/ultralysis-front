import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {LicenseManager} from "ag-grid-enterprise/main";
LicenseManager.setLicenseKey("Indigo_Yin_Ltd_Ultralysis_1Devs1_SaaS_5_January_2019__MTU0NjY0NjQwMDAwMA==38680bb706c88df2149ea970a2eb6ec3");

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

/*platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));*/

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
});