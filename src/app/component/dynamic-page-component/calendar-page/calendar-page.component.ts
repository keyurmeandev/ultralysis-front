import { Injector, Component, OnInit, Input, NgModule, OnChanges, SimpleChanges, SimpleChange, ViewChild} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss']
})
export class CalendarPageComponent implements OnInit {

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
    windowHeight:any;
    measurePositionClass:any;
    pageHeight:any;
    isFirstRequest:any;
    showSkuSelection:any;

    calendarGridInnerLoader:any;
    action:any;
    ColumnList:any;
    rowHeightArray:any;
    gridClass:any;
    whiteSpaceProperty:any;
    dataCalendarGrid:any;
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
        this.calendarGridInnerLoader = {"showInnerLoader": false};
        this.calendarGridInnerLoader.customError = '';

        this.action = "reload";

        this.requestPageName = "Calendar";
        this.pageUniqueKey = GLOBALS.pageUniqueId;        
        this.servicePageName = this.pageID + "_CalendarPage";

        
        this.textWrapField = [];
        this.rowHeightArray = {};
        this.whiteSpaceProperty = {spaceProperty:{}};
		this.gridClass = this.pageUniqueKey+'_calendarGrid';
	    this.rowHeightArray[this.gridClass] = [];
	    this.whiteSpaceProperty.spaceProperty[this.gridClass] = "normal";


        GLOBALS.stopPace = false;
        this.extraObjParams = [];

        if(GLOBALS.projectAlias == 'lcl')
            this.fieldSelection = GLOBALS.territoryList;


        this.layoutLoaded = false;

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
        params.push("action=" + this.action); 

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

        this.calendarGridInnerLoader.showInnerLoader = true;
        this.calendarGridInnerLoader.customError = '';
        this.calendarGridInnerLoader.showNoDataFound = false;

        this.extraObj = obj;
        var params = "";

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
	    this.sendRequestToServer(this.action).then((data:any) => {
	        this.renderGrid(this.result);
	    });
	}

	renderGrid (data){
	    if (data.customErrors != undefined) {
	        this.calendarGridInnerLoader.customError = data.customErrors.displayMessage;
	    }

	    if (data.Calender != undefined)
        {
            if(this.dataCalendarGrid==undefined){
	            this.dataCalendarGrid = this.setAgGridObject(data.Calender);
	            this.dataCalendarGrid.dataLoaded = true;
	        }
	        else{
	            this.updateGrid(this.dataCalendarGrid.gridOptions, data.Calender);
	        }
        }
        this.calendarGridInnerLoader.showInnerLoader = false;

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

        for(let key in this.ColumnList){
            var value = this.ColumnList[key];
            var temp = {};
            temp["field"] = key;
            temp["headerName"] = value;
            temp["suppressMenu"] = value;
            // temp["columnTypes"] = "string";

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

	    if (result.ColumnList != undefined)
        {
            this.ColumnList = result.ColumnList;
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
			GLOBALS.layoutSetup({layout: 'ONE_ROW_WITHOUT_TIME_FRAME',pageContainer:"."+this.pageUniqueKey+"_calendarPage"});
		});
    }

    rebuildPageProcess() {
        this.rebuildPageScope = true;
        this.setSelectionData('');
    }

    freePageObjectProcess() {
        if(this.dataCalendarGrid.gridOptions != undefined)
            this.dataCalendarGrid.gridOptions.api.setRowData([]);
    }

}
