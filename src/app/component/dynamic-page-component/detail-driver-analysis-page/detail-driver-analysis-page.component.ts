import { Injector, Component, OnInit, Input, Output, ViewChild, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Surface, Path, Text, Group, Layout, LinearGradient, GradientOptions, ShapeOptions } from '@progress/kendo-drawing';
import { Arc as DrawingArc, GradientStop } from '@progress/kendo-drawing';
import { Arc, Rect, ArcOptions } from '@progress/kendo-drawing/geometry';
import { formatNumber, IntlService } from '@progress/kendo-angular-intl';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { ChartComponent, AxisLabelVisualArgs, ChartsModule } from '@progress/kendo-angular-charts';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';

import * as $ from 'jquery';

@Component({
	selector: 'detail-driver-analysis-page',
	templateUrl: './detail-driver-analysis-page.component.html',
	styleUrls: ['./detail-driver-analysis-page.component.scss']
})
export class DetailDriverAnalysisPageComponent implements OnInit {

    @ViewChild('priceChartObj') priceChartObj;
    @ViewChild('unitChartObj') unitChartObj;
    @ViewChild('valueChartObj') valueChartObj;
    @ViewChild('sellingStoreChartObj') sellingStoreChartObj;
    @ViewChild('splitContainer') mainSplitter: jqxSplitterComponent;
	@ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

    //@ViewChild('mainSplitter') detailDriverSplitter: jqxSplitterComponent;

	isDefaultSelectedWeek:any;
	options:any;
	pageID:any;
	pageUniqueKey:any;
	rebuildPageScope:any;
	layoutLoaded:any;
	requestPageName:any;
	priceChartContextOptions:any;
	unitChartContextOptions:any;
	sellingStoreChartContextOptions:any;
	valueChartContextOptions:any;
	gridDivHeight:any;
	decimalPlaces:any;
	leftText:any;
	priceChartData:any;
	unitChartData:any;
	sSChartData:any;
	valueChartData:any;
	valueChart:any;
	productSelectionTabs:any;
	marketSelectionTabs:any;
	result:any;
	selectionParams:any;
	unitChart:any;
	lineChart:any;
	priceChart:any;
	sellingStoreChart:any;
	isFirstRequest:any;
	sellingStoreGrid:any;
	priceGrid:any;
	unitGrid:any;
	valueGrid:any;
	dataLoaded:any;
	showSSChart:any;
	showValueChart:any;
	showPriceChart:any;
	showUnitChart:any;
	showMeasureSelection:any;
	showMarketFilter:any;
	showProductFilter:any;
	showTimeSelection:any;
	hidePrivateLabel:any;
	selectedMeasureID:any;
	privateLabelStatus:any;
	servicePageName:any;
	chartData:any;
    randomData:any;
    priceChartGridClass:any;
    unitChartGridClass:any;
    valueChartGridClass:any;
    sellingStoreChartGridClass:any;

	constructor(private injector: Injector, private _helperService: HelperService, private _sendRequestService: SendRequestService, 
	            private _broadcastService: BroadcastService, public intl: IntlService) { 
        this.pageID = this.injector.get('pageID');
    }

