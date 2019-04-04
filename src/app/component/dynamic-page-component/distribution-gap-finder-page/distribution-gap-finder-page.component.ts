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
  selector: 'app-distribution-gap-finder-page',
  templateUrl: './distribution-gap-finder-page.component.html',
  styleUrls: ['./distribution-gap-finder-page.component.scss']
})
export class DistributionGapFinderPageComponent implements OnInit {

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

    
    titleOfGrid:any;
    skuName:any;
    regoin:any;
    selectedWeek:any;
    isServiceRequest:any;
    hideZeroGapStores:any;
    selectedRowData:any;
    selectedBottomGridRequestData:any;

    sellingData:any;
    notSellingData:any;
    skuGridData:any;
    extrColsNameForBottomGrids:any;
    backupGridData:any;
    topGrid:any;
    dataDecimalPlaces:any;
    measureLabel:any;
    topGridOption:any;
    bottomGridOption:any;
    tabActiveClass:any;

    showSkuSelection:any;
    showHardStopSelection:any;

    fieldNames:any;
    topGridColumnName:any;
    sellingColumn:any;
    notSellingColumn:any;

    textWrapField:any;
    rowHeightArray:any;
    GridClass:any;
    bottomGridClass:any;
    whiteSpaceProperty:any;

    preventRowChangeEvent:any;

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
        this.topGridOption = {showInnerLoader:false};
        this.bottomGridOption = {showInnerLoader:false};
        this.titleOfGrid = "SKU DETAILS INFORMATION";
        this.action = "reload";
        this.skuName = "";
        this.regoin = "";
        this.tabActiveClass = {one:'active', two:''};
        
        this.selectedWeek = 12;
        this.layoutLoaded = false;
        this.isServiceRequest = true;

        this.hideZeroGapStores = false;

        this.selectedRowData = '';
        this.selectedBottomGridRequestData = '';    
        this.preventRowChangeEvent = false;   


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
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_DistributionGapFinderPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        //initial grid text warp property
        this.textWrapField = [];
        this.rowHeightArray = {};
        this.whiteSpaceProperty = {spaceProperty:{}};
        this.GridClass = this.pageUniqueKey + '_gapFinderGrid';
        this.rowHeightArray[this.GridClass] = [];
        this.whiteSpaceProperty.spaceProperty[this.GridClass] = "normal";

        this.bottomGridClass = this.pageUniqueKey + '_bottomGrid';

        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "lcl\\DistributionGapFinder";
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

        params.push("action=config");
        params.push("HidePrivate=" + PLabel);
        params.push("pageID=" + this.pageID);
        params.push("action=" + this.action);
        params.push("timeFrame=" + this.selectedWeek);
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

    hideShowGapStores()
    {
        this.topGridOption.showInnerLoader = true;
        var newData;
        newData = this.backupGridData;
        if(this.hideZeroGapStores == true)
        {
            newData = this.backupGridData;
            // this._helperService.where(newData,{measureID: this.selectedMeasureID});
            // newData["gridData"] = $filter('filter')(newData,function(newData){
            //     return newData.GAP_VALUE > 0;
            // });
        }
        setTimeout(()=> {
            this.setGridData(newData);
            this.sellingData = "";
            this.notSellingData = "";
            this.setSkuGrid(this.sellingData, "selling");
            this.setSkuGrid(this.notSellingData, 'notSelling');                
            this.topGridOption.showInnerLoader = false;
        }, 100);
    }   

    exportAllComb() {
        this.action = "getallcomb";
        this.callFilterChange('');
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


        if(this.action == "reload")
        this.topGridOption.showInnerLoader = true;

        if(this.action == "getSellingNotSelling" || this.action == "reload")
        this.bottomGridOption.showInnerLoader = true;

        this.topGridOption.customError = '';
        this.bottomGridOption.customError = '';


        var params = "";
        // if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
            // params += '&' + this.timeselectionCall.getTimeSelection();
        // if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
            // params += '&' + this.timeselectionCall.getTimeSelectionDays();
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

        this.selectedBottomGridRequestData = '';
        if (this.rebuildPageScope) {
            this.rebuildPageScope = false;
            if( this.selectedRowData!='' ){
                this.selectedBottomGridRequestData = this.selectedRowData;
            }
        }

        this.selectionParams = obj.split('&');
        this.sendRequestToServer("").then( (data:any) => {
            
            if(this.action == "getSellingNotSelling"){
                this.renderSellingNotSellingGridData(this.result);
            }
            else if(this.action == "getallcomb"){
                this.renderExportData(this.result);
            }else{
                this.renderGridData(this.result);
                this.renderSellingNotSellingGridData(this.result);
                this.selectedRowData = '';
            }

            if(this.selectedBottomGridRequestData!=''){ // if need to send bottom grid request during _reBuild
                this.skuDriversGridGet(this.selectedBottomGridRequestData, false);
            }

        });
    }
    
