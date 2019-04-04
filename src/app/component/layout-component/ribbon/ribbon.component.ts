import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter  } from '@angular/core';
import { SendRequestService } from '../../../services/send-request.service';
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { CookieService } from 'ngx-cookie-service';

import * as $ from 'jquery';

@Component({
	selector: 'ribbon',
	templateUrl: './ribbon.component.html',
	styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent implements OnInit {

	@Input() ribbonData;

	@Output() reloadEvent = new EventEmitter();

	paramsCart:any;
	reloaded:any;
	forceStopChange:any;
	hasError:any;
	errorMsg:any;
	hasSaved:any;
	succMsg:any;
	selectedGlobalFilter:any;
	breadcrumbs:any;
	currentBreadcrumb:any;
	hasGlobalFilter:any;
	projectName:any;
	globalFilterData:any;
	selectedFilter:any;
	delete_filter_name:any;
	delete_filter_id:any;
	nameChanged:any;
	nameChangeSuccMsg:any;
	edit_filter_name:any;
	nameChangeHasError:any;
	filterNameChangeError:any;
	edit_filter_id:any;
	reportType:any;
	fiiler_id:any;
	filter_name:any;
	marketSelectionTabs:any;
	selectedMarketText:any;
	productSelectionTabs:any;
	selectedProductText:any;
	saveFilterData:any;
	requestPageName:any;
	pageName:any;
	menuName:any;
	opened:any;
	fetchProductAndMarketFilterOnTabClick:any;

	constructor(private _sendRequestService: SendRequestService, private _helperService: HelperService, private cookieService: CookieService) { }

	ngOnInit() {
		this.requestPageName = "ReloadWithFilters";
	    var params = new Array();
		this.paramsCart = GLOBALS.paramsCookie;
		this.reloaded = false;
		this.forceStopChange = false;
		this.projectName = "Arla LCL Html Dev";
		this.breadcrumbs = [];
		this.hasGlobalFilter = true;
		this.selectedGlobalFilter = GLOBALS.selectedGlobalFilter;
		this.globalFilterData = GLOBALS.globalFilterData;
		//console.log(GLOBALS.globalFilterData[0].data);
		/*let tmp = "<ul><li>123</li></ul>";
    	this.liElement.nativeElement.insertAdjacentHTML('beforeend',tmp);*/
    	this.opened = false;
    	this.fetchProductAndMarketFilterOnTabClick = GLOBALS.fetchProductAndMarketFilterOnTabClick;
	}

    /*$scope.$on('reloadwithfilters', function(events, args) {
        GLOBALS.callAsDefaultService({pageName: events.name, successCallBack: this.dataRead, params: params, servicesName: reloadwithfilters});
    });*/

    ngDoCheck() {
		if(this.ribbonData != undefined) {
			this.pageName = this.ribbonData.pageName;
			this.menuName = this.ribbonData.menuName;
		}
	}

	reloadPage() {
		console.log(GLOBALS.activePage);
		/*if (GLOBALS.activePage.templateSlug != '') {
            var tmpReBuildPageName = 'reBuildPageScope_' + GLOBALS.activePage.pageID + '_' + GLOBALS.activePage.templateSlug;
        } else if(GLOBALS.activePage.pageName != '') {
            var tmpReBuildPageName = 'reBuildPageScope_' + GLOBALS.activePage.pageName;
        }
		this.reloadEvent.emit(tmpReBuildPageName);*/
	}

	getFilters() {
		this.hasError = false;
		this.errorMsg = '';			
		this.hasSaved = false;
		this.succMsg = '';
		if(this.reloaded == false)
		{
			GLOBALS.startWaiting();
			var params = new Array();
			params.push("destination=ReloadWithFilters");
			params.push("ValueVolume=1");
			if (GLOBALS.default_load_pageID)
				params.push("pageID=" + GLOBALS.default_load_pageID);
			else
				params.push("pageName=EXE_SUMMARY_PAGE");

			params.push("commonFilterPage=true");
		
			this._sendRequestService.filterChange(params,'','').then((data: any) => {
			//sendRequestService.filterChange(params).then(function(result) {
				console.log(data);
				if (data.filter_list != undefined)
					GLOBALS.savedFilters = data.filter_list;
					
				if (data.filters != undefined)
					GLOBALS.filtersGrid = GLOBALS.filtersGridModule(data);				
				
				// Product selection's data
				if (data.productSelectionTabs != undefined)
					GLOBALS.CMN_FILTER_productSelectionTabs = data.productSelectionTabs;

				// Market selection's data
				if (data.marketSelectionTabs != undefined)
					GLOBALS.CMN_FILTER_marketSelectionTabs = data.marketSelectionTabs;
			
				this.reloaded = true;
				GLOBALS.endWaiting();
			});
		}
	}
	
	applyFilter() {
		var entityGrid = $("#filters-list").data("kendoGrid");
		var selectedItem = entityGrid.dataItem(entityGrid.select());
		if(selectedItem != null)
		{
			this.selectedFilter = selectedItem.filterId;
			if(this.selectedFilter != undefined || this.selectedFilter != '')
				this.forceStopChange = true;
		}
		
		if(this.forceStopChange == true) {
			/*return this._sendRequestService.filterChange(reqparams,'','').then((data: any) => {
            	this.sendFirstPodsRequest = true;
            	this.dataRead(data);
        	});*/
			this.sendRequestToServer("applyFilter").then((data: any) => { this.dataRead(data); });
		}
	}

	changeGlobalFilter() {
        var cookieName = "global_"+GLOBALS.globalFilterJsonKey+"_"+GLOBALS.projectID;
        if (confirm("Changing the filter requires us to reload Ultralysis. Are you sure  you want to reload?")) {
        	GLOBALS.selectedGlobalFilter = this.selectedGlobalFilter;
            var selectedGlobalFilter = (GLOBALS.selectedGlobalFilter != undefined) ? GLOBALS.selectedGlobalFilter : "ALL";
            this.cookieService.set(cookieName, selectedGlobalFilter);
            window.location.reload();
        } else {
        	setTimeout(()=>{
                if(this.cookieService.get(cookieName) != undefined){
                    GLOBALS.selectedGlobalFilter = this.cookieService.get(cookieName);
                } else {
                	console.log(GLOBALS.globalFilterData[0]);
                    GLOBALS.selectedGlobalFilter = GLOBALS.globalFilterData[0].data;
                }
                this.selectedGlobalFilter = GLOBALS.selectedGlobalFilter;
            });
        }
    }
	
	
	
	removeFilterForm (filterId, filterName) {	
		$("#filters-list").data("kendoGrid").clearSelection();
		this.forceStopChange = false;
		this.selectedFilter = '';
		this.delete_filter_name = filterName;
		this.delete_filter_id = filterId;
		$('#filter-delete-panel').modal('show');
	};			
	
	cancelDeleteFilter() {
		this.nameChanged = false;
		this.nameChangeSuccMsg = '';
		$('#report-list-panel').modal('show');
		$('#filter-delete-panel').modal('hide');
	};			
	
	removeFilter() {
		this.sendRequestToServer("deleteFilter").then((data: any) => { this.dataRead(data); });
	}					
	
	editFilterNameForm(filterId, filterName) {
		$("#filters-list").data("kendoGrid").clearSelection();
		this.forceStopChange = false;
		this.selectedFilter = '';
		this.edit_filter_name = filterName;
		this.edit_filter_id = filterId;
		$('#report-edit-form-panel').modal('show');
	}			
	
	cancelEditFilter() {
		this.nameChangeHasError = false;
		this.filterNameChangeError = '';
		this.nameChanged = false;
		this.nameChangeSuccMsg = '';
		
		$('#report-edit-form-panel').modal('hide');
	}						
	
	editFilterName() {
		this.sendRequestToServer("editFilter").then((data: any) => { this.dataRead(data); });
	}					
	
    pushAndPopAllItems(dataList, pushArr) {
		if(dataList.length > 0)
		{
			for (var i = dataList.length-1; i >= 0; i--) {
				pushArr.push(dataList[i]);
				dataList.splice(i, 1);
			}
			pushArr.reverse();
		}
    }
	
    saveUserSelection() {
		this.hasError = false;
		this.errorMsg = '';			
		this.hasSaved = false;
		this.succMsg = '';
		this.reportType = '';
		this.fiiler_id = 0;
		this.filter_name = '';
        $('#save-filter-name-panel').modal('show');
    };				
	
    changeReportType() {
        if (this.reportType == 1) {
            $('#fiiler_id').attr('required', 'required');
            $('#filter_name').removeAttr('required');
        }
        else if (this.reportType == 2) {
            $('#filter_name').attr('required', 'required');
            $('#fiiler_id').removeAttr('required');
        }
    }
	
    
    changeHidePrivateLabel() {
        this.setSelectionData('');
    }
    
    
    callFilterChange() {
        this.setSelectionData('');
    }

	setSelectedLabel() {
		this.setMarketSelectedLabel();
		this.setProductSelectedLabel();
	}
	
	// TO SET SELECTED MARKET LABEL TEXT
	setMarketSelectedLabel() {
		this.marketSelectionTabs = this._helperService.clone(GLOBALS.CMN_FILTER_marketSelectionTabs);
		var labelText = GLOBALS.makeLabelText(this.marketSelectionTabs);	    
		if(labelText==''){
			this.selectedMarketText = 'All';    
		}
		else{
			this.selectedMarketText = labelText;    
		}            
	}
	
	// TO GET PRODUCT SELECTION DATA
	getProductSelection() {
		var params=GLOBALS.makeFilteredValue(this.productSelectionTabs);
		return params;
	}			
	
	getMarketSelection() {
		var params=GLOBALS.makeFilteredValue(this.marketSelectionTabs);
		return params;
	}
	
	// TO SET SELECTED PRODUCT LABEL TEXT
	setProductSelectedLabel() {
		this.productSelectionTabs = this._helperService.clone(GLOBALS.CMN_FILTER_productSelectionTabs);
		var labelText = GLOBALS.makeLabelText(this.productSelectionTabs);	    
		if(labelText==''){
			this.selectedProductText = 'All';    
		}
		else{
			this.selectedProductText = labelText;
		}
	}
	
    setSelectionData(todo) {
        var params = "";
        if (typeof this.getProductSelection == 'function')
            params += '&' + this.getProductSelection();
        if (typeof this.getMarketSelection == 'function')
            params += '&' + this.getMarketSelection();
        params = params.substring(1, params.length);
        
        var encodeParams = [];
        var paramParts = params.split('&');

        paramParts.forEach((value : any, key: any) => {
            var temp = [];
            temp = value.split('=');
            var tempValue = temp[1];
            if (tempValue == undefined || tempValue == "") {
                // nothing to do
            } else {
                tempValue = tempValue.replace("AND_SIGN", "&");
            }
            encodeParams.push(temp[0].replace("FS[", "ADV_FS[") + "=" + tempValue);
        });

        //angular.forEach(paramParts, function(value, key) {
        //    var temp = [];
        //    temp = value.split('=');
        //    encodeParams.push(temp[0].replace("FS[", "ADV_FS[") + "=" + temp[1]);
        //});

        var encodeParam = encodeParams.join('&');

        /*console.log(params);
        console.log(encodeParam);*/

		if(todo == "apply")
		{
			GLOBALS.startWaiting();
			this.cookieService.set('params',encodeParam);
			location.reload();
		}
		else
		{
			this.saveFilterData = params.split('&');
		}
    }

	dataDownload() {
		this.sendRequestToServer("saveFilter").then((data: any) => { this.dataRead(data); });
	}
	
    
    sendRequestToServer(action) {
        GLOBALS.startWaiting();
		var params = [];
		params.push("destination=" + this.requestPageName);
		params.push("action=" + action);

		if (GLOBALS.default_load_pageID)
			params.push("pageID=" + GLOBALS.default_load_pageID);
		else
			params.push("pageName=EXE_SUMMARY_PAGE");

		if(action == "saveFilter")
		{
			params.push("DataHelper=false");
            if (this.reportType == 1)
                params.push("saved_filter_id=" + this.fiiler_id);
            else if (this.reportType == 2)
                params.push("saved_filter_name=" + this.filter_name);
				
			var selection = this.saveFilterData;

			for (var i = 0; i < selection.length; i++) {
				params.push(selection[i]);
			}
			
		}
		else if(action == "editFilter")
		{
			params.push("edit_filter_id=" + this.edit_filter_id);
			params.push("edit_filter_name=" + this.edit_filter_name);
		}
		else if(action == "deleteFilter")
		{
			params.push("delete_filter_id=" + this.delete_filter_id);
		}
		else if(action == "applyFilter")
		{
			params.push("filterId=" + this.selectedFilter);
			params.push("commonFilterPage=true");
		}
		
		return this._sendRequestService.filterChange(params,'','').then((data: any) => {
			return data;
        });
    }

    
    dataRead(result) {

        // Product selection's data
        if (result.data.productSelectionTabs != undefined)
			GLOBALS.CMN_FILTER_productSelectionTabs = result.data.productSelectionTabs;

        // Market selection's data
        if (result.data.marketSelectionTabs != undefined)
			GLOBALS.CMN_FILTER_marketSelectionTabs = result.data.marketSelectionTabs;
		
		if (result.data.filter_list != undefined)
			GLOBALS.savedFilters = result.data.filter_list;
			
		if (result.data.filters != undefined)
			GLOBALS.filtersGrid = GLOBALS.filtersGridModule(result.data);				
		
		if (result.data.saveFilter != undefined && result.data.saveFilter.status == "success")
		{
			this.hasSaved = true;
			this.succMsg = result.data.saveFilter.message;
			$('#save-filter-name-panel').modal('hide');
		}

		if (result.data.saveFilter != undefined && result.data.saveFilter.status == "fail")
		{
			this.hasError = true;
			this.errorMsg = result.data.saveFilter.message;
		}
	
		if (result.data.editFilter != undefined && result.data.editFilter.status == 'fail') {
			this.hasSaved = false;
			this.nameChangeSuccMsg = '';
			this.hasError = true;
			this.errorMsg = result.data.editFilter.errMsg;
		}
		else if (result.data.editFilter != undefined && result.data.editFilter.status == 'success') {
			this.hasError = false;
			this.errorMsg = '';
			this.hasSaved = true;
			this.succMsg = 'Filter has been saved successfully.';
			$('#report-edit-form-panel').modal('hide');
		}
		
		if (result.data.delete_status != undefined && result.data.delete_status.status == 'success') {
			this.hasError = false;
			this.errorMsg = '';
			this.hasSaved = true;
			this.succMsg = 'Filter has been deleted successfully.';	
			$('#filter-delete-panel').modal('hide');
		}
		else if(result.data.delete_status != undefined && result.data.delete_status.status == 'fail')
		{
			this.hasSaved = false;
			this.succMsg = '';
			this.hasError = true;
			this.errorMsg = result.data.delete_status.errMsg;
		}
		
		GLOBALS.endWaiting();
    }

    openWindow() {
    	this.opened = true;
    }

    closePopup() {
    	this.opened = false;
    }
	
    //pageSetup();

}
