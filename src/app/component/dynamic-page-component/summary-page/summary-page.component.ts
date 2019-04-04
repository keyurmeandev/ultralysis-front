import {Injector, Component, Input, OnInit, NgModule, OnChanges, SimpleChanges, SimpleChange, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { GLOBALS } from '../../../globals/globals';

import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';

import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';
import { TotalSalesColumnChartComponent } from './sub-components/total-sales-column-chart/total-sales-column-chart.component';
import { SharePieChartComponent } from './sub-components/share-pie-chart/share-pie-chart.component';
import { PerformanceColumnChartComponent } from './sub-components/performance-column-chart/performance-column-chart.component';

import * as $ from 'jquery';


@Component({
    selector: 'app-summary-page',
    templateUrl: './summary-page.component.html',
    styleUrls: ['./summary-page.component.scss']
})

export class SummaryPageComponent implements OnInit {

    @ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

    @Input('reloadEvent') reloadEvent;

    playerName:string;
    _playerName:string;
    initvalue:string;
    pageID:string;
    sendFirstPodsRequest:Boolean = false;
    templateDetails:any;
    showTimeSelection:any;
    showProductFilter:any;
    showMarketFilter:any;
    showMeasureSelection:any;
    servicePageName:any;
    pageUniqueKey:any;
    pageContainer:any;
    totalSalesChartOptions:any;
    shareByChartOptions:any;
    shareByPodTwoChartOptions:any;
    performanceByChartOptions:any;
    performanceByPodTwoChartOptions:any;
    params:any;
    isDefaultSelectedWeek:any;
    summaryPageFilterOptions:any;
    defaultGridHeight:any;
    selectionParams:any;
    podNum:any;
    getTimeSelection:any;
    getMeasureSelection:any;
    getSkuSelection:any;
    getProductSelection:any;
    getMarketSelection:any;
    privateLabelStatus:any;
    hidePrivateLabel:any;
    isShowPrivateLabel:any;
    requestPageName:any;
    api_result:any;
    selectedMeasureID:any;
    POD_TWO_TITLE:any;
    POD_THREE_TITLE:any;
    POD_FOUR_TITLE:any;
    POD_FIVE_TITLE:any;
    isLayoutReady:any;
    rebuildPageScope:any;

    constructor(private injector: Injector, private _sendRequestService: SendRequestService, private httpClient: HttpClient, private _timeSelectionComponent: TimeSelectionComponent, private _broadcastService: BroadcastService) {
        this.requestPageName = "SummaryPage";
        this.pageID = this.injector.get('pageID');
        this.servicePageName = (this.pageID != undefined && this.pageID != '') ? this.pageID + "_SummaryPage" : "SummaryPage";
        this.isDefaultSelectedWeek = true;
        this.params = [];
        this.params.push("destination=SummaryPage");
        GLOBALS.filterOptions = {"product": {}};
        this.summaryPageFilterOptions = {"blockFilterAccess": false};
        this.defaultGridHeight = "100%";
        this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageContainer = "." + this.pageUniqueKey + "_SummaryPage";
        this.totalSalesChartOptions = {
            pageName: this.pageContainer,
            showPodLoader: {"showInnerLoader": false},
            showPODNoDataFound: {"showNoDataFound": false},
            isMax: 0
        };
        this.shareByChartOptions = {
            pageName: this.pageContainer,
            showPodLoader: {"showInnerLoader": false},
            showPODNoDataFound: {"showNoDataFound": false},
            isMax: 0
        };

        this.shareByPodTwoChartOptions = {
            pageName: this.pageContainer,
            showPodLoader: {"showInnerLoader": false},
            showPODNoDataFound: {"showNoDataFound": false},
            isMax: 0
        };

        this.performanceByChartOptions = {
            pageName: this.pageContainer,
            showPodLoader: {"showInnerLoader": false},
            showPODNoDataFound: {"showNoDataFound": false},
            isMax: 0
        };

        this.performanceByPodTwoChartOptions = {
            pageName: this.pageContainer,
            showPodLoader: {"showInnerLoader": false},
            showPODNoDataFound: {"showNoDataFound": false},
            isMax: 0
        };

        // POD LAYOUT CLASS ASSIGN
        if( GLOBALS.isShowLyData ){
            this.totalSalesChartOptions.podClass = 'col-sm-6 col-md-4';
            this.shareByChartOptions.podClass = 'col-sm-6 col-md-4';
            this.performanceByChartOptions.podClass = 'col-sm-12 col-md-4';
            this.shareByPodTwoChartOptions.podClass = 'col-sm-6 col-md-6';
            this.performanceByPodTwoChartOptions.podClass = 'col-sm-6 col-md-6';                
        } else {
            this.totalSalesChartOptions.podClass = 'col-sm-6 col-md-6';
            this.shareByChartOptions.podClass = 'col-sm-6 col-md-6';
            this.performanceByChartOptions.podClass = 'hide';
            this.shareByPodTwoChartOptions.podClass = 'col-sm-12 col-md-12';
            this.performanceByPodTwoChartOptions.podClass = 'hide'; 
        }
    }

    ngOnInit() {
        GLOBALS.stopPace = false;
    
        this.rebuildPageScope = false;
        this._broadcastService.rebuildPageEmit.subscribe(rebuildPageId => {
            if (rebuildPageId == this.pageID) {
                this.rebuildPageProcess();
            }
        });

        this._broadcastService.freePageEmit.subscribe(freePageId => {
            if (freePageId == this.pageID) {
                this.freePageObjectProcess();
            }
        });

        let reqparams = [];
        reqparams.push("destination="+GLOBALS.default_page_slug);
        if (this.isDefaultSelectedWeek && GLOBALS.defaultFromWeek != "" && GLOBALS.defaultToWeek != "") {
            reqparams.push("FromWeek="+GLOBALS.defaultFromWeek);
            reqparams.push("ToWeek="+GLOBALS.defaultToWeek);
        }
        if (GLOBALS.defaultMeasureSelectionID != undefined && GLOBALS.defaultMeasureSelectionID != ""){
            reqparams.push("ValueVolume="+GLOBALS.defaultMeasureSelectionID);
        }
        var PLabel = (GLOBALS.isShowPrivateLabel == undefined) ? false : GLOBALS.isShowPrivateLabel;
        reqparams.push("HidePrivate="+PLabel);
        reqparams.push("pageID="+GLOBALS.default_load_pageID);
        reqparams.push("fetchConfig=true");
        reqparams.push("trackRequest=true");
        this.sendFirstPodsRequest = true;
        return this._sendRequestService.filterChange(reqparams,'','').then((data: any) => {
            this.dataRead(data);
        });
    }

    dataRead(result) {
        
        this.setInitLayout(); 
        if (result.customErrors != undefined) {
            this.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
            return;
        }

        if (result.gridConfig != undefined) {
            this.showTimeSelection = this.showProductFilter = this.showMarketFilter = this.showMeasureSelection = false;
            if (result.gridConfig.enabledFilters != undefined && result.gridConfig.enabledFilters.length > 0) {
                if (result.gridConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (GLOBALS.isShowProductFilter && result.gridConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.showProductFilter = true;

                if (GLOBALS.isShowMarketFilter && result.gridConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.gridConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
            }
        }

        if (this.sendFirstPodsRequest) {
            setTimeout(()=>{
                this.sendPodsRequest();
            }, 100);
        }
    }

    setInitLayout() {
        this.isLayoutReady = this.isLayoutReady || false;
        if (this.isLayoutReady == false) {
            this.isLayoutReady = true;
            GLOBALS.pageSetup({isLayout: true, layout: 'TWO_ROW', pageContainer: "." + this.pageUniqueKey + "_SummaryPage"});
            //pageSetUp();
        }
    }

    sendPodsRequest() {
        this.setSelectionData();
        this.sendFirstPodsRequest = false;
    }

    /**
    * changeHidePrivateLabel
    * send request to server to get data with changing private label
    */
    changeHidePrivateLabel() {
        this.setSelectionData();
    }

    setSelectionData() {
        GLOBALS.stopGlobalPaceLoader();

        this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;
        this.totalSalesChartOptions.showPodLoader.customError = this.shareByChartOptions.showPodLoader.customError = '';
        this.shareByPodTwoChartOptions.showPodLoader.customError = this.performanceByChartOptions.showPodLoader.customError = '';
        this.performanceByPodTwoChartOptions.showPodLoader.customError = '';

        this.totalSalesChartOptions.showPODNoDataFound.showNoDataFound = this.shareByChartOptions.showPODNoDataFound.showNoDataFound = false;
        this.shareByPodTwoChartOptions.showPODNoDataFound.showNoDataFound = this.performanceByChartOptions.showPODNoDataFound.showNoDataFound = false;
        this.performanceByPodTwoChartOptions.showPODNoDataFound.showNoDataFound = false;

        this.totalSalesChartOptions.showPodLoader.showInnerLoader = this.shareByChartOptions.showPodLoader.showInnerLoader = true;
        this.shareByPodTwoChartOptions.showPodLoader.showInnerLoader = this.performanceByChartOptions.showPodLoader.showInnerLoader = true;
        this.performanceByPodTwoChartOptions.showPodLoader.showInnerLoader = true;

        var param_req = "";
        if (typeof this.timeselectionCall.getTimeSelection == 'function')
            param_req += this.timeselectionCall.getTimeSelection();
        if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            param_req += '&' + this.measureselectionCall.getMeasureSelection();
        if (typeof this.getSkuSelection == 'function')
            param_req += '&' + this.getSkuSelection();
        if (typeof this.productselectionCall.getProductSelection == 'function')
            param_req += '&' + this.productselectionCall.getProductSelection();
        if (typeof this.marketselectionCall.getMarketSelection == 'function')
            param_req += '&' + this.marketselectionCall.getMarketSelection();

        GLOBALS.stopPace = true;
        this.getSelectionData(param_req);
    }

    getSelectionData(obj) {
        this.selectionParams = obj.split('&');
        this.sendRequestToServer("totalSales").then((data: any) => {this.renderTotalSales(data);});

        this.selectionParams = obj.split('&');
        this.podNum = 1;
        this.sendRequestToServer("sharePerformance").then((data: any) => {this.renderSharePerformancePodOne(data);});

        this.selectionParams = obj.split('&');
        this.podNum = 2;
        this.sendRequestToServer("sharePerformance").then((data: any) => {this.renderSharePerformancePodTwo(data);});
        this.podNum = undefined;
    }

    renderTotalSales(result) { 
        if (result.customErrors != undefined)
            this.totalSalesChartOptions.showPodLoader.customError = result.customErrors.displayMessage;

        this.totalSalesChartOptions.selectedMeasureID = this.selectedMeasureID;
        if (result.totalSales != undefined) {
            this.totalSalesChartOptions.data = result.totalSales;
            this.totalSalesChartOptions.shareValue = result.share.value;
            this.totalSalesChartOptions.dataLoaded = true;
            this.totalSalesChartOptions.showPodLoader.showInnerLoader = false;
        }
    }

    renderSharePerformancePodOne(result) {
        if (result.customErrors != undefined) {
            this.shareByChartOptions.showPodLoader.customError = result.customErrors.displayMessage;
            this.performanceByChartOptions.showPodLoader.customError = result.customErrors.displayMessage;
        }

        this.shareByChartOptions.selectedMeasureID = this.selectedMeasureID;
        this.performanceByChartOptions.selectedMeasureID = this.selectedMeasureID;

        if (result.TITLE_0 != undefined) {
            this.POD_TWO_TITLE = "Share by " + result.TITLE_0;
            this.POD_THREE_TITLE = result.TITLE_0 + " Performance";
            this.shareByChartOptions.firstColumnName = result.TITLE_0;
            this.performanceByChartOptions.firstColumnName = result.TITLE_0;
        }

        if (result.POD_0 != undefined) {
            if(result.POD_0.length > 0){
                this.shareByChartOptions.data = result.POD_0;
                this.shareByChartOptions.AllShareByData = result.POD_0;
                this.performanceByChartOptions.data = result.POD_0;
                this.performanceByChartOptions.AllPerformanceData = result.POD_0;
            }else{
                this.shareByChartOptions.showPODNoDataFound.showNoDataFound = this.performanceByChartOptions.showPODNoDataFound.showNoDataFound = true;
            }
            this.shareByChartOptions.dataLoaded = this.performanceByChartOptions.dataLoaded = true;
            this.shareByChartOptions.showPodLoader.showInnerLoader = this.performanceByChartOptions.showPodLoader.showInnerLoader = false;
        }
    }

    renderSharePerformancePodTwo(result) {
        if (result.customErrors != undefined) {
            this.shareByPodTwoChartOptions.showPodLoader.customError = result.customErrors.displayMessage;
            this.performanceByPodTwoChartOptions.showPodLoader.customError = result.customErrors.displayMessage;
        }

        this.shareByPodTwoChartOptions.selectedMeasureID = this.selectedMeasureID;
        this.performanceByPodTwoChartOptions.selectedMeasureID = this.selectedMeasureID;

        if (result.TITLE_1 != undefined) {
            this.POD_FOUR_TITLE = "Share by " + result.TITLE_1;
            this.POD_FIVE_TITLE = result.TITLE_1 + " Performance";
            this.shareByPodTwoChartOptions.firstColumnName = result.TITLE_1;
            this.performanceByPodTwoChartOptions.firstColumnName = result.TITLE_1;
        }

        if (result.POD_1 != undefined) {
            if(result.POD_1.length > 0){
                this.shareByPodTwoChartOptions.data = result.POD_1;
                this.shareByPodTwoChartOptions.AllShareByData = result.POD_1;
                this.performanceByPodTwoChartOptions.data = result.POD_1;
                this.performanceByPodTwoChartOptions.AllPerformanceData = result.POD_1;
            }else{
                this.shareByPodTwoChartOptions.showPODNoDataFound.showNoDataFound = this.performanceByPodTwoChartOptions.showPODNoDataFound.showNoDataFound = true;
            }    
            this.shareByPodTwoChartOptions.dataLoaded = this.performanceByPodTwoChartOptions.dataLoaded = true;
            this.shareByPodTwoChartOptions.showPodLoader.showInnerLoader = this.performanceByPodTwoChartOptions.showPodLoader.showInnerLoader = false;
        }
    }

    sendRequestToServer(action) {
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        if (action == "initFirstTab"){
            var params = new Array();
            params.push("initFirstTab=true");
        } else {
            var params = new Array();
            params = this.selectionParams;
        }
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);

        if (this.podNum != undefined)
            params.push("podNum=" + this.podNum);

        params.push("pageID=" + this.pageID);
        params.push("HidePrivate=" + this.privateLabelStatus);
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            return data;
        });
    }

    setFullScreen(obj, optionName) {
        var chartObj = obj + '-'+this.pageUniqueKey;
        this[optionName].reloadChart = true;
        this[optionName].isMax = !this[optionName].isMax;
        GLOBALS.getFullScreenClickEvent(chartObj);
    }

    rebuildPageProcess() {
        /*if ($rootScope.templateDetails[servicePageName].pageLoaded == false) {
            $rootScope.reloadProjectPageConfig(servicePageName,pageID);
        } else {*/
            this.rebuildPageScope = true;
            /*if(typeof this.applyProductStickyFilterToLocalScope == 'function')
                this.applyProductStickyFilterToLocalScope();
            if(typeof this.applyMarketStickyFilterToLocalScope == 'function')
                this.applyMarketStickyFilterToLocalScope();*/

            this.setSelectionData();
        // }
    }

    freePageObjectProcess() {
        delete this.totalSalesChartOptions.data;
        delete this.totalSalesChartOptions.shareValue;
        delete this.totalSalesChartOptions.totalSalesChart;
        if (this.totalSalesChartOptions.totalSalesGrid != undefined)
            this.totalSalesChartOptions.totalSalesGrid.gridOptions.api.setRowData([]);

        delete this.shareByChartOptions.data;
        delete this.shareByChartOptions.AllShareByData;
        delete this.shareByChartOptions.shareChart;
        if (this.shareByChartOptions.shareGrid != undefined)
            this.shareByChartOptions.shareGrid.gridOptions.api.setRowData([]);

        delete this.performanceByChartOptions.data;
        delete this.performanceByChartOptions.AllPerformanceData;
        delete this.performanceByChartOptions.performanceChart;
        delete this.performanceByChartOptions.performanceVarData;
        delete this.performanceByChartOptions.performanceVarPerData;
        if (this.performanceByChartOptions.performanceGrid != undefined)
            this.performanceByChartOptions.performanceGrid.gridOptions.api.setRowData([]);


        delete this.shareByPodTwoChartOptions.data;
        delete this.shareByPodTwoChartOptions.AllShareByData;
        delete this.shareByPodTwoChartOptions.shareChart;
        if (this.shareByPodTwoChartOptions.shareGrid != undefined)
            this.shareByPodTwoChartOptions.shareGrid.gridOptions.api.setRowData([]);

        delete this.performanceByPodTwoChartOptions.data;
        delete this.performanceByPodTwoChartOptions.AllPerformanceData;
        delete this.performanceByPodTwoChartOptions.performanceChart;
        delete this.performanceByPodTwoChartOptions.performanceVarData;
        delete this.performanceByPodTwoChartOptions.performanceVarPerData;
        if (this.performanceByPodTwoChartOptions.performanceGrid != undefined)
            this.performanceByPodTwoChartOptions.performanceGrid.gridOptions.api.setRowData([]);
    }

}
