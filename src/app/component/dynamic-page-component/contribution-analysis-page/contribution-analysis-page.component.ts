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

import { exportImage } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

import { formatNumber } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-contribution-analysis-page',
  templateUrl: './contribution-analysis-page.component.html',
  styleUrls: ['./contribution-analysis-page.component.scss']
})
export class ContributionAnalysisPageComponent implements OnInit {

    @Input() options;

    @ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

    @ViewChild('chartObj') chartObj;
    @ViewChild('popupChartObj') popupChartObj;

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


    chartOptions:any;
    contribution:any;
    contributionAnalysisPageFilterOptions:any;
    measureDataDecimalPlaces:any;
    popupInnerLoader:any;
    timeSelectionChange:any;
    showHardStopSelection:any;
    isShowSkuIDCol:any;
    skuIDColName:any;
    rowHeightArray:any;
    gridList:any;
    extraFields:any;

    newsGrid:any;
	growersGrid:any;
	declinersGrid:any;
	dropsGrid:any;
	netChangeChart:any;
	lineChart:any;
	lineChartData:any;
	gridWeek:any;
	chartTitleTg:any;
	contributionLineChart:any;
	toDate:any;
	newers:any;
	growers:any;
	dropers:any;
	decliners:any;
	totals:any;
	totalNewersAndGrowers:any;
	totalDropersAndDecliners:any;
	netChanges:any;
	isShowProductFilter:any;
	selectedSkuID:any;
	valueVolume:any;
	showSkuSelection:any;
	showProductMarketSelectionInlineFilter:any;
	productMarketFiltersDispType:any;
	showFieldSelection:any;
	dataLoaded:any;
	isFirstRequest:any;
	showContributionAnalysisPopup:any;
	chartTitle:any;
	ACCOUNT:any;
	catAxisFdName:any;
	lineChartDecimalPlace:any;

	netChangeChartContextOptions:any;

	chartPopup:boolean;

	constructor(private injector: Injector, private _sendRequestService: SendRequestService, private _helperService: HelperService, private _broadcastService: BroadcastService) { 
        this.pageID = this.injector.get('pageID');
    }

    public onContextMenuSelect({ item }): void {
        if(this[item.logicFunctionName] != undefined)
            this[item.logicFunctionName](item);
    }

    public exportPopup(e:any): void {
	    this.popupChartObj.exportImage().then((dataURI) => {
	      saveAs(dataURI, 'combine_analysis.png');
	    });
	}

