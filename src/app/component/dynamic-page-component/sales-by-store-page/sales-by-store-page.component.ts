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

import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

import { formatNumber } from '@progress/kendo-angular-intl';

@Component({
  selector: 'app-sales-by-store-page',
  templateUrl: './sales-by-store-page.component.html',
  styleUrls: ['./sales-by-store-page.component.scss']
})
export class SalesByStorePageComponent implements OnInit {

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
    windowHeight:any;
    measurePositionClass:any;
    pageHeight:any;
    showFacingsSelection:any;
    filterPosition:any;
    isFirstRequest:any;
    isShowProductFilter:any;
    showProductMarketSelectionInlineFilter:any;
    productMarketFiltersDispType:any;
    dataLoaded:any;

    
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

        this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_SalesByStorePage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        //initial grid text warp property
        this.textWrapField = [];
        this.rowHeightArray = {};
        this.whiteSpaceProperty = {spaceProperty:{}};
        this.GridClass = this.pageUniqueKey + '_salesByStoreGrid';
        this.rowHeightArray[this.GridClass] = [];
        this.whiteSpaceProperty.spaceProperty[this.GridClass] = "normal";


        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "lcl\\ProvinceSalesByStore";
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
           
            var options = {
                gridClass: this.GridClass,
                whiteSpaceProperty: this.whiteSpaceProperty.spaceProperty,
                textWrap: {field:this.textWrapField, currentRowHeight:this.rowHeightArray},
                contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
                callbackFooterRow: this.createFooterRow
            };

            this.gridData = {columns: this.getAgGridColumns(), data:data, options:options};
            this.gridData.dataLoaded = true;
        } else {
            this.gridData.gridOptions.api.setRowData(data);
            this.gridData.gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
        }

        return this.gridData;
    }

    createFooterRow (data) {

        var DIS = 0;
        var SALES = 0;
        var SALES_UNIT = 0;
        data.forEach(obj =>{
            if (obj['DIS']!=undefined) {
                DIS += parseFloat(obj.DIS);
            }
            if (obj['SALES']!=undefined) {
                SALES += parseFloat(obj.SALES);
            }
            if (obj['SALES_UNIT']!=undefined) {
                SALES_UNIT += parseFloat(obj.SALES_UNIT);
            }
        });

        DIS = formatNumber(DIS, 'n0');
        SALES = formatNumber(SALES, 'n0');
        SALES_UNIT = formatNumber(SALES_UNIT, 'n0');

        var result = [{
            PRO: 'Total',
            DIS: DIS,
            SALES: SALES,
            SALES_UNIT: SALES_UNIT,
        }];

        return result;
    }

    getAgGridColumns () {

        var columnsName = [];

        this.textWrapField = ["PRO", "DIS", "SALES", "CROS", "SALES_UNIT", "UROS"];

        columnsName = [{
                field: "PRO",
                headerName: "PROVINCE",
                columnTypes: "string",
                suppressMenu: true,
            }, {
                field: "DIS",
                headerName: "STORES",
                columnTypes: "number",
                suppressMenu: true,
            }, {
                field: "SALES",
                headerName: "SALES (" + GLOBALS.currencySign + ")",
                columnTypes: "number",
                valueFormatter: function(params) { return formatNumber(params.value, 'n0'); },
                suppressMenu: true,
            }, {
                field: "CROS",
                headerName: "WK CROS",
                columnTypes: "number",
                valueFormatter: function(params) { return formatNumber(params.value, 'n2'); },
                suppressMenu: true,
            }, {
                field: "SALES_UNIT",
                headerName: "SALES (UNITS)",
                columnTypes: "number",
                valueFormatter: function(params) { return formatNumber(params.value, 'n0'); },
                suppressMenu: true,
            }, {
                field: "UROS",
                headerName: "WK UROS",
                columnTypes: "number",
                valueFormatter: function(params) { return formatNumber(params.value, 'n1'); },
                suppressMenu: true,
            }];

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
    }

    

    setUpLayout() {
        setTimeout(()=>{
            if(typeof ($('#' + this.pageUniqueKey + '_splitContainer')) != undefined && $('#' + this.pageUniqueKey + '_splitContainer').length > 0){
                GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER_SINGLE', splitContainer: "#" + this.pageUniqueKey + "_distributionGapFindersplitter"});
            } else {
                this.setUpLayout();
            }

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