    // filtering selling by sku id    
    skuDriversGridGet(selectedRowData, rowClickEvent) {

        if(this.preventRowChangeEvent){
            this.preventRowChangeEvent = false;
            return false;
        }

        
        var selectedData = selectedRowData;

        // works for rebuild function
        if(rowClickEvent==false){
            
            this.preventRowChangeEvent = true;

            setTimeout(()=>{
                this.topGrid.gridOptions.api.forEachNode( (rowNode) => {

                    var thisRowData = rowNode.data;

                    var obj1 = {};
                    var obj2 = {};
                    this.fieldNames.forEach( (obj, index) => {
                        for(let key in obj) {
                            var value = obj[key];
                            obj1[value] = selectedData[value];
                            obj2[value] = thisRowData[value];                                        
                        }
                    });

                    if(JSON.stringify(obj1) == JSON.stringify(obj2)){
                        rowNode.setSelected(true, true);
                    }

                });
            }, 100);

        }

        this.selectedRowData = selectedData;

        this.fieldNames.forEach( (obj, index) => {
            for(let key in obj) {
                var value = obj[key];
                this[key] = selectedData[value];
            }
        });

        this.action = "getSellingNotSelling";
        this.callFilterChange('');
    }

    // change selling or not selling value by click tab 
    tabClickEvent(tabName) {
        if (tabName == 'selling') {
            this.tabActiveClass.one = '';
            this.tabActiveClass.two = 'active';
            this.setSkuGrid(this.sellingData, 'selling');
        }
        else {
            this.tabActiveClass.one = 'active';
            this.tabActiveClass.two = '';
            this.setSkuGrid(this.notSellingData, 'notSelling');
        }
    }

    
    renderGridData(data){

        if (data.customErrors != undefined) {
            this.topGridOption.customError = data.customErrors.displayMessage;
        }

        if (data.gridData != undefined)
        {
            this.backupGridData = data.gridData;
            this.setGridData(data.gridData);
            this.topGridOption.showInnerLoader = false;
        }
    }


    renderSellingNotSellingGridData (data){

        this.action = "reload";

        if (data.customErrors != undefined) {
            this.bottomGridOption.customError = data.customErrors.displayMessage;
        }

        // default tab active
        if (data.sellingStores != undefined)
        {
            this.sellingData = data.sellingStores;
        }
        else {
            this.sellingData = "";
        }

        if (data.notSellingStores != undefined)
        {
            this.notSellingData = data.notSellingStores;

        } else {
            this.notSellingData = "";
        }

        if (data.extrColsNameForBottomGrids != undefined)
            this.extrColsNameForBottomGrids = data.extrColsNameForBottomGrids;
        
        if (this.tabActiveClass.two=='active') {
            this.setSkuGrid(this.sellingData, "selling");                    
        } else {
            this.setSkuGrid(this.notSellingData, "notSelling");
        }
        this.bottomGridOption.showInnerLoader = false;
    }

    renderExportData (data){
        this.action = "reload";
        if (data.customErrors != undefined) {
            this.bottomGridOption.customError = data.customErrors.displayMessage;
        }

        if (data.allNotSellingStores != undefined && data.allNotSellingStores.fullPath != undefined){
            window.location.href = data.allNotSellingStores.fullPath;
        }

        this.bottomGridOption.showInnerLoader = false;
    }

