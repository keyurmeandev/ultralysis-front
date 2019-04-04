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
  selector: 'app-excel-pos-tracker-page',
  templateUrl: './excel-pos-tracker-page.component.html',
  styleUrls: ['./excel-pos-tracker-page.component.scss']
})
export class ExcelPosTrackerPageComponent implements OnInit {

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
    gkey:any;
    windowHeight:any;
    measurePositionClass:any;
    pageHeight:any;
    isFirstRequest:any;

    excelPosTrackerGridShowLoader:any;
    isShowMeasureSetting:any;
    measurefil:any;
    updateColDef:any;
    showLyData:any;
    gridtimeSelectionUnit:any;
    shoqgd:any;
    measureFilterSettings:any;
	rsdtd:any;
	measureFilterSettingsIds:any;
	gridTitle:any;
	measureDecimalMapping:any;
	groupName:any;
    isShowProductFilter:any;
    showSkuSelection:any;
    showProductMarketSelectionInlineFilter:any;
    productMarketFiltersDispType:any;
    backupResult:any;
    timeSelectionSettings:any;
    dataLoaded:any;
    excelPosTrackerGridId:any;
    poswalmartGrid:any;

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

		this.shoqgd = [];

		GLOBALS.tsdSif = false;

        this.excelPosTrackerGridShowLoader = {showInnerLoader: false};
        this.isShowMeasureSetting = false;
        // this.measurefil = true;
        this.updateColDef = false;
        this.showLyData = true;
        this.gridtimeSelectionUnit = "Week";


        if (GLOBALS.callbackObjPerformance == undefined)
            GLOBALS.callbackObjPerformance = {};

