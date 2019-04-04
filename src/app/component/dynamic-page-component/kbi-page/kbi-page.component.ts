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
import { formatNumber, IntlService } from '@progress/kendo-angular-intl';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChartComponent, AxisLabelVisualArgs, ChartsModule } from '@progress/kendo-angular-charts';
import { LayoutModule } from '@progress/kendo-angular-layout';

@Component({
	selector: 'kbi-page',
	templateUrl: './kbi-page.component.html',
	styleUrls: ['./kbi-page.component.scss']
})
export class KBIPageComponent implements OnInit {

	@ViewChild('timeselectionCall') timeselectionCall;
    @ViewChild('productselectionCall') productselectionCall;
    @ViewChild('marketselectionCall') marketselectionCall;
    @ViewChild('measureselectionCall') measureselectionCall;

    @ViewChild('distributionCountChartObj') distributionCountChartObj;
    @ViewChild('averagePriceChartObj') averagePriceChartObj;
    @ViewChild('unitSalesChartObj') unitSalesChartObj;

    @ViewChild('chartModal') chartModal;

    @ViewChild('kbiGrid') kbiGrid;

    modalRef: BsModalRef;
	pageID:any;
	isDefaultSelectedWeek:any;
	options:any;
	chartRequestOnly:any;
	requestPageName:any;
	customDownloadFlag:any;
	layoutLoaded:any;
	pageUniqueKey:any;
	servicePageName:any;
	distributionCountContextMenuOptions:any;
	averagePriceChartContextMenuOptions:any;
	unitSalesChartContextMenuOptions:any;
	tp:any;
	pp:any;
	ly:any;
	isRank:any;
	isFirstRequest:any;
	productSelectionTabs:any;
	marketSelectionTabs:any;
	extraObj:any;
	paramsAsString:any;
	selectionParams:any;
	result:any;
	HEADER:any;
	ACCOUNTS:any;
	ACCOUNT:any;
	gridDataForExport:any;
	productKbiGrid:any;
	avgPercent:any;
	sku:any;
	tpnb:any;
	skuName:any;
	percent:any;
	overUnderPerformance:any;
	distributionCountChart:any;
	unitSalesChart:any;
	averagePriceChart:any;
	growthDeclineChart:any;
	privateLabelStatus:any;
	hidePrivateLabel:any;
	extraColmunsFlag:any;
	showDownloadOptions:any;
	showTimeSelection:any;
	showProductFilter:any;
	showMarketFilter:any;
	showMeasureSelection:any;
	isServiceRequest:any;
	volumeSales:any;
	volumeShare:any;
	valueSales:any;
	valueShare:any;
	priceColumn:any;
	distributionColumn:any;
	value_sppd:any;
	volume_sppd:any;
	gridColumns:[any];
	ACCOUNT_NAME:any;
	dataLoaded:any;
	gridOptions:any;
	SKU_FIELD:any;
	rebuildPageScope:any;
    rowHeightArray:any;
    whiteSpaceProperty:any;
    distributionChartData:any;
    salesChartData:any;
    averageChartData:any;
    gridClass:any;

