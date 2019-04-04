import { Injector, Component, OnInit, Input, NgModule, OnChanges, SimpleChanges, SimpleChange, ViewChild} from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';
import { formatNumber, IntlService } from '@progress/kendo-angular-intl';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { ChartComponent, AxisLabelVisualArgs, ChartsModule } from '@progress/kendo-angular-charts';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as $ from 'jquery';

@Component({
	selector: 'growth-decline-driver-page',
	templateUrl: './growth-decline-driver-page.component.html',
	styleUrls: ['./growth-decline-driver-page.component.scss']
})
export class GrowthDeclineDriverPageComponent implements OnInit {

    @ViewChild('distributionCountChartObj') distributionCountChartObj;
    @ViewChild('averagePriceChartObj') averagePriceChartObj;
    @ViewChild('unitSalesChartObj') unitSalesChartObj;

	/*@ViewChild('mainSplitter') mainSplitter: jqxSplitterComponent;
    @ViewChild('subSplitter') subSplitter: jqxSplitterComponent;*/

	@ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

	isDefaultSelectedWeek:any;
	options:any;
	requestPageName:any;
	action:any;
	pageID:any;
	stopPace:any;
	extraObjParams:any;
	extraObj:any;
	layoutLoaded:any;
	pageUniqueKey:any;
	servicePageName:any;
	grid1Class:any;
	grid2Class:any;
	grid3Class:any;
	whiteSpaceProperty:any;
	rowHeightArray:any;
	gridNames:any;
	skuName:any;
	tyValue:any;
	lyValue:any;
	overUnderFontColor:any;
	percent:any;
	overUnderPerformance:any;
	distributionCountContextMenuOptions:any;
	averagePriceChartContextMenuOptions:any;
	unitSalesChartContextMenuOptions:any;
	isCheckedPrivateLabel:any;
	hidePrivateLabel:any;
	showMarketFilter:any;
	showProductFilter:any;
	showTimeSelection:any;
	dataLoaded:any;
	growthDeclineChart:any;
	productSelectionTabs:any;
	marketSelectionTabs:any;
	rebuildPageScope:any;
	averageChart:any;
	averagePriceChart:any;
	averagePriceChartPercent:any;
	avgPercent:any;
	gridSKU1:any;
	growthDeclineSku1Grid:any;
	gridSKU2:any;
	growthDeclineSku2Grid:any
	gridSKU3:any;
	growthDeclineSku3Grid:any;    
    discountChart:any;
    distributionCountChart:any;
    salesChart:any;
    unitSalesChart:any;
    isFirstRequest:any;
    showMeasureSelection:any;
    gridName:any;
    accountName:any;
    result:any;
    privateLabelStatus:any;
    selectionParams:any;
    selectedChartRequest:any;
    ACCOUNT_NAME:any;
    disChartPercent:any;
    salesChartPercent:any;
    measurePositionClass:any;
    distributionChartData:any;

