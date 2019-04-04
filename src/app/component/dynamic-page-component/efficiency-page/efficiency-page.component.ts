import { Injector, Component, OnInit, Input, NgModule, OnChanges, SimpleChanges, SimpleChange, ViewChild} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import * as $ from 'jquery';

import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';

import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

import { formatNumber } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-efficiency-page',
  templateUrl: './efficiency-page.component.html',
  styleUrls: ['./efficiency-page.component.scss']
})
export class EfficiencyPageComponent implements OnInit {

    @Input() options;

    @ViewChild('splitContainer') mainSplitter: jqxSplitterComponent;

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
    pageID:any;
    selectionParams:any;
    sendFirstSplittedRequest:any;
    selectedField:any;
    measuresOptiondata:any;
    showMarketFilter:any;
    showTimeSelection:any;
    showMeasureSelection:any;
    timeSelectionMode:any;
    selectedMeasureID:any;
    extraObj:any;
    action:any;
    isSif:any;
    marketSelectionTabs:any;
    productSelectionTabs:any;
    privateLabelStatus:any;
    hidePrivateLabel:any;
    result:any;
    requestPageName:any;
    servicePageName:any;
    gkey:any;
    windowHeight:any;
    measurePositionClass:any;
    pageHeight:any;


    topRowClass:string = 'podRowTwo';
    bottomRowClass:string = 'podRowTwo';
    range:any;
    skuPercent:any;
    scannedStoreFieldLabel:any;
    selectedSkuID:any;
    timeSelectionChange:any;
    rowHeightArray:any;
    PageVar: any;
    gridList: any;

    chartOptions: any;
    EXTRA_FIELD_NAMES: any;
    extraFields: any;

    titleOfTotalCount: string;
    measureLabel: any;
    dataDecimalPlaces: any;
    titleOfSelectedChart: string;
    accountTitle: string;
    titleOfTopSkusGrid: string;
    titleOfTailSkusGrid: string;

    gridWeek: any;
    toDate: any;
    rangeBarChart: any;
    signMsg: any;
    totalSkuText: string;
    totalSku: number;
    totalSumOfSku: any;
    topSkuText: any;
    topSku: any;
    totalSumOfTopSku: any;
    valueVolume: any;
    tailSkuText: any;
    tailSku: any;
    totalSumOfTailSku: any;
    topSKU: any;
    tailSKUData: any;
    skipScanStores: any;
    topSkuGrid: any;
    tailSkuGrid: any;
    showSkuSelection:any;
    showHardStopSelection:any;

    showFacingsSelection:any;
    filterPosition:any;
    isFirstRequest:any;
    isShowProductFilter:any;
    showProductMarketSelectionInlineFilter:any;
    productMarketFiltersDispType:any;
    dataLoaded:any;

    rangeBarChartData:any;


	constructor(private injector: Injector, private _sendRequestService: SendRequestService, private _helperService: HelperService) { 
        this.pageID = this.injector.get('pageID');
        this.chartOptions = {};
        this.rangeBarChartData = {};
        this.rangeBarChartData.skuBar = {};
        this.rangeBarChartData.valueBar = {};        
    }

	ngOnInit() {
        
        this.isDefaultSelectedWeek = true;
        GLOBALS.tsdSif = true;
        this.range = 0;
        this.skuPercent = 0;
        this.scannedStoreFieldLabel = '';
        this.timeSelectionChange = true;
        this.rowHeightArray = {};

        //if(GLOBALS.defaultSelectedSkuID != undefined)
        //   this.selectedSkuID = GLOBALS.defaultSelectedSkuID;


        this.rebuildPageScope = false;
        if (GLOBALS.callbackObjPerformance == undefined)
            GLOBALS.callbackObjPerformance = {};

        //var pageID = this.options.pageID;
        this.timeSelectionMode = 1;

        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;
        //this.layoutCollapse = false;

        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_EfficiencyPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        GLOBALS.requestType = "initial"; //which type of rwquest here such as initial, rowclick, reload
        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        this.measurePositionClass = "measurePositionLeft";
        

        this.PageVar = {}; // object variable to manage loading message, text wrap of grid, context menu options
        this.PageVar.isRageReady = false; // flag of $watch event of changing rage value
        this.gridList = {TOP: "top", TAIL: "tail"}; // grids list of this page
        // This method to setting of this.PageVar variable
        // @params: (string) var_name as key of this.PageVar variable
        
        // calling initVars method to setting initial values
	    for (let gkey in this.gridList) {
	    	this.initVars(this.gridList[gkey]);
	    }
        this.initVars("rangeBarChart"); // calling initVars method to setting value of rangeBarChart 
        this.initVars("summary"); // calling initVars method to setting value of summary 

        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "RangeEfficiency";
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

        if (GLOBALS.defaultMeasureSelectionID != undefined && GLOBALS.defaultMeasureSelectionID != ""){
            params.push("ValueVolume=" + GLOBALS.defaultMeasureSelectionID);    
        }

        var PLabel = (GLOBALS.isShowPrivateLabel == undefined) ? false : GLOBALS.isShowPrivateLabel;

        params.push("HidePrivate=" + PLabel);
        params.push("pageID=" + this.pageID);
        params.push("fetchConfig=true");
        // params.push("TSM=1");
        params.push("action=config");

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        this.isFirstRequest = true;

        //GLOBALS.callAsDefaultService({pageName: requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });

	}

