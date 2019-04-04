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


import { formatNumber } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  styleUrls: ['./view-page.component.scss']
})
export class ViewPageComponent implements OnInit {

    @Input() options;

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
    windowHeight:any;
    measurePositionClass:any;
    pageHeight:any;
    showFacingsSelection:any;
    filterPosition:any;
    isFirstRequest:any;
    isShowProductFilter:any;
    showProductMarketSelectionInlineFilter:any;
    productMarketFiltersDispcolumnTypes:any;
    dataLoaded:any;
    productMarketFiltersDispType:any;

    
    isServiceRequest:any;
    dataDecimalPlaces:any;
    measureLabel:any;
    gridLoaderOption:any;

    textWrapField:any;
    rowHeightArray:any;
    GridClass:any;
    whiteSpaceProperty:any;

    showSkuSelection:any;
    gridData:any;

    enabledColumns:any;
    gridColumns:any;
    userSelectedMeasure:any;
    dateList:any;
    aggregateConfig:any;

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
        this.gridLoaderOption = {};
        this.gridLoaderOption = {showInnerLoader:false};
        this.gridLoaderOption.showNoDataFound = false;

        this.rebuildPageScope = false;
        if (GLOBALS.callbackObjPerformance == undefined)
            GLOBALS.callbackObjPerformance = {};


        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        // this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_ViewPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        //initial grid text warp property
        this.textWrapField = [];
        this.rowHeightArray = {};
        this.whiteSpaceProperty = {spaceProperty:{}};
        this.GridClass = this.pageUniqueKey + '_ViewPage';
        this.rowHeightArray[this.GridClass] = [];
        this.whiteSpaceProperty.spaceProperty[this.GridClass] = "normal";


        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "lcl\\ProductView";
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

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        this.isFirstRequest = true;

