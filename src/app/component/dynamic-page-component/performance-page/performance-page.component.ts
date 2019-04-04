import { Injector, Component, OnInit, Input, NgModule, OnChanges, SimpleChanges, SimpleChange, ViewChild} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';

import * as $ from 'jquery';

import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';

import { OvertimeDrilldownComponent } from './sub-components/overtime-drilldown/overtime-drilldown.component';
import { PerformanceGridComponent } from './sub-components/performance-grid/performance-grid.component';

import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

@Component({
	selector: 'app-product-performance',
	templateUrl: './performance-page.component.html',
	styleUrls: ['./performance-page.component.scss']
})
export class PerformancePageComponent implements OnInit {
	
    @Input() options;

    @ViewChild('splitContainer') mainSplitter: jqxSplitterComponent;
    @ViewChild('firstNested') subSplitter: jqxSplitterComponent;

    @ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

	isDefaultSelectedWeek:any;
	rebuildPageScope:any;
	extraObjParams:any;
	fieldSelection:any;
	layoutLoaded:any;
	pageUniqueKey:any;
	showDateInWeeks:any;
	chartTabs:any;
	overtimeDrilldownChartOptions:any;
	performanceGridOptions:any;
    pageID:any;
    selectionParams:any;
    linechartFlag:any;
    gridFetchName:any;
    sendFirstSplittedRequest:any;
    GRID_FIELD:any;
    selectedField:any;
    ShowFieldSelection:any;
    measuresOptiondata:any;
    activeTabName:any;
    showProductFilter:any;
    showMarketFilter:any;
    showTimeSelection:any;
    showMeasureSelection:any;
    enabledGrids:any;
    measuresAliases:any;
    tabMeasures:any;
    totalGrid:any;
    activeTabMeasure:any;
    leftFirstGridName:any;
    timeSelectionMode:any;
    selectedMeasureID:any;
    lineChart:any;
    rowclickLeftFirstGrid:any;
    leftFirstGridPerformanceOptions:any;
    extraObj:any;
    action:any;
    isSif:any;
    marketSelectionTabs:any;
    productSelectionTabs:any;
    customAccount:any;
    chartTabMappings:any;
    privateLabelStatus:any;
    gridPostParamNames:any;
    hidePrivateLabel:any;
    gridDetails:any;
    result:any;
    requestPageName:any;
    servicePageName:any;
    gkey:any;
    windowHeight:any;
    layoutCollapse:any;
    measurePositionClass:any;
    pageHeight:any;

	constructor(private injector: Injector, private _sendRequestService: SendRequestService, private _helperService: HelperService, private _broadcastService: BroadcastService) { 
        this.pageID = this.injector.get('pageID');
    }

