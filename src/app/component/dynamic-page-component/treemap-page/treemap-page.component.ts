import { Injector, Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { SendRequestService } from '../../../services/send-request.service';
import { BroadcastService } from '../../../services/broadcast.service';
import { TimeSelectionComponent } from '../../filters/time-selection/time-selection.component';
import { ProductSelectionComponent } from '../../filters/product-selection/product-selection.component';
import { MarketSelectionComponent } from '../../filters/market-selection/market-selection.component';
import { MeasureSelectionComponent } from '../../filters/measure-selection/measure-selection.component';
import { ProductMarketSelectionInlineComponent } from '../../filters/product-market-selection-inline/product-market-selection-inline.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as $ from 'jquery';

@Component({
	selector: 'app-treemap-page',
	templateUrl: './treemap-page.component.html',
	styleUrls: ['./treemap-page.component.scss']
})
export class TreemapPageComponent implements OnInit {


    @ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

	isDefaultSelectedWeek:any;
	layoutLoaded:any;
	pageUniqueKey:any;
	treemapContextMenuOptions:any;
	allTreeMapObjScaleData:any;
	showPositiveScale:any;
	showNegativeScale:any;
	result:any;
	productSelectionTabs:any;
	marketSelectionTabs:any;
	selectedMeasureID:any;
	symbol:any;
	activeTab:any;
	positiveMaxVal:any;
	positiveMinVal:any;
	negativeMaxVal:any;
	negativeMinVal:any;
	treeTabList:any;
	selectionParams:any;
	privateLabelStatus:any;
	hidePrivateLabel:any;
	pageID:any;
	accountField:any;
	showTimeSelection:any;
	showProductFilter:any;
	showMarketFilter:any;
	showMeasureSelection:any;
	positiveValList:any;
	negativeValList:any;
	requestPageName:any;
	isFirstRequest:any;
	nodeOfSKU:any;
	servicePageName:any;
	rebuildPageScope:any;
	dataLoaded:any;
	currentIndex:any;
	options:any;

	constructor(private injector: Injector, private _helperService: HelperService, private _sendRequestService: SendRequestService, 
	            private _broadcastService: BroadcastService) { 
		this.pageID = this.injector.get('pageID');
	}

	public onContextMenuSelect({ item }): void {
		if(this[item.logicFunctionName] != undefined)
			this[item.logicFunctionName]();
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

		this.currentIndex = (this.currentIndex == undefined) ? 0 : this.currentIndex;
		this.isDefaultSelectedWeek = true;
		this.options = {
			showPodLoader:{showInnerLoader:false},
		}
		this.pageUniqueKey = GLOBALS.pageUniqueId;
		this.requestPageName = "TreeMap";
		GLOBALS.stopPace = false;
		this.hidePrivateLabel = GLOBALS.isShowPrivateLabel;
		
		this.layoutLoaded = false;
		this.servicePageName = this.pageID + "_TreemapPage";

		this.treemapContextMenuOptions = {
            container: '.treemapDivNode' + this.pageUniqueKey,
            treeMapExport:true,
            chartName: 'treemapChart',
            menuItems: [{menuSlug: 'CHART_EXPORT_AS_PNG', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Treemap.png', functionScope: 'self'}]
        };

		this.allTreeMapObjScaleData = [];
		this.showPositiveScale = false;
		this.showNegativeScale = false;
		this.isFirstRequest = true;

		/* Calling Service */
		var params = new Array();
        params.push("destination=" + this.requestPageName);
        /*if (GLOBALS.templateDetails[events.name] != undefined) {
            $scope.pageID = $rootScope.templateDetails[events.name].pageID;
            $scope.pageUniqueKey = $rootScope.templateDetails[events.name].pageUniqueId;
        }*/

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

        

        //GLOBALS.callAsDefaultService({pageName: this.requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });
	}

	/*ngAfterViewInit() {
		this.options.ContextOptions.containerObj = this.chartObj;
    }*/

	ngDoCheck() {
        if (this.dataLoaded != undefined && !this.layoutLoaded) {
            this.layoutLoaded = true;
            //layoutSetup({layout: 'ONE_ROW', pageContainer: "." + $scope.pageUniqueKey + "_TreeMapPage"});
            //pageSetup();
        }
    }

	/**
	* changeHidePrivateLabel
	* send request to server to get data with changing private label
	*/
	changeHidePrivateLabel() {
		this.setSelectionData('');
	}

	//Formate TREE MAP data
	formateTreemapData(tempRows) {
		if(tempRows != undefined ) {
			var children = [];
			for (var i = 0; i < tempRows.length; i++) {
				var temp = {
					id:tempRows[i].name,
					name:tempRows[i].name,
					value:Number(tempRows[i].value),
					varPct:parseFloat(tempRows[i].varp),
					share:tempRows[i].chartval1,
					size:Number(tempRows[i].value),
					colorCode:tempRows[i].color
				};
				children.push(temp);
			}
			var data = {
				children:children
			};
		}
		return data;
	}

	callFilterChange() {
		this.sendRequestToServer("filterChange").then((data: any) => {
			this.dataRead(this.result);
		});
	}

	// SETTING MODULE FOR THIS PAGE
	setSelectionModule() {
		//// configuring the product tabs
		this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
		//// configuring the market tabs
		this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
	}

	numRange(min, max, step, sign) {
		sign = sign || '';
		step = step || 1;
		var input = [];
		var maxVal = max;
		if (max >= 200) { max = 200; }else{ max = max -1; }
		for (var i = min; i <= max; i += step) input.push({'value':i,'label':sign+i});
			input.push({'value':maxVal,'label':'Default Scale'});
		return input;
	};

	redrawChart() {
		//var selectedMeasure = $filter('filter')(GLOBALS.measuresOptiondata,{measureID : this.selectedMeasureID }, true );
		var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.selectedMeasureID});
		//var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{selected:true});
		//var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.selectedMeasureID});
        //var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
		var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
		var valueFormat = "#,##0."+"#".repeat(measureDataDecimalPlaces);
		this.symbol = selectedMeasure[0]['measureName'];

		if (this.allTreeMapObjScaleData[this.activeTab] != undefined) {
			this.allTreeMapObjScaleData[this.activeTab].positiveMaxVal = this.positiveMaxVal;
			this.allTreeMapObjScaleData[this.activeTab].positiveMinVal = this.positiveMinVal;
			this.allTreeMapObjScaleData[this.activeTab].negativeMaxVal = this.negativeMaxVal;
			this.allTreeMapObjScaleData[this.activeTab].negativeMinVal = this.negativeMinVal;
		}

		setTimeout(function(){ 
			getTreeMap({container: '.treemapDivNode' + this.pageUniqueKey , symbol: this.symbol, jsonData: this.nodeOfSKU,  positiveStartColorCode:GLOBALS.positiveStartColorCode, positiveEndColorCode:GLOBALS.positiveEndColorCode, negativeStartColorCode:GLOBALS.negativeStartColorCode, negativeEndColorCode:GLOBALS.negativeEndColorCode, newItemColorCode:GLOBALS.newItemColorCode, positiveMaxVal:this.positiveMaxVal, positiveMinVal:this.positiveMinVal, negativeMaxVal:this.negativeMaxVal, negativeMinVal:this.negativeMinVal, redrawChart: true});
		},1000);
	}

	setSelectionData(obj) {
		GLOBALS.stopGlobalPaceLoader();
		this.options.showPodLoader.showInnerLoader = true;
		this.options.showPodLoader.customError = '';
		if (obj === undefined) {
			this.allTreeMapObjScaleData = [];
			for (let key in this.treeTabList) {
				this[obj] = "";
			}
		}

		this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

		var params = "";
		if (typeof this.timeselectionCall.getTimeSelection == 'function')
			params += '&' + this.timeselectionCall.getTimeSelection();
		if (typeof this.measureselectionCall.getMeasureSelection == 'function')
			params += '&' + this.measureselectionCall.getMeasureSelection();
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
		GLOBALS.stopPace = true;
		this.selectionParams = obj.split('&');
		this.sendRequestToServer("").then((data: any) => {
			this.renderTreeMapData(this.result);
		});
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
		params.push("action=" + action);
		params.push("HidePrivate=" + this.privateLabelStatus);
		if (this.accountField)
			params.push("accountField=" + this.accountField);
		return this._sendRequestService.filterChange(params,'','').then((result: any) => {
		//return sendRequestService.filterChange(params).then(function(result) {
			this.result = result;
		});
	}

	renderTreeMapData(result) {
		if (result.customErrors != undefined){
			this.options.showPodLoader.customError = result.customErrors.displayMessage;
			return ;
		}

		if($.isEmptyObject(result) == false) {

			for( let key in this.treeTabList) {

				var obj = this.treeTabList[key];
				if (result[obj.data] != undefined) {
					this[obj.data] = result[obj.data];
					this.drawTreeMap(obj.data);
				}
				else
					this.options.showPodLoader.showInnerLoader = false;
			}
		} else {
			for (let key in this.treeTabList) {
				var obj = this.treeTabList[key];
				this[obj.data] = [];
				this[obj.data] = undefined;
				this.drawTreeMap(obj.data);
			}
		}
	}

	// INITIAL TREE MAP DROWING
	dataRead(result) {

		if (result.customErrors != undefined) {
			this.options.showPodLoader.showInnerLoader = true;
			GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
			GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
			return ;
		}

		if (result.gridConfig != undefined) {
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

		if (result.TREE_TAB_LIST != undefined) {
			this.treeTabList = result.TREE_TAB_LIST;
			this.accountField = this.treeTabList[0].data;
		}

		//this.dataLoaded = true;
		if (this.isFirstRequest) {
			setTimeout(()=>{
				this.sendPodRequest();
			}, 100);
		}
	}


	sendPodRequest() {
		this.setSelectionData({dataReset: false});
		this.isFirstRequest = false;
	}

// tab click method
	tabClickEvent(dataField, index) {
		this.accountField = dataField;
		this.currentIndex = index;
		if (this[dataField] == undefined || this[dataField] === "")
			this.sendPodRequest();
		else
			this.drawTreeMap(dataField);
	}

	//draw tree map method that will check the selected tab and draw tree map
	drawTreeMap(dataField) {

		//$scope.symbol = ($scope.selectedMeasureID == 1) ? GLOBALS.currencySign : "Cases";
		var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.selectedMeasureID});
		var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
		var valueFormat = "#,##0."+"#".repeat(measureDataDecimalPlaces);
		this.symbol = selectedMeasure[0]['measureName'];

		//this.symbol = GLOBALS.measuresOptiondata[this.selectedMeasureID - 1].measureName;
		//getTreeMap({container: '.treemapDivNode' + this.pageUniqueKey , symbol: this.symbol, jsonData: formateTreemapData($scope[dataField]), valueFormat : valueFormat });*/

		this.nodeOfSKU = this.formateTreemapData(this[dataField]);
		var allChartData = this.nodeOfSKU.children;
		var allPositiveVals = this._helperService.sortBy(this._helperService.filter(allChartData, function(v) { return v.varPct > 0 }), function(num) { return num.varPct; });
		var allNegativeVals = this._helperService.sortBy(this._helperService.filter(allChartData, function(v) { return v.varPct < 0 }), function(num) { return num.varPct; });
		var positiveMaxVal = this._helperService.max(allPositiveVals, function(o){return o.varPct;});
		var positiveMinVal = this._helperService.min(allPositiveVals, function(o){return o.varPct;});
		positiveMaxVal = (positiveMaxVal.varPct < 0) ? positiveMaxVal.varPct * -1 : positiveMaxVal.varPct;
		positiveMinVal = (positiveMinVal.varPct < 0) ? positiveMinVal.varPct * -1 : positiveMinVal.varPct;

		var negativeMinVal = this._helperService.max(allNegativeVals, function(o){return o.varPct;});
		var negativeMaxVal = this._helperService.min(allNegativeVals, function(o){return o.varPct;});
		negativeMaxVal = (negativeMaxVal.varPct < 0) ? negativeMaxVal.varPct * -1 : negativeMaxVal.varPct;
		negativeMinVal = (negativeMinVal.varPct < 0) ? negativeMinVal.varPct * -1 : negativeMinVal.varPct;

		this.positiveMaxVal = Math.round(positiveMaxVal);
		this.positiveMinVal = Math.round(positiveMinVal);
		this.negativeMaxVal = Math.round(negativeMaxVal);
		this.negativeMinVal = Math.round(negativeMinVal);

		this.showPositiveScale = false;
		if (this.positiveMaxVal != undefined && this.positiveMaxVal > 0) {
			this.positiveValList = this.numRange(1,this.positiveMaxVal,1,'');
			this.showPositiveScale = true;
		}

		this.showNegativeScale = false;
		if (this.negativeMaxVal != undefined && this.negativeMaxVal > 0) {
			this.negativeValList = this.numRange(1,this.negativeMaxVal,1,'-');
			this.showNegativeScale = true;
		}

		var redrawChart = false;
		this.activeTab = dataField.replace('.','_');
		if(this.allTreeMapObjScaleData[this.activeTab] != undefined){
			this.positiveMaxVal = this.allTreeMapObjScaleData[this.activeTab].positiveMaxVal;
			this.positiveMinVal = this.allTreeMapObjScaleData[this.activeTab].positiveMinVal;
			this.negativeMaxVal = this.allTreeMapObjScaleData[this.activeTab].negativeMaxVal;
			this.negativeMinVal = this.allTreeMapObjScaleData[this.activeTab].negativeMinVal;
			redrawChart = true;
		} else {
			this.allTreeMapObjScaleData[this.activeTab] = {'positiveMaxVal':this.positiveMaxVal,'positiveMinVal':this.positiveMinVal,'negativeMaxVal':this.negativeMaxVal,'negativeMinVal':this.negativeMinVal};
		}

		getTreeMap({container: '.treemapDivNode' + this.pageUniqueKey, symbol: this.symbol, jsonData: this.nodeOfSKU, positiveStartColorCode:GLOBALS.positiveStartColorCode, positiveEndColorCode:GLOBALS.positiveEndColorCode, negativeStartColorCode:GLOBALS.negativeStartColorCode, negativeEndColorCode:GLOBALS.negativeEndColorCode, newItemColorCode:GLOBALS.newItemColorCode, positiveMaxVal:this.positiveMaxVal, positiveMinVal:this.positiveMinVal, negativeMaxVal:this.negativeMaxVal, negativeMinVal:this.negativeMinVal,'redrawChart': redrawChart});

		this.options.showPodLoader.showInnerLoader = false;
	}

	rebuildPageProcess() {

        /*if ($rootScope.templateDetails[servicePageName].pageLoaded == false) {
            $rootScope.reloadProjectPageConfig(servicePageName,pageID);
        } else {*/
            this.rebuildPageScope = true;
            /*if(typeof this.applyProductStickyFilterToLocalScope == 'function')
                this.applyProductStickyFilterToLocalScope();
            if(typeof this.applyMarketStickyFilterToLocalScope == 'function')
                this.applyMarketStickyFilterToLocalScope();*/

            this.setSelectionData('');
        // }
    }

    freePageObjectProcess() {
    	 if (this.treeTabList != undefined) {
    	 	for (let key in this.treeTabList) {
    	 		var obj = this.treeTabList[key];
    	 		if (this[obj.data] != undefined)
                    delete this[obj.data];
    	 	}
        }
    }

    /*public loadScript(url) {
	    const body = <HTMLDivElement> document.body;
	    const script = document.createElement('script');
	    script.innerHTML = '';
	    script.src = url;
	    script.async = false;
	    script.defer = true;
	    body.appendChild(script);
  	}*/

}
