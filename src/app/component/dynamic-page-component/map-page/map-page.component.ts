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

import { PerformanceGridComponent } from '../performance-page/sub-components/performance-grid/performance-grid.component';

import { jqxSplitterComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxsplitter';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {

    @Input() options;

    @ViewChild('splitContainer') mainSplitter: jqxSplitterComponent;
    @ViewChild('firstNested') subSplitter: jqxSplitterComponent;

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
	chartTabs:any;
	overtimeDrilldownChartOptions:any;
	performanceGridOptions:any;
    pageID:any;
    selectionParams:any;
    linechartFlag:any;
    gridFetchName:any;
    sendFirstSplittedRequest:any;
    GRID_FIELD:any;
    selectedField:any;
    ShowFieldSelection:any;
    measuresOptiondata:any;
    activeTabName:any;
    showProductFilter:any;
    showMarketFilter:any;
    showTimeSelection:any;
    showMeasureSelection:any;
    enabledGrids:any;
    measuresAliases:any;
    tabMeasures:any;
    totalGrid:any;
    activeTabMeasure:any;
    leftFirstGridName:any;
    timeSelectionMode:any;
    selectedMeasureID:any;
    lineChart:any;
    rowclickLeftFirstGrid:any;
    leftFirstGridPerformanceOptions:any;
    extraObj:any;
    action:any;
    isSif:any;
    marketSelectionTabs:any;
    productSelectionTabs:any;
    customAccount:any;
    chartTabMappings:any;
    privateLabelStatus:any;
    gridPostParamNames:any;
    hidePrivateLabel:any;
    gridDetails:any;
    result:any;
    requestPageName:any;
    servicePageName:any;
    gkey:any;
    windowHeight:any;
    layoutCollapse:any;
    measurePositionClass:any;
    pageHeight:any;

    provinceMapInitData:any;
    ontarioMapInitData:any;
    mapData:any;
    mapOptions:any;
    mapWidth:any;
    mapDataType:any;
    mapTemplate:any;
    showMap:any;

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

        this.mapWidth = 250;
	    this.mapDataType = "varpct";
        this.mapTemplate = 'provinceMap';
	    this.showMap = false;

        this.provinceMapInitData = {
            PROV_YUKON: {
                name: 'Yukon',
                data: 0,
                color: '#000000'
            },
            PROV_BRITISH_COLUMBIA: {
                name: '#VancouverIsland',
                data: 0,
                color: '#000000'
            },
            PROV_ALBERTA: {
                name: 'Alberta',
                data: 0,
                color: '#000000'
            },
            PROV_SASKATCHEWAN: {
                name: 'Saskatchewan',
                data: 0,
                color: '#000000'
            },
            PROV_MANITOBA: {
                name: 'Manitoba',
                data: 0,
                color: '#000000'
            },
            PROV_ONTARIO: {
                name: 'Ontario',
                data: 0,
                color: '#000000'
            },
            PROV_QUEBEC: {
                name: 'Quebec',
                data: 0,
                color: '#000000'
            },
            PROV_NEWFOUNDLAND: {
                name: 'NewFoundland',
                data: 0,
                color: '#000000'
            },
            PROV_PRINCE_EDW_ISLAND: {
                name: 'PrinceEdwardIslands',
                data: 0,
                color: '#000000'
            },
            PROV_NEW_BRUNSWICK: {
                name: 'NewBrunswick',
                data: 0,
                color: '#000000'
            },
            PROV_NOVA_SCOTIA: {
                name: 'Nova Scotia',
                data: 0,
                color: '#000000'
            },
            PROV_NORTHWEST_TERR: {
                name: 'Northwest Territories',
                data: 0,
                color: '#000000'
            },
            PROV_NUNAVUT: {
                name: 'Nunavat',
                data: 0,
                color: '#000000'
            }
        };


        this.ontarioMapInitData = {
            PROV_PARRY_SOUND_SUDBURY: {
                name: 'PARRY SOUND-SUDBURY',
                data: 0,
                color: '#000000'
            },
            PROV_WINDSOR_SARNIA: {
                name: 'WINDSOR-SARNIA',
                data: 0,
                color: '#000000'
            },
            PROV_LONDON_LAKE_HURON: {
                name: 'LONDON LAKE HURON',
                data: 0,
                color: '#000000'
            },
            PROV_BRANTFORD_WOODSTOCK: {
                name: 'BRANTFORD-WOODSTOCK',
                data: 0,
                color: '#000000'
            },
            PROV_NIAGARA: {
                name: 'NIAGARA',
                data: 0,
                color: '#000000'
            },
            PROV_HAMILTON_WENTWORTH: {
                name: 'HAMILTON-WENTWORTH',
                data: 0,
                color: '#000000'
            },
            PROV_WATERLOO: {
                name: 'WATERLOO',
                data: 0,
                color: '#000000'
            },
            PROV_DUFFERIN_WELLINGTON: {
                name: 'DUFFERIN-WELLINGTON',
                data: 0,
                color: '#000000'
            },
            PROV_HALTON: {
                name: 'HALTON',
                data: 0,
                color: '#000000'
            },
            PROV_PEEL: {
                name: 'PEEL',
                data: 0,
                color: '#000000'
            },
            PROV_CITY_OF_TORONTO: {
                name: 'CITY OF TORONTO',
                data: 0,
                color: '#000000'
            },
            PROV_YORK: {
                name: 'YORK',
                data: 0,
                color: '#000000'
            },
            PROV_BRUCE_GREY: {
                name: 'BRUCE-GREY',
                data: 0,
                color: '#000000'
            },
            PROV_SIMCOE: {
                name: 'SIMCOE',
                data: 0,
                color: '#000000'
            },
            PROV_PETERBOROUGH_AREA: {
                name: 'PETERBOROUGH AREA',
                data: 0,
                color: '#000000'
            },
            PROV_TRENTON_BELLEVILLE: {
                name: 'TRENTON-BELLEVILLE',
                data: 0,
                color: '#000000'
            },
            PROV_MUSKOKA_VICTORIA: {
                name: 'MUSKOKA-VICTORIA',
                data: 0,
                color: '#000000'
            },
            PROV_OTTAWA_AREA: {
                name: 'OTTAWA AREA',
                data: 0,
                color: '#000000'
            },
            PROV_KINGSTON_BROCKVILLE: {
                name: 'KINGSTON AREA',
                data: 0,
                color: '#000000'
            },
            PROV_DURHAM: {
                name: 'DURHAM',
                data: 0,
                color: '#000000'
            },
        };

        this.mapData = this.getInitMapData();

        this.isDefaultSelectedWeek = true;
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
        this.layoutCollapse = false;
        //this.pageUniqueKey = this.options.pageUniqueId;
        //this.pageUniqueKey = GLOBALS.getRandomId();
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        
        this.servicePageName = this.pageID + "_MapPage";

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            this.isSif = true;

        GLOBALS.requestType = "initial"; //which type of rwquest here such as initial, rowclick, reload
        this.showDateInWeeks = GLOBALS.showDateInWeeks;

        this.windowHeight = $(document).height();

        this.gridDetails = {"gridSKU": "skuGridData", "gridBrand": "brandGridData", "gridCategory": "categoryGridData",
            "gridGroup": "groupGridData", "gridStore": "storeGridData"};

        this.gridPostParamNames = ['STORE', 'GROUP', 'CATEGORY', 'BRAND', 'SKU'];

        this.measurePositionClass = "measurePositionLeft";

        this.performanceGridOptions = {
            "gridStore": false,
            "gridGroup": false,
            "gridCategory": false,
            "gridBrand": false,
            "gridSku": false,
            "totalGrid": 0,
            "leftFirstGrid": "",
            "splitContainer": '#' + this.pageUniqueKey + '_splitContainer',
            "splitter": '#' + this.pageUniqueKey + '_splitter',
            "pageName": '.' + this.pageUniqueKey + '_MapPage',
            "showPodLoader": {
                "gridStore": {"showInnerLoader": false},
                "gridGroup": {"showInnerLoader": false},
                "gridCategory": {"showInnerLoader": false},
                "gridBrand": {"showInnerLoader": false},
                "gridSKU": {"showInnerLoader": false}
            },
            "loadedGrid": "",
            "servicePageName": this.servicePageName
        };

        this.mapOptions = {
            showPodLoader: {showInnerLoader: false, customError:''}
        };

        /* Calling Service */
        var params = new Array();
        this.requestPageName = "SvgMap";
        params.push("destination=" + this.requestPageName);
        if(this.servicePageName != undefined){
            GLOBALS.callbackObjPerformance[this.servicePageName] = {
                callBack: (data) => {
                    return this.callFilterChange(data);
                }
            }
        }
        /*if (GLOBALS.templateDetails[events.name] != undefined) {
            this.pageID = GLOBALS.templateDetails[events.name].pageID;
            this.pageUniqueKey = GLOBALS.templateDetails[events.name].pageUniqueId;
        }*/
        //this.pageUniqueKey = GLOBALS.pageUniqueId;
        if (this.isDefaultSelectedWeek && GLOBALS.defaultFromWeek != "" && GLOBALS.defaultToWeek != "") {
            params.push("FromWeek=" + GLOBALS.defaultFromWeek);
            params.push("ToWeek=" + GLOBALS.defaultToWeek);
        }

        var PLabel = (GLOBALS.isShowPrivateLabel == undefined) ? false : GLOBALS.isShowPrivateLabel;

        params.push("HidePrivate=" + PLabel);
        params.push("pageID=" + this.pageID);
        params.push("fetchConfig=true");
        params.push("TSM=1");
        params.push("map=varpct");

        if ((GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2) || (GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) ))
            params.push("SIF=YES");

        //GLOBALS.callAsDefaultService({pageName: requestPageName, successCallBack: this.dataRead, params: params, servicesName: ""});
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });

        
	}

	/*
    ngDoCheck() {
        if(this.performanceGridOptions.dataLoaded != undefined && this.performanceGridOptions.dataLoaded == true) {
            if (!this.layoutLoaded) {
                this.layoutLoaded = true;
                //GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
                //GLOBALS.pageSetup();
            }
        }
    }
    */

    getInitMapData(){
        return $.extend(this.provinceMapInitData, this.ontarioMapInitData);
        // if(this.mapTemplate=='provinceMap'){
        //     return this.provinceMapInitData;
        // }else{
        //     return this.ontarioMapInitData;
        // }
    }

    formateMapData(data) {
        var tempMapData = this.getInitMapData();
        data.forEach((obj, key) => {
            var setKey = obj["@attributes"].name;
            setKey = setKey.replace(/ /g, '_').replace(/-/g, '_');
            tempMapData['PROV_' + setKey] = {
                name: obj["@attributes"].name,
                data: obj["@attributes"].data,
                color: obj["@attributes"].color
            }
        });
        this.showMap = true;
        return tempMapData;
    }

    changeMap (mapDataType) {
        this.mapOptions.showPodLoader.showInnerLoader = true;            
        this.mapDataType = mapDataType;
        GLOBALS.requestType = "onlyMapChange";
        if (this.selectionParams == undefined) {
            this.setSelectionData('');
        } else {
            this.sendRequestToServer("fetchGrid").then((data: any) => {
                this.renderPerformanceGrid(this.result);
            });
        }
    }



    changeHidePrivateLabel() {
        this.setSelectionData('');
    }

    // data binding with changing value volume
    changeMeasureValue(measureId) {
        GLOBALS.requestType = "initial"; //updateData
        this.setSelectionData('');
    }

    //Formate PERFORMANCE  data
    formateGridData(tempRows) {
        //which value will return in data on the basis of request(this year or last year)
        var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;
        var data = [];
        if (tempRows.length > 0) {
            for (var i = 0; i < tempRows.length; i++)
            {
                //var temp = {};
                if (tempRows[i][LYFIELD] > 0) {
                    var varPercent = ((tempRows[i][TYFIELD] - tempRows[i][LYFIELD]) * 100) / tempRows[i][LYFIELD];
                }
                else {
                    var varPercent = 0;
                }
                if (tempRows[i].LYPRICE > 0) {
                    var varPercentPrice = ((tempRows[i].TYPRICE - tempRows[i].LYPRICE) * 100) / tempRows[i].LYPRICE;
                }
                else {
                    var varPercentPrice = 0;
                }
                var temp = {
                    ID: (tempRows[i].ID != undefined ) ? tempRows[i].ID : '',
                    ACCOUNT: tempRows[i].ACCOUNT,
                    LYVALUE: tempRows[i][LYFIELD],
                    TYVALUE: tempRows[i][TYFIELD],
                    TYPRICE: tempRows[i].TYPRICE,
                    LYPRICE: tempRows[i].LYPRICE,
                    VAR: tempRows[i][TYFIELD] - tempRows[i][LYFIELD],
                    PRICE_VAR:tempRows[i].TYPRICE - tempRows[i].LYPRICE,
                    VARPER: varPercent.toFixed(1),
                    PRICE_VARPER:varPercentPrice.toFixed(1)
                };
                data.push(temp);
            }
        }
        return data;
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
        this.extraObj = obj;
        this.selectedMeasureID = this.measureselectionCall.selectedMeasureID;

        var params = "";
        if (GLOBALS.timeSelectionUnit != 'days' && typeof this.timeselectionCall.getTimeSelection == 'function' && !this.isSif)
            params += '&' + this.timeselectionCall.getTimeSelection();
        /*if ((GLOBALS.timeSelectionUnit == 'days' && typeof this.timeselectionCall.getTimeSelectionDays == 'function') || (this.isSif && typeof this.timeselectionCall.getTimeSelectionDays == 'function'))
            params += '&' + this.timeselectionCall.getTimeSelectionDays();*/
        if (typeof this.measureselectionCall.getMeasureSelection == 'function')
            params += '&' + this.measureselectionCall.getMeasureSelection();
        /*if (typeof this.getSkuSelection == 'function')
            param_req += '&' + this.getSkuSelection();*/
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
        GLOBALS.stopGlobalPaceLoader();
        var gridCountMatch = obj.match(/gridCount=/g);
        var gridFetchCnt = 0;
        if (!gridCountMatch) {
            gridFetchCnt = this.totalGrid;
        } else {
            var selectionParams = obj.split('&');
            Object.keys(selectionParams).forEach(function(key) {
                var value = selectionParams[key];
                var temp = [];
                temp = value.split('=');
                if (temp[0] == 'gridCount') {
                    gridFetchCnt = temp[1];
                }
            });
        }

        if (gridFetchCnt > 0) {
            GLOBALS.stopPace = true;
            this.mapOptions.showPodLoader.showInnerLoader = true;
            this.mapOptions.showPodLoader.customError = '';
            var objOrig = obj;


            if(!this.rebuildPageScope && gridFetchCnt == this.totalGrid) {
                GLOBALS.requestType = "initial";
            }
            for (var i = 0; i < gridFetchCnt; i++) {
                var k = (this.totalGrid - gridFetchCnt) + i;
                this.gridFetchName = this.enabledGrids[k];

                if (this.rebuildPageScope) {
                    obj = objOrig;
                    
                    if (this.extraObjParams[this.gridFetchName] != undefined && 
                        this.extraObjParams[this.gridFetchName].customParams != undefined)
                        obj += '&' + this.extraObjParams[this.gridFetchName].customParams;
                } else {
                    this.performanceGridOptions.selectedRow = {};
                }
                this.performanceGridOptions.showPodLoader[this.enabledGrids[k]].showInnerLoader = true;
                this.performanceGridOptions.showPodLoader[this.enabledGrids[k]].customError = '';
                this.selectionParams = obj.split('&');
                
                if (!this.rebuildPageScope) {
                    this.extraObjParams[this.gridFetchName] = this.extraObj;
                    if (this.extraObj != undefined && this.extraObj.customParams != undefined) {
                        var customParamsData = this.extraObj.customParams.split('&');
                        for (let customParamKey in customParamsData) {
                            var customParam = customParamsData[customParamKey];
                            var customParamPart = customParam.split("=");
                            if ($.inArray(customParamPart[0], this.gridPostParamNames) !== -1) {
                                if(this.performanceGridOptions.selectedRow == undefined)
                                    this.performanceGridOptions.selectedRow = {};

                                this.performanceGridOptions.selectedRow[customParamPart[0]] = customParamPart[1];
                            }
                        }
                    }
                }

                if (!this.rebuildPageScope)
                    this.extraObjParams[this.gridFetchName] = this.extraObj;

                if (!this.rebuildPageScope && i == 0)
                    this.rowclickLeftFirstGrid = this.gridFetchName;

                // if(this.ShowFieldSelection && this.selectedField != undefined)
                //     this.customAccount = this.selectedField.data;
                // else
                //     this.customAccount = "";

                this.sendRequestToServer("fetchGrid").then((data: any) => {
                    this.renderPerformanceGrid(this.result);
                });
            }

            this.rebuildPageScope = false;

        } else {

            this.selectionParams = obj.split('&');
            this.gridFetchName = "gridSKU";

            this.mapOptions.showPodLoader.showInnerLoader = true;
            this.mapOptions.showPodLoader.customError = '';

            this.sendRequestToServer("fetchGrid").then((data:any) => {
                this.renderChart(this.result);
            });
        }
    }

    

    sendRequestToServer(action) {
        
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        var gridNameForCustomError = this.gridFetchName;
        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        params.push("gridFetchName=" + this.gridFetchName);
        params.push("map=" + this.mapDataType);
        
        if (this.GRID_FIELD != undefined && this.GRID_FIELD[this.gridFetchName] != undefined )
            params.push("requestFieldName=" + this.GRID_FIELD[this.gridFetchName]);

        params.push("HidePrivate=" + this.privateLabelStatus);

        if(this.customAccount != undefined && this.customAccount != "")
            params.push("customAccount=" + this.customAccount);


        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
            this.result = result;
            this.result.gridNameForCustomError = gridNameForCustomError;
        });
    }

    sendSplittedRequest() {
        this.setSelectionData('');
        this.sendFirstSplittedRequest = false;
    }


    filterFirstGrid() {
        if(this.selectedField != undefined && this.selectedField != "" && this.selectedField.data != "")
        {
            this.performanceGridOptions[this.leftFirstGridName+"FirstColumn"] = { NAME : this.selectedField.label, ID : "" };
            this.setSelectionData('');
        }else{
            this.performanceGridOptions[this.leftFirstGridName+"FirstColumn"] = this.leftFirstGridPerformanceOptions;
            this.setSelectionData('');
        }
    }

    renderPerformanceGrid(result) {
        if (result.gridNameForCustomError != undefined && result.customErrors != undefined) {
            this.performanceGridOptions.showPodLoader[result.gridNameForCustomError].customError = result.customErrors.displayMessage;
            this.mapOptions.showPodLoader.customError = result.customErrors.displayMessage;
        }

        this.renderCommonProcess();

        // setting grids first column name
        if (result.GRID_FIRST_COLUMN_NAMES != undefined && result.GRID_FIRST_ID_NAMES != undefined ) {
            for (let gridName in result.GRID_FIRST_COLUMN_NAMES) {
                var firstColumnName = result.GRID_FIRST_COLUMN_NAMES[gridName];
                if(this.leftFirstGridName == gridName)
                    this.leftFirstGridPerformanceOptions = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };

                this.performanceGridOptions[gridName + "FirstColumn"] = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };
            }
        }
        

        var isAvailablePerformanceGridData = false;
        for (let gkey in this.gridDetails) {
            var gvalue = this.gridDetails[gkey];
            if (result[gkey] != undefined) {
                isAvailablePerformanceGridData = true;
                this.gkey = new Array();
                if (result[gkey]) {
                    if (Array.isArray(result[gkey])) {
                        this.gkey = result[gkey];
                    } else {
                        this.gkey.push(result[gkey]);
                    }
                }
                this.performanceGridOptions[gvalue] = this.gkey;
                this.performanceGridOptions.loadedGrid = gkey;
                setTimeout(()=>{
                    this.performanceGridOptions.showPodLoader[gkey].showInnerLoader = false;
                }, 100);

            }
            if (isAvailablePerformanceGridData == true) {
                this.performanceGridOptions.dataLoaded = true;
                isAvailablePerformanceGridData = false;
            }
        }
        // this.selectionParams = [];
        if (result.mapData != undefined) {
            this.renderChart(result);
        }
    }

    renderChart (result) {
        if (result.customErrors != undefined)
            this.mapOptions.showPodLoader.customError = result.customErrors.displayMessage;
        
        this.renderCommonProcess();

        if (result.mapData != undefined) {
            var resultMapData = new Array();
            if (result.mapData) {
                if (Array.isArray(result.mapData)) {
                    resultMapData = result.mapData;
                } else {
                    resultMapData.push(result.mapData);
                }
            }
            this.mapData = this.formateMapData(resultMapData);
            // console.log(this.mapData);
            setTimeout(() => {
                this.mapOptions.showPodLoader.showInnerLoader = false;
            }, 100);
        }
    }

    renderCommonProcess() {

        this.mapOptions.selectedMeasureID = (this.selectedMeasureID == undefined) ? GLOBALS.defaultMeasureSelectionID : this.selectedMeasureID;
        this.performanceGridOptions.selectedMeasureID = (this.selectedMeasureID == undefined) ? GLOBALS.defaultMeasureSelectionID : this.selectedMeasureID;

        this.mapOptions.isShowLyData = (GLOBALS.SIF == true || GLOBALS.tsdSif == true ) ? false : GLOBALS.isShowLyData;
        this.performanceGridOptions.isShowLyData = (GLOBALS.SIF == true || GLOBALS.tsdSif == true ) ? false : GLOBALS.isShowLyData;

        if(this.selectedMeasureID != undefined && this.selectedMeasureID != ""){
            var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
            GLOBALS.measureLabel = selectedMeasure[0].measureName;
        }
        GLOBALS.vsLabel = this.timeSelectionMode == 1 ? "Last Period" : "Previous Period"; // manage chart or grid label for last year or previous period data
    }
    
    dataRead(result) {

        
        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage,this.servicePageName,this.pageID);
            return ;
        }
        
        this.pageHeight = GLOBALS.getDynamicHeight({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});
        

        this.renderCommonProcess();

        this.showMap = false;
        if (result.mapTemplate != undefined && result.mapTemplate != '')
            this.mapTemplate = result.mapTemplate;
        
        
        if (result.fieldSelection != undefined)
            this.fieldSelection = result.fieldSelection;

        if (result.gridConfig != undefined) {
            this.leftFirstGridName = result.gridConfig.leftFirstGridName;
            this.performanceGridOptions.leftFirstGrid = result.gridConfig.leftFirstGridCol;
            this.totalGrid = this.performanceGridOptions.totalGrid = result.gridConfig.gridCount;

            
            if (result.gridConfig.enabledGrids != undefined && result.gridConfig.enabledGrids.length > 0) {
                this.enabledGrids = result.gridConfig.enabledGrids;
                this.mapOptions.showPodLoader.showInnerLoader = true;
                result.gridConfig.enabledGrids.forEach(key => {
                    var value = result.gridConfig.enabledGrids[key];
                    this.performanceGridOptions.showPodLoader[key].showInnerLoader = true;
                    key = (key == "gridSKU") ? "gridSku" : key;
                    this.performanceGridOptions[key] = true;
                });
            }   


            this.showTimeSelection = this.showProductFilter = this.showMarketFilter = this.showMeasureSelection = this.ShowFieldSelection = false;
            if (result.gridConfig.enabledFilters != undefined && result.gridConfig.enabledFilters.length > 0) {
                if (result.gridConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (GLOBALS.isShowProductFilter && result.gridConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.showProductFilter = true;

                if (GLOBALS.isShowMarketFilter && result.gridConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.gridConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
                    
                if (result.gridConfig.enabledFilters.indexOf('field-selection') != -1)
                    this.ShowFieldSelection = true;                            
            }

            this.sendFirstSplittedRequest = true;


            this.mapOptions.measuresOptiondata = this.measuresOptiondata;
            this.performanceGridOptions.measuresOptiondata = this.measuresOptiondata;
            
            if(result.gridConfig.selectedField != undefined && this.ShowFieldSelection)
            {
                var field = this._helperService.where(this.fieldSelection,{data:result.gridConfig.selectedField});
                if(field != undefined && field.length > 0)
                    this.selectedField = field[0];
            }
        }

        // setting grids first column name
        if (result.GRID_FIRST_COLUMN_NAMES != undefined && result.GRID_FIRST_ID_NAMES != undefined ) {
            for (let gridName in result.GRID_FIRST_COLUMN_NAMES) {
                var firstColumnName = result.GRID_FIRST_COLUMN_NAMES[gridName];
                if(this.leftFirstGridName == gridName)
                    this.leftFirstGridPerformanceOptions = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };

                this.performanceGridOptions[gridName + "FirstColumn"] = { NAME : firstColumnName, ID : result.GRID_FIRST_ID_NAMES[gridName] };
            }
        }
        if ( result.GRID_FIELD != undefined ) {
            this.GRID_FIELD = result.GRID_FIELD;
        }

        this.selectionParams = [];

        if (this.sendFirstSplittedRequest) {
            setTimeout(()=>{
                this.sendSplittedRequest();
            }, 100);
        }

        this.setUpLayout();
    }

    setUpLayout() {
        setTimeout(()=>{
            if(typeof ($('#' + this.pageUniqueKey + '_splitContainer')) != undefined && $('#' + this.pageUniqueKey + '_splitContainer').length > 0){
                GLOBALS.layoutSetup({layout: 'SPLITTER_CONTAINER', pageContainer: "." + this.pageUniqueKey + "_PerformancePage", splitContainer: '#' + this.pageUniqueKey + '_splitContainer', splitter: '#' + this.pageUniqueKey + '_splitter'});

                if(this.selectedMeasureID != undefined && this.selectedMeasureID != ""){
                    var selectedMeasure = this._helperService.where(this.measuresOptiondata,{measureID:this.selectedMeasureID});
                    var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
                    var valueFormat = "#,##0."+"#".repeat(measureDataDecimalPlaces);
                }else{
                   var valueFormat = ''; 
                }

                GLOBALS.setSvgMapTooltip("." + this.pageUniqueKey + "_productProvinceMapContainer", valueFormat);

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

        delete this.mapData;;

        // delete this.performanceGridOptions.storeGrid;
        if (this.performanceGridOptions.storeGrid != undefined)
            this.performanceGridOptions.storeGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.storeGridContextOptions.csvData;
        delete this.performanceGridOptions.storeGridData;

        // delete this.performanceGridOptions.groupGrid;
        if (this.performanceGridOptions.groupGrid != undefined)
            this.performanceGridOptions.groupGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.groupGridContextOptions.csvData;
        delete this.performanceGridOptions.groupGridData;

        // delete this.performanceGridOptions.categoryGrid;
        if (this.performanceGridOptions.categoryGrid != undefined)
            this.performanceGridOptions.categoryGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.categoryGridContextOptions.csvData;
        delete this.performanceGridOptions.categoryGridData;

        // delete this.performanceGridOptions.brandGrid;
        if (this.performanceGridOptions.brandGrid != undefined)
            this.performanceGridOptions.brandGrid.gridOptions.api.setRowData([]);

        delete this.performanceGridOptions.brandGridContextOptions.csvData;
        delete this.performanceGridOptions.brandGridData;

        // delete this.performanceGridOptions.skuGrid;
        if (this.performanceGridOptions.skuGrid != undefined)
            this.performanceGridOptions.skuGrid.gridOptions.api.setRowData([]);
        
        delete this.performanceGridOptions.skuGridContextOptions.csvData;
        delete this.performanceGridOptions.skuGridData;


    }

}