	// setting up initial vars
	initVars (var_name) {
        // loader
        this.PageVar.loader = this.PageVar.loader || {};
        this.PageVar.loader[var_name] = {showInnerLoader: false};
        // grid text warp property
        this.PageVar.spaceProperty = this.PageVar.spaceProperty || {};
        this[var_name + "GridClass"] = this.pageUniqueKey + '_' + var_name + 'Grid';
        this.PageVar.spaceProperty[this[var_name + "GridClass"]] = "";
        // context options
        this.PageVar.contextOptions = this.PageVar.contextOptions || {};
        if (var_name == "rangeBarChart")
            this.PageVar.contextOptions[var_name] = {container: '.' + this[var_name + "GridClass"], onlyChartExport: true, chartName: 'rangeBarChart'};
        else
            this.PageVar.contextOptions[var_name] = {container: '.' + this[var_name + "GridClass"], isGrid: true, isTextWrap: true, onlyExport: true};

    }

    
    
	// BAR chart configaration
    setRangeBarChart (data) {
        var sortedData = new Array();
        sortedData.push(data[1]);
        sortedData.push(data[0]);
        var skuBar = new Array();
        var valueBar = new Array();
        sortedData.forEach(item=>{
        	skuBar.push(Number(item.sku));
            valueBar.push(Number(item.value));
        });

        this.rangeBarChartData.skuBar = skuBar;
        this.rangeBarChartData.valueBar = valueBar;

        var categoryAxisLabels = [];
        categoryAxisLabels.push(data[1]['BNAME']);
        categoryAxisLabels.push(data[0]['BNAME']);

        this.chartOptions = {
            legend: {
                visible: false
            },
            dataSource: {
                data: sortedData
            },
            seriesDefaults: {
                type: "bar",
                stack: {
                    type: "100%"
                },
                labels: {
                    visible: true,
                    position: "bottom",
                    background: "transparent",
                    // template: " #= kendo.toString(Number(value), 'n1') #%"
                    template: function(e) {
                        return GLOBALS.nFormatter(e.value, 1) + '%';
                    }
                }
            },
            series: [{
                    name: "TOP",
                    title: "Top 20% Skus: ",
                    data: valueBar,
                    color: "#86b52b",
                }, {
                    name: "TAIL",
                    title: "Skus in tail: ",
                    data: skuBar,
                    color: "#666666",
                },
            ],
            valueAxis: {
                visible: false,
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                }
            },
            categoryAxis: {
                // field: "BNAME",
                majorGridLines: {
                    visible: true
                },
                categories: categoryAxisLabels,
            },
            tooltip: {
                visible: true,
                // format: "{0:N2}",
                // template: "#= series.title # #= kendo.toString(Number(value), 'n1') #%"
                // template: function(e) {
                //     console.log(e)
                //     return e.series.title + ' ' + GLOBALS.nFormatter(e.value, 2) + '%';
                // }
            }
        }
        // console.log(this.chartOptions);
        return this.chartOptions;
    }

    setAgGridObject (data, gridName) {

        var gridClass = this[this.gridList[gridName] + 'GridClass'];
        this.rowHeightArray[gridClass] = [];
        this.PageVar.spaceProperty[gridClass] = 'normal';
        
        var options = {
            gridClass: gridClass,
            whiteSpaceProperty: this.PageVar.spaceProperty,
            textWrap: {field:'ACCOUNT', currentRowHeight: this.rowHeightArray},
            contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
            callbackFooterRow: this.createFooterRow
        };

        // console.log(options);

        return {columns: this.getAgGridColumns(gridName), data:data, options:options};

    }

    updateGrid (gridOptions, data, gridName){
        gridOptions.api.setRowData(data);
        gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
    }

    createFooterRow (data) {
        var TYEAR = 0;
        var share = 0;
        data.forEach(obj =>{
            TYEAR += parseFloat(obj.TYEAR);
            share += parseFloat(obj.share);
        });

        var result = [{
            ACCOUNT: 'Total',
            TYEAR: TYEAR,
            STORES: '',
            share: share
        }];

        return result;
    }

    getAgGridColumns (gridName) {

        var dataDecimalPlaces = this.dataDecimalPlaces;
        var columnsName = [];

        columnsName.push({
            field: "ACCOUNT",
            headerName: this.accountTitle,
            columnTypes: "string",
            suppressMenu: true
        });

        if(this.extraFields != undefined && this.extraFields.length > 0){
            this.extraFields.forEach(val => {
                columnsName.push({
                    field: val.NAME_ALIASE,
                    headerName: val.NAME_CSV,
                    columnTypes: "number",
                    suppressMenu: true
                });
            });
        }

        columnsName.push({
            field: "STORES",
            headerName: this.scannedStoreFieldLabel,
            columnTypes: "number",
            // valueFormatter: function(params) { return $filter('number')(params.value, 0); },
            valueFormatter: function(params) { return formatNumber(Number(params.value), 'n0'); },
            hide: this.skipScanStores,
            suppressMenu: true
        });
        
        columnsName.push({
            field: "TYEAR",
            headerName: "THIS YEAR",
            columnTypes: "number",
            // valueFormatter: function(params) { return $filter('number')(params.value, this.dataDecimalPlaces); },
            valueFormatter: function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); },
            suppressMenu: true
        });

        columnsName.push({
            field: "share",
            headerName: "% SHARE",
            columnTypes: "number",
            // valueFormatter: function(params) { return $filter('number')(params.value, 1); },
            valueFormatter: function(params) { return formatNumber(Number(params.value), 'n1'); },
            suppressMenu: true
        });
        
        if(this.EXTRA_FIELD_NAMES != undefined){
            this.EXTRA_FIELD_NAMES.forEach( (value, key) => {
                columnsName.push({
                    field : key,
                    headerName : value.TITLE,
                    columnTypes: value.DATATYPE,
                    // valueFormatter: function(params) { return $filter('number')(params.value, 0); },
                    valueFormatter: function(params) { return formatNumber(Number(params.value), 'n0'); },
                    suppressMenu: true
                });
            });
        }  

        return columnsName;
    }


    changeHidePrivateLabel() {
        this.setSelectionData('');
    }

    // data binding with changing value volume
    changeMeasureValue(measureId) {
        GLOBALS.requestType = "initial"; //updateData
        this.setSelectionData('');
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
        GLOBALS.stopGlobalPaceLoader();
        this.extraObj = obj;
        this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

        var params = "";
        if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
            params += '&' + this.timeselectionCall.getTimeSelection();
        if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
            params += '&' + this.timeselectionCall.getTimeSelectionDays();
        if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            params += '&' + this.measureselectionCall.getMeasureSelection();
        
        //if (typeof this.getSkuSelection == 'function')
        //    params += '&' + this.getSkuSelection();

        if (typeof this.productselectionCall.getProductSelection == 'function')
            params += '&' + this.productselectionCall.getProductSelection();
        if (typeof this.marketselectionCall.getMarketSelection == 'function')
            params += '&' + this.marketselectionCall.getMarketSelection();

        params = params.substring(1, params.length);
        if (this.extraObj != undefined) {
            if (this.extraObj.customParams != undefined)
                params += '&' + this.extraObj.customParams;
        }

        this.getSelectionData(params);

            
        // if (this.showProductMarketSelectionInlineFilter != undefined && this.showProductMarketSelectionInlineFilter){
        //     params += '&' + this.makeAdvProductFilteredValue();
        //     this.setBreadCrum(this.breadcrum);
        // }else{
        //     if (typeof this.getProductSelection == 'function')
        //         params += '&' + this.getProductSelection();

        //     if (typeof this.getMarketSelection == 'function')
        //         params += '&' + this.getMarketSelection();
        // }

    }



    // GET FILTERING DATA
    getSelectionData(obj) {

    	for(let key in this.PageVar.loader){
            this.PageVar.loader[key].showInnerLoader = true;
            this.PageVar.loader[key].customError = '';
        }
        GLOBALS.stopPace = true;
        this.selectionParams = obj.split('&');
        this.sendRequestToServer("skuDetails").then( (data:any) => {
            this.renderSkuDetails(this.result);
        });
    }

    changeHardStockValue(measureId) {
        this.setSelectionData('');
    } 

    changeRange() {
        if (this.PageVar.isRageReady) {
            this.skuPercent = this.range;
            this.setSelectionData('');
        }
    }   
    
    renderCommonProcess (result) {
        //setting pod title
        this.titleOfTotalCount = "Range Efficiency Summary";
        if(this.selectedMeasureID != undefined && this.selectedMeasureID != ""){
            var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
            GLOBALS.measureLabel = selectedMeasure[0].measureName;
	        this.measureLabel = selectedMeasure[0].measureName;
	        this.dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
	        this.titleOfSelectedChart = this.measureLabel + " Composition";

	        if (result.skuPercent != undefined)
	            this.range = this.skuPercent = result.skuPercent;

	        if (result.accountTitle != undefined)
	            this.accountTitle = result.accountTitle;

        	this.titleOfTopSkusGrid  = this.accountTitle + " Creating " + this.skuPercent + "% " + this.measureLabel;
        	this.titleOfTailSkusGrid = this.accountTitle + " in Tail";
        }
    }
    
    

    renderSkuDetails (result) {

        if (result.customErrors != undefined) {
            for ( let key in this.PageVar.loader) {
                this.PageVar.loader[key].customError = result.customErrors.displayMessage;
            }
        }

        this.renderCommonProcess(result);

        if (result.seasonalHardStopDates != undefined){
            this.gridWeek = result.seasonalHardStopDates;
            var selectedIndex = result.selectedIndexTo;
            // var selectedHardStop = $filter('filter')(this.gridWeek,{numdata : selectedIndex}, true );
            var selectedHardStop = this._helperService.where(this.gridWeek,{numdata: selectedIndex});
            this.toDate = selectedHardStop[0].data;
        }

        if (result.barchart != undefined) {
            this.rangeBarChart = this.setRangeBarChart(result.barchart);
            this.PageVar.loader.rangeBarChart.showInnerLoader = false;
        }

        if (result.skuDetail != undefined) {
            // generating data of range summary pod
            this.signMsg = this.valueVolume == 1 ? GLOBALS.currencySign : "";
            this.totalSkuText = "Total " + this.accountTitle + ":";
            this.totalSku = result.skuDetail.totalSku;
            this.totalSumOfSku = result.skuDetail.totalSkuSum;

            this.topSkuText = this.skuPercent + "% " + this.measureLabel + " " + this.accountTitle + ":";
            this.topSku = result.skuDetail.topSku;
            this.totalSumOfTopSku = result.skuDetail.topSkuSum;

            this.tailSkuText = this.accountTitle + " in tail:";
            this.tailSku = result.skuDetail.tailSku;
            this.totalSumOfTailSku = result.skuDetail.tailSkuSum;
            this.PageVar.loader.summary.showInnerLoader = false;
        }

        this.topSKU = [];
        this.tailSKUData = [];
        this.extraFields = [];

        if (result.scannedStoreFieldLabel != undefined)
            this.scannedStoreFieldLabel = result.scannedStoreFieldLabel;

        if (result.gridSKU != undefined) {
            // binding the grid options
            if (result.gridSKU.topSKU != undefined)
                this.topSKU = result.gridSKU.topSKU;

            if (result.skipScanStores != undefined)
                this.skipScanStores = result.skipScanStores;

            if (result.gridSKU.tailSKU != undefined)
                this.tailSKUData = result.gridSKU.tailSKU;

            if (result.extraFields != undefined)
                this.extraFields = result.extraFields;

            if (this.topSkuGrid==undefined) {
                this.topSkuGrid = this.setAgGridObject(this.topSKU, 'TOP');
                this.topSkuGrid.dataLoaded = true;
            } else {
                this.updateGrid(this.topSkuGrid.gridOptions, this.topSKU, 'TOP');
            }
            this.PageVar.loader.top.showInnerLoader = false;

            if (this.tailSkuGrid==undefined) {
                this.tailSkuGrid = this.setAgGridObject(this.tailSKUData, 'TAIL');
                this.tailSkuGrid.dataLoaded = true;
            } else {
                this.updateGrid(this.tailSkuGrid.gridOptions, this.tailSKUData, 'TAIL');
            }
            this.PageVar.loader.tail.showInnerLoader = false;
        }
    }

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        

        params.push("HidePrivate=" + this.privateLabelStatus);

        params.push("skuPercent=" + this.skuPercent);        
        if(this.selectedSkuID != undefined && this.selectedSkuID != "" && this.showSkuSelection == true) {
            params.push("selectedField=" + this.selectedSkuID);
        }

        if (this.timeSelectionChange){
            this.toDate = '';
            params.push("fetchHardStopDate=YES");
            this.timeSelectionChange = false;
        }                
        
        if (this.showHardStopSelection && this.toDate != undefined) {
            params.push("toDate="+this.toDate);
        }                
        
        this.valueVolume = this.selectedMeasureID;

        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
            this.result = result;
        });       
        
        
    }


    dataRead(result) {

        this.setUpLayout(); 
        
    	if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
            return ;
        }
        
        this.pageHeight = GLOBALS.getDynamicHeight({});

        this.showFacingsSelection = false;

        this.renderCommonProcess(result);


        if (result.filterPosition != undefined)
            this.filterPosition = result.filterPosition;
        else{
            if(this.isFirstRequest)
                this.filterPosition = "LEFT";
        }

        // FILTER POSITION CLASS
        if(this.filterPosition=='TOP'){
            this.topRowClass = 'podRowTwo';
            this.bottomRowClass = 'podRowTwo';
        }else if(this.filterPosition=='LEFT'){
            this.topRowClass = 'full_row oneThirdRow';
            this.bottomRowClass = 'full_row twoThirdRow';
        }
        
        if(result.EXTRA_FIELD_NAMES != undefined){
            this.EXTRA_FIELD_NAMES = result.EXTRA_FIELD_NAMES;
        }                
        
        if (result.gridConfig != undefined) {
            this.showTimeSelection = this.isShowProductFilter = this.showMarketFilter = this.showMeasureSelection = this.showSkuSelection = false;
            if (result.gridConfig.enabledFilters != undefined && result.gridConfig.enabledFilters.length > 0) {
                if (result.gridConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (result.gridConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.isShowProductFilter = true;

                if (result.gridConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.gridConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
                    
                if (result.gridConfig.enabledFilters.indexOf('sku-selection') != -1)
                    this.showSkuSelection = true;                            
                    
                /*[START] CODE FOR INLINE FILTER STYLE*/
                    if (GLOBALS.isShowProductMarketSelectionInlineFilter && result.gridConfig.enabledFiltersDispType != undefined && (result.gridConfig.enabledFilters.indexOf('product-selection') != -1 || result.gridConfig.enabledFilters.indexOf('market-selection') != -1)){
                        this.showProductMarketSelectionInlineFilter = false;
                        this.productMarketFiltersDispType = result.gridConfig.enabledFiltersDispType;
                        if(this.productMarketFiltersDispType == 'inline' && (this.isShowProductFilter || this.showMarketFilter)){
                            this.isShowProductFilter = false;
                            this.showMarketFilter = false;
                            this.showProductMarketSelectionInlineFilter = true;
                        }
                    }
                /*[END] CODE FOR INLINE FILTER STYLE*/                            
                
                if (result.gridConfig.enabledFilters.indexOf('hardstop-selection') != -1)
                    this.showHardStopSelection = true;                        
            }
        }

        this.dataLoaded = true;

        if (this.isFirstRequest) {
            setTimeout(()=>{
                this.sendPodRequest();
            }, 100);
        }

    }

    sendPodRequest () {
        this.setSelectionData('');
        this.isFirstRequest = false;
        this.PageVar.isRageReady = true; // to active $watch of range
    }

    

    setUpLayout() {
        setTimeout(()=>{
            if(typeof ($('#' + this.pageUniqueKey + '_splitContainer')) != undefined && $('#' + this.pageUniqueKey + '_splitContainer').length > 0){
                //GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
	            if( this.filterPosition == "TOP" ){
			        GLOBALS.layoutSetup({layout: 'TWO_ROW', pageContainer: '.' + this.pageUniqueKey + '_EfficiencyPage', splitContainer: '#' + this.pageUniqueKey + '_splitContainer'});
	            }
			    else{		    	
			        GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER_SINGLE', splitContainer: '#' + this.pageUniqueKey + '_splitContainer'});
			    }
            } else {
                this.setUpLayout();
            }

		});
    }


}


