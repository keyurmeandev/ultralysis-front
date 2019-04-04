import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModuleWithProviders, NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';
import { SendRequestService } from './services/send-request.service';
import { InitializeProjectService } from './services/initialize-project.service';
import { HeaderComponent } from './component/layout-component/header/header.component';
import { NavComponent } from './component/layout-component/nav/nav.component';
import { SplitTextPipe } from './pipe/split-text.pipe';
import { DynamicComponent } from './dynamic-component-loading/dynamic.component';
import { SummaryPageComponent } from './component/dynamic-page-component/summary-page/summary-page.component';
import { PerformancePageComponent } from './component/dynamic-page-component/performance-page/performance-page.component';
import { EfficiencyPageComponent } from './component/dynamic-page-component/efficiency-page/efficiency-page.component';
import { ContributionAnalysisPageComponent } from './component/dynamic-page-component/contribution-analysis-page/contribution-analysis-page.component';
import { FormsModule } from '@angular/forms';
import { TimeSelectionComponent } from './component/filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from './component/filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from './component/filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from './component/filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from './component/filters/product-market-selection-inline/product-market-selection-inline.component';
import { TotalSalesColumnChartComponent } from './component/dynamic-page-component/summary-page/sub-components/total-sales-column-chart/total-sales-column-chart.component';
import { SharePieChartComponent } from './component/dynamic-page-component/summary-page/sub-components/share-pie-chart/share-pie-chart.component';
import { PerformanceColumnChartComponent } from './component/dynamic-page-component/summary-page/sub-components/performance-column-chart/performance-column-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { PopupModule } from '@progress/kendo-angular-popup';
import { MenuModule } from '@progress/kendo-angular-menu';
import { HelperService } from './services/helper.service';
import { BroadcastService } from './services/broadcast.service';
import 'hammerjs';
import { OrderByPipe } from './pipe/order-by.pipe';
import { ContextMenuComponent } from './component/common-component/context-menu/context-menu.component';
import { SearchFilterPipe } from './pipe/search-filter.pipe';
import { InnerLoaderComponent } from './component/common-component/inner-loader/inner-loader.component';
import { NoDataFoundComponent } from './component/common-component/no-data-found/no-data-found.component';
import { NumberFormatPipe } from './pipe/number-format.pipe';
import { NformatterPipe } from './pipe/nformatter.pipe';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { UltGridComponent } from './component/common-component/ult-grid/ult-grid.component';
import { TimeSelectionDaysComponent } from './component/filters/time-selection-days/time-selection-days.component';
import { OvertimeDrilldownComponent } from './component/dynamic-page-component/performance-page/sub-components/overtime-drilldown/overtime-drilldown.component';
import { PerformanceGridComponent } from './component/dynamic-page-component/performance-page/sub-components/performance-grid/performance-grid.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import {NgPipesModule} from 'ngx-pipes';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { CookieService } from 'ngx-cookie-service';

import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/bg/all';
import '@progress/kendo-angular-intl/locales/de/all';
import { RibbonComponent } from './component/layout-component/ribbon/ribbon.component';
import { BreadcrumbComponent } from './component/layout-component/breadcrumb/breadcrumb.component';

import {TransferHttpCacheModule} from '@nguniversal/common';
import { TreemapPageComponent } from './component/dynamic-page-component/treemap-page/treemap-page.component';
import { ExcelPosTrackerPageComponent } from './component/dynamic-page-component/excel-pos-tracker-page/excel-pos-tracker-page.component';
import { DetailDriverAnalysisPageComponent } from './component/dynamic-page-component/detail-driver-analysis-page/detail-driver-analysis-page.component';
import { GrowthDeclineDriverPageComponent } from './component/dynamic-page-component/growth-decline-driver-page/growth-decline-driver-page.component';
import { KBIPageComponent } from './component/dynamic-page-component/kbi-page/kbi-page.component';
import { ListPageComponent } from './component/dynamic-page-component/list-page/list-page.component';
import { ModalModule} from 'ngx-bootstrap/modal';
import { CalendarPageComponent } from './component/dynamic-page-component/calendar-page/calendar-page.component';
import { DistributionGapFinderPageComponent } from './component/dynamic-page-component/distribution-gap-finder-page/distribution-gap-finder-page.component';
import { SalesByStorePageComponent } from './component/dynamic-page-component/sales-by-store-page/sales-by-store-page.component';
import { MapPageComponent } from './component/dynamic-page-component/map-page/map-page.component';
import { ViewPageComponent } from './component/dynamic-page-component/view-page/view-page.component';
import { AreaReportPageComponent } from './component/dynamic-page-component/area-report-page/area-report-page.component';


const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

export function initializeProjectServiceFactory(_initializeProjectService: InitializeProjectService): Function {
    return () => _initializeProjectService.initalizeApplication();
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    SplitTextPipe,
    SummaryPageComponent,
    DynamicComponent,
    PerformancePageComponent,
    EfficiencyPageComponent,
    ContributionAnalysisPageComponent,
    TimeSelectionComponent,
    ProductSelectionComponent,
    MarketSelectionComponent,
    MeasureSelectionComponent,
    ProductMarketSelectionInlineComponent,
    TotalSalesColumnChartComponent,
    SharePieChartComponent,
    PerformanceColumnChartComponent,
    OrderByPipe,
    ContextMenuComponent,
    SearchFilterPipe,
    InnerLoaderComponent,
    NoDataFoundComponent,
    NumberFormatPipe,
    NformatterPipe,
    UltGridComponent,
    TimeSelectionDaysComponent,
    OvertimeDrilldownComponent,
    PerformanceGridComponent,
    jqxSplitterComponent,
    RibbonComponent,
    BreadcrumbComponent,
    TreemapPageComponent,
    ExcelPosTrackerPageComponent,
    DetailDriverAnalysisPageComponent,
    GrowthDeclineDriverPageComponent,
    KBIPageComponent,
    ListPageComponent,
    CalendarPageComponent,
    DistributionGapFinderPageComponent,
    SalesByStorePageComponent,
    MapPageComponent,
    ViewPageComponent,
    AreaReportPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    rootRouting,
    FormsModule,
    ChartsModule,
    GridModule,
    LabelModule,
    InputsModule,
    WindowModule,
    ButtonsModule,
    PopupModule,
    MenuModule,
    AgGridModule.withComponents([]),
    LayoutModule,
    NgPipesModule,
    IntlModule,
    TransferHttpCacheModule,
    ModalModule.forRoot()
  ],
  exports: [
    SummaryPageComponent,PerformancePageComponent,EfficiencyPageComponent,ContributionAnalysisPageComponent,TreemapPageComponent, ExcelPosTrackerPageComponent
  ],
  providers: [
    SendRequestService, 
    InitializeProjectService, 
    { provide: APP_INITIALIZER, useFactory: initializeProjectServiceFactory, deps: [InitializeProjectService], multi: true },
    OrderByPipe,
    HelperService,
    BroadcastService,
    TimeSelectionComponent,
    NumberFormatPipe,
    NformatterPipe,
    CookieService,
    SearchFilterPipe,
    SplitTextPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
