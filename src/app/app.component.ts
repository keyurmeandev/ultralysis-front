import { Component, TemplateRef, Inject, ViewContainerRef, ViewChild, Input, HostBinding} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Observable} from 'rxjs/Rx';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBALS } from './globals/globals';
import { NavComponent } from './component/layout-component/nav/nav.component';
import { RibbonComponent } from './component/layout-component/ribbon/ribbon.component';
import { SummaryPageComponent } from './component/dynamic-page-component/summary-page/summary-page.component';
import { PerformancePageComponent } from './component/dynamic-page-component/performance-page/performance-page.component';
import { EfficiencyPageComponent } from './component/dynamic-page-component/efficiency-page/efficiency-page.component';
import { ContributionAnalysisPageComponent } from './component/dynamic-page-component/contribution-analysis-page/contribution-analysis-page.component';
import { TreemapPageComponent } from './component/dynamic-page-component/treemap-page/treemap-page.component';
import { ExcelPosTrackerPageComponent } from './component/dynamic-page-component/excel-pos-tracker-page/excel-pos-tracker-page.component';
import { DetailDriverAnalysisPageComponent } from './component/dynamic-page-component/detail-driver-analysis-page/detail-driver-analysis-page.component';
import { GrowthDeclineDriverPageComponent } from './component/dynamic-page-component/growth-decline-driver-page/growth-decline-driver-page.component';
import { KBIPageComponent } from './component/dynamic-page-component/kbi-page/kbi-page.component';
import { ListPageComponent } from './component/dynamic-page-component/list-page/list-page.component';
import { CalendarPageComponent } from './component/dynamic-page-component/calendar-page/calendar-page.component';
import { DistributionGapFinderPageComponent } from './component/dynamic-page-component/distribution-gap-finder-page/distribution-gap-finder-page.component';
import { SalesByStorePageComponent } from './component/dynamic-page-component/sales-by-store-page/sales-by-store-page.component';
import { MapPageComponent } from './component/dynamic-page-component/map-page/map-page.component';
import { ViewPageComponent } from './component/dynamic-page-component/view-page/view-page.component';
import { AreaReportPageComponent } from './component/dynamic-page-component/area-report-page/area-report-page.component';
import { SendRequestService } from './services/send-request.service';
import { SplitTextPipe } from './pipe/split-text.pipe';
import * as jQuery from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    menuList:any;
    projectId:any;
    componentData:any;
    componentObj:any;
    component_name:any;
    defaultObj:any;
    ribbonData:any;

    constructor(private _sendRequestService: SendRequestService, private activatedRoute: ActivatedRoute, private splitPipe: SplitTextPipe) { 
        this.componentObj = {};
        this.componentObj['SummaryPageComponent'] = SummaryPageComponent;
        this.componentObj['PerformancePageComponent'] = PerformancePageComponent;
        this.componentObj['EfficiencyPageComponent'] = EfficiencyPageComponent;
        this.componentObj['ContributionAnalysisPageComponent'] = ContributionAnalysisPageComponent;
        this.componentObj['TreemapPageComponent'] = TreemapPageComponent;
        this.componentObj['ExcelPosTrackerPageComponent'] = ExcelPosTrackerPageComponent;
        this.componentObj['DetailDriverAnalysisPageComponent'] = DetailDriverAnalysisPageComponent;
        this.componentObj['GrowthDeclineDriverPageComponent'] = GrowthDeclineDriverPageComponent;
        this.componentObj['KBIPageComponent'] = KBIPageComponent;
        this.componentObj['ListPageComponent'] = ListPageComponent;
        this.componentObj['CalendarPageComponent'] = CalendarPageComponent;
        this.componentObj['DistributionGapFinderPageComponent'] = DistributionGapFinderPageComponent;
        this.componentObj['SalesByStorePageComponent'] = SalesByStorePageComponent;
        this.componentObj['MapPageComponent'] = MapPageComponent;
        this.componentObj['ViewPageComponent'] = ViewPageComponent;
        this.componentObj['AreaReportPageComponent'] = AreaReportPageComponent;

        this.activatedRoute.queryParams.subscribe((params: Params) => {
        });

    }

    ngOnInit() {
        this.getInitialGlobalVars();
        this.defaultObj = {
            templateSlug:GLOBALS.default_page_slug,
            pageID:GLOBALS.default_load_pageID,
            title:GLOBALS.default_load_title,
            mainPage:(GLOBALS.mainPage != '') ? GLOBALS.mainPage : 'Summary'
        };
        this.receivePageLoad(GLOBALS.default_menu_item);
    }

    getInitialGlobalVars() {
        if(GLOBALS.menuList) {
            this.menuList = GLOBALS.menuList;
        }

        if(GLOBALS.projectID) {
            this.projectId = GLOBALS.projectID;
        }
    }

    receivePageLoad(pageDetails){
        console.log(pageDetails);
        this.component_name = pageDetails.templateSlug + 'Component';
        this.ribbonData = { page_title: pageDetails.title, mainPage: pageDetails.mainPage };
        GLOBALS.activePage.templateSlug = pageDetails.templateSlug;
        GLOBALS.activePage.pageID = pageDetails.pageID;
        this.loadDynamicComponent(this.component_name, pageDetails);
    }

    loadDynamicComponent(component_name, pageDetails) {
    	this.componentData = {
    		component: this.componentObj[component_name],
    		inputs: {
    			pageDetails: pageDetails
    		}
    	};
    }

    reloadPageData(pageDetails) {
      this.receivePageLoad(pageDetails);
    }


}