	constructor(private injector: Injector, private _helperService: HelperService, private _sendRequestService: SendRequestService, 
	            private _broadcastService: BroadcastService, public intl: IntlService) { 
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
		this.options = {
			showPodLoader:{
				countChart:{showInnerLoader: false},
				priceChart:{showInnerLoader: false},
				salesChart:{showInnerLoader: false},
				grid1:{showInnerLoader: false},
				grid2:{showInnerLoader: false},
				grid3:{showInnerLoader: false}
			}
		};

		this.requestPageName = "DriverAnalysis";
		this.action = "reload";
		var params = new Array();
		params.push("destination=" + this.requestPageName);
		
		GLOBALS.stopPace = false;
		this.extraObjParams = [];
		this.extraObj = {};
		this.layoutLoaded = false;
		//this.pageUniqueKey = this.options.pageUniqueId;
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        //console.log(this.pageUniqueKey);
		this.servicePageName = this.pageID + "_GrowthDeclineDriverPage";
		GLOBALS.requestType = "initial"; 
		this.gridNames = {'growthDeclineSku1Grid':'', 'growthDeclineSku2Grid':'', 'growthDeclineSku3Grid':''};
		var gridPostParamNames = ['SKU'];
		this.grid1Class = this.pageUniqueKey + '_grid1';
		this.grid2Class = this.pageUniqueKey + '_grid2';
		this.grid3Class = this.pageUniqueKey + '_grid3';
		this.whiteSpaceProperty = {};
		this.whiteSpaceProperty[this.grid1Class] = "normal"; // initial 'nowrap' for empty
		this.whiteSpaceProperty[this.grid2Class] = "normal"; // initial 'nowrap' for empty
		this.whiteSpaceProperty[this.grid3Class] = "normal"; // initial 'nowrap' for empty
		this.rowHeightArray = {};
		this.rowHeightArray[this.grid1Class] = [];
		this.rowHeightArray[this.grid2Class] = [];
		this.rowHeightArray[this.grid3Class] = [];
		this.gridName = "";
		this.skuName = "";
		this.tyValue = "";
		this.lyValue = "";
		this.overUnderFontColor = "";
		this.percent = "";
		this.overUnderPerformance = "";
		this.measurePositionClass = "measurePositionLeft";

		this.distributionCountContextMenuOptions = {
			container: '.distributionCountContextMenu',
			onlyChartExport: true,
			chartName: 'distributionCount',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};
		this.averagePriceChartContextMenuOptions = {
			container: '.averagePriceChartContextMenu',
			onlyChartExport: true,
			chartName: 'averagePriceChart',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};
		this.unitSalesChartContextMenuOptions = {
			container: '.unitSalesChartContextMenu',
			onlyChartExport: true,
			chartName: 'unitSalesChart',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};
		this.isFirstRequest = true;

		/*$rootScope.callbackObj = {
            callBack: $scope.callFilterChange,
        }*/

        /*if ($rootScope.templateDetails[events.name] != undefined) {
            $scope.pageID = $rootScope.templateDetails[events.name].pageID;
            $scope.pageUniqueKey = $rootScope.templateDetails[events.name].pageUniqueId;
        }*/

        if (this.isDefaultSelectedWeek && GLOBALS.defaultFromWeek != "" && GLOBALS.defaultToWeek != "") {
            params.push("FromWeek=" + GLOBALS.defaultFromWeek);
            params.push("ToWeek=" + GLOBALS.defaultToWeek);
        }

        var PLabel = (GLOBALS.isShowPrivateLabel == undefined) ? false : GLOBALS.isShowPrivateLabel;

        params.push("HidePrivate=" + PLabel);
        params.push("pageID=" + this.pageID);
        params.push("TSM=1");
        params.push("fetchConfig=true");
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });
	}

	ngDoCheck() {
        if (this.dataLoaded != undefined && !this.layoutLoaded) {
            this.layoutLoaded = true;
            GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER_GROWTH_DECLINE', pageContainer: "." + this.pageUniqueKey + "_growthDeclineDriversPage", splitContainer: '#' + this.pageUniqueKey + '_splitContainerGrowthDeclineDrivers', splitter: '#' + this.pageUniqueKey + '_splitterContainerGrowthDeclineDrivers'});
            //GLOBALS.pageSetup();
        }
    }

    distributionCountChartRender(event) {
        this.distributionCountContextMenuOptions.containerObj = this.distributionCountChartObj;
    }
    averagePriceChartRender(event) {
        this.averagePriceChartContextMenuOptions.containerObj = this.averagePriceChartObj;
    }
    unitChartRender(event) {
        this.unitSalesChartContextMenuOptions.containerObj = this.unitSalesChartObj;
    }

	/**
     * changeHidePrivateLabel
     * send request to server to get data with changing private label
     */
    changeHidePrivateLabel() {
        this.action = 'reload';
        this.renderChart({data:[]}); // to empty the chart
        this.setSelectionData('');
    }

    // Set Growth Decline COLUMN chart
    setGrowthDeclineChart(data, title, chartname) {
        this.growthDeclineChart = {
            dataSource: {
                data: data
            },
            title: {
                text: title,
                font: "bold 14px Arial,Helvetica,sans-serif",
                color: "#666666"
            },
            series: [
                {color: "#2B80B5", spacing: 0, gap: 0.2, field: 'LYEAR', stack: "account", name: "account"},
                {color: "#FF9A00", spacing: 0, gap: 0.2, field: 'TYEAR', stack: "account", name: "account"}
            ],
            seriesDefaults: {
                type: 'column',
                style: 'smooth',
                gap: 0.2,
                labels: {
                    visible: true,
                    position: "bottom",
                    background: "transparent",
                    margin: {top: 20, left: 0},
                    template: (e) => {
                        if (chartname == 'averagePrice') {
                            var Val = (e.dataItem.TYEAR) ? e.dataItem.TYEAR : e.dataItem.LYEAR;
                        } else{
                            //var Val = (e.dataItem.TYEAR) ? format("#,##0.", e.dataItem.TYEAR) : format("#,##0.", e.dataItem.LYEAR);
                            var Val = (e.dataItem.TYEAR) ? formatNumber(e.dataItem.TYEAR, "#,##0.") : formatNumber(e.dataItem.LYEAR, "#,##0.");
                        }
                        return Val;
                    }
                }
            },
            valueAxis: {
                min: '0',
                visible: true,
                minorGridLines: {
                    visible: false
                },
                majorGridLines: {
                    visible: false,
                }
            },
            categoryAxis: {
                field: "account",
                minorGridLines: {
                    visible: false
                },
                labels: {
                    font: "11px Arial,Helvetica,sans-serif"
                }
            },
            legend: {
                visible: false,
                position: "bottom",
            },
            tooltip: {
                visible: false
            }
            /*,
            tooltip: {
                visible: true,
                //template: "#= category #<br /> #= value # "
                template: (e) =>  {
                    if (chartname == 'averagePrice')
                        var Val = (e.dataItem.TYEAR) ? e.dataItem.TYEAR : e.dataItem.LYEAR;
                    else
                        var Val = (e.dataItem.TYEAR) ? formatNumber(e.dataItem.TYEAR, "#,##0.") : formatNumber(e.dataItem.LYEAR, "#,##0.");
                    return "<div class='chartTooltipTitle'>" + e.dataItem.account + "</div><div class='chartTooltipLine'>" + Val + "</div>";
                }
            }*/
        };
        return this.growthDeclineChart;
    }

    /**
     * Method: callFilterChange
     * Action: get all data according to selection
     * Params: ...
     * Returns: ...              **/
    callFilterChange() {
        this.action = "reload";
        this.setSelectionData('');
    }

    // SETTING MODULE FOR THIS PAGE
    setSelectionModule() {
        this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
		this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
    }

    /**
     * setSelectionData to get result of selection
     * @param {string} obj
     * @returns {void}
     */
    setSelectionData(obj) {
        GLOBALS.stopGlobalPaceLoader();
        this.options.showPodLoader.countChart.customError = '';
        this.options.showPodLoader.salesChart.customError = '';
        this.options.showPodLoader.priceChart.customError = '';
        
        this.options.showPodLoader.countChart.showInnerLoader = true;
        this.options.showPodLoader.priceChart.showInnerLoader = true;
        this.options.showPodLoader.salesChart.showInnerLoader = true;
        
        if(this.action !== "ChangeSku" || this.accountName == undefined) {
            this.options.showPodLoader.grid1.customError = '';
            this.options.showPodLoader.grid2.customError = '';
            this.options.showPodLoader.grid3.customError = '';

            this.options.showPodLoader.grid1.showInnerLoader = true;
            this.options.showPodLoader.grid2.showInnerLoader = true;
            this.options.showPodLoader.grid3.showInnerLoader = true;
        }

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

    // GET FILTERING DATA
    getSelectionData(obj) {
    	//console.log(this.gridNames);
    	//Object.keys(this.gridNames).forEach(function(value) {
        for (let value in this.gridNames) {
        		var gridName = this.gridNames[value];
            if(this.extraObj.customParams != undefined){
                var customParamPart = this.extraObj.customParams.split("=");
                var selectedGridName = customParamPart[1]; //selectedGrid=gridname
                if (gridName==selectedGridName) {
                    this.extraObjParams[gridName] = this.extraObj.customParams;
                }else{
                    this.extraObjParams[gridName] = '';
                }
            }
            
        }

        this.selectedChartRequest = '';
        if (this.rebuildPageScope) {
            this.action = 'reload';
            for (let gridName in this.gridNames) {
            	var selectedValue = this.gridNames[gridName];
                this.rebuildPageScope = false;
                var extraObjParams = this.extraObjParams[gridName];
                if (extraObjParams != undefined) {
                    var customParamPart = extraObjParams.split("=");
                    var selectedGridName = customParamPart[1]; //selectedGrid=gridname
                    if (gridName==selectedGridName) {
                        this.selectedChartRequest = selectedValue;
                    }
                }
            }
        }                

        GLOBALS.stopPace = true;
        this.selectionParams = obj.split('&');

        if (this.accountName == undefined || this.action=='reload') {
            this.accountName = "";
            this.skuName = "";
            this.tyValue = "";
            this.lyValue = "";
            this.overUnderFontColor = "";
            this.percent = "";
            this.overUnderPerformance = "";
            this.action = "reload";
        }

        this.sendRequestToServer('').then((data: any) => {

            if( this.action=='reload' ){
                this.accountName = undefined;
                this.extraObj.customParams = '';
                this.renderData(this.result);
                if(this.selectedChartRequest=='')
                    this.renderChart({data:[]}); // to empty the chart

            } else {

                this.action='reload';
                this.renderChart(this.result);
            }

            if(this.selectedChartRequest!='') { 
                var selectedValue = this.selectedChartRequest;
                this.clickRowGridDataChange(selectedValue.accountName, selectedValue.skuName, selectedValue.tyValue, selectedValue.lyValue, selectedValue.percent, selectedValue.gridName);
            }
            
        });
    }
    

    getAgGridColumns() {
        var columnsName = [];
        columnsName.push(
            {
                field: "ACCOUNT",
                headerName: this.ACCOUNT_NAME,
                //columnTypes: "string",
                suppressMenu: true
            },
            {
                field: "TYEAR",
                headerName: "TY VAL",
                type: "numericColumn",
                suppressMenu: true,
                valueFormatter: (params) => { 
                    return formatNumber(Number(params.value), 'n0')
                }
            },
            {
                field: "LYEAR",
                headerName: "LY VAL",
                type: "numericColumn",
                suppressMenu: true,
                valueFormatter: (params) => { 
                    return formatNumber(Number(params.value), 'n0')
                }
            },
            {
                field: "PERCENT",
                headerName: "%VAR",
                type: "numericColumn",
                suppressMenu: true,
                valueFormatter: (params) => { 
                    return formatNumber(Number(params.value), 'n0')
                }
            }
        );

        return columnsName;
    }


    /**
     * method: setGridObject
     * action: set grid options
     * @param {json array} data
     * @param {sting} gridName
     * @returns {object} gridOptions
     */
    setAgGridObject(data, gridName) {

        if (gridName == 'SKU1') {
            var gridClass = this.grid1Class;
        }
        if (gridName == 'SKU2') {
            var gridClass = this.grid2Class;
        }
        if (gridName == 'SKU3') {
            var gridClass = this.grid3Class;
        }
        
        var options = {
            gridClass: gridClass,
            whiteSpaceProperty: this.whiteSpaceProperty,
            textWrap: {field:'ACCOUNT', currentRowHeight: this.rowHeightArray},
            contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
            callbackOnRowClick: (selectedRowData) => {
                this.clickRowGridDataChange(selectedRowData.DATA, selectedRowData.ACCOUNT, selectedRowData.TYEAR, selectedRowData.LYEAR, selectedRowData.PERCENT, gridName);
            }
        };

        return {columns:this.getAgGridColumns(), data:data, options:options};

    }

    renderData(result) {

        if (result.customErrors != undefined) {
            this.options.showPodLoader.grid1.customError = result.customErrors.displayMessage;
            this.options.showPodLoader.grid2.customError = result.customErrors.displayMessage;
            this.options.showPodLoader.grid3.customError = result.customErrors.displayMessage;
        }

        //read Brand data and set on performance grid and drilldown overtime directives
        if (result.avgpercent != undefined) {
            this.avgPercent = result.avgpercent.value;
        }
        if (result.gridSKU1 != undefined) {
            this.gridSKU1 = new Array();
            if (result.gridSKU1) {
                if (Array.isArray(result.gridSKU1)) {
                    this.gridSKU1 = result.gridSKU1;
                } else {
                    this.gridSKU1.push(result.gridSKU1);
                }
            }
            if( this.growthDeclineSku1Grid==undefined){                        
                this.growthDeclineSku1Grid = this.setAgGridObject(this.gridSKU1, "SKU1");
                this.growthDeclineSku1Grid.dataLoaded = true;
            }else{
                this.growthDeclineSku1Grid.gridOptions.api.setRowData(this.gridSKU1);
                this.setSelectedRow('growthDeclineSku1Grid', this.grid1Class);
            }
        } else {
            if( this.growthDeclineSku1Grid==undefined){                        
                this.growthDeclineSku1Grid = this.setAgGridObject([], "SKU1");
                this.growthDeclineSku1Grid.dataLoaded = true;
            }else{
                this.growthDeclineSku1Grid.gridOptions.api.setRowData([]);
            }
        }                
        this.options.showPodLoader.grid1.showInnerLoader = false;

        if (result.gridSKU2 != undefined) {
            this.gridSKU2 = new Array();
            if (result.gridSKU2) {
                if (Array.isArray(result.gridSKU2)) {
                    this.gridSKU2 = result.gridSKU2;
                } else {
                    this.gridSKU2.push(result.gridSKU2);
                }
            }
            if( this.growthDeclineSku2Grid == undefined){                        
                this.growthDeclineSku2Grid = this.setAgGridObject(this.gridSKU2, "SKU2");
                this.growthDeclineSku2Grid.dataLoaded = true;
            }else{
                this.growthDeclineSku2Grid.gridOptions.api.setRowData(this.gridSKU2);
                this.setSelectedRow('growthDeclineSku2Grid', this.grid2Class);
            }
        } else {
            if( this.growthDeclineSku2Grid == undefined){                        
                this.growthDeclineSku2Grid = this.setAgGridObject([], "SKU2");
                this.growthDeclineSku2Grid.dataLoaded = true;
            }else{
                this.growthDeclineSku2Grid.gridOptions.api.setRowData([]);
            }
        }
        this.options.showPodLoader.grid2.showInnerLoader = false;

        if (result.gridSKU3 != undefined) {
            this.gridSKU3 = new Array();
            if (result.gridSKU3) {
                if (Array.isArray(result.gridSKU3)) {
                    this.gridSKU3 = result.gridSKU3;
                } else {
                    this.gridSKU3.push(result.gridSKU3);
                }
            }
            if( this.growthDeclineSku3Grid == undefined) {
                this.growthDeclineSku3Grid = this.setAgGridObject(this.gridSKU3, "SKU3");
                this.growthDeclineSku3Grid.dataLoaded = true;
            } else {
                this.growthDeclineSku3Grid.gridOptions.api.setRowData(this.gridSKU3);
                this.setSelectedRow('growthDeclineSku3Grid', this.grid3Class);
            }
        } else {
            if( this.growthDeclineSku3Grid==undefined) {
                this.growthDeclineSku3Grid = this.setAgGridObject([], "SKU3");
                this.growthDeclineSku3Grid.dataLoaded = true;
            } else {
                this.growthDeclineSku3Grid.gridOptions.api.setRowData([]);
            }
        }
        this.options.showPodLoader.grid3.showInnerLoader = false;
    }

    setSelectedRow(gridName, gridClass) {
    	setTimeout(()=>{
            // var textWrapped = ($scope.whiteSpaceProperty[gridClass] == 'normal') ? true : false;
            // $rootScope.textWrappLogic(textWrapped, gridClass, $scope[gridName], {field:'ACCOUNT', currentRowHeight: $scope.rowHeightArray});

            var extraObjParams = this.extraObjParams[gridName];
            if (extraObjParams != undefined) {
                var customParamPart = extraObjParams.split("=");
                var selectedGridName = customParamPart[1]; //selectedGrid=gridname
                if (gridName==selectedGridName) {

                    this[gridName].gridOptions.api.forEachNode( function(rowNode) {
                        var thisRowData = rowNode.data;
                        if (thisRowData['ACCOUNT'] != undefined && thisRowData['ACCOUNT'] == this.skuName){
                            rowNode.setSelected(true, true);
                        }
                    });
                }
            }

        }, 100);
    }

    renderChart(result) {
        if (result.customErrors != undefined) {
            this.options.showPodLoader.countChart.customError = result.customErrors.displayMessage;
            this.options.showPodLoader.salesChart.customError = result.customErrors.displayMessage;
            this.options.showPodLoader.priceChart.customError = result.customErrors.displayMessage;
        }
        if (result.disChart != undefined) {
            this.discountChart = result.disChart;
            this.disChartPercent = (result.disChartPercent.percent) > 0 ? "+" + result.disChartPercent.percent + "%" : result.disChartPercent.percent + "%";
            this.distributionCountChart = this.setGrowthDeclineChart(this.discountChart, this.disChartPercent, "distributionCount");
            this.distributionChartData = result.disChart;
            this.options.showPodLoader.countChart.showInnerLoader = false;
        } else {
            this.distributionCountChart = this.setGrowthDeclineChart("", "", "distributionCount");
            this.distributionChartData = "";
            this.options.showPodLoader.countChart.showInnerLoader = false;
        }

        if (result.salesChart != undefined) {
            this.salesChart = result.salesChart;
            this.salesChartPercent = (result.salesChartPercent.percent) > 0 ? "+" + result.salesChartPercent.percent + "%" : result.salesChartPercent.percent + "%";
            this.unitSalesChart = this.setGrowthDeclineChart(this.salesChart, this.salesChartPercent, "unitSales");
            this.options.showPodLoader.salesChart.showInnerLoader = false;
            
            this.averageChart = [];
            var temp = {};
            let lyear;
            let tyear;
            lyear = (this.lyValue / this.salesChart[0].LYEAR).toFixed(2);
            temp = {
            	account:"LAST YEAR",
            	LYEAR:lyear
            };
            this.averageChart[0] = temp;
            tyear = (this.tyValue / this.salesChart[1].TYEAR).toFixed(2);
			temp = {
				account:"THIS YEAR",
				TYEAR:tyear
			};
            this.averageChart[1] = temp;
            if (lyear > 0) {
                let tempVal:string = (((tyear - lyear) / lyear) * 100).toFixed(1);
                let percentVal = parseFloat(tempVal);
            	this.averagePriceChartPercent = (percentVal > 0) ? "+" + percentVal + "%" : percentVal + "%";
            } else {
                this.averagePriceChartPercent = 0 + "%";
            }
            this.averagePriceChart = this.setGrowthDeclineChart(this.averageChart, this.averagePriceChartPercent, "averagePrice");
            this.options.showPodLoader.priceChart.showInnerLoader = false;
        } else {
            this.unitSalesChart = this.setGrowthDeclineChart("", "", "unitSales");
            this.options.showPodLoader.salesChart.showInnerLoader = false;
            this.averagePriceChart = this.setGrowthDeclineChart("", "", "averagePrice");
            this.options.showPodLoader.priceChart.showInnerLoader = false;
        }
    }

    /**
     * Method: sendRequestToServer
     * Action: GET DATA FROM SERVER
     * Params: ACTION
     * Returns: RESULT WITH SERVICES
     **/
    sendRequestToServer(action) {
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("pageID=" + this.pageID);
        params.push("action=" + this.action);
        if(this.action!='reload')
        params.push("SKU=" + this.accountName);
        params.push("HidePrivate=" + this.privateLabelStatus);
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.result = data;
        });
    }

    //call this method when click on the sku grid data
    clickRowGridDataChange(accountName, skuName, tyValue, lyValue, percent, gridName) {
        this.action = "ChangeSku";
        this.gridName = gridName;
        this.accountName = accountName;
        this.skuName = skuName;
        this.tyValue = tyValue;
        this.lyValue = lyValue;
        this.percent = percent;
        this.overUnderPerformance = (this.percent - this.avgPercent).toFixed(1);
        this.overUnderPerformance = this.overUnderPerformance > 0 ? "+" + this.overUnderPerformance + "pp" : this.overUnderPerformance + "pp";

        var backupObj = {
        	gridName:gridName,
        	accountName:accountName,
        	skuName:skuName,
        	tyValue:tyValue,
        	lyValue:lyValue,
	        percent:percent
	    };
        console.log(gridName);
        if (gridName == "SKU1") {
            this.growthDeclineSku2Grid.gridOptions.api.deselectAll();
            this.growthDeclineSku3Grid.gridOptions.api.deselectAll();

            this.overUnderFontColor = "green";
            this.gridNames.growthDeclineSku1Grid = backupObj;
            this.extraObj.customParams = 'selectedGrid=growthDeclineSku1Grid';
        }
        else if (gridName == "SKU2") {
            this.growthDeclineSku1Grid.gridOptions.api.deselectAll();           
            this.growthDeclineSku3Grid.gridOptions.api.deselectAll();
            this.overUnderFontColor = "#FF9A00";
            this.gridNames.growthDeclineSku2Grid = backupObj;
            this.extraObj.customParams = 'selectedGrid=growthDeclineSku2Grid';
        }
        else if (gridName == "SKU3") {
            this.growthDeclineSku1Grid.gridOptions.api.deselectAll();
            this.growthDeclineSku2Grid.gridOptions.api.deselectAll();
            this.overUnderFontColor = "red";
            this.gridNames.growthDeclineSku3Grid = backupObj;
            this.extraObj.customParams = 'selectedGrid=growthDeclineSku3Grid';
        }
        this.setSelectionData(this.extraObj);
    }

    /**
     * Method: dataRead
     * Action: ALL RESULT DATA READ
     * Params: RESULT DATA of JSON FORMAT
     * Returns: ...
     **/
    dataRead(result) {
    	//console.log(result);
        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage, this.servicePageName, this.pageID);
            return ;
        }

        if (result.gridConfig != undefined) {
            this.ACCOUNT_NAME = result.gridConfig.ACCOUNT_NAME;

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

        /*console.log(this.showTimeSelection);
        console.log(this.showProductFilter);
        console.log(this.showMarketFilter);*/

        this.dataLoaded = true;
        
        if (this.isFirstRequest) {
            setTimeout(()=>{
                this.sendPodRequest();
            }, 100);
        }

    }

    sendPodRequest() {
        this.action = "reload";
        this.setSelectionData('');
        this.isFirstRequest = false;
    }

    /*$('#' + $scope.pageUniqueKey + '_splitContainerGrowthDeclineDrivers').on('resize', function(event) {
        $(".distributionCountChart").data("kendoChart").refresh();
        $(".averagePriceChart").data("kendoChart").refresh();
        $(".unitSalesChart").data("kendoChart").refresh();
    });*/

    // set resize method to supporting the layout in all devices
    //setResizeWindow('.' + $scope.pageUniqueKey + '_growthDeclineDriversPage');
    resizeCallback() {
        if(window.innerWidth<768){
            // nothing
        }else{
            /*if(is_splitter_collapse==false){
                layoutSetup({layout: 'SPLITTER_CONTAINER_GROWTH_DECLINE', pageContainer: "." + $scope.pageUniqueKey + "_growthDeclineDriversPage", splitContainer: '#' + $scope.pageUniqueKey + '_splitContainerGrowthDeclineDrivers', splitter: '#' + $scope.pageUniqueKey + '_splitterContainerGrowthDeclineDrivers'});
            }else{
                is_splitter_collapse = false;
            }*/
            //$('#' + this.pageUniqueKey + '_splitContainerGrowthDeclineDrivers').jqxSplitter('refresh');
            //$('#' + this.pageUniqueKey + '_splitterContainerGrowthDeclineDrivers').jqxSplitter('refresh');
        }

        /*chartResize(this.distributionCountContextMenuOptions.container);
        chartResize(this.averagePriceChartContextMenuOptions.container);
        chartResize(this.unitSalesChartContextMenuOptions.container);*/

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
        delete this.avgPercent;
        delete this.gridSKU1;
        if (this.growthDeclineSku1Grid.gridOptions != undefined)
            this.growthDeclineSku1Grid.gridOptions.api.setRowData([]);

        delete this.gridSKU2;
        if (this.growthDeclineSku2Grid.gridOptions != undefined)
            this.growthDeclineSku2Grid.gridOptions.api.setRowData([]);

        delete this.gridSKU3;
        if (this.growthDeclineSku3Grid.gridOptions != undefined)
            this.growthDeclineSku3Grid.gridOptions.api.setRowData([]);
        
        delete this.discountChart;
        delete this.distributionCountChart;
        delete this.salesChart;
        delete this.unitSalesChart;
        delete this.averagePriceChart;

    }

}