    setGridData(data) {

        if (this.topGrid==undefined) {
           
            var options = {
                gridClass: this.GridClass,
                whiteSpaceProperty: this.whiteSpaceProperty.spaceProperty,
                textWrap: {field:this.textWrapField, currentRowHeight:this.rowHeightArray},
                contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
                callbackOnRowClick: (dataItem) => {
                    this.skuDriversGridGet(dataItem, true);
                },
                callbackFooterRow: this.createFooterRow
            };

            this.topGrid = {columns: this.getAgGridColumns(), data:data, options:options};
            this.topGrid.dataLoaded = true;
        } else {
            this.topGrid.gridOptions.api.setRowData(data);
            this.topGrid.gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
        }

        return this.topGrid;
    }

    createFooterRow (data) {

        var SALES = 0;
        data.forEach(obj =>{
            if (obj['SALES']!=undefined) {
                SALES += parseFloat(obj.SALES);
            }
        });

        SALES = formatNumber(SALES, 'n'+this.dataDecimalPlaces);

        var result = [{
            PIN: 'Total',
            SALES: SALES
        }];

        return result;
    }

    getAgGridColumns () {

        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID: this.selectedMeasureID});
        this.measureLabel = selectedMeasure[0]['measureName'];
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
        var columnsName = [];

        this.textWrapField = [];
        for(let key in this.topGridColumnName){
            var columnName = this.topGridColumnName[key];
            var temp = {};

            temp["field"] = key;
            temp["headerName"] = columnName;
            if (key == 'PIN' || key == 'UPC' || key == 'SALES' || key == 'TTL_STORES' || key == 'SLNG_STORES' || key == 'DIST_PCT' || key == "GAP_VALUE") {
                temp["columnTypes"] = "number";
                if (columnName.indexOf('.') == -1) {
                    if (key == 'DIST_PCT')
                        temp['valueFormatter'] = function(params) { return formatNumber(params.value, 'n1'); }
                    else
                    {
                        if (key == "GAP_VALUE")
                        {
                            temp['valueFormatter'] = function(params) { return formatNumber(params.value, 'n0'); }
                            temp["headerName"] += " (" + this.measureLabel + ")";
                        }
                        else if (key == 'SALES')
                            temp['valueFormatter'] = function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); }
                        else
                            temp['valueFormatter'] = function(params) { return formatNumber(params.value, 'n0'); }

                    }
                    // if (key == 'PIN')
                    //     temp["footerTemplate"] = '<div style="text-align: left;">Total</div>';
                    if (key == 'SALES') {
                        temp["headerName"] += " (" + this.measureLabel + ")";
                    }
                    //  else {
                    //     temp["headerAttributes"] = {"class": "text-left"};
                    //     temp["attributes"] = {"class": "text-left"};
                    // }


                } else {
                    temp['valueFormatter'] = function(params) { return formatNumber(params.value, 'n1'); }
                }
            } else {
                temp["columnTypes"] = "string";
            }

            if (key == 'PIN_PNAME')
                temp["width"] = "22%";

            temp["suppressMenu"] = true;

            // set textwrap field
            this.textWrapField.push(key);

            columnsName.push(temp);
        }

        return columnsName;
    }


    // selling and not selling sku grid 
    setSkuGrid(data, gridName) {
        if (this.skuGridData==undefined) {            
            var options = {
                gridClass: this.bottomGridClass,
                contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH'],
                callbackFooterRow: this.createFooterRowBottomGrid
            };

            this.skuGridData = {columns: this.bottomGridColumn(gridName), data:data, options:options};
            this.skuGridData.dataLoaded = true;
        } else {
            this.skuGridData.gridOptions.api.setColumnDefs(this.bottomGridColumn(gridName));
            this.skuGridData.gridOptions.api.setRowData(data);
            this.skuGridData.gridOptions.api.setPinnedBottomRowData(this.createFooterRowBottomGrid(data));
        }

        return this.skuGridData;
    }

    createFooterRowBottomGrid (data) {

        if(data.length==0)
            return [];

        var SALES = 0;
        var SALES_LW = 0;
        data.forEach(obj =>{
            if (obj['SALES']!=undefined) {
                SALES += parseFloat(obj.SALES);
            }
            if (obj['SALES_LW']!=undefined) {
                SALES_LW += parseFloat(obj.SALES_LW);
            }
        });

        SALES = formatNumber(SALES, 'n'+this.dataDecimalPlaces);
        SALES_LW = formatNumber(SALES_LW, 'n'+this.dataDecimalPlaces);

        var result = [{
            SALES: SALES,
            SALES_LW: SALES_LW
        }];

        return result;
    }

    
    bottomGridColumn(gridName){
        var columnsName = [];
        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID: this.selectedMeasureID});
        this.measureLabel = selectedMeasure[0]['measureName'];
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;

        if (gridName == "notSelling") {
            for( let fieldName in this.notSellingColumn) {
                var columnName = this.notSellingColumn[fieldName];
                var tempCol = {};
                tempCol["field"] = fieldName;
                tempCol["headerName"] = columnName;
                if (fieldName == "SALES_LW" || fieldName == "SALES") {
                    tempCol["columnTypes"] = "number";
                    tempCol['valueFormatter'] = function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); }
                } else {
                    tempCol["columnTypes"] = "string";
                }
                if (fieldName == "SALES_LW") {
                    tempCol["headerName"] += " (" + this.measureLabel + ")";
                }
                if(fieldName == "ValidStore")
                {
                    tempCol['cellRendererSelector'] = function (params) {
                        var value = params.data.ValidStore;
                        if(params.data.ValidStore == "YES"){
                            value = '<div style="background:rgb(252, 88, 88); padding-right:5px; color: white;">'+params.data.ValidStore+'</div>';
                        }
                    };
                }
                tempCol["suppressMenu"] = true; 
                columnsName.push(tempCol);
            }
        }
        else {
            for(let fieldName in this.sellingColumn) {
                var columnName = this.sellingColumn[fieldName];
                var tempCol = {};
                tempCol["field"] = fieldName;
                tempCol["headerName"] = columnName;
                if (fieldName == "SALES_LW" || fieldName == "SALES") {
                    tempCol["columnTypes"] = "number";
                    tempCol['valueFormatter'] = function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); }
                    tempCol["headerName"] += " (" + this.measureLabel + ")";
                } else {
                    tempCol["columnTypes"] = "string";
                }
                if(fieldName == "ValidStore")
                {
                    tempCol['cellRendererSelector'] = function (params) {
                        var value = params.data.ValidStore;
                        if(params.data.ValidStore == "YES"){
                            value = '<div style="background:rgb(252, 88, 88); padding-right:5px; color: white;">'+params.data.ValidStore+'</div>';
                        }
                    };
                }     
                tempCol["suppressMenu"] = true;                   
                columnsName.push(tempCol);
            }
        }
        
        if(this.extrColsNameForBottomGrids != undefined)
        {
            for(let fieldName in this.extrColsNameForBottomGrids) {
                var tempCol = {};
                tempCol["field"] = fieldName;
                tempCol["headerName"] = columnName;
                tempCol["columnTypes"] = "string";
                tempCol["suppressMenu"] = true; 
                columnsName.push(tempCol);
            }
        }
        
        return columnsName;
    }

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        // params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        

        params.push("HidePrivate=" + this.privateLabelStatus);

        params.push("action=" + this.action);
        params.push("timeFrame=" + this.selectedWeek);

        if (this.action == 'getallcomb')
            params.push("randomData=" + GLOBALS.getRandomId());

        this.fieldNames.forEach( (obj, index) => {
            // angular.forEach(obj, function(value, key) {
            for(let key in obj) {
                if (this[key] != null)
                    params.push(key + '=' + encodeURIComponent(this[key]));
            }
        });

        params.push("hideZeroGapStores=" + this.hideZeroGapStores);

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
                
                if (result.gridConfig.enabledFilters.indexOf('hardstop-selection') != -1)
                    this.showHardStopSelection = true;                        
            }
        }

        if (result.FIELD_NAMES != undefined) {
            this.fieldNames = result.FIELD_NAMES;
        }

        if (result.TOP_GRID_COLUMN_NAME != undefined)
        {
            this.topGridColumnName = result.TOP_GRID_COLUMN_NAME;
        }
        if (result.SELLING != undefined)
        {
            this.sellingColumn = result.SELLING;
        }
        if (result.NOTSELLING != undefined)
        {
            this.notSellingColumn = result.NOTSELLING;
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
        this.backupGridData = '';
        
        if(this.topGrid.gridOptions != undefined)
            this.topGrid.gridOptions.api.setRowData([]);

        if(this.skuGridData.gridOptions != undefined)
            this.skuGridData.gridOptions.api.setRowData([]);
    }


}