    public onContextMenuSelect({ item }): void {
        if(this[item.logicFunctionName] != undefined)
            this[item.logicFunctionName](item);
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
        this.options = {
        	price: {showInnerLoader:false},
        	unit: {showInnerLoader:false},
        	selling: {showInnerLoader:false},
        	value:{showInnerLoader:false}
        };

        this.requestPageName = "lcl\\DetailedDriverAnalysis";
        var params = new Array();
        params.push("destination=" + this.requestPageName);

        GLOBALS.stopPace = false;

        this.layoutLoaded = false;
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        this.randomData = this._helperService.getRandomData();
        this.servicePageName = this.pageID + "_DetailDriverAnalysisPage";
        this.priceChartGridClass = "priceChartContextMenu_" + this.randomData;
        this.unitChartGridClass = "unitChartContextMenu_" + this.randomData;
        this.valueChartGridClass = "valueChartContextMenu_" + this.randomData;
        this.sellingStoreChartGridClass = "sellingStoreChartContextMenu_" + this.randomData;

        // initialize context options of price container
        this.priceChartContextOptions = {
            //container: '.priceChartContextMenu_' + this.pageUniqueKey,
            container: "." + this.priceChartGridClass,
            isGrid: false,
            csvData: '',
            csvName: 'priceData',
            xlsName: 'priceData',
            chartName: 'priceChart',
            menuItems: [
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnPriceGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
        };

        // initialize context options of unit container
        this.unitChartContextOptions = {
            //container: '.' + this.pageUniqueKey + '_unitChartContextMenu',
            container: "." + this.unitChartGridClass,
            isGrid: false,
            csvData: '',
            csvName: 'unitData',
            xlsName: 'unitData',
            chartName: 'unitChart',
            menuItems: [
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnUnitGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Unit-Chart', functionScope: 'self'}
            ],
            containerObj:{}
        };

        // initialize context options of selling store container
        this.sellingStoreChartContextOptions = {
            //container: '.' + this.pageUniqueKey + '_sellingStoreChartContextMenu',
            container: "." + this.sellingStoreChartGridClass,
            isGrid: false,
            csvData: '',
            csvName: 'sellingStoreData',
            xlsName: 'sellingStoreData',
            chartName: 'sellingStoreChart',
            menuItems: [
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnSellingStoreGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Selling-Store-Chart', functionScope: 'self'}
            ],
            containerObj:{}
        };

        // initialize context options of value container
        this.valueChartContextOptions = {
            //container: '.' + this.pageUniqueKey + '_valueChartContextMenu',
            container: "." + this.valueChartGridClass,
            isGrid: false,
            csvData: '',
            csvName: 'valueData',
            xlsName: 'valueData',
            chartName: 'valueChart',
            menuItems: [
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnValueGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Value-Chart', functionScope: 'self'}
            ],
            containerObj:{}
        };

        this.gridDivHeight = 400;
        this.isFirstRequest = true;

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
        params.push("TSM=1");
        

        //$rootScope.callAsDefaultService({pageName: events.name, successCallBack: this.dataRead, params: params, servicesName: ''});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });
	}

    priceChartRender(event) {
        this.priceChartContextOptions.containerObj = this.priceChartObj;
    }
    unitChartRender(event) {
        this.unitChartContextOptions.containerObj = this.unitChartObj;
    }
    valueChartRender(event) {
        this.valueChartContextOptions.containerObj = this.valueChartObj;
    }
    sellChartRender(event) {
        this.sellingStoreChartContextOptions.containerObj = this.sellingStoreChartObj;
    }

	ngDoCheck() {
        if (this.dataLoaded != undefined && !this.layoutLoaded) {
            this.layoutLoaded = true;
            GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER_LEFT_ONE_ROW', splitContainer: '#' + this.pageUniqueKey + '_detailedDriverAnalysisSplitter'});
            //GLOBALS.pageSetup();
        }
    }

	changeHidePrivateLabel() {
		this.setSelectionData('');
    }

    setdetailedDriverGridData(gridObj, data, gridName) {
        if (this[gridObj] == undefined) {
            this[gridObj] = this.setAgGridObject(data, gridName);
            this[gridObj].dataLoaded = true;
        } else {
            this.updateGrid(this[gridObj].gridOptions, data, gridName);
        }
    }

    setAgGridObject(data, gridName) {
        var options = {
            contextMenuItems: ['SHOW_CHART', 'EXPORT_CSV_EXCEL_BOTH'],
            callbackFooterRow: (data) => {
                return this.createFooterRow(data)
            },
            myContextMenuItems:[]
        };
        if (gridName == "price")
            options.myContextMenuItems = [{name:'SHOW_CHART', text:'Show Chart', callback:()=> { return this.fnPriceChart();}}];
        else if (gridName == "unit")
            options.myContextMenuItems = [{name:'SHOW_CHART', text:'Show Chart', callback:() => { return this.fnUnitChart();}}];
        else if (gridName == "selling")
            options.myContextMenuItems = [{name:'SHOW_CHART', text:'Show Chart', callback:() => { return this.fnSellingStoreChart();}}];
        else if (gridName == "value")
            options.myContextMenuItems = [{name:'SHOW_CHART', text:'Show Chart', callback:() => { return this.fnValueChart();}}];

        return {columns:this.getAgGridColumns(gridName), data:data, options:options};
    }

    updateGrid(gridOptions, data, gridName) {
        gridOptions.api.setRowData(data);
        gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
    }

    createFooterRow(data) {
        var COST_CUR = 0;
        var COST_PRE = 0;
        console.log(data);
        Object.keys(data).forEach(function(key) {
        	var obj = data[key];
            COST_CUR += parseFloat(obj.COST_CUR);
            COST_PRE += parseFloat(obj.COST_PRE);
        });
        var result = [{
            ACCOUNT: 'Total',
            COST_CUR: COST_CUR,
            COST_PRE: COST_PRE
        }];
        return result;
    }

    getAgGridColumns(gridName) {
        if (gridName == "price")
            this.decimalPlaces = 1;
        else if (gridName == "unit")
            this.decimalPlaces = 0;
        else if (gridName == "selling")
            this.decimalPlaces = 0;
        else if (gridName == "value")
            this.decimalPlaces = 0;

        var decimalPlaces = this.decimalPlaces;
        var columnsName = [{
                field: "ACCOUNT",
                type: "numericColumn",
                headerName: "WEEK",
                suppressMenu: true
            }, {
                field: "COST_CUR",
                headerName: "THIS YEAR",
                type: "numericColumn",
                suppressMenu: true,
                valueFormatter: (params) => { 
                    //return params.value, this.decimalPlaces); 
                    return formatNumber(Number(params.value), 'n'+decimalPlaces)
                }
            }, {
                field: "COST_PRE",
                headerName: "LAST YEAR",
                type: "numericColumn",
                suppressMenu: true,
                valueFormatter: (params) => { 
                    //return $filter('number')(params.value, this.decimalPlaces); 
                    return formatNumber(Number(params.value), 'n'+decimalPlaces)
                },
            }
        ];

        console.log(columnsName);
        return columnsName;
    }

    setLineChartData(data, chartName) {
        if (chartName == "price") {
            this.leftText = "Price";
            this.decimalPlaces = 1;
        }
        else if (chartName == "unit") {
            this.leftText = "Units";
            this.decimalPlaces = 0;
        }
        else if (chartName == "selling") {
            this.leftText = "Selling Stores";
            this.decimalPlaces = 0;
        }
        else if (chartName == "value") {
            this.leftText = "Value";
            this.decimalPlaces = 0;
        }
        this.chartData = data;
        this.lineChart = {
            title: "",
            dataSource: {
                data: this.chartData
            },
            series: [
                {color: "#BD191A", field: 'COST_PRE', name: "Last Year", format: "{0:n"+this.decimalPlaces+"}"},
                {color: "#21558E", field: 'COST_CUR', name: "This Year", format: "{0:n"+this.decimalPlaces+"}"}
            ],
            seriesDefaults: {
                type: 'line',
                style: 'smooth',
                labels: {
                    visible: false,
                }
            },
            valueAxis: {
                visible: true,
                title: {
                    text: this.leftText,
                    font: "12px Arial",
                    rotation: 90
                },
                labels: {
                    format: "{0:n"+this.decimalPlaces+"}"
                }
            },
            /*categoryAxis: {
                field: "ACCOUNT",
                labels: {
                    font: "11px Arial,Helvetica,sans-serif"
                }
            },*/
            legend: {
                visible: true,
                position: "bottom"
            }
            /*,
            tooltip: {
                visible: true,
                format: "{0:n"+this.decimalPlaces+"}",
                template: '#= series.name #<br />  #= category # <br /> #= kendo.toString(value, "n'+this.decimalPlaces+'") #'
            }*/
        };
        //console.log(this.lineChart);
        return this.lineChart;

    }

    // share by price GRID function
    fnPriceGrid() {
        this.priceChartContextOptions.isGrid = true;
        this.setdetailedDriverGridData('priceGrid', this.priceChartData, "price");
    }
    // share by price CHART function
    fnPriceChart() {
        console.log(this.priceChartContextOptions.isGrid);
        this.priceChartContextOptions.isGrid = false;
        this.priceChart = this.setLineChartData(this.priceChartData, "price");
        console.log(this.priceChartContextOptions.isGrid);
    }

    // share by unit GRID function
    fnUnitGrid() {
        this.unitChartContextOptions.isGrid = true;
        this.setdetailedDriverGridData('unitGrid', this.unitChartData, "unit");
    }
    // share by unit CHART function
    fnUnitChart() {
        this.unitChartContextOptions.isGrid = false;
        this.unitChart = this.setLineChartData(this.unitChartData, "unit");
    }

    // share by unit GRID function
    fnSellingStoreGrid() {
        this.sellingStoreChartContextOptions.isGrid = true;
        this.setdetailedDriverGridData('sellingStoreGrid', this.sSChartData, "selling");
    }
    // share by unit CHART function
    fnSellingStoreChart() {
        this.sellingStoreChartContextOptions.isGrid = false;
        this.sellingStoreChart = this.setLineChartData(this.sSChartData, "selling");
    }

    // share by unit GRID function
    fnValueGrid() {
        this.valueChartContextOptions.isGrid = true;
        this.setdetailedDriverGridData('valueGrid', this.valueChartData, "value");
    }
    // share by unit CHART function
    fnValueChart() {
        this.valueChartContextOptions.isGrid = false;
        this.valueChart = this.setLineChartData(this.valueChartData, "value");
    }
    callFilterChange() {
    	this.setSelectionData('');
    }
    // SETTING MODULE FOR THIS PAGE
    setSelectionModule() {
        this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
		this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
    }

    setSelectionData(obj) {
        GLOBALS.stopGlobalPaceLoader();
        this.options.price.showInnerLoader = true;
        this.options.unit.showInnerLoader = true;
        this.options.selling.showInnerLoader = true;
        this.options.value.showInnerLoader = true;
        this.options.value.customError = '';
        this.options.unit.customError = '';
        this.options.price.customError = '';
        this.options.selling.customError = '';

        //this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;
        //console.log(this.measureselectionCall);

        var params = "";
        if (typeof this.timeselectionCall.getTimeSelection == 'function')
            params += '&' + this.timeselectionCall.getTimeSelection();
        /*if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            params += '&' + this.measureselectionCall.getMeasureSelection();*/
        /*if (typeof this.getSkuSelection == 'function')
            params += '&' + this.getSkuSelection();*/
        if (typeof this.productselectionCall.getProductSelection == 'function')
            params += '&' + this.productselectionCall.getProductSelection();
        if (typeof this.marketselectionCall.getMarketSelection == 'function')
            params += '&' + this.marketselectionCall.getMarketSelection();
        params = params.substring(1, params.length);
        if (obj != undefined) {
            if (obj.customParams != undefined)
                params += '&' + obj.customParams;
        }
        this.getSelectionData(params);
    }

    getSelectionData(obj) {
        GLOBALS.stopPace = true;
        this.selectionParams = obj.split('&');
        this.sendRequestToServer('').then((data: any) => {
            //console.log(data);
			this.renderGrid(this.result);
		});
    }

    renderGrid(result) {
        if (result.customErrors != undefined) {
            this.options.value.customError = result.customErrors.displayMessage;
            this.options.unit.customError = result.customErrors.displayMessage;
            this.options.price.customError = result.customErrors.displayMessage;
            this.options.selling.customError = result.customErrors.displayMessage;
        }

        if (result.ValueChart != undefined && this.showValueChart)
        {
            this.valueChartData = result.ValueChart;
            if( this.valueChartContextOptions.isGrid == true ){
                this.setdetailedDriverGridData('valueGrid', this.valueChartData, "value");
            }else{
                this.valueChart = this.setLineChartData(this.valueChartData, "value");
            }
        }
        this.options.value.showInnerLoader = false;

        if (result.UnitChart != undefined && this.showUnitChart)
        {
            this.unitChartData = result.UnitChart;
            if( this.unitChartContextOptions.isGrid == true ){
                this.setdetailedDriverGridData('unitGrid', this.unitChartData, "unit");
            }else{
                this.unitChart = this.setLineChartData(this.unitChartData, "unit");
            }
        }
        this.options.unit.showInnerLoader = false;

        if (result.PriceChart != undefined && this.showPriceChart)
        {
            this.priceChartData = result.PriceChart;
            if( this.priceChartContextOptions.isGrid == true ){
                this.setdetailedDriverGridData('priceGrid', this.priceChartData, "price");
            }else{
                this.priceChart = this.setLineChartData(this.priceChartData, "price");
            }
        }
        this.options.price.showInnerLoader = false;
        

        if (result.SSChart != undefined && this.showSSChart)
        {
            this.sSChartData = result.SSChart;
            if( this.sellingStoreChartContextOptions.isGrid == true ){
                console.log(this.sSChartData);
                this.setdetailedDriverGridData('sellingStoreGrid', this.sSChartData, "selling");
            }else{
                this.sellingStoreChart = this.setLineChartData(this.sSChartData, "selling");
            }
        }
        this.options.selling.showInnerLoader = false;
    }

    sendRequestToServer(action) {
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("pageID=" + this.pageID);
        params.push("HidePrivate=" + this.privateLabelStatus);
        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
			this.result = result;
		});
    }

    dataRead(result) {
        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage, this.servicePageName, this.pageID);
            return ;
        }
        if (result.pageConfig != undefined) {
            this.showTimeSelection = this.showProductFilter = this.showMarketFilter = this.showMeasureSelection = false;
            if (result.pageConfig.enabledFilters != undefined && result.pageConfig.enabledFilters.length > 0) {
                if (result.pageConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (GLOBALS.isShowProductFilter && result.pageConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.showProductFilter = true;

                if (GLOBALS.isShowMarketFilter && result.pageConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.pageConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
            }
        }

        if (result.enabledCharts != undefined) {
            this.showValueChart = this.showUnitChart = this.showPriceChart = this.showSSChart = false;
            if (result.enabledCharts.indexOf('priceChart') != -1)
                this.showPriceChart = true;

            if (result.enabledCharts.indexOf('unitChart') != -1)
                this.showUnitChart = true;

            if (result.enabledCharts.indexOf('valueChart') != -1)
                this.showValueChart = true;

            if (result.enabledCharts.indexOf('sellingStoreChart') != -1)
                this.showSSChart = true;
        }

        this.dataLoaded = true;

        if (this.isFirstRequest) {
            setTimeout(()=>{
                this.sendPodRequest();
            }, 100);
        }
    }

    sendPodRequest() {
        this.setSelectionData('');
        this.isFirstRequest = false;
    }

    resizeCallback(){
        /*if(window.innerWidth<768){
            // nothing
        }else{
            if(is_splitter_collapse==false){
                layoutSetup({layout: 'SPLITTER_CONTAINER_SINGLE', splitContainer: '#'+this.pageUniqueKey+'_detailedDriverAnalysisSplitter'});
            }else{
                is_splitter_collapse = false;
                $('#'+this.pageUniqueKey+'_detailedDriverAnalysisSplitter').jqxSplitter('refresh');
            }
        }
        chartResize(this.priceChartContextOptions.container);
        chartResize(this.unitChartContextOptions.container);
        chartResize(this.sellingStoreChartContextOptions.container);
        chartResize(this.valueChartContextOptions.container);*/
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
        delete this.valueChartData;
        delete this.valueChart;
        if( this.valueGrid != undefined )
            this.valueGrid.gridOptions.api.setRowData([]);

        delete this.unitChartData;
        delete this.unitChart;
        if( this.unitGrid != undefined )
            this.unitGrid.gridOptions.api.setRowData([]);

        delete this.priceChartData;
        delete this.priceChart;
        if( this.priceGrid != undefined )
            this.priceGrid.gridOptions.api.setRowData([]);

        delete this.sSChartData;
        delete this.sellingStoreChart;
        if( this.sellingStoreGrid != undefined )
            this.sellingStoreGrid.gridOptions.api.setRowData([]);
    }
}