	ngOnInit() {

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

        this.isDefaultSelectedWeek = true;
        if (GLOBALS.callbackObjPerformance == undefined)
            GLOBALS.callbackObjPerformance = {};

        //var pageID = this.options.pageID;
        // this.pageID = this.injector.get('pageId');
        this.timeSelectionMode = 1;

        GLOBALS.stopPace = false;
        console.log(GLOBALS.stopPace);
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;
        this.layoutCollapse = false;
        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_PerformancePage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        GLOBALS.requestType = "initial"; //which type of rwquest here such as initial, rowclick, reload
        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        this.gridDetails = {"gridSKU": "skuGridData", "gridBrand": "brandGridData", "gridCategory": "categoryGridData",
            "gridGroup": "groupGridData", "gridStore": "storeGridData"};

        this.gridPostParamNames = ['STORE', 'GROUP', 'CATEGORY', 'BRAND', 'SKU'];

        this.measurePositionClass = "measurePositionLeft";

        this.chartTabs = {
            "01_drillDown": { slug: "drillDown", tabTitle: "Drill Down", tabType: "DRILLDOWN", tabEvent: "firstTabEvent", seqNum: "one", showTab: false, activeTabClass: "active", dataLoaded: false, tabId: "drillDownChartTab_"+this.pageUniqueKey, columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: true, showTyVsLyContextOption : true},
            "02_overTime": { slug: "overTime", tabTitle: "Over Time", tabType: "OVERTIME", tabEvent: "secondTabEvent", seqNum: "two", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "overTimeChartTab_"+this.pageUniqueKey, hasColumnChart: false, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : true },
            "03_priceOverTime": { slug: "priceOverTime", tabTitle: "Price Over Time", tabType: "OVERTIME", tabEvent: "thirdTabEvent", seqNum: "three", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "priceOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "04_distributionOverTime": { slug: "distributionOverTime", tabTitle: "Distribution Over Time", tabType: "OVERTIME", tabEvent: "fourthTabEvent", seqNum: "four", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "distributionOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "05_instockOverTime": { slug: "instockOverTime", tabTitle: "Instock Over Time", tabType: "OVERTIME", tabEvent: "fifthTabEvent", seqNum: "five", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "instockOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "06_depotServiceOverTime": { slug: "depotServiceOverTime", tabTitle: "Dep Serv Over Time", tabType: "OVERTIME", tabEvent: "sixthTabEvent", seqNum: "six", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "depotServiceOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "07_storesRangedOverTime": { slug: "storesRangedOverTime", tabTitle: "Ranged Over Time", tabType: "OVERTIME", tabEvent: "seventhTabEvent", seqNum: "seven", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "storesRangedOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "08_stockOverTime": { slug: "stockOverTime", tabTitle: "Stock Over Time", tabType: "OVERTIME", tabEvent: "eightTabEvent", seqNum: "eight", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "stockOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "09_availabilityOverTime": { slug: "availabilityOverTime", tabTitle: "Availability Over Time", tabType: "OVERTIME", tabEvent: "nineTabEvent", seqNum: "nine", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "availabilityOverTimeChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
            "10_rateOfSale": { slug: "rateOfSale", tabTitle: "Rate Of Sale", tabType: "OVERTIME", tabEvent: "tenTabEvent", seqNum: "ten", showTab: false, activeTabClass: "", dataLoaded: false, tabId: "rateOfSaleChartTab_"+this.pageUniqueKey, hasColumnChart: true, hasLineChart: true, columnDataKey: "", lineDataKey: "", columnChartAxixTitle: "", activeChartName: "TYANDLY", dataTips: false, showTyVsLyContextOption : false },
        };

        this.chartTabMappings = {"drillDown": "01_drillDown", "overTime": "02_overTime", "priceOverTime": "03_priceOverTime",
            "distributionOverTime": "04_distributionOverTime", "instockOverTime": "05_instockOverTime", 
            "depotServiceOverTime": "06_depotServiceOverTime", "storesRangedOverTime": "07_storesRangedOverTime", 
            "stockOverTime": "08_stockOverTime","availabilityOverTime": "09_availabilityOverTime", "rateOfSale": "10_rateOfSale"};

        // initialize context options of drill down overtime chart
        this.overtimeDrilldownChartOptions = {
            "pageName": "." + this.pageUniqueKey + "_PerformancePage",
            "drillDownData": "",
            "leftFirstGrid": "",
            "showPodLoader": {showInnerLoader:false},
            tabsConfiguration: this.chartTabs,
            chartTabMappings: this.chartTabMappings
        };

        this.performanceGridOptions = {
            "gridStore": false,
            "gridGroup": false,
            "gridCategory": false,
            "gridBrand": false,
            "gridSku": false,
            "totalGrid": 0,
            "leftFirstGrid": "",
            "splitContainer": '#' + this.pageUniqueKey + '_splitContainer',
            "splitter": '#' + this.pageUniqueKey + '_splitter',
            "pageName": '.' + this.pageUniqueKey + '_PerformancePage',
            "showPodLoader": {
                "gridStore": {"showInnerLoader": false},
                "gridGroup": {"showInnerLoader": false},
                "gridCategory": {"showInnerLoader": false},
                "gridBrand": {"showInnerLoader": false},
                "gridSKU": {"showInnerLoader": false}
            },
            "loadedGrid": "",
            "servicePageName": this.servicePageName
        };
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "PerformancePage";
        params.push("destination=" + this.requestPageName);
        if(this.servicePageName != undefined){
            GLOBALS.callbackObjPerformance[this.servicePageName] = {
                callBack: (data) => {
                    return this.callFilterChange(data);
                }
            }
        }
        /*if (GLOBALS.templateDetails[events.name] != undefined) {
            this.pageID = GLOBALS.templateDetails[events.name].pageID;
            this.pageUniqueKey = GLOBALS.templateDetails[events.name].pageUniqueId;
        }*/
        //this.pageUniqueKey = GLOBALS.pageUniqueId;
        if (this.isDefaultSelectedWeek && GLOBALS.defaultFromWeek != "" && GLOBALS.defaultToWeek != "") {
            params.push("FromWeek=" + GLOBALS.defaultFromWeek);
            params.push("ToWeek=" + GLOBALS.defaultToWeek);
        }

        var PLabel = (GLOBALS.isShowPrivateLabel == undefined) ? false : GLOBALS.isShowPrivateLabel;

        params.push("HidePrivate=" + PLabel);
        params.push("pageID=" + this.pageID);
        params.push("fetchConfig=true");
        params.push("TSM=1");

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        //GLOBALS.callAsDefaultService({pageName: requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });

        
	}

    ngDoCheck() {
        if(this.performanceGridOptions.dataLoaded != undefined && this.performanceGridOptions.dataLoaded == true) {
            if (!this.layoutLoaded) {
                this.layoutLoaded = true;
                /*GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
                GLOBALS.pageSetup();*/
            }
        }
    }

    getChartTabData() {
        if(this.overtimeDrilldownChartOptions.tabDataRequested.changeTab != undefined && this.overtimeDrilldownChartOptions.tabDataRequested.changeTab == true) {
            if (this.overtimeDrilldownChartOptions.tabDataRequested.activeTab != undefined) {
                this.chartTabClickEvent(this.overtimeDrilldownChartOptions.tabDataRequested.activeTab);
            }
            this.overtimeDrilldownChartOptions.tabDataRequested.changeTab = false;
        }
    }

    // Pending items to be converted
    /*resizeCallback() {    
        layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
        var chartContainer = "."+this.pageUniqueKey+"_PerformancePage .performanceChartContainer";
        chartResize(chartContainer);
    }

    setResizeWindow('.' + this.pageUniqueKey + '_PerformancePage');  

    
    if (GLOBALS.templateDetails[servicePageName].pageLoaded == false) {
        GLOBALS.templateDetails[servicePageName].pageLoaded = true;
        setTimeout(()=>{
            this.$emit(servicePageName);
        }, 100);
    }

    $scope.$on("reBuildPageScope_"+servicePageName, function(){
        if (GLOBALS.templateDetails[servicePageName].pageLoaded == false) {
            GLOBALS.reloadProjectPageConfig(servicePageName,pageID);
        } else {
            this.rebuildPageScope = true;
            if(typeof this.applyProductStickyFilterToLocalScope == 'function')
                this.applyProductStickyFilterToLocalScope();

            if(typeof this.applyMarketStickyFilterToLocalScope == 'function')
                this.applyMarketStickyFilterToLocalScope();

            this.setSelectionData();
        }
    });*/

    changeHidePrivateLabel() {
        this.setSelectionData('');
    }

    // data binding with changing value volume
    changeMeasureValue(measureId) {
        GLOBALS.requestType = "initial"; //updateData
        this.setSelectionData('');
    }

    //Formate PERFORMANCE  data
    formateGridData(tempRows) {
        //which value will return in data on the basis of request(this year or last year)
        var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;
        var data = [];
        if (tempRows.length > 0) {
            for (var i = 0; i < tempRows.length; i++)
            {
                //var temp = {};
                if (tempRows[i][LYFIELD] > 0) {
                    var varPercent = ((tempRows[i][TYFIELD] - tempRows[i][LYFIELD]) * 100) / tempRows[i][LYFIELD];
                }
                else {
                    var varPercent = 0;
                }
                if (tempRows[i].LYPRICE > 0) {
                    var varPercentPrice = ((tempRows[i].TYPRICE - tempRows[i].LYPRICE) * 100) / tempRows[i].LYPRICE;
                }
                else {
                    var varPercentPrice = 0;
                }
                var temp = {
                    ID: (tempRows[i].ID != undefined ) ? tempRows[i].ID : '',
                    ACCOUNT: tempRows[i].ACCOUNT,
                    LYVALUE: tempRows[i][LYFIELD],
                    TYVALUE: tempRows[i][TYFIELD],
                    TYPRICE: tempRows[i].TYPRICE,
                    LYPRICE: tempRows[i].LYPRICE,
                    VAR: tempRows[i][TYFIELD] - tempRows[i][LYFIELD],
                    PRICE_VAR:tempRows[i].TYPRICE - tempRows[i].LYPRICE,
                    VARPER: varPercent.toFixed(1),
                    PRICE_VARPER:varPercentPrice.toFixed(1)
                };
                data.push(temp);
            }
        }
        return data;
    }

    callFilterChange(obj) {
        this.extraObj = obj;
        this.setSelectionData(obj);
    }

    // SETTING MODULE FOR THIS PAGE
    setSelectionModule() {
        // configuring the product tabs
        this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
        // configuring the market tabs
        this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
    }

    setSelectionData(obj) {
        this.extraObj = obj;
        this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

        var params = "";
        if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
            params += '&' + this.timeselectionCall.getTimeSelection();
        /*if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
            params += '&' + this.timeselectionCall.getTimeSelectionDays();*/
        if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            params += '&' + this.measureselectionCall.getMeasureSelection();
        /*if (typeof this.getSkuSelection == 'function')
            param_req += '&' + this.getSkuSelection();*/
        if (typeof this.productselectionCall.getProductSelection == 'function')
            params += '&' + this.productselectionCall.getProductSelection();
        if (typeof this.marketselectionCall.getMarketSelection == 'function')
            params += '&' + this.marketselectionCall.getMarketSelection();

        params = params.substring(1, params.length);
        if (this.extraObj != undefined) {
            if (this.extraObj.customParams != undefined)
                params += '&' + this.extraObj.customParams;
        }
        if (this.action == 'requestChartData') {
            this.requestChartData(params);
        } else {
            this.changeDataLoadedTabsStatus(false);
            this.getSelectionData(params);
        }
    }

    // GET FILTERING DATA
    changeDataLoadedTabsStatus(status) {
        for (let key in this.overtimeDrilldownChartOptions.tabsConfiguration) {
            this.overtimeDrilldownChartOptions.tabsConfiguration[key].dataLoaded = status;
        }
    }

    // GET FILTERING DATA
    requestChartData(obj) {
        //check which type of filtering is going here. if filter with click on grid data the grid count is maintained in performance directive,
        this.selectionParams = obj.split('&');
        this.linechartFlag = true;
        this.gridFetchName = "";
        this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = true;
        this.overtimeDrilldownChartOptions.showPodLoader.customError = '';

        delete this.overtimeDrilldownChartOptions.drilldownOvertimeChart;
        this.action = "";
        this.sendRequestToServer("requestChartData").then((data: any) => {
            this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].dataLoaded = true;
            this.renderLineChart(this.result);
        });
    }

    // GET FILTERING DATA
    getSelectionData(obj) {
        GLOBALS.stopGlobalPaceLoader();
        var gridCountMatch = obj.match(/gridCount=/g);
        var gridFetchCnt = 0;
        if (!gridCountMatch) {
            gridFetchCnt = this.totalGrid;
        } else {
            var selectionParams = obj.split('&');
            Object.keys(selectionParams).forEach(function(key) {
                var value = selectionParams[key];
                var temp = [];
                temp = value.split('=');
                if (temp[0] == 'gridCount') {
                    gridFetchCnt = temp[1];
                }
            });
        }

        if (gridFetchCnt > 0) {
            GLOBALS.stopPace = true;
            this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = true;
            this.overtimeDrilldownChartOptions.showPodLoader.customError = '';
            delete this.overtimeDrilldownChartOptions.drilldownOvertimeChart;
            var objOrig = obj;
            if(!this.rebuildPageScope && gridFetchCnt == this.totalGrid) {
                GLOBALS.requestType = "initial";
            }
            for (var i = 0; i < gridFetchCnt; i++) {
                var k = (this.totalGrid - gridFetchCnt) + i;
                this.gridFetchName = this.enabledGrids[k];

                if (this.rebuildPageScope) {
                    obj = objOrig;
                    
                    if (this.extraObjParams[this.gridFetchName] != undefined && 
                        this.extraObjParams[this.gridFetchName].customParams != undefined)
                        obj += '&' + this.extraObjParams[this.gridFetchName].customParams;
                } else {
                    this.performanceGridOptions.selectedRow = {};
                }
                this.performanceGridOptions.showPodLoader[this.enabledGrids[k]].showInnerLoader = true;
                this.performanceGridOptions.showPodLoader[this.enabledGrids[k]].customError = '';
                this.selectionParams = obj.split('&');
                
                this.linechartFlag = false;
                if (!this.rebuildPageScope) {
                    this.extraObjParams[this.gridFetchName] = this.extraObj;
                    if (this.extraObj != undefined && this.extraObj.customParams != undefined) {
                        var customParamsData = this.extraObj.customParams.split('&');
                        for (let customParamKey in customParamsData) {
                            var customParam = customParamsData[customParamKey];
                            var customParamPart = customParam.split("=");
                            if ($.inArray(customParamPart[0], this.gridPostParamNames) !== -1) {
                                if(this.performanceGridOptions.selectedRow == undefined)
                                    this.performanceGridOptions.selectedRow = {};

                                this.performanceGridOptions.selectedRow[customParamPart[0]] = customParamPart[1];
                            }
                        }
                    }
                }
                if (!this.rebuildPageScope && i == 0)
                    this.rowclickLeftFirstGrid = this.gridFetchName;

                if(this.ShowFieldSelection && this.selectedField != undefined)
                    this.customAccount = this.selectedField.data;
                else
                    this.customAccount = "";

                this.sendRequestToServer("fetchGrid").then((data: any) => {
                    this.renderPerformanceGrid(this.result);
                });
            }

            if (this.activeTabName != 'drillDown') {
                //this.selectionParams = obj.split('&');
                this.activeTabName = this.overtimeDrilldownChartOptions.activeTabName;
                this.activeTabMeasure = this.tabMeasures[this.activeTabName];
                this.linechartFlag = true;
                this.gridFetchName = "";
                this.sendRequestToServer("fetchGrid").then((data: any) => {
                    this.renderLineChart(this.result);
                });
            }

            this.rebuildPageScope = false;

        } else {

            this.selectionParams = obj.split('&');
            var extraObjParams = this.extraObj;
            if (extraObjParams != undefined && extraObjParams.customParams != undefined) {
                var customParamsData = extraObjParams.customParams.split('&');
                for (let customParamKey in customParamsData) {
                //Object.keys(customParamsData).forEach(function(customParamKey) {
                    var customParam = customParamsData[customParamKey];
                    //angular.forEach(customParamsData, function(customParam, customParamKey) {
                    var customParamPart = customParam.split("=");
                    if (customParamPart[0] == 'SKU') {
                        if(this.performanceGridOptions.selectedRow == undefined)
                            this.performanceGridOptions.selectedRow = {};

                        this.performanceGridOptions.selectedRow[customParamPart[0]] = customParamPart[1];
                    }
                }
            }
            if (GLOBALS.changeGrid == 'changeSku' && this.activeTabName == 'drillDown') {
                setTimeout(()=>{
                    //this.selectionParams = obj.split('&');
                    this.overtimeDrilldownChartOptions.dataLoaded = true;
                    this.overtimeDrilldownChartOptions.selectedGridData = this.selectionParams;
                    
                    this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].dataLoaded = true;
                    this.selectionParams = [];
                });
            } else {
                //this.selectionParams = obj.split('&');
                this.linechartFlag = true;
                this.gridFetchName = "";
                this.activeTabName = this.overtimeDrilldownChartOptions.activeTabName;
                this.activeTabMeasure = this.tabMeasures[this.activeTabName];
                this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = true;
                this.overtimeDrilldownChartOptions.showPodLoader.customError = '';

                this.sendRequestToServer("fetchGrid").then((data: any) => {
                    this.renderLineChart(this.result);
                });
            }
        }
    }

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var gridNameForCustomError = this.gridFetchName;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        params.push("gridFetchName=" + this.gridFetchName);
        
        if (this.GRID_FIELD != undefined && this.GRID_FIELD[this.gridFetchName] != undefined )
            params.push("requestFieldName=" + this.GRID_FIELD[this.gridFetchName]);

        if (this.linechartFlag) {
            params.push("LINECHART=true");
            params.push("requestedChartMeasure=" + this.activeTabMeasure);
        }
        else
            params.push("LINECHART=false");

        params.push("HidePrivate=" + this.privateLabelStatus);

        if(this.customAccount != undefined && this.customAccount != "")
            params.push("customAccount=" + this.customAccount);

        this.overtimeDrilldownChartOptions.selectedGridData = this.selectionParams;

        if(this.activeTabName != undefined && this.activeTabName != '')
            params.push("activeTabName=" + this.activeTabName);

        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
            this.result = result;
            this.result.gridNameForCustomError = gridNameForCustomError;
        });
    }

    sendSplittedRequest() {
        this.setSelectionData('');
        this.sendFirstSplittedRequest = false;
    }

    chartTabClickEvent(tabName) {
        this.activeTabName = tabName;
        if (this.activeTabName == 'drillDown') {
            this.overtimeDrilldownChartOptions.dataLoaded = true;
            this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].dataLoaded = true;
            setTimeout(()=>{
                this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = false;
            }, 100);
        } else {
            this.action = 'requestChartData';
            this.activeTabMeasure = this.tabMeasures[tabName];
            this.setSelectionData(this.extraObj);
        }
    }

    filterFirstGrid() {
        if(this.selectedField != undefined && this.selectedField != "" && this.selectedField.data != "")
        {
            this.performanceGridOptions[this.leftFirstGridName+"FirstColumn"] = { NAME : this.selectedField.label, ID : "" };
            this.setSelectionData('');
        }else{
            this.performanceGridOptions[this.leftFirstGridName+"FirstColumn"] = this.leftFirstGridPerformanceOptions;
            this.setSelectionData('');
        }
    }

    renderPerformanceGrid(result) {
        if (result.gridNameForCustomError != undefined && result.customErrors != undefined) {
            this.performanceGridOptions.showPodLoader[result.gridNameForCustomError].customError = result.customErrors.displayMessage;
            if ((this.activeTabName == 'drillDown' && result.gridNameForCustomError == this.rowclickLeftFirstGrid ))
                this.overtimeDrilldownChartOptions.showPodLoader.customError = result.customErrors.displayMessage;
        }

        this.renderCommonProcess();

        var isAvailablePerformanceGridData = false;
        for (let gkey in this.gridDetails) {
            var gvalue = this.gridDetails[gkey];
            if (result[gkey] != undefined) {
                isAvailablePerformanceGridData = true;
                this.gkey = new Array();
                if (result[gkey]) {
                    if (Array.isArray(result[gkey])) {
                        this.gkey = result[gkey];
                    } else {
                        this.gkey.push(result[gkey]);
                    }
                }
                this.performanceGridOptions[gvalue] = this.gkey;
                this.overtimeDrilldownChartOptions[gvalue] = this.gkey;
                this.performanceGridOptions.loadedGrid = gkey;
                setTimeout(()=>{
                    this.performanceGridOptions.showPodLoader[gkey].showInnerLoader = false;
                }, 100);
                if ((this.activeTabName == 'drillDown' && gkey == this.rowclickLeftFirstGrid )) {
                    this.overtimeDrilldownChartOptions.dataLoaded = true;
                    this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].dataLoaded = true;
                    setTimeout(()=>{
                        this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = false;
                    }, 100);
                }
            }
            if (isAvailablePerformanceGridData == true) {
                this.performanceGridOptions.dataLoaded = true;
                isAvailablePerformanceGridData = false;
            }
        }
        this.selectionParams = [];
    }

    renderLineChart(result) {
        if (result.customErrors != undefined)
            this.overtimeDrilldownChartOptions.showPodLoader.customError = result.customErrors.displayMessage;

        this.renderCommonProcess();

        if (result.LineChart != undefined)
        {
            if (result.LineChart[0] != undefined) {
                if (result.LineChart[0].ACCOUNT.indexOf(' ') >= 0) {
                    this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].rotation = 0;
                }
            }

            this.lineChart = new Array();
            if (result.LineChart) {
                if (Array.isArray(result.LineChart)) {
                    this.lineChart = result.LineChart;
                } else {
                    this.lineChart.push(result.LineChart);
                }
                if (this.overtimeDrilldownChartOptions.overTimeData == undefined)
                    this.overtimeDrilldownChartOptions.overTimeData = {};

                this.overtimeDrilldownChartOptions.overTimeData[this.activeTabName] = this.lineChart;
            }

            this.overtimeDrilldownChartOptions.measureJsonKey = (result.measureJsonKey != undefined) ? result.measureJsonKey : '';
            this.overtimeDrilldownChartOptions.dataLoaded = true;
            this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].dataLoaded = true;
            this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = false;
        }
        this.selectionParams = [];
    }

    renderCommonProcess() {

        this.overtimeDrilldownChartOptions.selectedMeasureID = (this.selectedMeasureID == undefined) ? GLOBALS.defaultMeasureSelectionID : this.selectedMeasureID;
        this.performanceGridOptions.selectedMeasureID = (this.selectedMeasureID == undefined) ? GLOBALS.defaultMeasureSelectionID : this.selectedMeasureID;

        this.overtimeDrilldownChartOptions.isShowLyData = (GLOBALS.SIF == true || GLOBALS.tsdSif == true ) ? false : GLOBALS.isShowLyData;
        this.performanceGridOptions.isShowLyData = (GLOBALS.SIF == true || GLOBALS.tsdSif == true ) ? false : GLOBALS.isShowLyData;

        if(this.selectedMeasureID != undefined && this.selectedMeasureID != ""){
            var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
            GLOBALS.measureLabel = selectedMeasure[0].measureName;
        }
        GLOBALS.vsLabel = this.timeSelectionMode == 1 ? "Last Period" : "Previous Period"; // manage chart or grid label for last year or previous period data
    }
    
    dataRead(result) {
        
        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
            return ;
        }
        
        this.pageHeight = GLOBALS.getDynamicHeight({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
        

        this.renderCommonProcess();
        
        this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions = (this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions != undefined) ? this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions : {} ;
        
        if (result.fieldSelection != undefined)
            this.fieldSelection = result.fieldSelection;

        if (result.gridConfig != undefined) {
            this.leftFirstGridName = result.gridConfig.leftFirstGridName;
            this.overtimeDrilldownChartOptions.leftFirstGrid = result.gridConfig.leftFirstGridCol;
            this.performanceGridOptions.leftFirstGrid = result.gridConfig.leftFirstGridCol;
            this.totalGrid = this.performanceGridOptions.totalGrid = result.gridConfig.gridCount;
            this.overtimeDrilldownChartOptions.totalGrid = this.performanceGridOptions.totalGrid;
            this.activeTabMeasure = result.gridConfig.firstTabMeasure;
            this.tabMeasures = result.gridConfig.tabMeasures;
            if (result.gridConfig.measuresAliases != undefined && this.tabMeasures != undefined) {
                this.measuresAliases = result.gridConfig.measuresAliases;
                for (let mSlug in this.tabMeasures) {
                    var mKey = this.tabMeasures[mSlug];
                    for (let configKey in this.overtimeDrilldownChartOptions.tabsConfiguration) {
                        var tabConfigData = this.overtimeDrilldownChartOptions.tabsConfiguration[configKey];
                        if (tabConfigData.slug == mSlug && tabConfigData.tabType == 'OVERTIME') {
                            this.overtimeDrilldownChartOptions.tabsConfiguration[configKey].columnDataKey = this.measuresAliases[mKey].ALIASE;
                            this.overtimeDrilldownChartOptions.tabsConfiguration[configKey].columnChartAxixTitle = this.measuresAliases[mKey].NAME;
                            this.overtimeDrilldownChartOptions.tabsConfiguration[configKey].dataDecimalPlaces = this.measuresAliases[mKey].dataDecimalPlaces;
                            this.overtimeDrilldownChartOptions.tabsConfiguration[configKey].lineDataKey = this.measuresAliases['M'+this.overtimeDrilldownChartOptions.selectedMeasureID].ALIASE;
                        }
                    }
                }
            }

            
            if (result.gridConfig.enabledGrids != undefined && result.gridConfig.enabledGrids.length > 0) {
                this.enabledGrids = result.gridConfig.enabledGrids;
                this.overtimeDrilldownChartOptions.showPodLoader.showInnerLoader = true;
                result.gridConfig.enabledGrids.forEach(key => {
                    var value = result.gridConfig.enabledGrids[key];
                    this.performanceGridOptions.showPodLoader[key].showInnerLoader = true;
                    key = (key == "gridSKU") ? "gridSku" : key;
                    this.performanceGridOptions[key] = true;
                });
            }   

            if (result.gridConfig.enabledTabs != undefined && result.gridConfig.enabledTabs.length > 0) {
                result.gridConfig.enabledTabs.forEach((tabkey : any, tabvalue :any) => {
                    if (tabvalue == 0) {
                        this.overtimeDrilldownChartOptions.activeTabName = tabkey;
                        this.activeTabName = tabkey;
                    }
                    this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[tabkey]].showTab = true;
                    this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions[this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[tabkey]].tabEvent] = 'chart';
                });
            }

            this.showTimeSelection = this.showProductFilter = this.showMarketFilter = this.showMeasureSelection = this.ShowFieldSelection = false;
            if (result.gridConfig.enabledFilters != undefined && result.gridConfig.enabledFilters.length > 0) {
                if (result.gridConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (GLOBALS.isShowProductFilter && result.gridConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.showProductFilter = true;

                if (GLOBALS.isShowMarketFilter && result.gridConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.gridConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
                    
                if (result.gridConfig.enabledFilters.indexOf('field-selection') != -1)
                    this.ShowFieldSelection = true;                            
            }

            this.overtimeDrilldownChartOptions.configUpdated = true;
            this.sendFirstSplittedRequest = true;

            this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions.activeTab = this.overtimeDrilldownChartOptions.tabsConfiguration[this.chartTabMappings[this.activeTabName]].seqNum;

            this.overtimeDrilldownChartOptions.measuresOptiondata = this.measuresOptiondata;
            this.performanceGridOptions.measuresOptiondata = this.measuresOptiondata;
            
            if(result.gridConfig.selectedField != undefined && this.ShowFieldSelection)
            {
                var field = this._helperService.where(this.fieldSelection,{data:result.gridConfig.selectedField});
                if(field != undefined && field.length > 0)
                    this.selectedField = field[0];
            }
        }
        // setting grids first column name
        if (result.GRID_FIRST_COLUMN_NAMES != undefined && result.GRID_FIRST_ID_NAMES != undefined ) {
            for (let gridName in result.GRID_FIRST_COLUMN_NAMES) {
                var firstColumnName = result.GRID_FIRST_COLUMN_NAMES[gridName];
                if(this.leftFirstGridName == gridName)
                    this.leftFirstGridPerformanceOptions = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };

                this.performanceGridOptions[gridName + "FirstColumn"] = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };
            }
        }
        if ( result.GRID_FIELD != undefined ) {
            this.GRID_FIELD = result.GRID_FIELD;
        }

        this.selectionParams = [];

        if (this.sendFirstSplittedRequest) {
            setTimeout(()=>{
                this.sendSplittedRequest();
            }, 100);
        }
    }

    setUpLayout() {
        setTimeout(()=>{
            if(typeof ($('#' + this.pageUniqueKey + '_splitContainer')) != undefined && $('#' + this.pageUniqueKey + '_splitContainer').length > 0){
                GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
            } else {
                this.setUpLayout();
            }
        });
    }

    // layout changing method
    performancePageChangeLayout() {
        this.overtimeDrilldownChartOptions.isDefaultLayout = this.overtimeDrilldownChartOptions.isDefaultLayout == undefined ? true : this.overtimeDrilldownChartOptions.isDefaultLayout;
        this.overtimeDrilldownChartOptions.isDefaultLayout = !this.overtimeDrilldownChartOptions.isDefaultLayout;

        /*let panels = this.mainSplitter.panels();
        let subPanels = this.subSplitter.panels();
        panels[0].collapsible = true;
        panels[1].collapsible = false;
        subPanels[0].collapsible = false;
        subPanels[1].collapsible = true;
        this.mainSplitter.panels(panels);
        this.subSplitter.panels(subPanels);
        if(!this.layoutCollapse) {
            this.mainSplitter.collapse();
            this.subSplitter.collapse();
            this.layoutCollapse = true;
            this.measurePositionClass = "measurePositionTop";
            $('.gridPart').addClass("gridPartFullHeight");
        } else {
            this.mainSplitter.expand();
            this.subSplitter.expand();
            this.layoutCollapse = false;
            this.measurePositionClass = "measurePositionLeft";
            $('.gridPart').removeClass("gridPartFullHeight");
        }*/

    }

    rebuildPageProcess() {
        
        /*if (GLOBALS.templateDetails[servicePageName].pageLoaded == false) {
            GLOBALS.reloadProjectPageConfig(servicePageName,pageID);
        } else {*/
            this.rebuildPageScope = true;
            /*if(typeof this.applyProductStickyFilterToLocalScope == 'function')
                this.applyProductStickyFilterToLocalScope();

            if(typeof this.applyMarketStickyFilterToLocalScope == 'function')
                this.applyMarketStickyFilterToLocalScope();*/

            this.setSelectionData('');
        //}

    }

    freePageObjectProcess() {
        delete this.overtimeDrilldownChartOptions.storeGridData;
        delete this.overtimeDrilldownChartOptions.groupGridData;
        delete this.overtimeDrilldownChartOptions.brandGridData;
        delete this.overtimeDrilldownChartOptions.categoryGridData;
        delete this.overtimeDrilldownChartOptions.skuGridData;
        
            //delete this.overtimeDrilldownChartOptions.chartTabMappings;
        delete this.overtimeDrilldownChartOptions.countList;
        delete this.overtimeDrilldownChartOptions.drillDownData;
        delete this.overtimeDrilldownChartOptions.drillDownDataBackup;
        delete this.overtimeDrilldownChartOptions.drilldownOvertimeChart;
            //delete this.overtimeDrilldownChartOptions.drilldownOvertimeContextOptions;
            //delete this.overtimeDrilldownChartOptions.selectedGridData;
        if (this.overtimeDrilldownChartOptions.drilldownOvertimeGrid != undefined)
            this.overtimeDrilldownChartOptions.drilldownOvertimeGrid.gridOptions.api.setRowData([]);

        // delete this.performanceGridOptions.storeGrid;
        if (this.performanceGridOptions.storeGrid != undefined)
            this.performanceGridOptions.storeGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.storeGridContextOptions.csvData;
        delete this.performanceGridOptions.storeGridData;

        // delete this.performanceGridOptions.groupGrid;
        if (this.performanceGridOptions.groupGrid != undefined)
            this.performanceGridOptions.groupGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.groupGridContextOptions.csvData;
        delete this.performanceGridOptions.groupGridData;

        // delete this.performanceGridOptions.categoryGrid;
        if (this.performanceGridOptions.categoryGrid != undefined)
            this.performanceGridOptions.categoryGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.categoryGridContextOptions.csvData;
        delete this.performanceGridOptions.categoryGridData;

        // delete this.performanceGridOptions.brandGrid;
        if (this.performanceGridOptions.brandGrid != undefined)
            this.performanceGridOptions.brandGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.brandGridContextOptions.csvData;
        delete this.performanceGridOptions.brandGridData;

        // delete this.performanceGridOptions.skuGrid;
        if (this.performanceGridOptions.skuGrid != undefined)
            this.performanceGridOptions.skuGrid.gridOptions.api.setRowData([]);
        
        delete this.performanceGridOptions.skuGridContextOptions.csvData;
        delete this.performanceGridOptions.skuGridData;

        /*delete this.gridStore;
        delete this.gridGroup;
        delete this.gridCategory;
        delete this.gridBrand;
        delete this.gridSku;*/

        delete this.lineChart;
    }

}
