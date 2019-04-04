import { Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import { SummaryPageComponent }  from '../component/dynamic-page-component/summary-page/summary-page.component';
import { PerformancePageComponent } from '../component/dynamic-page-component/performance-page/performance-page.component';
import { EfficiencyPageComponent } from '../component/dynamic-page-component/efficiency-page/efficiency-page.component';
import { ContributionAnalysisPageComponent } from '../component/dynamic-page-component/contribution-analysis-page/contribution-analysis-page.component';
import { TreemapPageComponent } from '../component/dynamic-page-component/treemap-page/treemap-page.component';
import { ExcelPosTrackerPageComponent } from '../component/dynamic-page-component/excel-pos-tracker-page/excel-pos-tracker-page.component';
import {DetailDriverAnalysisPageComponent } from '../component/dynamic-page-component/detail-driver-analysis-page/detail-driver-analysis-page.component';
import { GrowthDeclineDriverPageComponent } from '../component/dynamic-page-component/growth-decline-driver-page/growth-decline-driver-page.component';
import { KBIPageComponent } from '../component/dynamic-page-component/kbi-page/kbi-page.component';
import { ListPageComponent } from '../component/dynamic-page-component/list-page/list-page.component';
import { CalendarPageComponent } from '../component/dynamic-page-component/calendar-page/calendar-page.component';
import { DistributionGapFinderPageComponent } from '../component/dynamic-page-component/distribution-gap-finder-page/distribution-gap-finder-page.component';
import { SalesByStorePageComponent } from '../component/dynamic-page-component/sales-by-store-page/sales-by-store-page.component';
import { MapPageComponent } from '../component/dynamic-page-component/map-page/map-page.component';
import { ViewPageComponent } from '../component/dynamic-page-component/view-page/view-page.component';
import { AreaReportPageComponent } from '../component/dynamic-page-component/area-report-page/area-report-page.component';
import { BroadcastService } from '../services/broadcast.service';
import { HelperService } from '../services/helper.service';
import { GLOBALS } from '../globals/globals';


@Component({
  selector: 'dynamic-component',
  entryComponents: [SummaryPageComponent, PerformancePageComponent, EfficiencyPageComponent, ContributionAnalysisPageComponent, TreemapPageComponent, ExcelPosTrackerPageComponent, DetailDriverAnalysisPageComponent, GrowthDeclineDriverPageComponent, KBIPageComponent, ListPageComponent, CalendarPageComponent, DistributionGapFinderPageComponent, SalesByStorePageComponent, MapPageComponent, ViewPageComponent, AreaReportPageComponent],
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.scss']
})

export class DynamicComponent {
  
  currentComponent:any;
  pageId:any;
  currentpageId:any;
  previousPageId:any;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;
  
  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() 
  set componentData(data: {component: any, inputs: any }) {
    if (!data) {
      return;
    }

    this.previousPageId = this.currentpageId;

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs.pageDetails).map((inputName) => {return {provide: inputName, useValue: data.inputs.pageDetails[inputName]};});

    var pageObj = this._helperService.where(inputProviders,{provide: 'pageID'});
    this.currentpageId = (pageObj != undefined && pageObj.length > 0) ? pageObj[0].useValue : '';

    if(this.pageId.indexOf(this.currentpageId) > -1 ) {

      this.pageId.forEach(function(item) {
          document.getElementById("page-"+item).style.display = 'none';
      });      
      document.getElementById("page-"+this.currentpageId).style.display = 'block';
      this._broadcastService.updatePageSwitched(this.currentpageId, this.previousPageId);

    } else {

      let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
      
      // We create an injector out of the data we want to pass down and this components injector
      let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
      
      // We create a factory out of the component we want to create
      if(data.component != undefined) { 
        console.log(data.inputs.pageDetails);
        // GLOBALS.templateDetails['initialiseProject'] = {pageID: '', pageUniqueId: $rootScope.pageUniqueId};
        // GLOBALS.templateDetails[pageName] = {pageID: pageID, pageUniqueId: $rootScope.pageUniqueId, pageLoaded: false};
        let factory = this.resolver.resolveComponentFactory(data.component);
        
        // We create the component using the factory and the injector
        let component = factory.create(injector);
      

        this.pageId.forEach(function(item) {
            document.getElementById("page-"+item).style.display = 'none';
        });
        //document.getElementById("page-"+this.currentpageId).style.display = 'block';
        this.pageId.push(this.currentpageId);
        this.dynamicComponentContainer.insert(component.hostView);
        this.currentComponent = component;
      }
    }
     /*if ("dynamic-component-"+this.pageId) {
          this.currentComponent.destroy();
      }*/
  }
  
  constructor(private resolver: ComponentFactoryResolver, private _broadcastService: BroadcastService, private _helperService: HelperService) {
    this.pageId = [];
  }
}