    ngAfterViewInit() {
        this.netChangeChartContextOptions.containerObj = this.chartObj;
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

		this.netChangeChart = {};
        this.lineChart = {};
        this.contributionLineChart = {};

		this.chartPopup = false;
        
        GLOBALS.tsdSif = false;
	    this.isDefaultSelectedWeek = true; // to set default week in server request
	    this.contributionAnalysisPageFilterOptions = {"blockFilterAccess": false};
	    this.measureDataDecimalPlaces = 0;
	    this.action = "";
	    this.popupInnerLoader = {"showInnerLoader": false};
	    this.timeSelectionChange = true;
	    this.showHardStopSelection = false;
	    this.isShowSkuIDCol = false;
	    this.skuIDColName = '';


	    this.rowHeightArray = {};

	    this.contribution = {};
	    this.gridList = {NPD: "news", GROWERS: "growers", DROPS: "drops", DECLINERS: "decliners"}; // grids list of this page

        if (GLOBALS.callbackObjPerformance == undefined)
            GLOBALS.callbackObjPerformance = {};

        this.timeSelectionMode = 1;

        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;

        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_ContributionAnalysisPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();


        this.netChangeChartContextOptions = {
			container: ".chart_container" + this.pageUniqueKey,
			menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'netChangeChart', functionScope: 'self'},
            ]
        }
        
        // calling initVars method to setting initial values
	    for (let gkey in this.gridList) {
	    	this.initVars(this.gridList[gkey]);
	    }
	    this.initVars("netChange"); // calling initVars method to setting value of netChange chart

        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "ContributionAnalysis";
        params.push("destination=" + this.requestPageName);
        if(this.servicePageName != undefined){
            GLOBALS.callbackObjPerformance[this.servicePageName] = {
                callBack: (data) => {
                    return this.callFilterChange(data);
                }
            }
        }

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
        params.push("action=config");        

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        this.isFirstRequest = true;

        //GLOBALS.callAsDefaultService({pageName: requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });

	}

	// This method to setting of this.contribution variable
    // @params: (string) var_name as key of this.contribution variable
    initVars (var_name) {
        // loader
        this.contribution.loader = this.contribution.loader || {};
        this.contribution.loader[var_name] = {showInnerLoader: false};
        // grid text warp property
        this.contribution.spaceProperty = this.contribution.spaceProperty || {};
        this[var_name + "GridClass"] = this.pageUniqueKey + '_' + var_name + 'Grid';
        this.contribution.spaceProperty[this[var_name + "GridClass"]] = "";
        // context options
        this.contribution.contextOptions = this.contribution.contextOptions || {};
        if (var_name == "netChange")
            this.contribution.contextOptions[var_name] = {container: '.' + this[var_name + "GridClass"], onlyChartExport: true, chartName: 'netChangeChart'};
        else
            this.contribution.contextOptions[var_name] = {container: '.' + this[var_name + "GridClass"], isGrid: true, isTextWrap: true, onlyExport: true};

    }
    

	changeHidePrivateLabel() {
	    this.setSelectionData('');
	}

	setAgGridObject (data, gridName) {

	    var gridClass = this[this.gridList[gridName] + 'GridClass'];
	    this.rowHeightArray[gridClass] = [];
	    this.contribution.spaceProperty[gridClass] = "normal";
	    
	    var options = {
	        gridClass: gridClass,
	        whiteSpaceProperty: this.contribution.spaceProperty,
	        textWrap: {field:'ACCOUNT', currentRowHeight:this.rowHeightArray},
	        contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
	        // callbackFooterRow: this.createFooterRow,
	        callbackOnRowClick: (params:any) => {
	            this.clickOnRow(params);
	        },
	        callbackOnRowDoubleClick: (params:any) => {
	            this.dblClickOnRow(params);
	        }
	    };

	    return {columns:this.getAgGridColumns(), data:data, options:options};
	}

	updateGrid (gridOptions, data)
	{
	    gridOptions.api.setColumnDefs(this.getAgGridColumns());

	    setTimeout(() => {
	        gridOptions.api.setRowData(data);
	        gridOptions.api.doLayout();
	    }, 100);
	    
	    gridOptions.api.sizeColumnsToFit();
	}

	getAgGridColumns() {

		var columnsName = [];
	    columnsName.push({
            field: "ID",
            headerName: (this.skuIDColName != undefined && this.skuIDColName != '') ? this.skuIDColName : 'Item Number',
            columnTypes: "string",
            hide: !this.isShowSkuIDCol,
            suppressMenu: true,
        });
	    columnsName.push({
            field: "ACCOUNT",
            headerName: this.selectedField.label,
            columnTypes: "string",
            suppressMenu: true,	            
        });

	    if (this.extraFields != undefined && this.extraFields.length > 0){
	        this.extraFields.forEach((val, key)=> {
	            columnsName.push({
	                field: val.NAME_ALIASE,
	                headerName: val.NAME_CSV,
	                columnTypes: "string",
	                suppressMenu: true,
	            });
	        });
	    }

	    columnsName.push({
	        field: "VAR",
	        headerName: "VARIANCE",
	        columnTypes: "number",
	        suppressMenu: true,
	        // valueFormatter: function(params) { return $filter('number')(params.value, this.measureDataDecimalPlaces); },
	        valueFormatter: (params:any) => { 
	        	return formatNumber(Number(params.value), 'n'+this.measureDataDecimalPlaces); 
	        }
	    });

	    columnsName.push({
	        field: "PERCENT",
	        headerName: "% CONTRIBUTION",
	        columnTypes: "number",
	        suppressMenu: true,
	        valueFormatter: function(params) { return formatNumber(Number(params.value), 'n1'); },
	    });                                   
	    
	    return columnsName;
	}


	contributionAnalysisGrids (data, gridName) {

	    if(gridName=='NPD'){
	        if(this.newsGrid==undefined){
	            this.newsGrid = this.setAgGridObject(data[gridName], gridName);
	            this.newsGrid.dataLoaded = true;
	        }
	        else{
	            this.updateGrid(this.newsGrid.gridOptions, data[gridName]);
	        }
	    }

	    if(gridName=='GROWERS'){
	        if(this.growersGrid==undefined){
	            this.growersGrid = this.setAgGridObject(data[gridName], gridName);
	            this.growersGrid.dataLoaded = true;
	        }
	        else{
	            this.updateGrid(this.growersGrid.gridOptions, data[gridName]);
	        }
	    }

	    if(gridName=='DECLINERS'){
	        if(this.declinersGrid==undefined){
	            this.declinersGrid = this.setAgGridObject(data[gridName], gridName);
	            this.declinersGrid.dataLoaded = true;
	        }
	        else{
	            this.updateGrid(this.declinersGrid.gridOptions, data[gridName]);
	        }
	    }

	    if(gridName=='DROPS'){
	        if(this.dropsGrid==undefined){
	            this.dropsGrid = this.setAgGridObject(data[gridName], gridName);
	            this.dropsGrid.dataLoaded = true;
	        }
	        else{
	            this.updateGrid(this.dropsGrid.gridOptions, data[gridName]);
	        }
	    }

	    
	}

	// configure net change chart
	setNetChangeChart (data) {
	    var chartHeight = $(".contributionAnalysisContainer .podContainerMid").height() + 15;
	    this.netChangeChart = {
	        chartArea: {
	            height: chartHeight
	        },
	        legend: {
	            visible: false,
	        },
	        seriesDefaults: {
	            type: "column",
	            stack: {
	                type: "100"
	            },
	            labels: {
	                visible: true,
	                position: "center",
	                //rotation: -45,
	                background: "transparent",
	                template: (e:any) => {
	                    if (e.value > 1000000 || e.value < -1000000) {
	                        var value = GLOBALS.nFormatter(e.value, 0);
	                    } else {
	                        // var value = kendo.format("{0:n"+this.measureDataDecimalPlaces+"}", Number(e.value));
	                        var value = formatNumber(Number(e.value), 'n'+this.measureDataDecimalPlaces);
	                    }
	                    return value;	                    
	                }
	            }
	        },
	        series: [{
	                name: "GROWERS VAR",
	                data: [data.GROWERS],
	                color: "#86AC3E"
	            }, {name: "NEW VAR",
	                data: [data.NPD],
	                color: "#EDC83B"
	            }, {
	                name: "DECLINERS VAR",
	                data: [data.DECLINERS],
	                color: "#AD3A34"
	            }, {
	                name: "DROPS VAR",
	                data: [data.DROPS],
	                color: "#456AB4"
	            }],
	        valueAxis: {
	            visible: false,
	            line: {
	                visible: false
	            },
	            minorGridLines: {
	                visible: false
	            }
	        },
	        categoryAxes: [{
	                visible: false,
	                line: {
	                    visible: false
	                }}],
	        tooltip: {
	            visible: true,
	            // template: "#= series.name #: #= kendo.format('{0:N"+this.measureDataDecimalPlaces+"}',value) # "
	        }
	    };
	}


	setLineChartData (data) {
	    this.selectedMeasureID = (this.selectedMeasureID == undefined) ?  GLOBALS.defaultMeasureSelectionID : this.selectedMeasureID;
	    var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID: this.selectedMeasureID});
	    
	    var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
	    var LYFIELD = "LY" + selectedMeasure[0].jsonKey;
	    var decimalPlaces = (selectedMeasure[0].dataDecimalPlaces != undefined) ? selectedMeasure[0].dataDecimalPlaces : 0;

	    this.lineChartDecimalPlace = decimalPlaces;
	    this.catAxisFdName = (data[0].TYMYDATE != undefined && data[0].TYMYDATE != '') ? 'TYMYDATE' : 'ACCOUNT';
	    this.lineChartData = data;
	    this.lineChart = {
	        title: { 
	            text: this.chartTitleTg
	        },
	        dataSource: {
	            data: data
	        },
	        series: [
	            {color: "#BD191A", field: LYFIELD, name: "LAST YEAR "+selectedMeasure[0].measureName, format: "{0:n"+decimalPlaces+"}"},
	            {color: "#21558E", field: TYFIELD, name: "THIS YEAR "+selectedMeasure[0].measureName, format: "{0:n"+decimalPlaces+"}"}
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
	                text: selectedMeasure[0].measureName,
	                font: "12px Arial",
	                //rotation: 90
	            },
	            labels: {
	                format: "{0:n"+decimalPlaces+"}"
	            }
	        },
	        categoryAxis: {
	            field: this.catAxisFdName,
	            axisCrossingValues: [0, 30],
	            labels: {
	                font: "11px Arial,Helvetica,sans-serif",
	                rotation: -60,
	                padding: {right: 10}
	            }
	        },
	        legend: {
	            visible: true,
	            position: "top"
	        },
	        tooltip: {
	            visible: true,
	            format: "{0:n"+decimalPlaces+"}",
	            // template: '#= series.name #<br /> # if(series.field == "' + TYFIELD + '"){ # <span> # if(dataItem.TYMYDATE == undefined){ # #= dataItem.ACCOUNT # # } else { # #= dataItem.TYMYDATE # # } # </span> # } else { # <span> # if(dataItem.LYMYDATE == undefined){ # # if(dataItem.LYACCOUNT == undefined){ # #= dataItem.ACCOUNT # # } else { # #= dataItem.LYACCOUNT # # } # # } else { # #= dataItem.LYMYDATE # # } # </span> # } # <br /> #= kendo.toString(Number(value), "n'+decimalPlaces+'") #'
	        }
	    }
	    return this.lineChart;
	}

	callFilterChange(obj) {
        this.extraObj = obj;
        this.setSelectionData(obj);
    }

	// SETTING MODULE FOR THIS PAGE
	setSelectionModule()
	{
	    // configuring the product tabs
        this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
        // configuring the market tabs
        this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
	}

	setSelectionData(obj) {
		GLOBALS.stopGlobalPaceLoader();
		if(this.action != 'skuChange'){
	        for(let key in this.contribution.loader) {
	            this.contribution.loader[key].showInnerLoader = true;
	            this.contribution.loader[key].customError = '';
	        };
	    }

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
	getSelectionData (obj)
	{
	    GLOBALS.stopPace = true;
	    this.selectionParams = obj.split('&');
	    this.sendRequestToServer(this.action).then((data:any) => {
	        if(this.action == 'skuChange'){
	            this.renderSkuChange(this.result);
	        } else {
	            this.renderContributionAnalysisData(this.result);
	        }
	    });
	}

	renderSkuChange (result) {
	    if (result.customErrors != undefined) {
	        this.popupInnerLoader.customError = result.customErrors.displayMessage;
	    }

	    if (result.LineChart != undefined) {
	        this.chartTitleTg = this.ACCOUNT;
	        this.action = this.ACCOUNT = '';
	        this.contributionLineChart = this.setLineChartData(result.LineChart);
	        this.popupInnerLoader.showInnerLoader = false;
	    }
	}

	renderContributionAnalysisData (result) {
	    if (result.customErrors != undefined) {
	        this.contribution.loader.forEach((val, key) => {
	            this.contribution.loader[key].customError = result.customErrors.displayMessage;
	        });
	    }

	    if (result.isShowSkuIDCol != undefined)
	        this.isShowSkuIDCol = result.isShowSkuIDCol;

	    if (result.skuIDColName != undefined)
	        this.skuIDColName = result.skuIDColName;

	    if (result.seasonalHardStopDates != undefined){
	        this.gridWeek = result.seasonalHardStopDates;
	        var selectedIndex = result.selectedIndexTo;
	        var selectedHardStop = this._helperService.where(this.gridWeek,{numdata: selectedIndex});
	        this.toDate = selectedHardStop[0].data;
	    }

	    if (result.fieldSelection != undefined) {
	        this.fieldSelection = result.fieldSelection;
	        var field = this._helperService.where(this.fieldSelection,{data: result.selectedField});
	        if(field != undefined && field.length > 0)
	            this.selectedField = field[0];
	        else
	            this.selectedField = this.fieldSelection[0];
	    }

	    this.extraFields = [];
	    if (result.extraFields != undefined)
	        this.extraFields = result.extraFields;

	    //read all data and store them
	    if (result.NPD != undefined || result.GROWERS != undefined ||
	            result.DROPS != undefined || result.DECLINERS != undefined) {
	        this.newers = result.NPD;
	        this.growers = result.GROWERS;
	        this.dropers = result.DROPS;
	        this.decliners = result.DECLINERS;
	        this.totals = result.TOTALS;

	        //calculate net change
	        this.totalNewersAndGrowers = Number(this.totals.NPD) + Number(this.totals.GROWERS);
	        this.totalDropersAndDecliners = Number(this.totals.DROPS) + Number(this.totals.DECLINERS);
	        this.netChanges = this.totalNewersAndGrowers + this.totalDropersAndDecliners;

	        //call draw grid method for news, growers, decliners, drops
	        // this.newsGrid = this.contributionAnalysisGrids(result, 'NPD');
	        this.contributionAnalysisGrids(result, 'NPD');
	        // this.growersGrid = this.contributionAnalysisGrids(result, 'GROWERS');
	        this.contributionAnalysisGrids(result, 'GROWERS');
	        // this.declinersGrid = this.contributionAnalysisGrids(result, 'DECLINERS');
	        this.contributionAnalysisGrids(result, 'DECLINERS');
	        // this.dropsGrid = this.contributionAnalysisGrids(result, 'DROPS');
	        this.contributionAnalysisGrids(result, 'DROPS');

	        //formate data string to number for news, growers, decliners, drops
	        var temp = {
	        	NPD: Number(this.totals.NPD),
	        	GROWERS: Number(this.totals.GROWERS),
	        	DECLINERS: Number(this.totals.DECLINERS),
	        	DROPS: Number(this.totals.DROPS),
	        };

	        //call net change chart
	        this.setNetChangeChart(temp);

	        for(let key in this.contribution.loader){
	            this.contribution.loader[key] = {showInnerLoader: false};
	        }
	    }
	}

	timeSelectionSeasonal (){
	    this.timeSelectionChange = true;
	}

	changeHardStockValue (measureId) {
	    this.setSelectionData('');
	}

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        

        params.push("HidePrivate=" + this.privateLabelStatus);

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

        if(action == 'skuChange'){
            this.popupInnerLoader.showInnerLoader = true;
            this.popupInnerLoader.customError = '';
            params.push("ACCOUNT=" + encodeURIComponent(this.ACCOUNT));
        }

        if (this.selectedField !== undefined)
            params.push("Field=" + this.selectedField.data);
        
        this.valueVolume = this.selectedMeasureID;
        GLOBALS.stopPace = true;


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
        
        // this.pageHeight = GLOBALS.getDynamicHeight({});

        if(GLOBALS.measuresOptiondata != undefined && this.selectedMeasureID != undefined){
            // var selectedMeasure = $filter('filter')(GLOBALS.measuresOptiondata,{measureID : this.selectedMeasureID }, true );
            var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID: this.selectedMeasureID});
            this.measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
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

                if (result.gridConfig.enabledFilters.indexOf('field-selection') != -1)
                    this.showFieldSelection = true;                     
            }
        }

        this.dataLoaded = true;

        if (this.isFirstRequest) {
            if (result.showContributionAnalysisPopup != undefined)
                this.showContributionAnalysisPopup = result.showContributionAnalysisPopup;
            else
                this.showContributionAnalysisPopup = true;
                
            setTimeout(()=>{
                this.sendPodRequest();
            }, 100);
        }

    }

    sendPodRequest () {
        this.setSelectionData('');
        this.isFirstRequest = false;
    }

    // for mobile
    clickOnRow (gdName) {
        if ($.isMobile) {
            this.sendRequestWithDblClickOnRow(gdName);
        }
    }

    // for desktop
    dblClickOnRow (gdName) {
        if(this.showContributionAnalysisPopup == true)
            this.sendRequestWithDblClickOnRow(gdName);
    }

    sendRequestWithDblClickOnRow (gdName) {
        
        if ( typeof gdName=='object' ) {
            this.chartTitle = (this.selectedField != undefined) ? this.selectedField.label+" Contribution Chart" : "Contribution Chart";
            this.ACCOUNT = gdName.ACCOUNT;
            this.action  = 'skuChange';
            this.setSelectionData('');
            this.chartPopup = true;
        }

    }
    

    setUpLayout() {
        setTimeout(()=>{            	    	
			GLOBALS.layoutSetup({layout: 'CONTRIBUTION_ANALYSIS'});    
		});
    }

    rebuildPageProcess() {
        /*if ($rootScope.templateDetails[servicePageName].pageLoaded == false) {
            $rootScope.reloadProjectPageConfig(servicePageName,pageID);
        } else {*/
            this.rebuildPageScope = true;
            /*if(typeof $scope.applyProductStickyFilterToLocalScope == 'function')
                $scope.applyProductStickyFilterToLocalScope();

            if(typeof $scope.applyMarketStickyFilterToLocalScope == 'function')
                $scope.applyMarketStickyFilterToLocalScope();*/

            this.setSelectionData('');
        // }
    }

    freePageObjectProcess() {
        delete this.extraFields;
        delete this.newers;  
        delete this.growers;
        delete this.dropers;
        delete this.decliners;
        delete this.totals;
        delete this.totalNewersAndGrowers;
        delete this.totalDropersAndDecliners;
        delete this.netChanges;

        if (this.newsGrid.gridOptions != undefined)
            this.newsGrid.gridOptions.api.setRowData([]);

        if (this.growersGrid.gridOptions != undefined)
            this.growersGrid.gridOptions.api.setRowData([]);

        if (this.declinersGrid.gridOptions != undefined)
            this.declinersGrid.gridOptions.api.setRowData([]);

        if (this.dropsGrid.gridOptions != undefined)
            this.dropsGrid.gridOptions.api.setRowData([]);

        delete this.netChangeChart;
        delete this.contributionLineChart;
        delete this.lineChart;
    }
}
