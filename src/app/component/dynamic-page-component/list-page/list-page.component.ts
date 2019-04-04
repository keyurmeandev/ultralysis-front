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
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements OnInit {

	// @Input() options;

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
    showSkuSelection:any;

    selectedWeek:any;
    listPageGridInnerLoader:any;
    showStoreCount:any;
    storeCount:any;
    showProductMarketSelectionInlineFilter:any;
    isShowProductFilter:any;
    productMarketFiltersDispType:any;
    tableName:any;
    gridSetup:any;
    rowHeightArray:any;
    gridClass:any;
    whiteSpaceProperty:any;
    skuFileGrid:any;
    dataLoaded:any;
    textWrapField:any;

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

		 // Setting awaiting message and initial variables
        this.isDefaultSelectedWeek = true;
        GLOBALS.tsdSif = false;
        this.listPageGridInnerLoader = {"showInnerLoader": false};
        this.listPageGridInnerLoader.customError = '';
        this.listPageGridInnerLoader.showNoDataFound = false;
        this.showStoreCount = false;
        this.storeCount = 0;
        this.selectedWeek = 12;

        this.requestPageName = "ListPage";
        this.pageUniqueKey = GLOBALS.pageUniqueId;        
        this.servicePageName = this.pageID + "_ListPage";

        
        this.textWrapField = [];
        this.rowHeightArray = {};
        this.whiteSpaceProperty = {spaceProperty:{}};
		this.gridClass = this.pageUniqueKey+'_listPageGrid';
	    this.rowHeightArray[this.gridClass] = [];
	    this.whiteSpaceProperty.spaceProperty[this.gridClass] = "normal";


        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;

        // this.measuresOptiondata = this.measureselectionCall.measuresOptiondata;

        this.layoutLoaded = false;

        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();
        
        
        /* Calling Service */
        var params = new Array();        
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

        this.listPageGridInnerLoader.showInnerLoader = true;
        this.listPageGridInnerLoader.customError = '';
        this.listPageGridInnerLoader.showNoDataFound = false;

        this.extraObj = obj;
        // this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

        var params = "";
        //if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
         //   params += '&' + this.timeselectionCall.getTimeSelection();
        //if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
        //    params += '&' + this.timeselectionCall.getTimeSelectionDays();
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
	getSelectionData (obj)
	{
	    GLOBALS.stopPace = true;
	    this.selectionParams = obj.split('&');
	    this.sendRequestToServer("").then((data:any) => {
	        this.renderGrid(this.result);
	    });
	}

	renderGrid (data){
	    if (data.customErrors != undefined) {
	        this.listPageGridInnerLoader.customError = data.customErrors.displayMessage;
	    }

	    if (data.sku != undefined)
	    {
	        if(data.sku.length>0){
	            if(this.skuFileGrid==undefined){
		            this.skuFileGrid = this.setAgGridObject(data.sku);
		            this.skuFileGrid.dataLoaded = true;
		        }
		        else{
		            this.updateGrid(this.skuFileGrid.gridOptions, data.sku);
		        }


	            if(this.tableName != undefined && this.tableName == 'Store'){
	                this.storeCount    = data.sku.length;
	                this.showStoreCount = true;
	            }
	        }
	        else
	            this.listPageGridInnerLoader.showNoDataFound = true;
	    }
	    this.listPageGridInnerLoader.showInnerLoader = false;

	}


    setAgGridObject (data) {    
        
        var options = {
            gridClass: this.gridClass,
            whiteSpaceProperty: this.whiteSpaceProperty.spaceProperty,
            textWrap: {field:this.textWrapField, currentRowHeight:this.rowHeightArray},
            contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
        };

        return {columns:this.getAgGridColumns(), data:data, options:options};
    }

    updateGrid (gridOptions, data){

        gridOptions.api.setColumnDefs(this.getAgGridColumns());

        setTimeout(() => {
            gridOptions.api.setRowData(data);
            gridOptions.api.doLayout();
        }, 100);
        
        gridOptions.api.sizeColumnsToFit();
    }

    getAgGridColumns() {
        this.textWrapField = [];
        var columnsName = [];
        for(let key in this.gridSetup){
            var value = this.gridSetup[key];
            var temp = {};
            temp["field"] = key;
            temp["headerName"] = value;
            temp["suppressMenu"] = value;
            if (key == 'PIN' || key == 'PIN_ROLLUP' || key == 'AGG_INT'){
                temp["columnTypes"] = "number";
            }else{
                temp["columnTypes"] = "string";
            }

            // set textwrap field
            this.textWrapField.push(key);

            columnsName.push(temp);
        }                    
        return columnsName;
    }


	sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        params.push("HidePrivate=" + this.privateLabelStatus);
        
        GLOBALS.stopPace = true;
        if(this.showTimeSelection != undefined && this.showTimeSelection == true)
	        params.push("timeFrame=" + this.selectedWeek);

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
        } 


		
	    if(result.tableName != undefined)
	        this.tableName = result.tableName;
	    
		if(result.GRID_SETUP != undefined){
	        this.gridSetup = result.GRID_SETUP;
	    }
	    
	    //read sku file data and call draw grid method
	    if (this.isFirstRequest) {
	        setTimeout(() => {
	            this.sendPodRequest();
	        }, 100);
	    }

	    this.dataLoaded = true;
	}


	sendPodRequest() {
	    this.isFirstRequest = false;
	    this.setSelectionData('');
	}	
	

	setUpLayout() {
        setTimeout(()=>{            	    	
			GLOBALS.layoutSetup({layout: 'ONE_ROW_WITHOUT_TIME_FRAME',pageContainer:"."+this.pageUniqueKey+"_ListPage"});    
		});
    }

    rebuildPageProcess() {
        this.rebuildPageScope = true;
        this.setSelectionData('');
    }

    freePageObjectProcess() {
        if(this.skuFileGrid.gridOptions != undefined)
            this.skuFileGrid.gridOptions.api.setRowData([]);
    }

}