	constructor(private injector: Injector, private _helperService: HelperService, private _sendRequestService: SendRequestService, 
	            private _broadcastService: BroadcastService, private modalService: BsModalService, public intl: IntlService) { 
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
        this.options = {
        	showPodLoader : {
        		kbiGrid : {showInnerLoader: false},
        		kbiChart :{showInnerLoader: false}
        	}
        };
        this.chartRequestOnly = false;
        this.requestPageName = "ProductKBI";
        var params = new Array();
        params.push("destination=" + this.requestPageName);
        GLOBALS.stopPace = false;
        this.customDownloadFlag = false;
        this.layoutLoaded = false;
        this.pageUniqueKey = GLOBALS.pageUniqueId;
        this.servicePageName = this.pageID + "_KBIPage";
        //initialize context options of chart
        this.distributionCountContextMenuOptions = {
			container: '.distributionCountContextMenu',
			onlyChartExport: true,
			chartName: 'distributionCount',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};
		this.averagePriceChartContextMenuOptions = {
			container: '.averagePriceChartContextMenu',
			onlyChartExport: true,
			chartName: 'averagePriceChart',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};
		this.unitSalesChartContextMenuOptions = {
			container: '.unitSalesChartContextMenu',
			onlyChartExport: true,
			chartName: 'unitSalesChart',
            menuItems: [
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Price-Chart', functionScope: 'self'}
            ],
            containerObj:{}
		};

        this.tp = this.pp = this.ly = false;
        this.isRank = false;
        this.gridClass = this.pageUniqueKey + '_KbiPageGrid';
        this.whiteSpaceProperty = {};
        this.whiteSpaceProperty[this.gridClass] = "nowrap";
        this.rowHeightArray = {};

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
        this.isFirstRequest = true;
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.dataRead(data);
        });
	}

	ngDoCheck() {
        if(this.dataLoaded != undefined && this.dataLoaded == true) {
            if (!this.layoutLoaded) {
                this.layoutLoaded = true;
                //pageSetup();
            	GLOBALS.layoutSetup({layout: 'ONE_ROW', pageContainer: "." + this.pageUniqueKey + "_KbiPage"});
            }
        }
    }

    distributionCountChartRender(event) {
        this.distributionCountContextMenuOptions.containerObj = event.sender;
    }
    averagePriceChartRender(event) {
        this.averagePriceChartContextMenuOptions.containerObj = event.sender;
    }
    unitChartRender(event) {
        this.unitSalesChartContextMenuOptions.containerObj = event.sender;
    }

	/**
     * changeHidePrivateLabel
     * send request to server to get data with changing private label
     */
    changeHidePrivateLabel() {
        this.setSelectionData('');
    }

    // SETTING MODULE FOR THIS PAGE
    setSelectionModule() {
    	this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);
		this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);
    }

    /**
     * setSelectionData to get result of selection
     * @param {string} obj
     * @returns {void}
     */
    setSelectionData(obj) {
    	GLOBALS.stopGlobalPaceLoader();
        if(!this.chartRequestOnly)
        this.options.showPodLoader.kbiGrid.showInnerLoader = true;
        this.options.showPodLoader.kbiChart.showInnerLoader = true;
        this.options.showPodLoader.kbiGrid.customError = '';
        var params = "";
        if (typeof this.timeselectionCall.getTimeSelection == 'function')
            params += '&' + this.timeselectionCall.getTimeSelection();
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
        GLOBALS.stopPace = true;
        this.paramsAsString = obj;
        this.selectionParams = obj.split('&');
        if (!this.customDownloadFlag) {
            this.sendRequestToServer("").then((data: any) => {
                this.renderGridData(this.result);
            });
        }
    }

    renderGridData(result) {

        if (result.customErrors != undefined) {
            this.options.showPodLoader.kbiGrid.customError = result.customErrors.displayMessage;
        }

        if (result.HEADER != undefined) {
            this.HEADER = result.HEADER;
        }
        if (result.ACCOUNTS != undefined) {
            this.ACCOUNTS = result.ACCOUNTS;
        }
        if (result.SKU_FIELD != undefined) {
            this.SKU_FIELD = result.SKU_FIELD;
        }
        if (result.ACCOUNT != undefined) {
            this.ACCOUNT = result.ACCOUNT;
        }
        if (result.gridData != undefined) {
            this.gridDataForExport = result.gridData;
            if ( this.productKbiGrid == undefined ){
                this.productKbiGrid = this.setAgGridObject(result.gridData);
                this.productKbiGrid.dataLoaded = true;
                this.options.showPodLoader.kbiGrid.showInnerLoader = false;
            } else {
		        this.productKbiGrid.gridOptions.api.setRowData(result.gridData);
		        this.productKbiGrid.gridOptions.api.setPinnedBottomRowData(this.createFooterRow(result.gridData));
		        this.options.showPodLoader.kbiGrid.showInnerLoader = false;
            }
        }
        if (result.totalData != undefined && result.totalData.VAL_LY_VAR_PCT != undefined) {
        	this.avgPercent = result.totalData.VAL_LY_VAR_PCT;
        }
    }

    setAgGridObject (data) {
        
        this.rowHeightArray[this.gridClass] = [];
        var options = {
            gridClass: this.gridClass,
            whiteSpaceProperty: this.whiteSpaceProperty,
            textWrap: {field:'TPNB', currentRowHeight: this.rowHeightArray},
            contextMenuItems: [ 'EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
            callbackFooterRow:this.createFooterRow,
            callbackOnRowClick: (params) => { this.clickOnRow(params);},
            callbackOnRowDoubleClick: (params) => { this.dblClickOnRow(params); },
        };

        return {columns: this.getAgGridColumns(), data:data, options:options};
    }

    getAgGridColumns () {
        var columnsName = [{
                field: "TPNB",
                headerName: this.gridColumns['TPNB'],
                headerClass: "headerTop",
                cellClass: "cellClass",
                suppressMenu: true,
                type:'',
                minWidth:70
            }, {
                field: "SKU",
                headerName: this.gridColumns['SKU'],
                headerClass: "headerTop",
                suppressMenu: true,
                type:'',
                minWidth:200
            }];

        if(this.isRank){    
            columnsName.push({
                field: "RANK",
                headerName: "RANK",
                headerClass: "headerTop",
                type: "numericColumn",
                suppressMenu:true,
                minWidth:50
            });
        } 

        
        var valueSales = {
            headerName: "VALUE SALES",
            headerClass: "headerTop2",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "VAL_TP",
                    headerName: "TP",
                    headerClass: "headerTop2",
                    type: "numericColumn",
                    hide: this.tp,
                    valueFormatter: function(params) {  return formatNumber(params.value, "#,##0."); },
                    minWidth:70,
                    suppressMenu: true,
                }, {
                    headerName: "PP",
                    headerClass: "headerTop2",
                    minWidth:140,
                    children: [{
                            field: "VAL_PP_VAR",
                            headerName: "VAR",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth:70,
                            valueFormatter: function(params) { return formatNumber(params.value, "#,##0."); },
                            hide: this.pp,
                            suppressMenu: true,
                        }, {
                            field: "VAL_PP_VAR_PCT",
                            headerName: "VAR %",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth:70,
                            valueFormatter: function(params) { return formatNumber((params.value != undefined ? params.value : 0 ), "#,##0.0") + ' %'; },
                            hide: this.pp,
                            suppressMenu: true,
                        }
                    ]
                }, {
                    headerName: "LY",
                    headerClass: "headerTop2",
                    field:'',
                    suppressMenu: true,
                    type:'string',
                    minWidth:140,
                    children: [{
                            field: "VAL_LY_VAR",
                            headerName: "VAR",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth:70,
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber(params.value, "#,##0."); },
                            hide: this.ly || !GLOBALS.isShowLyData,
                            suppressMenu: true,
                        }, {
                            field: "VAL_LY_VAR_PCT",
                            headerName: "VAR %",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth: 70,
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber((params.value != undefined ? params.value : 0 ), "#,##0.0") + ' %';},
                            hide: this.ly || !GLOBALS.isShowLyData,
                            suppressMenu: true,
                        }
                    ]
                }
            ]
        };
        
        if(this.valueSales)
            columnsName.push(valueSales);

        var valueShare = {
            headerName: "VALUE SHARE",
            headerClass: "headerTop3",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:260,
            children: [{
                    field: "VAL_TP_SHARE",
                    headerName: "TP",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "VAL_PP_SHARE",
                    headerName: "PP",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "VAL_LY_SHARE",
                    headerName: "LY",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.valueShare)
            columnsName.push(valueShare);

        var volumeSales = {
            headerName: "VOLUME SALES",
            headerClass: "headerTop2",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "VOL_TP",
                    headerName: "TP",
                    headerClass: "headerTop2",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) {  return formatNumber(params.value, "#,##0."); },
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    headerName: "PP",
                    headerClass: "headerTop2",
                    field:'',
                    suppressMenu: true,
                    type:'string',
                    minWidth:140,
                    children: [{
                            field: "VOL_PP_VAR",
                            headerName: "VAR",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth: 70,
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                            hide: this.pp,
                            suppressMenu: true,
                        }, {
                            field: "VOL_PP_VAR_PCT",
                            headerName: "VAR %",
                            headerClass: "headerTop2",
                            minWidth: 70,
                            type: "numericColumn",
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber((params.value != undefined ? params.value : 0 ), "#,##0.0", ) + ' %';},
                            hide: this.pp,
                            suppressMenu: true,
                        }
                    ]
                }, {
                    headerName: "LY",
                    headerClass: "headerTop2",
                    field:'',
                    suppressMenu: true,
                    type:'string',
                    minWidth:140,
                    children: [{
                            field: "VOL_LY_VAR",
                            headerName: "VAR",
                            headerClass: "headerTop2",
                            type: "numericColumn",
                            minWidth: 70,
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                            hide: this.ly || !GLOBALS.isShowLyData,
                            suppressMenu: true,
                        }, {
                            field: "VOL_LY_VAR_PCT",
                            headerName: "VAR %",
                            headerClass: "headerTop2",
                            minWidth: 70,
                            type: "numericColumn",
                            cellClass: ["text-left"],
                            valueFormatter: function(params) { return formatNumber((params.value != undefined ? params.value : 0 ), "#,##0.0") + ' %';},
                            hide: this.ly || !GLOBALS.isShowLyData,
                            suppressMenu: true,
                        }
                    ]
                }

            ]
        };

        if (this.volumeSales)
            columnsName.push(volumeSales);

        var volumeShare = {
            headerName: "VOLUME SHARE",
            headerClass: "headerTop3",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:260,
            children: [{
                    field: "VOL_TP_SHARE",
                    headerName: "TP",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "VOL_PP_SHARE",
                    headerName: "PP",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "VOL_LY_SHARE",
                    headerName: "LY",
                    headerClass: "headerTop3",
                    type: "numericColumn",
                    minWidth: 85,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return params.value + ' %';},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.volumeShare)
            columnsName.push(volumeShare);                    
            
        var price = {
            headerName: "PRICE",
            headerClass: "headerTop4",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "PRICE_TP",
                    headerName: "TP",
                    headerClass: "headerTop4",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "PRICE_PP",
                    headerName: "PP",
                    headerClass: "headerTop4",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "PRICE_LY",
                    headerName: "LY",
                    headerClass: "headerTop4",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.priceColumn)
            columnsName.push(price);

        var distribution = {
            headerName: "DISTRIBUTION",
            headerClass:"headerTop5",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "DIST_TP",
                    headerName: "TP",
                    headerClass:"headerTop5",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "DIST_PP",
                    headerName: "PP",
                    headerClass:"headerTop5",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "DIST_LY",
                    headerName: "LY",
                    headerClass:"headerTop5",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.distributionColumn)
            columnsName.push(distribution);

        var value_sppd = {
            headerName: "VALUE SPPD",
            headerClass: "headerTop6",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "VALUE_SPPD_TP",
                    headerName: "TP",
                    headerClass: "headerTop6",
                    type: "numericColumn",                    
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "VALUE_SPPD_PP",
                    headerName: "PP",
                    headerClass: "headerTop6",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "VALUE_SPPD_LY",
                    headerName: "LY",
                    headerClass: "headerTop6",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.value_sppd)
            columnsName.push(value_sppd);
          
        var volume_sppd = {
            headerName: "VOLUME SPPD",
            headerClass:"headerTop7",
            field:'',
            suppressMenu: true,
            type:'string',
            minWidth:200,
            children: [{
                    field: "VOLUME_SPPD_TP",
                    headerName: "TP",
                    headerClass:"headerTop7",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.tp,
                    suppressMenu: true,
                }, {
                    field: "VOLUME_SPPD_PP",
                    headerName: "PP",
                    headerClass:"headerTop7",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.pp,
                    suppressMenu: true,
                }, {
                    field: "VOLUME_SPPD_LY",
                    headerName: "LY",
                    headerClass:"headerTop7",
                    type: "numericColumn",
                    minWidth: 70,
                    cellClass: ["text-left"],
                    valueFormatter: function(params) { return formatNumber(params.value, "#,##0.##");},
                    hide: this.ly || !GLOBALS.isShowLyData,
                    suppressMenu: true,
                }
            ]
        };

        if (this.volume_sppd)
            columnsName.push(volume_sppd);

        if (this.extraColmunsFlag == false) {
            var extraColmuns = {
                headerName: "CUSTOMARS",
                headerClass:"headerTop5",
                field:'',
                suppressMenu: true,
                type:'string',
                minWidth:200,
                children: [{
                        field: "CUST_TP",
                        headerName: "TP",
                        headerClass:"headerTop5",
                        type: "numericColumn",
                        minWidth: 70,
                        cellClass: ["text-left"],
                        valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                        hide: this.tp,
                        suppressMenu: true,
                    }, {
                        field: "CUST_PP",
                        headerName: "PP",
                        headerClass:"headerTop5",
                        type: "numericColumn",
                        minWidth: 70,
                        cellClass: ["text-left"],
                        valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                        hide: this.pp,
                        suppressMenu: true,
                    }, {
                        field: "CUST_LY",
                        headerName: "LY",
                        headerClass:"headerTop5",
                        type: "numericColumn",
                        minWidth: 70,
                        cellClass: ["text-left"],
                        valueFormatter: function(params) { return formatNumber(params.value, "#,##0.");},
                        hide: this.ly || !GLOBALS.isShowLyData,
                        suppressMenu: true,
                    }
                ]
            };
        }
        return columnsName;
    }


    submitDataViaPost(url, params) {
        var f = $("<form target='_blank' method='POST' style='display:none;'></form>").attr({
            action: url
        }).appendTo(document.body);

        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                $('<input type="hidden" />').attr({
                    name: i,
                    value: params[i]
                }).appendTo(f);
            }
        }
        f.submit();
        f.remove();
    }

    // Download full grid
    downloadGrid() {
        this.customDownloadFlag = true;
        this.setSelectionData('');
        this.sendRequestToServer("exportXls").then((data: any) => {
            this.renderDownloadFile(this.result);
        });
        this.customDownloadFlag = false;
    }

    // download singel sku pp or ly BRANCHES History 
    downloadXlsxPPorLY(timeMode) {
        var downloadlink;
        this.customDownloadFlag = true;
        var customParamsObj = {
            customParams: 'SKU=' + encodeURIComponent(this.sku) + '&TPNB=' + encodeURIComponent(this.tpnb) + '&timeMode=' + timeMode,
        };
        this.setSelectionData(customParamsObj);

        this.sendRequestToServer("exportXls").then((data: any) => {
            this.renderDownloadFile(this.result);
        });
        this.customDownloadFlag = false;
    }

    renderDownloadFile(result) {
        if (result.customErrors != undefined) {
            this.options.showPodLoader.kbiGrid.customError = result.customErrors.displayMessage;
        }
        if (result.fileName != undefined) {
            window.location.href = result.fileName;
            this.options.showPodLoader.kbiGrid.showInnerLoader = false;
        }
    }

    // for mobile
    clickOnRow(data) {
        if(this.showDownloadOptions == false) {
            this.showDownloadOptions = true;
            this.productKbiGrid.options.myContextMenuItems = [
                {name:'DOWNLOAD_BRANCHES_SALES_VS_PP', text:'Download Branches Sales Vs PP', callback: () => { this.downloadXlsxPPorLY('PP') }},
                {name:'DOWNLOAD_BRANCHES_SALES_VS_LY', text:'Download Branches Sales Vs Ly', callback: () => { this.downloadXlsxPPorLY('LY') }},
            ];
            this.productKbiGrid.options.contextMenuItems.push('DOWNLOAD_BRANCHES_SALES_VS_LY');
            this.productKbiGrid.options.contextMenuItems.push('DOWNLOAD_BRANCHES_SALES_VS_PP');
            //this.productKbiGrid.dataLoaded = true;
            //this.kbiGrid.getBaseAgGrid(this.productKbiGrid)
            this.kbiGrid.getBaseAgGrid(this.productKbiGrid.columns, this.productKbiGrid.data, this.productKbiGrid.options);
        }
        if ($.isMobile) {
            this.sendRequestWithDblClickOnRow(data);
        }
    }

    // for desktop
    dblClickOnRow(data) {
        this.sendRequestWithDblClickOnRow(data);
    }

    sendRequestWithDblClickOnRow(data) {
    	this.options.showPodLoader.kbiChart.showInnerLoader = true;
        let rowsSelection = this.productKbiGrid.gridOptions.api.getSelectedRows();
        if(rowsSelection[0].TPNB != undefined) { 
            this.tpnb = rowsSelection[0].TPNB;
            this.skuName = rowsSelection[0].SKU;
            this.customDownloadFlag = true;
            setTimeout( () => {
                let val_tp:string = ((rowsSelection[0].VAL_TP - rowsSelection[0].VAL_LY) / rowsSelection[0].VAL_LY * 100).toFixed(1);
                this.percent = ((rowsSelection[0].VAL_LY != 0) ? parseFloat(val_tp) : 0);
                let overUnderPerformance:string = (this.percent - this.avgPercent).toFixed(1);
                this.overUnderPerformance = parseFloat(overUnderPerformance);
                this.overUnderPerformance = this.overUnderPerformance > 0 ? "+" + this.overUnderPerformance + "pp" : this.overUnderPerformance + "pp";

                var distributionChartData = [{account: "LAST YEAR", LYEAR: rowsSelection[0].DIST_LY}, {account: "THIS YEAR", TYEAR: rowsSelection[0].DIST_TP}];
                var distributionChartDataPer = (rowsSelection[0].DIST_LY > 0) ? (((rowsSelection[0].DIST_TP-rowsSelection[0].DIST_LY)/rowsSelection[0].DIST_LY) * 100) : 0;

                let distributionChartDataPerStr:string = distributionChartDataPer.toFixed(1);
                //distributionChartDataPer = parseInt(distributionChartDataPerStr);
                distributionChartDataPerStr = (distributionChartDataPer > 0) ? "+" + distributionChartDataPerStr + "%" : distributionChartDataPerStr + "%";

                this.distributionCountChart = this.setGrowthDeclineChart(distributionChartData, distributionChartDataPerStr, "distributionCount");
                this.distributionChartData = distributionChartData;

                rowsSelection[0].VOL_LY = parseFloat(rowsSelection[0].VOL_LY);
                var salesChartData = [{account: "LAST YEAR", LYEAR: rowsSelection[0].VOL_LY}, {account: "THIS YEAR", TYEAR: rowsSelection[0].VOL_TP}];
                var salesChartDataPer = (rowsSelection[0].VOL_LY > 0) ? (((rowsSelection[0].VOL_TP-rowsSelection[0].VOL_LY)/rowsSelection[0].VOL_LY) * 100) : 0;
                let dataPerVal:string = salesChartDataPer.toFixed(1);
                dataPerVal = (salesChartDataPer) > 0 ? "+" + dataPerVal + "%" : dataPerVal + "%";

                this.unitSalesChart = this.setGrowthDeclineChart(salesChartData, dataPerVal, "unitSales");
                this.salesChartData = salesChartData;

                var averageChartData = [{account: "LAST YEAR", LYEAR: rowsSelection[0].PRICE_LY}, {account: "THIS YEAR", TYEAR: rowsSelection[0].PRICE_TP}];
                var averageChartDataPer = (rowsSelection[0].PRICE_LY > 0) ? (((rowsSelection[0].PRICE_TP-rowsSelection[0].PRICE_LY)/rowsSelection[0].PRICE_LY) * 100) : 0;
                let averageChartDataPerStr:string = averageChartDataPer.toFixed(1);
                averageChartDataPerStr = (averageChartDataPer) > 0 ? "+" + averageChartDataPerStr + "%" : averageChartDataPerStr + "%";

                this.averagePriceChart = this.setGrowthDeclineChart(averageChartData, averageChartDataPerStr, "averagePrice");
                this.averageChartData = averageChartData;

                this.options.showPodLoader.kbiChart.showInnerLoader = false;

            }, 1000);

            this.modalRef = this.modalService.show(this.chartModal);
            this.customDownloadFlag = false;
        }
    }

    // Set Growth Decline COLUMN chart
    setGrowthDeclineChart(data, title, chartname) {
        this.growthDeclineChart = {
            dataSource: {
                data: data
            },
            title: {
                text: title,
                font: "bold 14px Arial,Helvetica,sans-serif",
                color: "#666666"
            },
            series: [
                {color: "#2B80B5", spacing: 0, field: 'LYEAR', stack: "account", name: "account"},
                {color: "#FF9A00", spacing: 0, field: 'TYEAR', stack: "account", name: "account"}
            ],
            seriesDefaults: {
                type: 'column',
                style: 'smooth',
                labels: {
                    hidden: true,
                    position: "bottom",
                    background: "transparent",
                    margin: {top: 20, left: 0},
                    padding: 5,
                    template: (e) => {
                        if (chartname == 'averagePrice')
                            var Val = (e.dataItem.TYEAR) ? e.dataItem.TYEAR : e.dataItem.LYEAR;
                        else
                            var Val = (e.dataItem.TYEAR) ? formatNumber(e.dataItem.TYEAR, "#,##0.") : formatNumber(e.dataItem.LYEAR, "#,##0.");
                        return Val;
                    }
                }
            },
            valueAxis: {
                min: '0',
                visible: true,
                minorGridLines: {
                    visible: false
                },
                majorGridLines: {
                    visible: false,
                }
            },
            categoryAxis: {
                field: "account",
                minorGridLines: {
                    visible: false
                },
                labels: {
                    font: "11px Arial,Helvetica,sans-serif"
                }
            },
            legend: {
                visible: false,
                position: "bottom",
            }
            /*,
            tooltip: {
                visible: true,
                //template: "#= category #<br /> #= value # "
                template: function(e) {
                    if (chartname == 'averagePrice')
                        var Val = (e.dataItem.TYEAR) ? e.dataItem.TYEAR : e.dataItem.LYEAR;
                    else
                        var Val = (e.dataItem.TYEAR) ? format("#,##0.", e.dataItem.TYEAR) : format("#,##0.", e.dataItem.LYEAR);
                    return "<div class='chartTooltipTitle'>" + e.dataItem.account + "</div><div class='chartTooltipLine'>" + Val + "</div>";
                }
            }*/
        };
        return this.growthDeclineChart;
    }

    /**
     * Method: sendRequestToServer
     * Action: GET DATA FROM SERVER
     * Params: ACTION
     * Returns: RESULT WITH SERVICES
     **/
    sendRequestToServer(action) {
        this.privateLabelStatus = (this.hidePrivateLabel == undefined) ? GLOBALS.isShowPrivateLabel : this.hidePrivateLabel;
        if (this.findParamsKeyValue(this.selectionParams, 'ACCOUNT') == this.ACCOUNT) {
            this.extraColmunsFlag = true;
        } else {
            this.extraColmunsFlag = false;
        }

        var params = this.selectionParams;
        params.push("destination=" + this.requestPageName);
        params.push("action=" + action);
        params.push("pageID=" + this.pageID);
        params.push("HidePrivate=" + this.privateLabelStatus);

        return this._sendRequestService.filterChange(params,'','').then((result: any) => {
            this.result = result;
        });
    }

    /**
     * Method: dataRead
     * Action: ALL RESULT DATA READ
     * Params: RESULT DATA of JSON FORMAT
     * Returns: ...
     **/
    dataRead(result) {

        if (result.customErrors != undefined) {
            GLOBALS.templateDetails[this.servicePageName].pageLoaded = false;
            GLOBALS.setProjectPageCustomErrors(result.customErrors.displayMessage, this.servicePageName, this.pageID);
            return ;
        }

        this.showDownloadOptions = false;
        this.chartRequestOnly = false;

        if (result.pageConfig != undefined) {
            this.showTimeSelection = this.showProductFilter = this.showMarketFilter = this.showMeasureSelection = false;
            this.isServiceRequest = false;
            if (result.pageConfig.enabledFilters != undefined && result.pageConfig.enabledFilters.length > 0) {
                if (result.pageConfig.enabledFilters.indexOf('time-selection') != -1)
                    this.showTimeSelection = true;

                if (result.pageConfig.enabledFilters.indexOf('product-selection') != -1)
                    this.showProductFilter = true;

                if (result.pageConfig.enabledFilters.indexOf('market-selection') != -1)
                    this.showMarketFilter = true;

                if (result.pageConfig.enabledFilters.indexOf('measure-selection') != -1)
                    this.showMeasureSelection = true;
            }
        }

        //grid column configuring
        if (result.gridColumnConfig != undefined) {
            this.volumeSales = this.volumeShare = this.valueSales = this.valueShare = this.priceColumn = this.distributionColumn = this.value_sppd = this.volume_sppd = false;
            if (result.gridColumnConfig.enabledColumnGroup != undefined && result.gridColumnConfig.enabledColumnGroup.length > 0) {
                if (result.gridColumnConfig.enabledColumnGroup.indexOf('volume_sales') != -1)
                    this.volumeSales = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('volume_share') != -1)
                    this.volumeShare = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('value_sales') != -1)
                    this.valueSales = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('value_share') != -1)
                    this.valueShare = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('price') != -1)
                    this.priceColumn = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('distribution') != -1)
                    this.distributionColumn = true;

                if (result.gridColumnConfig.enabledColumnGroup.indexOf('value_sppd') != -1)
                    this.value_sppd = true;
                    
                if (result.gridColumnConfig.enabledColumnGroup.indexOf('volume_sppd') != -1)
                    this.volume_sppd = true;
            }

            if (result.gridColumnConfig.dispColumnOptions != undefined && result.gridColumnConfig.dispColumnOptions.length > 0) {
                this.tp = this.pp = this.ly = true;
                if (result.gridColumnConfig.dispColumnOptions.indexOf('TP') != -1)
                    this.tp = false;

                if (result.gridColumnConfig.dispColumnOptions.indexOf('PP') != -1)
                    this.pp = false;
                
                if (result.gridColumnConfig.dispColumnOptions.indexOf('LY') != -1)
                    this.ly = false;
            }else{
                this.tp = this.pp = this.ly = false;
            }

            if (result.gridColumnConfig.kbiRank != undefined && result.gridColumnConfig.kbiRank.length > 0) {
                this.isRank = true;
            }
        }

        if (result.gridColumns) {
            this.gridColumns = result.gridColumns;
            this.ACCOUNT_NAME = this.gridColumns['SKU'];
        }

        this.dataLoaded = true;
        
        if (this.isFirstRequest) {
            setTimeout( () => {
                this.sendPodRequest();
            }, 100);
        }
    }
    
    sendPodRequest() {
        this.customDownloadFlag = false;
        this.setSelectionData('');
        this.isFirstRequest = false;
    }


    onSelection(data) {
        this.tpnb = data.TPNB;
        this.sku = data.SKU;
        this.showDownloadOptions = true;
    }
    
    findParamsKeyValue(arrayInput, keyIndex) {
        var returnValue;
        for (let key in arrayInput) {
        	var value = arrayInput[key];
        //angular.forEach(arrayInput, function(value, key) {
            var matchKey = value.split('=');
            if (matchKey[0] == keyIndex) {
                returnValue = matchKey[1];
            }
        }
        //});
        return returnValue;
    }

   
    createFooterRow(data) {
        var TPNB;
        var DIST_LY = 0;
        var DIST_PP = 0;
        var DIST_TP = 0;
        var PRICE_LY = 0;
        var PRICE_PP = 0;
        var PRICE_TP = 0;
        var VALUE_SPPD_LY = 0;
        var VALUE_SPPD_PP = 0;
        var VALUE_SPPD_TP = 0;
        var VAL_LY = 0;
        var VAL_LY_SHARE = 0;
        var VAL_LY_VAR = 0;
        var VAL_LY_VAR_PCT = 0;
        var VAL_PP = 0;
        var VAL_PP_SHARE = 0;
        var VAL_PP_VAR = 0;
        var VAL_PP_VAR_PCT = 0;
        var VAL_TP = 0;
        var VAL_TP_SHARE = 0;
        var VOLUME_SPPD_LY = 0;
        var VOLUME_SPPD_PP = 0;
        var VOLUME_SPPD_TP = 0;
        var VOL_LY = 0;
        var VOL_LY_SHARE = 0;
        var VOL_LY_VAR = 0;
        var VOL_LY_VAR_PCT = 0;
        var VOL_PP_SHARE = 0;
        var VOL_PP = 0;
        var VOL_PP_VAR = 0;
        var VOL_PP_VAR_PCT = 0;
        var VOL_TP = 0;
        var VOL_TP_SHARE = 0;
        
        data.forEach(function(obj, key){
            
            DIST_LY += parseFloat(obj.DIST_LY);
            DIST_PP += parseFloat(obj.DIST_PP);
            DIST_TP += parseFloat(obj.DIST_TP);

            PRICE_LY += parseFloat(obj.PRICE_LY);
            PRICE_PP += parseFloat(obj.PRICE_PP);
            PRICE_TP += parseFloat(obj.PRICE_TP);

            VALUE_SPPD_LY += parseFloat(obj.VALUE_SPPD_LY);
            VALUE_SPPD_PP += parseFloat(obj.VALUE_SPPD_LY);
            VALUE_SPPD_TP += parseFloat(obj.VALUE_SPPD_LY);

            VAL_LY += parseFloat(obj.VAL_LY);
            VAL_LY_SHARE += parseFloat(obj.VAL_LY_SHARE);
            VAL_LY_VAR += parseFloat(obj.VAL_LY_VAR);

            VAL_LY_VAR_PCT += parseFloat(obj.VAL_LY_VAR_PCT);
            VAL_PP += parseFloat(obj.VAL_PP);
            VAL_PP_SHARE += parseFloat(obj.VAL_PP_SHARE);

            VAL_PP_VAR += parseFloat(obj.VAL_PP_VAR);
            VAL_PP_VAR_PCT += parseFloat(obj.VAL_PP_VAR_PCT);
            VAL_TP += parseFloat(obj.VAL_TP);
            VAL_TP_SHARE += parseFloat(obj.VAL_TP_SHARE);

            VOLUME_SPPD_LY += parseFloat(obj.VOLUME_SPPD_LY);
            VOLUME_SPPD_PP += parseFloat(obj.VOLUME_SPPD_PP);
            VOLUME_SPPD_TP += parseFloat(obj.VOLUME_SPPD_TP);

            VOL_LY += parseFloat(obj.VOL_LY);
            VOL_LY_SHARE += parseFloat(obj.VOL_LY_SHARE);
            VOL_LY_VAR += parseFloat(obj.VOL_LY_VAR);

            VOL_LY_VAR_PCT += parseFloat(obj.VOL_LY_VAR_PCT);
            VOL_PP_SHARE += parseFloat(obj.VOL_PP_SHARE);
            VOL_PP += parseFloat(obj.VOL_PP);


            VOL_PP_VAR += parseFloat(obj.VOL_PP_VAR);
            VOL_PP_VAR_PCT += parseFloat(obj.VOL_PP_VAR_PCT);
            VOL_TP += parseFloat(obj.VOL_TP);
            VOL_TP_SHARE += parseFloat(obj.VOL_TP_SHARE);

        });

        var result = [{
            TPNB:"Total",
            DIST_LY:formatNumber(DIST_LY, "#,##0."),
            DIST_PP:formatNumber(DIST_PP, "#,##0."),
            DIST_TP:formatNumber(DIST_TP, "#,##0."),
            PRICE_LY:formatNumber(PRICE_LY, "#,##0."),
            PRICE_PP:formatNumber(PRICE_PP, "#,##0."),
            PRICE_TP:formatNumber(PRICE_TP, "#,##0."),
            VALUE_SPPD_LY:formatNumber(VALUE_SPPD_LY, "#,##0."),
            VALUE_SPPD_PP:formatNumber(VALUE_SPPD_LY, "#,##0."),
            VALUE_SPPD_TP:formatNumber(VALUE_SPPD_LY, "#,##0."),
            VAL_LY:formatNumber(VAL_LY, "#,##0."),
            VAL_LY_SHARE:formatNumber(VAL_LY_SHARE, "#,##0."),
            VAL_LY_VAR:formatNumber(VAL_LY_VAR, "#,##0."),
            VAL_LY_VAR_PCT:formatNumber(VAL_LY_VAR_PCT, "#,##0."),
            VAL_PP:formatNumber(VAL_PP, "#,##0."),
            VAL_PP_SHARE:formatNumber(VAL_PP_SHARE, "#,##0."),
            VAL_PP_VAR:formatNumber(VAL_PP_VAR, "#,##0."),
            VAL_PP_VAR_PCT:formatNumber(VAL_PP_VAR_PCT, "#,##0."),
            VAL_TP:formatNumber(VAL_TP, "#,##0."),
            VAL_TP_SHARE:formatNumber(VAL_TP_SHARE, "#,##0."),
            VOLUME_SPPD_LY:formatNumber(VOLUME_SPPD_LY, "#,##0."),
            VOLUME_SPPD_PP:formatNumber(VOLUME_SPPD_PP, "#,##0."),
            VOLUME_SPPD_TP:formatNumber(VOLUME_SPPD_TP, "#,##0."),
            VOL_LY:formatNumber(VOL_LY, "#,##0."),
            VOL_LY_SHARE:formatNumber(VOL_LY_SHARE, "#,##0."),
            VOL_LY_VAR:formatNumber(VOL_LY_VAR, "#,##0."),
            VOL_LY_VAR_PCT:formatNumber(VOL_LY_VAR_PCT, "#,##0."),
            VOL_PP_SHARE:formatNumber(VOL_PP_SHARE, "#,##0."),
            VOL_PP:formatNumber(VOL_PP, "#,##0."),
            VOL_PP_VAR:formatNumber(VOL_PP_VAR, "#,##0."),
            VOL_PP_VAR_PCT:formatNumber(VOL_PP_VAR_PCT, "#,##0."),
            VOL_TP:formatNumber(VOL_TP, "#,##0."),
            VOL_TP_SHARE:formatNumber(VOL_TP_SHARE, "#,##0.")
        }];

        return result;
    }

    rebuildPageProcess() {
    	this.rebuildPageScope = true;
        this.setSelectionData('');
    }

    freePageObjectProcess() {
    	delete this.gridDataForExport;
        delete this.productKbiGrid;
        delete this.avgPercent;
        delete this.distributionCountChart;
        delete this.averagePriceChart;
        delete this.unitSalesChart;
    }

    closeModal() {
    	this.modalRef.hide();
        delete this.avgPercent;
        delete this.distributionCountChart;
        delete this.averagePriceChart;
        delete this.unitSalesChart;
    }

}