        this.timeSelectionMode = 1;

        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        // this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;

        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_ExcelPosTrackerPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();
        
        
        /* Calling Service */
        var params = new Array();
        this.requestPageName = "ExcelPosTracker";
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

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        this.isFirstRequest = true;

        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });
	}


	changeHidePrivateLabel() {
	    this.setSelectionData('');
	}

    
    // Download full grid
    downloadGrid () {
        this.action = "exportGrid";
        this.setSelectionData('');
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


    setSelectionData(obj)
    {
        GLOBALS.stopGlobalPaceLoader();
        if(this.action == undefined || this.action == ""){
            this.action = "getGridData";
        }
        this.excelPosTrackerGridShowLoader.showInnerLoader = true;
        this.excelPosTrackerGridShowLoader.customError = '';

        this.extraObj = obj;
        // this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

        var params = "";
        if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
            params += '&' + this.timeselectionCall.getTimeSelection();
        if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
            params += '&' + this.timeselectionCall.getTimeSelectionDays();
        // if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            // params += '&' + this.measureselectionCall.getMeasureSelection();
        
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

        if (this.shoqgd && this.action == 'exportGrid'){
            var selmeas = '';
            var name = '';
            this.measureFilterSettings.forEach((value,key) => {
                for( let measureKey in this.rsdtd.arrAliaseMap){
                    if (value == this.rsdtd.arrAliaseMap[measureKey])
                        name = measureKey;
                }
                //If value is false then we need to consider it in the export list 
                if(!this.shoqgd[name]){
                    selmeas += this.measureFilterSettingsIds[value]+'##true'+',';
                }else{
                    selmeas += this.measureFilterSettingsIds[value]+'##false'+',';
                }
            });
            if(selmeas!='') params += '&selMeasures='+selmeas;
            params += '&RandomKey=' + GLOBALS.getRandomId();
        }

        this.getSelectionData(params);
    }



    // GET FILTERING DATA
	getSelectionData (obj)
	{
	    GLOBALS.stopPace = true;
	    this.selectionParams = obj.split('&');
	    this.sendRequestToServer(this.action).then((data:any) => {
	        this.renderGrid(this.result);
	    });
	}

    renderGrid(result) {

        if (result.customErrors != undefined) {
            this.excelPosTrackerGridShowLoader.customError = result.customErrors.displayMessage;
        }

        if (result.timeSelectionUnit != undefined) {
            this.gridtimeSelectionUnit = result.timeSelectionUnit;
        }

        if (result.gridTitle != undefined) {
            this.gridTitle = result.gridTitle;
        }

        if (result.gridList != undefined) {
            this.rsdtd = result;
            this.setGrid(result);
            setTimeout(() => {
                this.excelPosTrackerGridShowLoader.showInnerLoader = false;
                // LAYOUT                
            }, 200);
        }

        if (result.fileName != undefined) {
            this.excelPosTrackerGridShowLoader.showInnerLoader = false;
            window.location.href = result.fileName;
        }
    }

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        params.push("HidePrivate=" + this.privateLabelStatus);
        
        GLOBALS.stopPace = true;

        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
            this.result = result;
        });       
        
        
    }
    

    dataRead (result) {

    	this.setUpLayout(); 

        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
            return ;
        }

        if (result.measureDecimalMapping != undefined)
            this.measureDecimalMapping = result.measureDecimalMapping;

        if (result.groupName != undefined)
            this.groupName = result.groupName;

        if (result.lyShowHide != undefined)
        {
            if(result.lyShowHide == "SHOW")
                this.showLyData = true;
            else
                this.showLyData = false;
        }

        if(!GLOBALS.isShowLyData)
            this.showLyData = false;

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

            if (result[result.pageConfig.leftFirstGridName] != undefined) {
                this.backupResult = result;
            }
        }   

            

        if (result.measureFilterSettings != undefined)
        {
            this.measureFilterSettings = result.measureFilterSettings;
            // made seleted all by default
            this.measureFilterSettings.forEach((value,key)=>{
                this.measurefil[key] = true;
            });
            this.measureFilterSettingsIds = result.measureFilterSettingsIds;
            this.isShowMeasureSetting = true;
        }

        if (result.timeSelectionSettings != undefined)
        {
            this.timeSelectionSettings = result.timeSelectionSettings;
        }

        this.action = '';
        this.dataLoaded = true;
        if (this.isFirstRequest) {
            this.excelPosTrackerGridShowLoader.showInnerLoader = true;
            setTimeout(() => {
                this.sendPodsRequest();
            }, 100);
        }

    }


    sendPodsRequest () { 
        this.action = 'getGridData';
        this.isFirstRequest = false;
        this.setSelectionData('');
    }


    setAgGridObject (data) {
        this.excelPosTrackerGridId = this.pageUniqueKey+'GridId';
        var options = {
            agGridId: this.excelPosTrackerGridId,
            agGridClass: 'gridWithoutHoverEffect',
            callbackGetRowStyle: this.setRowStyle,
            // domLayout: 'autoHeight',
            // fixHeight:'500px',
            callbackOnRowDataChanged: this.setGridWidth,
            myContextMenuItems: [{
                name:'EXPORT_EXCEL', 
                text:'Export to Excel', 
                callback: () => {
                    this.downloadGrid()
                }
            }],
            contextMenuItems: ['EXPORT_EXCEL'],
            callbackOnGridReady: (params:any) => {
                this.gridReady(params);
            },
        };
        return {columns:this.getAgGridColumns(data), data:data.gridList, options:options};
    }

    setRowStyle(params){
        if (params.data.colorCode != undefined && params.data.colorCode != '' && params.data.isCategory == 1){
            return { background: params.data.colorCode };
        }
        return;
    }

    setGridWidth (params){
        /*var measurePart = $( ".measureCheckbox:checked" ).length;;
        var gridContainer = $('.'+this.pageUniqueKey+'_excelPosTrackerGrid');
        if(measurePart>1){
            var gridWidth = (measurePart * ($('body').innerWidth()-200) )+'px';
            gridContainer.css({'display':'inline-block','width':gridWidth});
            params.api.doLayout();
        }else{
            gridContainer.css({'width':'100%'});
            params.api.doLayout();
        }*/
    }

    updateGrid (gridOptions, data) {
        if(this.updateColDef)
            gridOptions.api.setColumnDefs(this.getAgGridColumns(data));
            
        this.updateColDef = false;
        gridOptions.api.setRowData(data.gridList);

        this.gridReady(gridOptions);

        $(".ag-body-viewport").scroll(()=>{
            this.gridReady(this.poswalmartGrid.gridOptions);
        });
    }

    gridReady (params)
    {
        var allColumnIds = [];
        params.columnApi.getAllColumns().forEach(function(column) {
            allColumnIds.push(column.colId);
        });
        params.columnApi.autoSizeColumns(allColumnIds);
        params.api.deselectAll();
        // params.api.doLayout();
    }

    
    getAgGridColumns (data) {

        var gridData = data.gridList;
        var gridListAliase = data.gridListAliase;
        var arrAliaseMap = data.arrAliaseMap;
        //var totalData = data.totalData;

        var columnsName = [];
        columnsName.push({
            headerName: this.gridTitle,
            headerClass: ['headerBgTop'],
            children: [
                {
                    field: "ACCOUNT",
                    headerName: " ",
                    columnTypes: "number",
                    minWidth: 150,
                    // suppressSizeToFit: true,
                    cellStyle: function(params) {
                        if(params.data.isTotalRow==1){
                            return {background:'orange', textAlign: 'center'};
                        }else{
                            return {textAlign: 'center'};
                        }
                    },                            
                    suppressMenu: true
                }
            ]
        });
        

        // console.log(gridListAliase);
        // gridListAliase.forEach((value, key) => {
        for(let key in gridListAliase){
        	var value = gridListAliase[key];


            var decimalPlace = 0;
            if(this.measureDecimalMapping != undefined && this.measureDecimalMapping[key] != undefined)
                decimalPlace = this.measureDecimalMapping[key];
            
            var colorcd = value;
            value = key;
            if(this.shoqgd[value]){
            }else{
                this.shoqgd[value] =  false;
            }

            // start color set
            var css_id = "CustomCss"+value;
            var elem = document.getElementById(css_id);
            if( elem!=undefined && elem!=null )
            elem.parentNode.removeChild(elem);

            var styleNode = document.createElement('style');
            styleNode.type = "text/css";
            styleNode.id = css_id;
            // if (!!(window['attachEvent'] && !window['opera'])) {
            //     styleNode.styleSheet.cssText = '.headerBg'+value+'0{background:'+colorcd[0]+';text-align:center;}.headerBg'+value+'1{background:'+colorcd[1]+';text-align:center;}.headerBg'+value+'2{background:'+colorcd[2]+';text-align:center;}';
            // } else {
                var styleText = document.createTextNode('.headerBg'+value+'0{background:'+colorcd[0]+';text-align:center;}.headerBg'+value+'1{background:'+colorcd[1]+';text-align:center;}.headerBg'+value+'2{background:'+colorcd[2]+';text-align:center;}');
                styleNode.appendChild(styleText);
            // }
            document.getElementsByTagName('head')[0].appendChild(styleNode);
            // end color set

            var colsTmp = [];
            colsTmp.push(
                {
                    headerName: "Last "+this.gridtimeSelectionUnit,
                    headerClass: ['headerBg'+value+'1'],
                    children: [
                        {
                            field: "LW_TY_"+value,
                            headerName: "TY",
                            columnTypes: "number",
                            minWidth: 60,
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW_LY_"+value,
                            headerName: "LY",
                            columnTypes: "number",
                            minWidth: 60,
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW_VARP_"+value,
                            headerName: "%",
                            columnTypes: "number",
                            minWidth: 60,
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW_VARP_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n1') +'% </span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }, {
                            field: "LW_VAR_"+value,
                            headerName: GLOBALS.currencySign+" - DIFF",
                            columnTypes: "number",
                            minWidth: 60,
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW_VAR_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n'+decimalPlace) +'</span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }
                    ]
                }
            );

            
            if(this.gridtimeSelectionUnit == 'Month'){
                //Month
                colsTmp.push({
                    headerName: "Last 3 "+this.gridtimeSelectionUnit+"s",
                    headerClass: ['headerBg'+value+'2'],
                    children: [
                        {
                            field: "LW3_TY_"+value,
                            headerName: "TY",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'2'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[2], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW3_LY_"+value,
                            columnsName: "LY",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'2'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[2], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW3_VARP_"+value,
                            headerName: "%",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'2'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[2], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW3_VARP_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n1')+'% </span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }, {
                            field: "LW3_VAR_"+value,
                            headerName: GLOBALS.currencySign+" - DIFF",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'2'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[2], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW3_VAR_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }
                    ]
                });
                //12 Month
                colsTmp.push({
                    headerName: "Last 12 "+this.gridtimeSelectionUnit+"s",
                    headerClass: ['headerBg'+value+'1'],
                    children: [
                        {
                            field: "LW12_TY_"+value,
                            headerName: "TY",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW12_LY_"+value,
                            headerName: "LY",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true,
                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                            valueFormatter: (params:any) => { 
					        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
					        }
                        }, {
                            field: "LW12_VARP_"+value,
                            headerName: "%",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW12_VARP_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n1')+'%</span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }, {
                            field: "LW12_VAR_"+value,
                            headerName: GLOBALS.currencySign+" - DIFF",
                            minWidth: 60,
                            columnTypes: "number",
                            headerClass: ['headerBg'+value+'1'],
                            cellStyle: function(params) {
                                if(params.data.isTotalRow==1){
                                    return {background:colorcd[1], textAlign: 'center'};
                                }else{
                                    return {textAlign: 'center'};
                                }
                            },
                            cellRenderer: function(params) {
                                var className = '';
                                if (params.data['LW12_VAR_'+value] < 0){
                                    className = 'cellTextRedColor';
                                }
                                return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                            },
                            hide : this.shoqgd[value] || !this.showLyData,
                            suppressMenu: true
                        }
                    ]
                });
            }else{
            //4 Week
            colsTmp.push({
                            headerName: "Last 4 "+this.gridtimeSelectionUnit+"s",
                            headerClass: ['headerBg'+value+'2'],
                            children: [
                                {
                                    field: "LW4_TY_"+value,
                                    headerName: "TY",
                                    minWidth: 60,
                                    columnTypes: "number",
                                    headerClass: ['headerBg'+value+'2'],
                                    cellStyle: function(params) {
                                        if(params.data.isTotalRow==1){
                                            return {background:colorcd[2], textAlign: 'center'};
                                        }else{
                                            return {textAlign: 'center'};
                                        }
                                    },
                                    hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                                    suppressMenu: true,
                                    // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                    valueFormatter: (params:any) => { 
							        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
							        }
                                }, {
                                    field: "LW4_LY_"+value,
                                    headerName: "LY",
                                    minWidth: 60,
                                    // suppressSizeToFit: true,
                                    columnTypes: "number",
                                    headerClass: ['headerBg'+value+'2'],
                                    cellStyle: function(params) {
                                        if(params.data.isTotalRow==1){
                                            return {background:colorcd[2], textAlign: 'center'};
                                        }else{
                                            return {textAlign: 'center'};
                                        }
                                    },
                                    hide : this.shoqgd[value] || !this.showLyData,
                                    suppressMenu: true,
                                    // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                    valueFormatter: (params:any) => { 
							        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
							        }
                                }, {
                                    field: "LW4_VARP_"+value,
                                    headerName: "%",
                                    minWidth: 60,
                                    columnTypes: "number",
                                    headerClass: ['headerBg'+value+'2'],
                                    cellStyle: function(params) {
                                        if(params.data.isTotalRow==1){
                                            return {background:colorcd[2], textAlign: 'center'};
                                        }else{
                                            return {textAlign: 'center'};
                                        }
                                    },
                                    cellRenderer: function(params) {
                                        var className = '';
                                        if (params.data['LW4_VARP_'+value] < 0){
                                            className = 'cellTextRedColor';
                                        }
                                        return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n1')+'%</span>';
                                    },
                                    hide : this.shoqgd[value] || !this.showLyData,
                                    suppressMenu: true
                                }, {
                                    field: "LW4_VAR_"+value,
                                    headerName: GLOBALS.currencySign+" - DIFF",
                                    columnTypes: "number",
                                    minWidth: 60,
                                    headerClass: ['headerBg'+value+'2'],
                                    cellStyle: function(params) {
                                        if(params.data.isTotalRow==1){
                                            return {background:colorcd[2], textAlign: 'center'};
                                        }else{
                                            return {textAlign: 'center'};
                                        }
                                    },
                                    cellRenderer: function(params) {
                                        var className = '';
                                        if (params.data['LW4_VAR_'+value] < 0){
                                            className = 'cellTextRedColor';
                                        }
                                        return '<span class="'+className+'">'+ formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                                    },
                                    hide : this.shoqgd[value] || !this.showLyData,
                                    suppressMenu: true
                                }
                            ]
                        });
                    //13 Week
                    colsTmp.push({
                                    headerName: "Last 13 "+this.gridtimeSelectionUnit+"s",
                                    headerClass: ['headerBg'+value+'1'],
                                    children: [
                                        {
                                            field: "LW13_TY_"+value,
                                            headerName: "TY",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'1'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[1], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                                            suppressMenu: true,
                                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                            valueFormatter: (params:any) => { 
									        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
									        }
                                        }, {
                                            field: "LW13_LY_"+value,
                                            headerName: "LY",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'1'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[1], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true,
                                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                            valueFormatter: (params:any) => { 
									        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
									        }
                                        }, {
                                            field: "LW13_VARP_"+value,
                                            headerName: "%",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'1'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[1], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            cellRenderer: function(params) {
                                                var className = '';
                                                if (params.data['LW13_VARP_'+value] < 0){
                                                    className = 'cellTextRedColor';
                                                }
                                                return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n1')+'%</span>';
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true
                                        }, {
                                            field: "LW13_VAR_"+value,
                                            headerName: GLOBALS.currencySign+" - DIFF",
                                            columnTypes: "number",
                                            minWidth: 60,
                                            headerClass: ['headerBg'+value+'1'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[1], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            cellRenderer: function(params) {
                                                var className = '';
                                                if (params.data['LW13_VAR_'+value] < 0){
                                                    className = 'cellTextRedColor';
                                                }
                                                return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true
                                        }
                                    ]
                                });
                    //52 Week
                    colsTmp.push({
                                    headerName: "Last 52 "+this.gridtimeSelectionUnit+"s",
                                    headerClass: ['headerBg'+value+'2'],
                                    children: [
                                        {
                                            field: "LW52_TY_"+value,
                                            headerName: "TY",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'2'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[2], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                                            suppressMenu: true,
                                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                            valueFormatter: (params:any) => { 
									        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
									        }
                                        }, {
                                            field: "LW52_LY_"+value,
                                            headerName: "LY",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'2'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[2], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true,
                                            // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                            valueFormatter: (params:any) => { 
									        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
									        }
                                        }, {
                                            field: "LW52_VARP_"+value,
                                            headerName: "%",
                                            minWidth: 60,
                                            columnTypes: "number",
                                            headerClass: ['headerBg'+value+'2'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[2], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            cellRenderer: function(params) {
                                                var className = '';
                                                if (params.data['LW52_VARP_'+value] < 0){
                                                    className = 'cellTextRedColor';
                                                }
                                                return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n1')+'%</span>';
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true
                                        }, {
                                            field: "LW52_VAR_"+value,
                                            headerName: GLOBALS.currencySign+" - DIFF",
                                            columnTypes: "number",
                                            minWidth: 60,
                                            headerClass: ['headerBg'+value+'2'],
                                            cellStyle: function(params) {
                                                if(params.data.isTotalRow==1){
                                                    return {background:colorcd[2], textAlign: 'center'};
                                                }else{
                                                    return {textAlign: 'center'};
                                                }
                                            },
                                            cellRenderer: function(params) {
                                                var className = '';
                                                if (params.data['LW52_VAR_'+value] < 0){
                                                    className = 'cellTextRedColor';
                                                }
                                                return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                                            },
                                            hide : this.shoqgd[value] || !this.showLyData,
                                            suppressMenu: true
                                        }
                                    ]
                                });
                 }
                    colsTmp.push({
                                headerName: this.groupName+" YTD",
                                headerClass: ['headerBg'+value+'1'],
                                children: [
                                    {
                                        field: "YTD_TY_"+value,
                                        headerName: "TY",
                                        columnTypes: "number",
                                        minWidth: 60,
                                        headerClass: ['headerBg'+value+'1'],
                                        cellStyle: function(params) {
                                            if(params.data.isTotalRow==1){
                                                return {background:colorcd[1], textAlign: 'center'};
                                            }else{
                                                return {textAlign: 'center'};
                                            }
                                        },
                                        hide : this.shoqgd[value] || !GLOBALS.isShowTyData,
                                        suppressMenu: true,
                                        // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                        valueFormatter: (params:any) => { 
								        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
								        }
                                    }, {
                                        field: "YTD_LY_"+value,
                                        headerName: "LY",
                                        columnTypes: "number",
                                        minWidth: 60,
                                        headerClass: ['headerBg'+value+'1'],
                                        cellStyle: function(params) {
                                            if(params.data.isTotalRow==1){
                                                return {background:colorcd[1], textAlign: 'center'};
                                            }else{
                                                return {textAlign: 'center'};
                                            }
                                        },
                                        hide : this.shoqgd[value] || !this.showLyData,
                                        suppressMenu: true,
                                        // valueFormatter: function(params) { return $filter('number')(params.value, decimalPlace); },
                                        valueFormatter: (params:any) => { 
								        	return formatNumber(Number(params.value), 'n'+decimalPlace); 
								        }
                                    }, {
                                        field: "YTD_VARP_"+value,
                                        headerName: "%",
                                        columnTypes: "number",
                                        minWidth: 60,
                                        headerClass: ['headerBg'+value+'1'],
                                        cellStyle: function(params) {
                                            if(params.data.isTotalRow==1){
                                                return {background:colorcd[1], textAlign: 'center'};
                                            }else{
                                                return {textAlign: 'center'};
                                            }
                                        },
                                        cellRenderer: function(params) {
                                            var className = '';
                                            if (params.data['YTD_VARP_'+value] < 0){
                                                className = 'cellTextRedColor';
                                            }
                                            return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n1')+'%</span>';
                                        },
                                        hide : this.shoqgd[value] || !this.showLyData,
                                        suppressMenu: true
                                    }, {
                                        field: "YTD_VAR_"+value,
                                        headerName: GLOBALS.currencySign+" - DIFF",
                                        columnTypes: "number",
                                        minWidth: 60,
                                        headerClass: ['headerBg'+value+'1'],
                                        cellStyle: function(params) {
                                            if(params.data.isTotalRow==1){
                                                return {background:colorcd[1], textAlign: 'center'};
                                            }else{
                                                return {textAlign: 'center'};
                                            }
                                        },
                                        cellRenderer: function(params) {
                                            var className = '';
                                            if (params.data['YTD_VAR_'+value] < 0){
                                                className = 'cellTextRedColor';
                                            }
                                            return '<span class="'+className+'">'+formatNumber(Number(params.value), 'n'+decimalPlace)+'</span>';
                                        },
                                        hide : this.shoqgd[value] || !this.showLyData,
                                        suppressMenu: true
                                    }
                                ]
                        });

            

            columnsName[0].children.push(
                {
                    headerName: arrAliaseMap[value],
                    headerClass: ['headerBg'+value+'0'],
                    children: colsTmp
                }
            );

        }                             
        
        return columnsName;
    }


    setGrid(data){
        if(this.poswalmartGrid==undefined){
            this.poswalmartGrid = this.setAgGridObject(data);
            this.poswalmartGrid.dataLoaded = true;
        }
        else{
            this.updateGrid(this.poswalmartGrid.gridOptions, data);
        }
    }


    changeHideGridColumns(name,value) {
        this.updateColDef = true;
        for(let measureKey in this.rsdtd.arrAliaseMap){
            if (this.rsdtd.arrAliaseMap[measureKey] == name)
                name = measureKey;
        }

        if(value){
            this.shoqgd[name] = false;
        }else{
            this.shoqgd[name] = true;
        }
        this.excelPosTrackerGridShowLoader.showInnerLoader = true;
        this.setGrid(this.rsdtd);
        this.excelPosTrackerGridShowLoader.showInnerLoader = false;
        
        var n = $( ".measureCheckbox:checked" ).length;
        if(n == 1)
            $(".measureCheckbox:checked").attr("disabled", true);
        else
            $(".measureCheckbox:checked").removeAttr("disabled");
    }

    setUpLayout() {
        setTimeout(()=>{            	    	
			GLOBALS.layoutSetup({layout: 'ONE_ROW', pageContainer: "."+this.pageUniqueKey+"_ExcelPosTrackerPage"}); 
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
        delete this.gridTitle;
        delete this.rsdtd;
        if(this.poswalmartGrid.gridOptions != undefined)
            this.poswalmartGrid.gridOptions.api.setRowData([]);
    }

}