        //GLOBALS.callAsDefaultService({pageName: requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });

	}


    changeHidePrivateLabel() {
        this.setSelectionData('');
    }

    setGridData (data) {

        if (this.gridData==undefined) {
            var gridColumns = this.getAgGridColumns();
            var options = {
                gridClass: this.GridClass,
                whiteSpaceProperty: this.whiteSpaceProperty.spaceProperty,
                textWrap: {field:this.textWrapField, currentRowHeight:this.rowHeightArray},
                contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
                callbackFooterRow: this.createFooterRow,
                aggregateConfig: this.aggregateConfig
            };

            this.gridData = {columns: gridColumns, data:data, options:options};
            this.gridData.dataLoaded = true;
        } else {
            this.gridData.gridOptions.api.setRowData(data);
            this.gridData.gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
        }

        return this.gridData;
    }
 
    createFooterRow (data) {
        // console.log(this.aggregateConfig);
        var initData = {};
        data.forEach(obj =>{
            this.aggregateConfig.forEach(aggObj =>{
                if (obj[aggObj.field]!=undefined && aggObj.aggregate=='sum') {
                    if( !(aggObj.field in initData) ){
                        initData[aggObj.field] = parseFloat(obj[aggObj.field]);
                    }else{
                        initData[aggObj.field] += parseFloat(obj[aggObj.field]);
                    }
                }
                else if (obj[aggObj.field]!=undefined && aggObj.aggregate=='static') {
                    initData[aggObj.field] = aggObj.value;
                }
            });
        });

        // for(let key in initData){
        //     initData[key] = formatNumber(initData[key], 'n0');
        // }

        var result = [initData];
        return result;
    }


    getAgGridColumns () {

        var columnsName = [];
        this.textWrapField = [];

        var measureDataDecimalPlaces = 0;
        if(GLOBALS.measuresOptiondata != undefined && this.selectedMeasureID != undefined){
            var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.selectedMeasureID});
            measureDataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
        }

        for(let key in this.gridColumns) {
            var value = this.gridColumns[key];
            this.textWrapField.push(key);
            columnsName.push({
                field: key,
                headerName: value,
                columnTypes: "string",
                suppressMenu: true,
                minWidth: 120,
            });
        }

        this.aggregateConfig = [];
        for(let key in this.userSelectedMeasure) {

            var value = this.userSelectedMeasure[key];

            this.aggregateConfig.push({field: 'TY_' + value.measureAlias, aggregate: "sum"});
            this.aggregateConfig.push({field: 'LY_' + value.measureAlias, aggregate: "sum"});

            this.aggregateConfig.push({field: 'VAR_' + value.measureAlias, aggregate: "sum"});
            this.aggregateConfig.push({field: 'SHARE_TY_' + value.measureAlias, aggregate: "static", value:100});
            this.aggregateConfig.push({field: 'SHARE_LY_' + value.measureAlias, aggregate: "static", value:100});
            this.aggregateConfig.push({field: 'UROS', aggregate: "static", value:''});

            columnsName.push({
                field: 'TY_' + value.measureAlias,
                headerName: value.measureName + " TY",
                columnTypes: "number",                
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+value.decimalPlaces); },
                suppressMenu: true,
                minWidth: 120,                
                // format: "{0:n"+value.decimalPlaces+"}",
                // footerTemplate: '<div style="float: left;">#= kendo.toString(sum, "n'+value.decimalPlaces+'") #</div>',
                hide: ((this.enabledColumns.indexOf('measure-columns') != -1) ? false : true),
            });
            columnsName.push({
                field: 'LY_' + value.measureAlias,
                headerName: value.measureName + " LY",
                columnTypes: "number",                
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+value.decimalPlaces); },
                suppressMenu: true,                
                // format: "{0:n"+value.decimalPlaces+"}",
                // footerTemplate: '<div style="float: left;">#= kendo.toString(sum, "n'+value.decimalPlaces+'") #</div>',
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('measure-columns') == -1),
                minWidth: 120,
            });                    
            columnsName.push({
                field: 'VAR_' + value.measureAlias,
                headerName: value.measureName + " VAR %",
                columnTypes: "number",                
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+value.decimalPlaces); },
                suppressMenu: true,
                minWidth: 120,                
                // format: "{0:n"+value.decimalPlaces+"}",
                cellRenderer: function(params) {
                    if(params.data['VAR_' + value.measureAlias] > 0)
                        return '<span class="bg-light-green">'+ formatNumber(params.data['VAR_' + value.measureAlias], 'n1') +'</span>';
                    else if (params.data['VAR_' + value.measureAlias] < 0)
                        return '<span class="bg-red">'+ formatNumber(params.data['VAR_' + value.measureAlias], 'n1') +'</span>';
                    else
                        return '<span class="bg-yellow">'+ formatNumber(params.data['VAR_' + value.measureAlias], 'n1') +'</span>';
                },
                pinnedRowCellRenderer: function(params){
                    return formatNumber(params.value, 'n0');
                },
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('measure-columns') == -1),
                // footerTemplate: "<div style='float: left;'>#= window.calculateSummaryVarper(data, '"+value.measureAlias+"') #</div>",
            });
            columnsName.push({
                field: 'SHARE_TY_' + value.measureAlias,
                headerName: value.measureName + ' SHARE % TY',
                columnTypes: "number",                
                // format: "{0:n1}",
                // footerTemplate: '<div style="float: left;">100</div>',
                valueFormatter: function(params) { return formatNumber(params.value, 'n1'); },
                pinnedRowCellRenderer: function(params){
                    return formatNumber(params.value, 'n0');
                },
                suppressMenu: true,                
                hide: ((this.enabledColumns.indexOf('share-columns') != -1) ? false : true),
                minWidth: 120,
            });
            columnsName.push({
                field: 'SHARE_LY_' + value.measureAlias,
                headerName: value.measureName + ' SHARE % LY',
                columnTypes: "number",                
                // format: "{0:n1}",
                // footerTemplate: '<div style="float: left;">100</div>',
                valueFormatter: function(params) { return formatNumber(params.value, 'n1'); },
                pinnedRowCellRenderer: function(params){
                    return formatNumber(params.value, 'n0');
                },
                suppressMenu: true,                
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('share-columns') == -1),
                minWidth: 120,
            });                    
        }

        columnsName.push({
                field: "DIS",
                headerName: "AVE.DIST TY",
                columnTypes: "number",
                hide: ((this.enabledColumns.indexOf('dist-columns') != -1) ? false : true),
                cellRenderer: function(params) {
                    if(params.data.DIS > params.data.DISLY)
                        return params.data.DIS+" <img src='/assets/img/increase.png' />";
                    else
                        return params.data.DIS+" <img src='/assets/img/decrease.png' />";
                },
                pinnedRowCellRenderer: function(params){
                    return '';
                },
                minWidth: 120,
                suppressMenu: true,
            }, {
                field: "DISLY",
                headerName: "AVE.DIST LY",
                columnTypes: "number",                
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('dist-columns') == -1),
                minWidth: 120,
                suppressMenu: true,
            }, {
                field: "CROS",
                headerName: "WK CROS TY",
                columnTypes: "number",
                // format: "{0:n2}",                
                hide: ((this.enabledColumns.indexOf('cros-columns') != -1) ? false : true),
                valueFormatter: function(params) { return formatNumber(params.value, 'n2'); },
                suppressMenu: true,
                minWidth: 120,              
                cellRenderer: function(params) {
                    if(params.data.CROS > params.data.CROSLY)
                        return params.data.CROS+" <img src='/assets/img/increase.png' />";
                    else
                        return params.data.CROS+" <img src='/assets/img/decrease.png' />";
                },
                pinnedRowCellRenderer: function(params){
                    return '';
                }
            }, {
                field: "CROSLY",
                headerName: "WK CROS LY",
                columnTypes: "number",
                // format: "{0:n2}",                
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('cros-columns') == -1),
                valueFormatter: function(params) { return formatNumber(params.value, 'n2'); },
                suppressMenu: true,
                minWidth: 120,
            }, {
                field: "UROS",
                headerName: "WK UROS TY",
                columnTypes: "number",
                // format: "{0:n2}",                
                hide: ((this.enabledColumns.indexOf('uros-columns') != -1) ? false : true),                
                valueFormatter: function(params) { return formatNumber(params.value, 'n2'); },
                suppressMenu: true,
                minWidth: 120,
                cellRenderer: function(params) {
                    if(params.data.UROS > params.data.UROSLY)
                        return params.data.UROS+" <img src='/assets/img/increase.png' />";
                    else
                        return params.data.UROS+" <img src='/assets/img/decrease.png' />";
                },
                pinnedRowCellRenderer: function(params){
                    return '';
                }
            }, {
                field: "UROSLY",
                headerName: "WK UROS LY",
                columnTypes: "number",
                // format: "{0:n2}",                
                hide: !GLOBALS.isShowLyData || (this.enabledColumns.indexOf('uros-columns') == -1),
                valueFormatter: function(params) { return formatNumber(params.value, 'n2'); },
                suppressMenu: true,
                minWidth: 120,
            });

        return columnsName;
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

    	this.gridLoaderOption.showInnerLoader = true;
        this.gridLoaderOption.customError = '';
        this.gridLoaderOption.showNoDataFound = false;

        GLOBALS.stopGlobalPaceLoader();
        this.extraObj = obj;

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

    }

    // GET FILTERING DATA
    getSelectionData(obj) {

        this.selectionParams = obj.split('&');
        this.sendRequestToServer("").then( (data:any) => {
            
            this.renderGridData(this.result);

        });
    }


    renderGridData (data){
        if (data.customErrors != undefined) {
            this.gridLoaderOption.customError = data.customErrors.displayMessage;
            return ;
        }

        if (data.gridValue != undefined) {
            if(data.gridValue.length>0)
                this.setGridData(data.gridValue);
            else
                this.gridLoaderOption.showNoDataFound = true;
        }else{
            this.setGridData([]);
        }
        this.gridLoaderOption.showInnerLoader = false;

    }

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("pageID=" + this.pageID);     
        params.push("HidePrivate=" + this.privateLabelStatus);

        // params.push("action=" + action);
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
 
        
        if (result.pageConfig != undefined) 
        {
            this.showTimeSelection = this.isShowProductFilter = this.showMarketFilter = this.showMeasureSelection = this.showSkuSelection = false;
            if (result.pageConfig.enabledFilters != undefined && result.pageConfig.enabledFilters.length > 0) {
                if (result.pageConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (result.pageConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.isShowProductFilter = true;

                if (result.pageConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.pageConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
                    
                if (result.pageConfig.enabledFilters.indexOf('sku-selection') != -1)
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
            }         

            if (result.pageConfig.enabledColumns != undefined && result.pageConfig.enabledColumns.length > 0) {
                this.enabledColumns = result.pageConfig.enabledColumns;
            }
        }

        if (result.gridColumns != undefined){
            this.gridColumns = result.gridColumns;
        }

        if (result.userSelectedMeasure != undefined){
            this.userSelectedMeasure = result.userSelectedMeasure;
            // this.setAggregateColumns();
        }

        // if (GLOBALS.ROOT_dateList != undefined)
        //     this.dateList = GLOBALS.ROOT_dateList;

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
    }

    

    setUpLayout() {
        setTimeout(()=>{
            GLOBALS.layoutSetup({layout: 'ONE_ROW', pageContainer: "."+this.pageUniqueKey+"_ViewPage"});
        });
    }

    rebuildPageProcess() {
        this.rebuildPageScope = true;
        this.setSelectionData('');
    }

    freePageObjectProcess() {        
        if(this.gridData.gridOptions != undefined)
            this.gridData.gridOptions.api.setRowData([]);
    }

}
