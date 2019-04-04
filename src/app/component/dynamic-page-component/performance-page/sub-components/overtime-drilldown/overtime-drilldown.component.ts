import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { HelperService } from '../../../../../services/helper.service';
import { Surface, Path, Text, Group, Layout, LinearGradient, GradientOptions, ShapeOptions } from '@progress/kendo-drawing';
import { Arc as DrawingArc, GradientStop } from '@progress/kendo-drawing';
import { Arc, Rect, ArcOptions } from '@progress/kendo-drawing/geometry';
import { formatNumber, IntlService } from '@progress/kendo-angular-intl';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { ChartComponent, AxisLabelVisualArgs, ChartsModule } from '@progress/kendo-angular-charts';
import { NformatterPipe } from '../../../../../pipe/nformatter.pipe';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GLOBALS } from '../../../../../globals/globals';
import { saveAs } from '@progress/kendo-file-saver';

import * as $ from 'jquery';

@Component({
	selector: 'overtime-drilldown',
	templateUrl: './overtime-drilldown.component.html',
	styleUrls: ['./overtime-drilldown.component.scss']
})
export class OvertimeDrilldownComponent implements OnInit {

	@Input() options;

	@ViewChild('drillDownChartObj') drillDownChartObj;
	private chart: ChartComponent;

	@ViewChild('container', { read: ViewContainerRef }) public container: ViewContainerRef;
	@ViewChild('anchor') anchor;
	@ViewChild('template') template;

	@Output() tabSelectionEvent = new EventEmitter();

	resetSlider:any;
	opened:boolean;
	pSelectionData:any;
	mSelectionData:any;
	tileSelectionData:any;
	randomData:any;
	defaultChartItemWidth:any;
	dataSourceKey:any;
	rotation:any;
	fontSize:any;
	itemNumbers:any;
	allOtherCount:any;
	skuSingleData:any;
	isShowLyData:any;
	isShowTyData:any;
	chartFooterBredcrumb:any;
	aggregateConfig:any;
	selectedItems:any;
	sliderContainer:any;
	drilldownOvertimeChart:any;
	chartData:any;
	retobj:any;
	drillDownModalWidth:any;
	drillDownChartTabs:any;
	columnchartdecimalplaces;
    linechartdecimalplaces;
    unit:any;
    dataTips:any;
    customChartSelectionWindowVisible:boolean;
    legendAlign:any;

    private popupRef: PopupRef;

	constructor(private _helperService: HelperService, private nformatterPipe: NformatterPipe, public intl: IntlService, private popupService: PopupService) { }

	public onContextMenuSelect({ item }): void {
        if(this[item.logicFunctionName] != undefined)
            this[item.logicFunctionName](item);
    }

    public labelContent = (e: any) => {
    	if (e.value > 1000000) {
    		var value = GLOBALS.nFormatter(e.value, 0);
    	} else {
    		var value = formatNumber(Number(e.value), 'n'+this.columnchartdecimalplaces);
    	}
    	return value;
    }

	ngOnInit() {
		
		this.options.dataTips = true;
	    this.options.fitPageWidth = true;
	    this.options.showTopCnt = 1;
	    this.randomData = this._helperService.getRandomData();
	    this.options.performanceChartGridClass = "performancePageChartContainer_" + this.randomData;
	    this.options.customChartOptionsID = "customChartOptionsID_" + this.randomData;
	    this.options.dataDecimalPlaces = {columnData: 0, lineData: 0};

	    // initialize context options of DRILL DOWN grid
	    this.options.drilldownOvertimeContextOptions = {
	        container: "." + this.options.performanceChartGridClass,
	        isGrid: false,
	        csvData: '',
	        isTab: true,
	        customOptions: true,
	        advanceChartExport: false,
	        isShowLyData: true,
	        isShowTyData: true,
	        menuItems: [
                {menuSlug: 'SHOW_HIDE_DATA_TIPS', menuText: 'Show/Hide Data Tips', logicFunctionName: 'fnShowHideDataTips', functionScope: 'parentComponent'},
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnSetPerformanceDrilldownGrid', functionScope: 'parentComponent'},
                {menuSlug: 'TY_AND_LY', menuText: 'TY AND LY', logicFunctionName: 'fnTYANDLYChart', functionScope: 'parentComponent'},
                {menuSlug: 'TY_VS_LY', menuText: 'TY Vs LY', logicFunctionName: 'fnTYVSLYChart', functionScope: 'parentComponent', extraOptions:'VARIANCE'},
                {menuSlug: 'TY_VS_LY_PER', menuText: 'TY Vs LY(%)', logicFunctionName: 'fnTYVSLYChart', functionScope: 'parentComponent', extraOptions:'VARPER'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Drill Down Chart', functionScope: 'self'},
                {menuSlug: 'CUSTOM_CHART_OPTIONS', menuText: 'Custom Chart Options', logicFunctionName: 'fnSetCustomChartOptions', functionScope: 'parentComponent'}
            ]
	    };
	    //console.log(this.options.drilldownOvertimeContextOptions);

	    this.options.allOthers = true;
	    this.options.fitPageWidth = true;
	    this.opened = true;
	    this.customChartSelectionWindowVisible = false;
	    this.drillDownModalWidth = 600;
	    this.dataTips = true;
	    this.options.legendAlign = 'center';
	}

	ngDoCheck() {
		if(this.options.dataLoaded != undefined && this.options.dataLoaded == true) {
        	this.isShowLyData = (this.options.isShowLyData != undefined) ? this.options.isShowLyData : ((GLOBALS.isShowLyData != undefined ) ? GLOBALS.isShowLyData : true);
            this.isShowTyData = (this.options.isShowTyData != undefined) ? this.options.isShowTyData : ((GLOBALS.isShowTyData != undefined ) ? GLOBALS.isShowTyData : true);
            GLOBALS.timeSelectionModeVal = (GLOBALS.timeSelectionModeVal != undefined) ? GLOBALS.timeSelectionModeVal : 1;
            this.options.drilldownOvertimeContextOptions.isShowLyData = this.isShowLyData;
            this.options.drilldownOvertimeContextOptions.isShowTyData = this.isShowTyData;
            this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].fontSize = 12;
		    this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].rotation = 0;
		    this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].isVisibleSelectionToTitle = false;
		    this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].isVisibleSelectionToFooterTitle = false;
		    this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].chartTextWrap = true;
		    this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].legendAlign = (this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].legendAlign != undefined) ? this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].legendAlign : 'center';
            this.callToDataRender();
		}
		if(this.options.isDefaultLayout != undefined) {
			this.performancePageChangeLayout();
		}
		/*if(this.options.configUpdated != undefined && this.options.configUpdated == true) {
			this.defaultActiveTabs();
	    }*/
	}

    onChartRender(event) {
        this.options.drilldownOvertimeContextOptions.containerObj = this.drillDownChartObj;
    }

	fnSetVisibleItems(selectedEle){
        this.options.drilldownOvertimeContextOptions.maxVisibleItems = selectedEle.data;
        this.options.dataLoaded = true;
    }

    getMaximumValue(val) {
    	return Number(val) + Math.ceil((val * 10) / 100);
	}

	//Formate PERFORMANCE  data
	formateGridData(tempRows, otherMeasureDataKey) {
		
	    var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	    var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
	    var LYFIELD = "LY" + selectedMeasure[0].jsonKey;
	    this.options.dataDecimalPlaces.lineData = selectedMeasure[0].dataDecimalPlaces;
	    
	    var data = [];

	    if (otherMeasureDataKey != undefined && otherMeasureDataKey != '') {
	        var TY_OTHER_FIELD = "TY" + otherMeasureDataKey;
	        var LY_OTHER_FIELD = "LY" + otherMeasureDataKey;
	    }

	    if (tempRows.length > 0) {
	        for (var i = 0; i < tempRows.length; i++) {
	            
	            if (tempRows[i][LYFIELD] > 0) {
	                var varPercent = ((tempRows[i][TYFIELD] - tempRows[i][LYFIELD]) * 100) / tempRows[i][LYFIELD];
	            } else {
	                var varPercent = 0;
	            }

	            if (tempRows[i][LY_OTHER_FIELD] > 0) {
                    var varPercentOther = ((tempRows[i][TY_OTHER_FIELD] - tempRows[i][LY_OTHER_FIELD]) * 100) / tempRows[i][LY_OTHER_FIELD];
                } else {
                    var varPercentOther = 0;
                }	

	            var temp = {
	            	ID:(typeof (tempRows[i].ID) != 'undefined') ? tempRows[i].ID : '',
	            	ACCOUNT:tempRows[i].ACCOUNT,
	            	LYACCOUNT:tempRows[i].LYACCOUNT,
	            	LYVALUE:tempRows[i][LYFIELD],
	            	TYVALUE:tempRows[i][TYFIELD],
	            	[LYFIELD]:tempRows[i][LYFIELD],
	            	[TYFIELD]:tempRows[i][TYFIELD],
	            	VAR:tempRows[i][TYFIELD] - tempRows[i][LYFIELD],
	            	VARPER:varPercent.toFixed(1),
	            	[TY_OTHER_FIELD]:(otherMeasureDataKey != undefined) ? tempRows[i][TY_OTHER_FIELD] : '',
	            	[LY_OTHER_FIELD]:(otherMeasureDataKey != undefined) ? tempRows[i][LY_OTHER_FIELD] : '',
	            	[otherMeasureDataKey+'_VAR']:(otherMeasureDataKey != undefined) ? tempRows[i][TY_OTHER_FIELD] - tempRows[i][LY_OTHER_FIELD] : '',
	            	[otherMeasureDataKey+'_VARPER']:(otherMeasureDataKey != undefined) ? varPercentOther.toFixed(1) : ''
	            };
	            data.push(temp);
	        }
	    }
	    return data;
	}

	// setting default items or colums chart
	getDefalutItems() {
		var itemNumbers;
	    this.options.notFitScreenWidth = 0;
	    this.resetSlider = true;
	    itemNumbers = parseInt(this.options.chartContainerWidth) / parseInt(this.defaultChartItemWidth);
	    itemNumbers = itemNumbers > this.options.totalLength ? this.options.totalLength : itemNumbers;
	    this.options.drillDownData = this.options.drillDownDataBackup.slice(0, itemNumbers);
	}

	/**
	 * getLegendOffsetX() to get the possition of legend
	 * @returns {Number}
	 */
	getLegendOffsetX() {
		var leftPosition,rightPosition;
	    this.options.chartContainerWidth = $(this.options.pageName + " #drillDownChartDiv").width();
	    var containerWidth = parseInt(this.options.chartContainerWidth);
	    var legendPosition = 0, rejectedWidth = 200;
	    leftPosition = ((containerWidth / 2) - containerWidth) + rejectedWidth;
	    rightPosition = (containerWidth / 2) - rejectedWidth;
	    if (this.options.drilldownOvertimeContextOptions.activeTab == 'one') {
	        if (this.options.legendAlign == 'start') {
	            legendPosition = leftPosition;
	        } else if (this.options.legendAlign == 'end') {
	            legendPosition = rightPosition;
	        } else {
	            //legendPosition = 0;
	        }
	    } else {
	        if (this.options.overtimeLegendAlign == 'start') {
	            legendPosition = leftPosition;
	        } else if (this.options.overtimeLegendAlign == 'end') {
	            legendPosition = rightPosition;
	        } else {
	            //legendPosition = 0;
	        }
	    }
	    //console.log(legendPosition);
	    return legendPosition;
	}

	/**
	 * method: setPriceOvertimeData
	 * action: configuring over time chart and slider with data binding
	 * @returns {void}
	 */
	setOvertimeDataMultiple(columnDataKey, lineDataKey, overtimeTabName, chartName, dataSourceKey) {

	    if (chartName == 'DRILLDOWN_DEFAULT') {
	        this.getDefalutItems();
	        if (this.options.allOthers)
	            this.setAllOthers();
	    }
	    
	    var vsTextTyear = GLOBALS.vsLabel == "Last Period" ? "THIS YEAR" : "THIS PERIOD";
	    var vsTextLyear = GLOBALS.vsLabel == "Last Period" ? "LAST YEAR" : "PREVIOUS PERIOD";
	    var tyLineColorCode = "#21558E";
	    var lyLineColorCode = "#BD191A";
	    var tyColumnColorCode = "#CBCFF2";
	    var lyColumnColorCode = "#F2CBCB";
	    var showLyBasedOnChartName = true;
	    var axisConfiguration = [];
	    var graphType = "OVERTIME";



	    if (chartName == 'DRILLDOWN_VARIANCE' || chartName == 'DRILLDOWN_VARPER') {
	        chartName = (chartName == 'DRILLDOWN_VARIANCE') ? 'VARIANCE' : 'VARPER';
	        graphType = "DRILLDOWN";
	    }

	    var chartName = (chartName != undefined && chartName != '') ? chartName : "default";
	    var dataSourceKey = (dataSourceKey != undefined && dataSourceKey != '') ? dataSourceKey : "overTimeData";
	    
	    var leftText = ((chartName == 'VARIANCE') ? "Variance " : ((chartName == 'VARPER') ? "Variance %" : GLOBALS.measureLabel));
	    var showColumnChart = (columnDataKey != undefined && columnDataKey != '') ? true : false;
	    var showLineChart = (lineDataKey != undefined && lineDataKey != '') ? true : false;

	    var tyLineDataKey = "";
	    var lyLineDataKey = "";
	    var tyColumnDataKey = "";
	    var lyColumnDataKey = "";
	    var MAX_VALUE = 0;
	    var MIN_VALUE = 0;

	    if (chartName == 'DRILLDOWN_DEFAULT' || chartName == 'DRILLDOWN') {
	        graphType = "DRILLDOWN";
	        var tyColumnColorCode = "#21558E";
	        var lyColumnColorCode = "#BD191A";
	    } else if (chartName == 'VARIANCE' || chartName == 'VARPER') {
	        tyLineDataKey = lineDataKey;
	        showLyBasedOnChartName = false;
	        vsTextTyear = (chartName == 'VARIANCE') ? 'Variance' : 'Percent';
	        tyLineColorCode = (chartName == 'VARIANCE') ? '#6D7B8D' : '#6754CA';
	    } else {
	        tyLineDataKey = "TY" + lineDataKey;
	        lyLineDataKey = "LY" + lineDataKey;
	    }

	    $(this.options.pageName + " .k-slider-horizontal").show();

	    if (dataSourceKey == "overTimeData") {
	        if (chartName == 'VARIANCE' || chartName == 'VARPER') {
	            var columnDataKeyChange = columnDataKey.replace("_VARPER", "").replace("_VAR", "");
	        } else {
	            var columnDataKeyChange = columnDataKey;
	        }
			this[dataSourceKey] = this.formateGridData(this.options[dataSourceKey][this.options.activeTabName], columnDataKeyChange);
	    } else {
	        
	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});

	        if(chartName == 'VARPER') {
	            this.options.dataDecimalPlaces.columnData = 1;
	        }else{
	            this.options.dataDecimalPlaces.columnData = selectedMeasure[0].dataDecimalPlaces;
	        }
	        this[dataSourceKey] = this.formateGridData(this.options[dataSourceKey], '');
	        //this.unit = selectedMeasure[0]['measureName'];
	    }

	    this.rotation = this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].rotation;  //measureRotation(this.drillDownData);
	    this.fontSize = this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].fontSize;
	    
	    if(this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].setDefaultTextWrap){
	        if(this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].tabType == 'OVERTIME')
	            this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].chartTextWrap = true;
	        else
	            this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].chartTextWrap = (this[dataSourceKey].length <= 10) ? true : false;
	    }

	    //local variables for chart template
	    var linechartdecimalplaces = this.options.dataDecimalPlaces.lineData;
	    var columnchartdecimalplaces = this.options.dataDecimalPlaces.columnData;
	    this.chartData = this[dataSourceKey];
	    var activeTabNameChart = this.options.activeTabName;
	    var chartTabMappings = this.options.chartTabMappings;
	    var tabsConfiguration = this.options.tabsConfiguration;
	    this.columnchartdecimalplaces = columnchartdecimalplaces;
	    this.linechartdecimalplaces = linechartdecimalplaces;
	    //this.legendAlign = this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].legendAlign;
	    this.legendAlign = this.options.legendAlign;

	    if (showColumnChart) {
	        var maxValueTY = 0;
	        var maxValueLY = 0;
	        var minValueTY = 0;
	        var minValueLY = 0;

	        if (chartName == 'VARIANCE' || chartName == 'VARPER')
	            tyColumnDataKey = columnDataKey;
	        else {
	            tyColumnDataKey = "TY" + columnDataKey;
	            lyColumnDataKey = "LY" + columnDataKey;
	        }
	        if (tyColumnDataKey) {
	            maxValueTY = GLOBALS.getMaxValue(this[dataSourceKey], tyColumnDataKey);
	            minValueTY = GLOBALS.getMinValueIncMinus(this[dataSourceKey], tyColumnDataKey);
	        }

	        if (lyColumnDataKey) {
	            maxValueLY = GLOBALS.getMaxValue(this[dataSourceKey], lyColumnDataKey);
	            minValueLY = GLOBALS.getMinValueIncMinus(this[dataSourceKey], lyColumnDataKey);
	        }

	        MAX_VALUE = maxValueTY > maxValueLY ? maxValueTY : maxValueLY;
	        MAX_VALUE = this.getMaximumValue(MAX_VALUE);

	        MIN_VALUE = minValueTY < minValueLY ? minValueTY : minValueLY;
	        MIN_VALUE = (MIN_VALUE < 0) ? this.updateMinValue(Math.round(MIN_VALUE)) : 0;


	    }

	    var lineChartAxixConfig = {visible: showLineChart, name: "LINE_CHART", title: {
	            text: leftText,
	            font: "12px Arial"
	        },
	        labels: {
	            template: function(e) { 
	                if (e.value > 1000000) {
	                    var value = GLOBALS.nFormatter(e.value, 0);
	                } else {
	                    var value = formatNumber(Number(e.value), 'n'+linechartdecimalplaces);
	                }
	                return value;
	            }
	        }
	    };

	    var columnChartAxixConfig = {visible: showColumnChart, name: "COLUMN_CHART", min: (1*MIN_VALUE), max: MAX_VALUE,
	        title: {
	            text: overtimeTabName,
	            font: "12px Arial"
	        },
	        labels: {
	            template: function(e) { 
	                if (e.value > 1000000) {
	                    var value = GLOBALS.nFormatter(e.value, 'n0');
	                } else {
	                    var value = formatNumber(e.value, 'n'+columnchartdecimalplaces);
	                }
	                return value;
	            }/*,
	            format: "{0:n"+this.options.dataDecimalPlaces.columnData+"}",*/
	        }
	    };

	    if (chartName == 'DRILLDOWN_DEFAULT' || chartName == 'DRILLDOWN' || columnDataKey == 'VAR' || columnDataKey == 'VARPER') {
	        columnChartAxixConfig.title.text = leftText;
	        axisConfiguration.push(columnChartAxixConfig);
	    } else {
	        axisConfiguration.push(lineChartAxixConfig); 
	        axisConfiguration.push(columnChartAxixConfig);
	    }

	    //console.log(leftText);

	    if (this[dataSourceKey].length > 0) {
	        var seriesList = [];

	        var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);
	        
	        if (showLineChart && showLyBasedOnChartName && lyLineDataKey != "" && ((this.isShowLyData) || (this.isShowTyData && GLOBALS.timeSelectionModeVal == 2))) {
	            seriesList.push({type: "line", color: lyLineColorCode, field: lyLineDataKey, 
	                axis: "LINE_CHART", format: "{0:n"+this.options.dataDecimalPlaces.lineData+"}", 
	                name: vsTextLyear + " " + GLOBALS.measureLabel,
	                labels: { 
	                    template: function(e) { 
	                        if (e.value > 1000000) {
	                            var value = GLOBALS.nFormatter(e.value, 'n0');
	                        } else {
	                            var value = formatNumber(Number(e.value), 'n'+linechartdecimalplaces);
	                        }
	                        return value;
	                    }
	                }
	            });
	        }

	        if (showLineChart && tyLineDataKey != "" && this.isShowTyData) {
	            seriesList.push({type: "line", color: tyLineColorCode, field: tyLineDataKey, 
	                axis: "LINE_CHART", format: "{0:n"+this.options.dataDecimalPlaces.lineData+"}", 
	                name: vsTextTyear + " " + GLOBALS.measureLabel,
	                labels: {
	                    template: function(e) { 
	                        if (e.value > 1000000) {
	                            var value = GLOBALS.nFormatter(e.value, 'n0');
	                        } else {
	                            var value = formatNumber(Number(e.value), 'n'+linechartdecimalplaces);
	                        }
	                        return value;
	                    }
	                }
	            });
	        }

	        if (showLyBasedOnChartName && showColumnChart && ((this.isShowLyData) || (this.isShowTyData && GLOBALS.timeSelectionModeVal == 2))) {
	            seriesList.push({type: "column", color: lyColumnColorCode, spacing: 0, field: lyColumnDataKey, 
	                axis: "COLUMN_CHART", format: "{0:n"+columnchartdecimalplaces+"}", 
	                name: ((overtimeTabName != '' ) ? (overtimeTabName + " " + vsTextLyear) : ( vsTextLyear + " " + GLOBALS.measureLabel) ), 
	                labels: {
	                    template: function(e) { 
	                        if (e.value > 1000000){
	                            var value = GLOBALS.nFormatter(e.value, 'n0');
	                        } else {
	                            var value = formatNumber(Number(e.value), 'n'+columnchartdecimalplaces);
	                        }
	                        return value;
	                    }
	                } 
	            });
	        }

	        if (showColumnChart && this.isShowTyData) {
	            seriesList.push({type: "column", color: tyColumnColorCode, spacing: 0, field: tyColumnDataKey, 
	                axis: "COLUMN_CHART", format: "{0:n"+this.options.dataDecimalPlaces.columnData+"}", 
	                name: ((overtimeTabName != '' ) ? (overtimeTabName + " " + vsTextTyear) : ( vsTextTyear + " " + GLOBALS.measureLabel) ), 
	                labels: {
	                    template: function(e) { 
	                        if (e.value > 1000000){
	                            var value = GLOBALS.nFormatter(e.value, 'n0');
	                        } else {
	                            var value = formatNumber(Number(e.value), 'n'+columnchartdecimalplaces);
	                        }
	                        return value;
	                    }
	                }
	            });
	        }

	        this.drilldownOvertimeChart = {
	            panes: [
	                {name: "title-pane",
	                    title: {
	                        visible: this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].isVisibleSelectionToTitle,
	                        text: this.options.selectionToTitle,
	                        font: "16px Arial,Helvetica,sans-serif",
	                        color: "#000",
	                        position: 'center'
	                    },
	                }],
	            title: {
	                text: tabsConfiguration[chartTabMappings[activeTabNameChart]].isVisibleSelectionToFooterTitle == true ? this.options.selectionToFooterTitle + "\n" + this.chartFooterBredcrumb : this.chartFooterBredcrumb,
	                font: "12px Arial,Helvetica,sans-serif",
	                color: "#000",
	                align: "left",
	                position: "bottom"
	            },
	            dataSource: {
	                data: this.chartData
	            },
	            series: seriesList,
	            seriesDefaults: {
	                type: 'line',
	                style: 'smooth',
	                labels: {
	                    visible: this.options.tabsConfiguration[this.options.chartTabMappings[this.options.activeTabName]].dataTips,
	                    position: "top",
	                    background: "transparent",
	                    padding: {
	                        top: -20,
	                        // left: 0
	                    }/*,
	                    template: function(e) {
	                        return nFormatter(e.value);
	                    }*/
	                }
	            },
	            valueAxis: axisConfiguration,
	            categoryAxis: [{
	                    field: "ACCOUNT",
	                    axisCrossingValues: [0,1000],
	                    labels: {
	                        font: this.fontSize + "px Arial,Helvetica,sans-serif",
	                        rotation: this.rotation,
	                        align: "left",
	                        template: function(e) {
	                            var wrapText = "";
	                            if (tabsConfiguration[chartTabMappings[activeTabNameChart]].chartTextWrap == true) {
	                                if(e.dataItem.ACCOUNT != undefined && e.dataItem.ACCOUNT != "")
	                                    wrapText = GLOBALS.getWordWrapInLine(e.dataItem.ACCOUNT.toString());
	                                else
	                                    wrapText = "";
	                            } else {
	                                if(e.dataItem.ACCOUNT != undefined && e.dataItem.ACCOUNT != "")
	                                    wrapText = GLOBALS.getWordWrap(e.dataItem.ACCOUNT.toString(), dataSourceKey);
	                                else
	                                    wrapText = "";
	                            }
	                            return wrapText;
	                        }
	                    },
	                }
	            ],
	            legend: {
	            	align:this.legendAlign,
	                visible: true,
	                position: "bottom",
	                margin: {
	                    top: 5,
	                    bottom: 5
	                }
	            },
	            tooltip: {
	                visible: true
	                //format: "{0:n}",
	                //template: '#= series.name #<br /> # if(series.field == "' + tyLineDataKey + '" || series.field == "' + tyColumnDataKey + '"){ # <span>#= dataItem.ACCOUNT #</span> # }else{#<span># if(dataItem.LYACCOUNT == undefined){ # #= dataItem.ACCOUNT #  # } else {# #= dataItem.LYACCOUNT # # } # </span>#}# <br /> # if(series.field == "' + tyLineDataKey + '" || series.field == "' + lyLineDataKey + '" ) { # #= kendo.toString(Number(value), "n2") #  # } else {#  #= kendo.toString(Number(value), "n2") # # } #'
	            }
	        };
	    }
	}

	updateMinValue(minValue) {
	    var len = minValue.toString().length;
	    var deviderValue = 1;
	    for (var i = 0; i < (len-1); i++) {
	        deviderValue = deviderValue*10;
	    }
	    var minValueTop = (Math.floor(minValue/deviderValue)) * deviderValue;
	    var diffValue = minValueTop - (minValue);
	    diffValue = (Math.ceil(diffValue / (deviderValue/10))) * (deviderValue/10);

	    minValue = minValueTop - diffValue;
	    return minValue;
	}

	/**
	 * method: setGridData
	 * action: set grid options
	 * @param {json array} data
	 * @returns {object} gridOptions
	 */
	setAgGridObject(data, columns, footerFields) {
	    var options = {
	    	callbackFooterRow: (data) => {
                return this.createFooterRow(data);
            },
            myContextMenuItems: [{
                name:'SHOW_CHART', 
                text:'Show Chart', 
                callback: () => {
                    this.chartCallbackForPerformanceDrilldown()
                }
            }],
            contextMenuItems: ['SHOW_CHART', 'EXPORT_CSV_EXCEL_BOTH']
        };
        return {columns:columns, data:data, options:options};
	}


	createFooterRow(data) {
	    var footerFields = this.aggregateConfig;
	    var var_ty_field = '';
	    var var_ly_field = '';

	    Object.keys(data).forEach(function(key) {
	    	var obj = data[key];
	    	Object.keys(footerFields).forEach(function(subkey) {
	    		var footerObj = footerFields[subkey];
	            if(footerObj.aggregate == 'sum'){
	                footerObj.value += parseFloat(obj[footerObj.field]);
	            }
	            if(footerObj.aggregate == 'var'){
	                var_ty_field = 'TY'+footerObj.dataKey;
	                var_ly_field = 'LY'+footerObj.dataKey;
	            }
	        });
	    });

	    var footerRow = {ACCOUNT: 'Total'};
	    for (let key in footerFields) {
	    	var footerObj = footerFields[key];
	        if(footerObj.aggregate == 'var'){
	            var VARPER = 0;
	            var TY_SUM = this._helperService.where(footerFields,{field:var_ty_field});
	            var LY_SUM = this._helperService.where(footerFields,{field:var_ly_field});
	            if(TY_SUM.length>0 && LY_SUM.length>0){
	                TY_SUM = TY_SUM[0];
	                LY_SUM = LY_SUM[0];
	                if (LY_SUM.value > 0) {
	                    VARPER = ((TY_SUM.value - LY_SUM.value) * 100) / LY_SUM.value;
	                }
	            }
	            footerObj.value = VARPER;
	        }
	        footerRow[footerObj.field] = footerObj.value;
	    }
		
		var result = [footerRow];
	    return result;
	}

	/**
	 * method: setPriceOvertimeGridDataMultiple
	 * action: set over time grid options
	 * @returns {void}
	 */
	setOvertimeGridDataMultiple(columnDataKey, lineDataKey, varDataKey, columnName, dataSourceKey)
	{
	    var textTyear = GLOBALS.vsLabel == "Last Period" ? "THIS YEAR" : "THIS PERIOD";
	    var textLyear = GLOBALS.vsLabel == "Last Period" ? "LAST YEAR" : "PREVIOUS PERIOD";

	    varDataKey = (varDataKey != "") ? varDataKey + "_" : "";
	    var summaryVarperDataKey = lineDataKey;
	    var dataSourceKey = (dataSourceKey != undefined) ? dataSourceKey : "overTimeData";

	    var firstColumnTitle = (dataSourceKey == 'drillDownData') ? GLOBALS.gridFirstHeader[this.options.salesByName] : "WEEK";

	    $(this.options.pageName + " .k-slider-horizontal").hide();

	    //console.log(this.options[dataSourceKey]);

	    if (dataSourceKey == "overTimeData")
	        var data = this.formateGridData(this.options[dataSourceKey][this.options.activeTabName], columnDataKey);
	    else{
	        // this.options.dataDecimalPlaces.columnData = this.options.dataDecimalPlaces.lineData;
	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	        this.options.dataDecimalPlaces.columnData = selectedMeasure[0].dataDecimalPlaces;
	        var data = this.formateGridData(this.options[dataSourceKey], '');
	    }

	    this.options.drilldownOvertimeContextOptions.isGrid = true;
	    var columnsName = [];
	    columnsName.push({
            field: "ACCOUNT",
            headerName: firstColumnTitle,
            suppressMenu: true
        });

	    var aggregateConfig = [];
	    var lineDataDecimalPlaces = this.options.dataDecimalPlaces.lineData;
	    var columnDataDecimalPlaces = this.options.dataDecimalPlaces.columnData;

	    if (lineDataKey != "") {
	        columnsName.push({
	            field: "LY" + lineDataKey,
	            headerName: textLyear,
	            type: "numericColumn",
	            suppressMenu: true,
	            hide: (!this.isShowLyData && !(this.isShowTyData && GLOBALS.timeSelectionModeVal == 2)),
	            valueFormatter: function(params) {
	            	return formatNumber(Number(params.value), 'n'+lineDataDecimalPlaces)
	            }
	        });

	        aggregateConfig.push({field: "LY" + lineDataKey, aggregate: "sum", value:0});

	        columnsName.push({
	            field: "TY" + lineDataKey,
	            headerName: textTyear,
	            type: "numericColumn",
	            suppressMenu: true,
	            hide: !this.isShowTyData,
	            valueFormatter: function(params) { 
	            	return formatNumber(params.value, 'n'+lineDataDecimalPlaces)
	            }
	        });

	        aggregateConfig.push({field: "TY" + lineDataKey, aggregate: "sum", value:0});
	    }

	    if (columnDataKey != "") {
	        summaryVarperDataKey = columnDataKey;

	        columnsName.push({
	            field: "LY" + columnDataKey,
	            headerName: columnName + " " + textLyear,
	            type: "numericColumn",
	            suppressMenu: true,
	            hide: (!this.isShowLyData && !(this.isShowTyData && GLOBALS.timeSelectionModeVal == 2)),
	            valueFormatter: function(params) { 
	            	return formatNumber(params.value, 'n'+columnDataDecimalPlaces) 
	            }
	        });

	        aggregateConfig.push({field: "LY" + columnDataKey, aggregate: "sum", value:0});

	        columnsName.push({
	            field: "TY" + columnDataKey,
	            headerName: columnName + " " + textTyear,
	            type: "numericColumn",
	            suppressMenu: true,
	            hide: !this.isShowTyData,
	            valueFormatter: function(params) {
	            	return formatNumber(params.value, 'n'+columnDataDecimalPlaces) 
	            }
	        });

	        aggregateConfig.push({field: "TY" + columnDataKey, aggregate: "sum", value:0});
	    }

	    columnsName.push({
	        field: varDataKey + "VAR",
	        headerName: columnName + " VAR",
	        type: "numericColumn",
	        valueFormatter: function(params) { return formatNumber(params.value, 'n'+columnDataDecimalPlaces) },
	        suppressMenu: true,
	        hide: (!(this.isShowLyData && this.isShowTyData) && !(this.isShowTyData && GLOBALS.timeSelectionModeVal == 2))
	    });

	    aggregateConfig.push({field: varDataKey + "VAR", aggregate: "sum", value:0});

	    columnsName.push({
	        field: varDataKey + "VARPER",
	        headerName: columnName + " VAR %",
	        type: "numericColumn",
	        valueFormatter: function(params) { return formatNumber(params.value, 1) },
	        suppressMenu: true,
	        hide: (!(this.isShowLyData && this.isShowTyData) && !(this.isShowTyData && GLOBALS.timeSelectionModeVal == 2))
	    });

	    aggregateConfig.push({field: varDataKey + "VARPER", aggregate: "var", dataKey:summaryVarperDataKey, value:0});

	    this.aggregateConfig = aggregateConfig;

	    if( this.options.drilldownOvertimeGrid == undefined){
	        this.options.drilldownOvertimeGrid = this.setAgGridObject(data, columnsName, aggregateConfig);
	        this.options.drilldownOvertimeGrid.dataLoaded = true;
	    }else{
	    	
	        this.options.drilldownOvertimeGrid.gridOptions.api.setColumnDefs(columnsName);
	        this.options.drilldownOvertimeGrid.gridOptions.api.setRowData(data);
	        this.options.drilldownOvertimeGrid.gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
	        this.options.drilldownOvertimeGrid.gridOptions.api.sizeColumnsToFit();
	        this.options.drilldownOvertimeGrid.gridOptions.api.deselectAll();
	    }	    
	}

	/**
	 * method: window.calculateSummaryVarperOvertime
	 * action: calculating verpercent data
	 * @param {array} data
	 * @returns {string} VARPER 
	 */
	/*window.calculateSummaryVarperGraphGrid(data, dataKey) {
	    var VARPER = 0;
	    if (data["LY" + dataKey].sum > 0) {
	        VARPER = ((data["TY" + dataKey].sum - data["LY" + dataKey].sum) * 100) / data["LY" + dataKey].sum;
	    }
	    return kendo.toString(VARPER, 'n1');
	}*/

	chartCallbackForPerformanceDrilldown() {
	    var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);                
	    if (tabSlug == '')
	        return;
	    this.fnSetPerformanceDrilldownChart(tabSlug);
	}

	/**
	 * method: fnSetPerformanceDrilldownChart
	 * action: checking flag which tab and which chart is actived, and set isGrid false
	 * and calling a method to rendering drill down chart data according to flag
	 * @param {string} tabType
	 * @returns {void}
	 */
	fnSetPerformanceDrilldownChart(tabSlug) {

	    this.options.drilldownOvertimeContextOptions.isGrid = false;

	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;

	    this.options.drilldownOvertimeContextOptions[tabEvent] = 'chart';

	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;

	    //console.log(this.options.tabsConfiguration[tabSlug].tabType);
	    //console.log(this.options.tabsConfiguration[tabSlug].activeChartName);
	    if (this.options.tabsConfiguration[tabSlug].tabType == 'DRILLDOWN') {
	    	
	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	            this.setOvertimeDataMultiple('VALUE', '', '', 'DRILLDOWN_DEFAULT', 'drillDownData');
	        }

	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	            this.setOvertimeDataMultiple('VAR', '', '', 'DRILLDOWN_VARIANCE', 'drillDownData');
	        }

	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	            this.setOvertimeDataMultiple('VARPER', '', '', 'DRILLDOWN_VARPER', 'drillDownData');
	        }
	    } else if (this.options.tabsConfiguration[tabSlug].tabType == 'OVERTIME') {
	        var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	            this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	        var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	            selectedMeasure[0].jsonKey : "";

	        var columnVarKey = (columnDataKey != '') ? columnDataKey+"_VAR" : "";
	        var columnVarPerKey = (columnDataKey != '') ? columnDataKey+"_VARPER" : "";

	        var lineVarKey = (lineDataKey != '') ? "VAR" : "";
	        var lineVarPerKey = (lineDataKey != '') ? "VARPER" : "";

	        var columnChartAxixTitle = this.options.tabsConfiguration[tabSlug].columnChartAxixTitle;

	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	            this.setOvertimeDataMultiple(columnDataKey, lineDataKey, columnChartAxixTitle, '', '');
	        }

	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	            this.setOvertimeDataMultiple(columnVarKey, lineVarKey, columnChartAxixTitle, 'VARIANCE', '');
	        }

	        if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	            this.setOvertimeDataMultiple(columnVarPerKey, lineVarPerKey, columnChartAxixTitle, 'VARPER', '');
	        }
	    }
	        
	}

	/**
	 * method: fnSetPerformanceDrilldownGrid
	 * action: checking flag which tab is actived, and set isGrid true
	 * and calling a method to rendering drill down grid data according to flag
	 * @param {string} tabType
	 * @returns {void}
	 */
	fnSetPerformanceDrilldownGrid() {
		var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);
	    if (tabSlug == '')
	        return;

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;
	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;

	    this.options.drilldownOvertimeContextOptions.isGrid = true;
	    this.options.drilldownOvertimeContextOptions[tabEvent] = 'grid';

	    if (tabType == 'DRILLDOWN') {
	    	this.setOvertimeGridDataMultiple("", "VALUE", "", "", "drillDownData");
	    } else if (tabType == 'OVERTIME') {
	        var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	            this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	        var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	            selectedMeasure[0].jsonKey : "";

	        var columnChartAxixTitle = (columnDataKey != '') ? this.options.tabsConfiguration[tabSlug].columnChartAxixTitle : '';

	        this.setOvertimeGridDataMultiple(columnDataKey, lineDataKey, columnDataKey, columnChartAxixTitle, 'overTimeData');
	    }
	}

	/**
	 * method: fnShowHideDataTips
	 * action: checking flag which tab and which chart is actived, checking data tip is visible or not and set isGrid false
	 * and calling a method to showing/hiding drill down chart label according to flag
	 * @param {string} tabType
	 * @returns {void}
	 */
	fnShowHideDataTips() {

	    var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);

	    if (tabSlug == '')
	        return;

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;

	    this.options.drilldownOvertimeContextOptions.isGrid = false;
	    this.options.tabsConfiguration[tabSlug].dataTips = !this.options.tabsConfiguration[tabSlug].dataTips;
	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;

	    if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'chart') {
	    	//console.log(this.options.tabsConfiguration[tabSlug].activeChartName);
	        if (tabType == 'DRILLDOWN') {
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	                this.setOvertimeDataMultiple('VALUE', '', '', 'DRILLDOWN', 'drillDownData');
	            }
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	                this.setOvertimeDataMultiple('VAR', '', '', 'DRILLDOWN_VARIANCE', 'drillDownData');
	            }
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	                this.setOvertimeDataMultiple('VARPER', '', '', 'DRILLDOWN_VARPER', 'drillDownData');
	            }
	        } else if (tabType == 'OVERTIME') {
	            var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	                this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	            var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	            var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	                selectedMeasure[0].jsonKey : "";

	            var columnVarKey = (columnDataKey != '') ? columnDataKey+"_VAR" : "";
	            var columnVarPerKey = (columnDataKey != '') ? columnDataKey+"_VARPER" : "";

	            var lineVarKey = (lineDataKey != '') ? "VAR" : "";
	            var lineVarPerKey = (lineDataKey != '') ? "VARPER" : "";

	            var columnChartAxixTitle = this.options.tabsConfiguration[tabSlug].columnChartAxixTitle;

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	                this.setOvertimeDataMultiple(columnDataKey, lineDataKey, columnChartAxixTitle, '', '');
	            }

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	                this.setOvertimeDataMultiple(columnVarKey, lineVarKey, columnChartAxixTitle, 'VARIANCE', '');
	            }

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	                this.setOvertimeDataMultiple(columnVarPerKey, lineVarPerKey, columnChartAxixTitle, 'VARPER', '');
	            }
	        }
	    }
	}

	/**
	 * method: fnTYVSLYChart
	 * action: checking flag which tab and which chart is actived and set isGrid false
	 * and calling a method to rendering drill down last year vs this year chart data according to flag
	 * @param {string} tabType
	 * @returns {void}
	 */
	fnTYVSLYChart(menuObj) {
		var chartType = menuObj.extraOptions;
	    var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);
	    if (tabSlug == '')
	        return;

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;

	    this.options.drilldownOvertimeContextOptions.isGrid = false;
	    this.options.tabsConfiguration[tabSlug].activeChartName = chartType;
	    console.log(this.options.tabsConfiguration[tabSlug]);
	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;

	    if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'chart') {
	        this.options.drilldownOvertimeContextOptions[tabEvent] = 'chart';
	        //console.log(chartType);
	        if (tabType == 'DRILLDOWN') {
	            if (chartType == 'VARIANCE')
	                this.setOvertimeDataMultiple('VAR', '', '', 'DRILLDOWN_VARIANCE', 'drillDownData');
	            else if (chartType == 'VARPER')
	                this.setOvertimeDataMultiple('VARPER', '', '', 'DRILLDOWN_VARPER', 'drillDownData');
	        } else if (tabType == 'OVERTIME') {
	            var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	                this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	            var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	            var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	                selectedMeasure[0].jsonKey : "";

	            var columnVarKey = (columnDataKey != '') ? columnDataKey+"_VAR" : "";
	            var columnVarPerKey = (columnDataKey != '') ? columnDataKey+"_VARPER" : "";

	            var lineVarKey = (lineDataKey != '') ? "VAR" : "";
	            var lineVarPerKey = (lineDataKey != '') ? "VARPER" : "";

	            var columnChartAxixTitle = this.options.tabsConfiguration[tabSlug].columnChartAxixTitle;

	            if (chartType == "VARIANCE")
	                this.setOvertimeDataMultiple(columnVarKey, lineVarKey, columnChartAxixTitle, 'VARIANCE', '');

	            if (chartType == "VARPER")
	                this.setOvertimeDataMultiple(columnVarPerKey, lineVarPerKey, columnChartAxixTitle, 'VARPER', '');
	        }
	    }
	}


	/**
	 * method: fnTYANDLYChart
	 * action: checking flag which tab and which chart is actived and set isGrid false
	 * and calling a method to rendering drill down last year and this year chart data according to flag
	 * @param {string} tabType
	 * @returns {void}
	 */
	fnTYANDLYChart() {

	    var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);

	    if (tabSlug == '')
	        return;

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;

	    this.options.drilldownOvertimeContextOptions.isGrid = false;
	    this.options.tabsConfiguration[tabSlug].activeChartName = "TYANDLY";
	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;
	    if (tabType == 'DRILLDOWN') {
	            this.setOvertimeDataMultiple('VALUE', '', '', 'DRILLDOWN', 'drillDownData');
	    } else if (tabType == 'OVERTIME') {
	        var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	            this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	            var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	                selectedMeasure[0].jsonKey : "";

	        var columnVarKey = (columnDataKey != '') ? columnDataKey+"_VAR" : "";
	        var columnVarPerKey = (columnDataKey != '') ? columnDataKey+"_VARPER" : "";

	        var lineVarKey = (lineDataKey != '') ? "VAR" : "";
	        var lineVarPerKey = (lineDataKey != '') ? "VARPER" : "";

	        var columnChartAxixTitle = this.options.tabsConfiguration[tabSlug].columnChartAxixTitle;

	        this.setOvertimeDataMultiple(columnDataKey, lineDataKey, columnChartAxixTitle, '', '');
	    }
	}

	/*// initial set tab event
	this.options.drilldownOvertimeContextOptions.firstTabEvent = 'chart';
	this.options.drilldownOvertimeContextOptions.secondTabEvent = 'chart';
	this.options.drilldownOvertimeContextOptions.thirdTabEvent = 'chart';*/

	drilldownOvertimetabClickEvent(tabSlug) {
	    var previousActiveTabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);
	    this.options.tabsConfiguration[previousActiveTabSlug].activeTabClass = "";

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var activeTab   = this.options.tabsConfiguration[tabSlug].seqNum;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;
	    var tabName     = this.options.tabsConfiguration[tabSlug].slug;
	    var showTyVsLyContextOption = this.options.tabsConfiguration[tabSlug].showTyVsLyContextOption;


	    this.options.drilldownOvertimeContextOptions.activeTab = activeTab;
	    this.options.drilldownOvertimeContextOptions.showTyVsLyContextOption = showTyVsLyContextOption;
	    this.options.activeTabName = tabName;
	    this.options.tabsConfiguration[tabSlug].activeTabClass = "active";


	    if (!this.options.tabsConfiguration[tabSlug].dataLoaded) {
	        this.options.tabDataRequested = {activeTab: tabName, changeTab: true};
	        this.options.drilldownOvertimeContextOptions.isGrid = false;
	        this.tabSelectionEvent.emit();
	    }
	    else {
	        if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'chart') {
	            this.fnSetPerformanceDrilldownChart(tabSlug);
	            $(this.options.pageName + " .performanceChartContainer").data("kendoChart").refresh();
	        }
	        else if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'grid') {
	            //this.fnSetPerformanceDrilldownGrid(tabType);
	            this.fnSetPerformanceDrilldownGrid();
	        }
	    }
	}

	// resize all pod chart or grid with splitter resize event
	/*if ($(this.options.pageName).children().length > 0) {
	    this.firstSplitContainer = $(this.options.pageName).children()[1].id;
	    this.secondSplitContainer = $(this.options.pageName).children().children().children().attr('id');
	    $(this.options.pageName + " #" + this.firstSplitContainer).on('resize', function(event) {
	        this.getChartWithResize();
	    });
	}*/

	getChartWithResize() {
	    // var chartOptions = $(this.options.pageName + " .performanceChartContainer").data("kendoChart");
	    // if (chartOptions != undefined) {
	    //     chartOptions.options.legend.offsetX = this.getLegendOffsetX();
	    //     chartOptions.refresh();
	    // }
	    this.sliderContainer = $(this.options.pageName + " #kendoRangeSlider").getKendoRangeSlider();
	    if (this.sliderContainer != undefined) {
	        this.sliderContainer.wrapper.css("width", "97%");
	        this.sliderContainer.resize();
	    }
	}

	/**
	 * method: defaultActiveTabs
	 * action: by default tab activation
	 * @returns {void}
	 */
	/*defaultActiveTabs() {
	    setTimeout(()=>{
	        var activeTabFound = false;
	        for (let tabSlug in this.options.tabsConfiguration) {
	        	var tabConfig = this.options.tabsConfiguration[tabSlug];
	            if (tabConfig.showTab && !activeTabFound) {
	                activeTabFound = true;
	                this.options.tabsConfiguration[tabSlug].activeTabClass = "active";
	            }
	        }
	    });
	}*/

	// calling defaultActiveTabs to active by default tab
	//this.defaultActiveTabs();

	getActiveTabConfig(filterColumn, columnValue) {
	    var returnKey = '';
	    for (let configKey in this.options.tabsConfiguration) {
	    	var tabConfigData = this.options.tabsConfiguration[configKey];
	        if (tabConfigData[filterColumn] == columnValue) {
	            returnKey = configKey;
	        }
	    }
	    return returnKey;
	}

	/**
	 * method: checkingActiveTab
	 * action: activating tab and calling a method to data renderin according to flag
	 * @returns {void}
	 */
	checkingActiveTab(callType) {
	    callType = callType || "";

	    var tabSlug = this.getActiveTabConfig("seqNum", this.options.drilldownOvertimeContextOptions.activeTab);
	    if (tabSlug == '')
	        return;

	    var tabType     = this.options.tabsConfiguration[tabSlug].tabType;
	    var tabEvent    = this.options.tabsConfiguration[tabSlug].tabEvent;
	    var showTyVsLyContextOption = this.options.tabsConfiguration[tabSlug].showTyVsLyContextOption;
	    this.options.drilldownOvertimeContextOptions.showTyVsLyContextOption = showTyVsLyContextOption;
	    this.options.dataDecimalPlaces.columnData = this.options.tabsConfiguration[tabSlug].dataDecimalPlaces;
	    //this.options.legendAlign = this.options.tabsConfiguration[tabSlug].legendAlign;
	    if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'grid') {
	        if (tabType == 'DRILLDOWN') 
	            this.setOvertimeGridDataMultiple("", "VALUE", "", "", "drillDownData");
	        else if (tabType == 'OVERTIME') {
	            var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	                this.options.tabsConfiguration[tabSlug].columnDataKey : "";

	            var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	            var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	                selectedMeasure[0].jsonKey : "";

	            var columnChartAxixTitle = (columnDataKey != '') ? this.options.tabsConfiguration[tabSlug].columnChartAxixTitle : '';

	            this.setOvertimeGridDataMultiple(columnDataKey, lineDataKey, columnDataKey, columnChartAxixTitle, '');
	        }
	    }
	    else if (this.options.drilldownOvertimeContextOptions[tabEvent] == 'chart') {
	        this.options.tabsConfiguration[tabSlug].setDefaultTextWrap = (callType == "custom") ? false : true;
	        if (tabType == 'DRILLDOWN') {
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	                if (callType == "custom") {
	                    this.setOvertimeDataMultiple('VALUE', '', '', 'DRILLDOWN', 'drillDownData');
	                } else {
	                    this.setOvertimeDataMultiple('VALUE', '', '', 'DRILLDOWN_DEFAULT', 'drillDownData');
	                }
	            }
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	                this.setOvertimeDataMultiple('VAR', '', '', 'DRILLDOWN_VARIANCE', 'drillDownData');
	            }
	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	                this.setOvertimeDataMultiple('VARPER', '', '', 'DRILLDOWN_VARPER', 'drillDownData');
	            }
	        } else if (tabType == 'OVERTIME') {
	            var columnDataKey = (this.options.tabsConfiguration[tabSlug].hasColumnChart) ? 
	                this.options.tabsConfiguration[tabSlug].columnDataKey : "";
	                
	            var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	            var lineDataKey = (this.options.tabsConfiguration[tabSlug].hasLineChart && selectedMeasure != undefined && selectedMeasure.length > 0) ? 
	                selectedMeasure[0].jsonKey : "";

	            var columnVarKey = (columnDataKey != '') ? columnDataKey+"_VAR" : "";
	            var columnVarPerKey = (columnDataKey != '') ? columnDataKey+"_VARPER" : "";

	            var lineVarKey = (lineDataKey != '') ? "VAR" : "";
	            var lineVarPerKey = (lineDataKey != '') ? "VARPER" : "";

	            var columnChartAxixTitle = this.options.tabsConfiguration[tabSlug].columnChartAxixTitle;

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "TYANDLY") {
	                this.setOvertimeDataMultiple(columnDataKey, lineDataKey, columnChartAxixTitle, '', '');
	            }

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARIANCE") {
	                this.setOvertimeDataMultiple(columnVarKey, lineVarKey, columnChartAxixTitle, 'VARIANCE', '');
	            }

	            if (this.options.tabsConfiguration[tabSlug].activeChartName == "VARPER") {
	                this.setOvertimeDataMultiple(columnVarPerKey, lineVarPerKey, columnChartAxixTitle, 'VARPER', '');
	            }
	        }
	    }
	}

	updateLegendAlign($event) {
		console.log($event);
	}

	/**
	 * method: chartRecall
	 * actin: set drilldown data and calling checkingActiveTab method
	 * @param {json array} data
	 * @returns {void}
	 */
	chartRecall(data) {
	    this.options.drillDownData = this.formateGridData(data, '');
	    this.options.drillDownDataBackup = this.formateGridData(data, '');
	    this.setDrilldownDataToDropdownList();
	}

	/**
	 * method: callToDataRender
	 * action: calling a method to data render according to request type
	 * @returns {void}
	 */
	callToDataRender() {
	    if (this.options.dataLoaded == true) {
	        this.options.dataLoaded = false;

	        if (GLOBALS.requestType == "initial") {
	            this.renderInitialData();
	        }
	        else if (GLOBALS.requestType == "rowclick") {
	            this.renderGridRowClickData();
	        }
	        else if (GLOBALS.requestType == "reload") {
	            this.renderReloadData()
	        }
	    }
	}

	/**
	 * watching the dataloaded flag 
	 * when value is changed and newvalue is true then calling callToDataRender method
	 */
	/*this.$watch('options.dataLoaded', function(newValue, oldValue) {
	    if (newValue == true) {
	        setTimeout(()=>{
	            // GLOBALS.isShowLyData = (GLOBALS.isShowLyData != undefined) ? GLOBALS.isShowLyData : true;
	            // GLOBALS.isShowTyData = (GLOBALS.isShowTyData != undefined) ? GLOBALS.isShowTyData : true;
	            this.isShowLyData = (this.options.isShowLyData != undefined) ? this.options.isShowLyData : ((GLOBALS.isShowLyData != undefined ) ? GLOBALS.isShowLyData : true);
	            this.isShowTyData = (this.options.isShowTyData != undefined) ? this.options.isShowTyData : ((GLOBALS.isShowTyData != undefined ) ? GLOBALS.isShowTyData : true);
	            GLOBALS.timeSelectionModeVal = (GLOBALS.timeSelectionModeVal != undefined) ? GLOBALS.timeSelectionModeVal : 1;
	            this.options.drilldownOvertimeContextOptions.isShowLyData = this.isShowLyData;
	            this.options.drilldownOvertimeContextOptions.isShowTyData = this.isShowTyData;
	            this.callToDataRender();
	        }, 500);
	    }
	});

	
	this.$watch('options.configUpdated', function(newValue, oldValue) {
	    if (newValue == true) {
	        this.defaultActiveTabs();
	    }
	});*/

	/**
	 * method: renderInitialData
	 * action: rendering all chart data
	 * @returns {void}
	 */
	renderInitialData() {
	    if (this.options.leftFirstGrid == "STORE") {
	        this.options.salesByName = "storeGrid";
	        this.chartRecall(this.options.storeGridData);
	    }
	    else if (this.options.leftFirstGrid == "GROUP") {
	        this.options.salesByName = "groupGrid";
	        this.chartRecall(this.options.groupGridData);
	    }
	    else if (this.options.leftFirstGrid == "CATEGORY") {
	        this.options.salesByName = "categoryGrid";
	        this.chartRecall(this.options.categoryGridData);
	    }
	    else if (this.options.leftFirstGrid == "BRAND") {
	        this.options.salesByName = "brandGrid";
	        this.chartRecall(this.options.brandGridData);
	    }
	    else if (this.options.leftFirstGrid == "SKU") {
	        this.options.salesByName = "skuGrid";
	        this.chartRecall(this.options.skuGridData);
	    }
	}

	/**
	 * method: getSingleSkuFromTotal 
	 * action: set skuSingleData array for chart from last (sku) grid
	 * @param {string} arrayIndex
	 * @returns {void}
	 */
	getSingleSkuFromTotal(arrayIndex) {
	    if (this.options.skuGridData != undefined) {
	        var i;
	        this.skuSingleData = new Array();
	        for (i = 0; i < this.options.skuGridData.length; i++) {
	            var index = (this.options.skuGridData[i].ID == undefined) ? 'ACCOUNT' : 'ID';
	            if (this.options.skuGridData[i][index] == arrayIndex) {
	                this.skuSingleData.push(this.options.skuGridData[i]);
	            }
	        }
	    } else {
	        setTimeout(()=>{
	            this.getSingleSkuFromTotal('');
	        }, 100);
	    }
	}

	/**
	 * method: renderGridRowClickData
	 * action: rendering the chart data according to changeGrid flag
	 * @returns {void}
	 */
	renderGridRowClickData() {
	    if (GLOBALS.changeGrid == "changeStore") {
	        this.options.salesByName = "groupGrid";
	        this.chartRecall(this.options.groupGridData);
	    }
	    else if (GLOBALS.changeGrid == "changeGroup") {
	        this.options.salesByName = "categoryGrid";
	        this.chartRecall(this.options.categoryGridData);
	    }
	    else if (GLOBALS.changeGrid == "changeCategory") {
	        this.options.salesByName = "brandGrid";
	        this.chartRecall(this.options.brandGridData);
	    }
	    else if (GLOBALS.changeGrid == "changeBrand") {
	        this.options.salesByName = "skuGrid";
	        this.chartRecall(this.options.skuGridData);
	    }
	    else if (GLOBALS.changeGrid == "changeSku") {
	        this.options.salesByName = "skuGrid";
	        if (this.options.showLastCustomData != undefined && this.options.showLastCustomData != '')
	            this.chartRecall(this.options.showLastCustomData);
	        else
	        {
	            this.getSingleSkuFromTotal(GLOBALS.singleSkuName);
	            this.chartRecall(this.skuSingleData);
	        }
	    }
	}

	/**
	 * method: renderReloadData
	 * action: rendering the chart data according to showAllGridName flag
	 * @returns {void}
	 */
	renderReloadData() {
	    
	    // if (GLOBALS.showAllGridName == "STORE") {
	    if (GLOBALS.showAllGridName == "showAllStore") {
	        this.options.salesByName = "storeGrid";
	        this.chartRecall(this.options.storeGridData);
	    }
	    // else if (GLOBALS.showAllGridName == "GROUP") {
	    else if (GLOBALS.showAllGridName == "showAllGroup") {
	        this.options.salesByName = "groupGrid";
	        this.chartRecall(this.options.groupGridData);
	    }
	    // else if (GLOBALS.showAllGridName == "CATEGORY") {
	    else if (GLOBALS.showAllGridName == "showAllCategory") {
	        this.options.salesByName = "categoryGrid";
	        this.chartRecall(this.options.categoryGridData);
	    }
	    // else if (GLOBALS.showAllGridName == "BRAND") {
	    else if (GLOBALS.showAllGridName == "showAllBrand") {
	        this.options.salesByName = "brandGrid";
	        this.chartRecall(this.options.brandGridData);
	    }
	    // else if (GLOBALS.showAllGridName == "SKU") {
	    else if (GLOBALS.showAllGridName == "showAllSku") {
	        this.options.salesByName = "skuGrid";
	        this.chartRecall(this.options.skuGridData);
	    }
	}


	// preparing drilldown data to dropdown list
	setDrilldownDataToDropdownList() {
	    if (this.options.drillDownDataBackup != undefined) {
	        this.options.totalLength = this.options.drillDownDataBackup.length;
	    } else {
	        this.options.totalLength = this.options.drillDownData.length;
	    }
	    this.options.countList = [];
	    for (var i = 1; i <= this.options.totalLength; i++) {
	        var temp = {"label": i, "data": i};
	        this.options.countList.push(temp);
	    }
	    // setting chart custom options will show or hide

	    this.isShowCustomOptions();
	    
	    if ( GLOBALS.gridFirstHeader != undefined ){
	        this.setCustomChartOptionTitle();
	        this.calculateLength("default");
	        this.checkingActiveTab('');
	    } else {
	        setTimeout(()=>{
	            this.setDrilldownDataToDropdownList();
	        }, 100);
	    }
	}

	// show or hide custom options
	isShowCustomOptions() {
		var itemNumbers = 0;
	    this.defaultChartItemWidth = 150;
	    this.options.chartContainerWidth = $(this.options.pageName + " #drillDownChartDiv").width();
	    itemNumbers = this.options.chartContainerWidth / this.defaultChartItemWidth;
	    
	}

	// getting POPUP window with clicking context options
	fnSetCustomChartOptions() {
	    //$("#" + this.options.customChartOptionsID).data("kendoWindow").center().open();
	    this.customChartSelectionWindowVisible = true;
	}

	// setting screen fit width
	setChartContainerWidth() {
	    this.options.newContainerWidth = 0;
	    this.selectedItems = this.options.showTopCnt;
	    this.options.newContainerWidth = this.defaultChartItemWidth * this.selectedItems;
	    this.options.notFitScreenWidth = (!this.options.fitPageWidth && this.options.newContainerWidth > this.options.chartContainerWidth) ? this.options.newContainerWidth : '99%';
	}

	// length calculation
	calculateLength(fromIndex) {
	    this.options.showTopCntErrorMsg = "";
	    this.options.chartContainerWidth = $(this.options.pageName + " #drillDownChartDiv").width();
	    if (fromIndex == 'default') {
	        if (this.options.selectedCountFrom == undefined || this.options.selectedCountTo == undefined) {
	            this.itemNumbers = (this.options.chartContainerWidth / this.defaultChartItemWidth);
	            this.itemNumbers = this.itemNumbers > this.options.totalLength ? this.options.totalLength : this.itemNumbers;
	            this.itemNumbers = this.itemNumbers > 20 ? 20 : this.itemNumbers;
	            this.options.showTopCnt = this.itemNumbers > 1 ? this.itemNumbers : this.options.totalLength;
	        }
	    }
	    else if (fromIndex == 'full') {
	        this.options.showTopCnt = this.options.totalLength;
	    }
	    else {
	        if (fromIndex * 1 > 0) {
	            this.options.showTopCntErrorMsg = fromIndex > this.options.totalLength ? "Sorry, you can select maximum " + this.options.totalLength + " item(s)" : "";
	            fromIndex = fromIndex > this.options.totalLength ? this.options.totalLength : fromIndex;
	            this.options.showTopCnt = fromIndex;
	        }
	    }
	    //console.log(this.options.showTopCnt);
	}

	// preparing to generate all others options
	setAllOthers() {
	    this.setChartContainerWidth();
	    this.allOtherCount = this.selectedItems;
	    this.options.drillDownData = this.options.drillDownDataBackup.slice(0, this.options.showTopCnt);
	    if (this.allOtherCount < this.options.drillDownDataBackup.length) {
	        
	        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
	        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
	        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;
	        var TYVALUE = 0, LYVALUE = 0, VAR = 0, VARPER = 0;

	        for (let key in this.options.drillDownDataBackup) {
	        	var obj = this.options.drillDownDataBackup[key];
	            if (key >= this.allOtherCount) {
	                TYVALUE += Number(obj[TYFIELD]);
	                LYVALUE += Number(obj[LYFIELD]);
	                VAR += Number(obj.VAR);
	                VARPER += Number(obj.VARPER);
	            }
	        }
	       
	        this.retobj = {ACCOUNT: "ALL OTHERS", TYVALUE: TYVALUE, LYVALUE: LYVALUE, VAR: VAR, VARPER: VARPER};
	        this.retobj.ACCOUNT = "ALL OTHERS";
	        this.retobj[LYFIELD] = LYVALUE;
	        this.retobj[TYFIELD] = TYVALUE;
	        this.options.drillDownData.push(this.retobj);
	    }
	}

	// binding chart calculation 
	customChartCalculation() {
	    this.resetSlider = true;
	    this.setChartContainerWidth();
	    if (this.options.allOthers) {
	        this.setAllOthers();
	    } else {
	        this.options.drillDownData = this.options.drillDownDataBackup.slice(0, this.options.showTopCnt);
	    }

	    this.checkingActiveTab("custom");
	}

	setFooterBreadcrumb() {
	    this.chartFooterBredcrumb = '';

	    if (this.options.selectedGridData != undefined) {

	        var selectedStore = 'All';

	        // var selectedStoreArr = this._helperService.where(this.options.selectedGridData, ['FOOTERSTORE']);
	        var selectedStoreArr = this._helperService.arrayContainsString(this.options.selectedGridData, "", 'FOOTERSTORE');
	      //var selectedStoreArr = $filter('filter')(this.options.selectedGridData, 'FOOTERSTORE=');

	        if (selectedStoreArr != undefined && selectedStoreArr.length > 0) {
	            selectedStoreArr = selectedStoreArr[0].split('=');
	            selectedStore = (selectedStoreArr[1] != '' ? selectedStoreArr[1].replace("AND_SIGN", "&") : 'All');
	        }

	        var selectedGroup = 'All';
	        //var selectedGroupArr = $filter('filter')(this.options.selectedGridData, 'FOOTERGROUP=');
	        var selectedGroupArr = this._helperService.arrayContainsString(this.options.selectedGridData, "", 'FOOTERGROUP');
	        if (selectedGroupArr.length > 0) {
	            selectedGroupArr = selectedGroupArr[0].split('=');
	            selectedGroup = (selectedGroupArr[1] != '' ? selectedGroupArr[1].replace("AND_SIGN", "&") : 'All');
	        }

	        var selectedCategory = 'All';
	        //var CategoryIndex = this._helperService.findIndex(this.options.selectedGridData, 'FOOTERCATEGORY=');
	        var selectedCategoryArr = this._helperService.arrayContainsString(this.options.selectedGridData, "", 'FOOTERCATEGORY');
	        if (selectedGroupArr.length > 0) {
	            selectedCategoryArr = selectedCategoryArr[0].split('=');
	            selectedCategory = (selectedCategoryArr[1] != '' ? selectedCategoryArr[1].replace("AND_SIGN", "&") : 'All');
	        }

	        var selectedBrand = 'All';
	        //var selectedBrandArr = $filter('filter')(this.options.selectedGridData, 'FOOTERBRAND=');
	        var selectedBrandArr = this._helperService.arrayContainsString(this.options.selectedGridData, "", 'FOOTERBRAND');
	        if (selectedBrandArr.length > 0) {
	            selectedBrandArr = selectedBrandArr[0].split('=');
	            selectedBrand = (selectedBrandArr[1] != '' ? selectedBrandArr[1].replace("AND_SIGN", "&") : 'All');
	        }

	        var selectedSku = 'All';
	        //var selectedSkuArr = $filter('filter')(this.options.selectedGridData, 'FOOTERSKU=');
	        var selectedSkuArr = this._helperService.arrayContainsString(this.options.selectedGridData, "", 'FOOTERSKU');
	        if (selectedSkuArr.length > 0) {
	            selectedSkuArr = selectedSkuArr[0].split('=');
	            selectedSku = (selectedSkuArr[1] != '' ? selectedSkuArr[1].replace("AND_SIGN", "&") : 'All');
	        }

	        // if ((selectedStore != 'All' || selectedGroup != 'All' || selectedSku != 'All' || selectedBrand != 'All' || selectedCategory != 'All') && this.options.totalGrid != undefined) {
	        if (this.options.totalGrid != undefined) {
	        	//console.log(this.options.totalGrid)
	            var chartFooterBredcrumbArr = [selectedStore, selectedGroup, selectedCategory, selectedBrand, selectedSku];
	            //console.log(chartFooterBredcrumbArr);
	            this.chartFooterBredcrumb = chartFooterBredcrumbArr.slice(-this.options.totalGrid).join(' > ');
	            //console.log(this.chartFooterBredcrumb);
	        }
	    }

	}

	// setting custom chart option title
	setCustomChartOptionTitle() {
	    this.tileSelectionData = $(this.options.pageName + ' #timeSelection .measureBox-content:last-child p:first-child').text();

	    if (this.tileSelectionData == undefined || this.tileSelectionData == "") {
	        this.options.tileSelectionData = "";
	    } else {
	        this.tileSelectionData = this.tileSelectionData.replace('VS', '');
	        this.tileSelectionData = (this.tileSelectionData).replace(/:/g, ' Week');
	        this.options.tileSelectionData = (this.tileSelectionData).replace(/-/g, ', ');
	    }

	    this.options.ValueVolume = $(this.options.pageName + " #measureSelection option:selected").text();

	    var salesBy = GLOBALS.gridFirstHeader[this.options.salesByName];
	    this.options.salesBy = salesBy;
	    this.options.customChartOptionTitle = this.options.ValueVolume + " Sales by " + this.options.salesBy + ". " + this.options.tileSelectionData;

	    this.options.selectionToTitle = this.options.customChartOptionTitle;

	    this.pSelectionData = $(this.options.pageName + ' #productSelection .measureBox-content').text();
	    this.pSelectionData = $.trim(this.pSelectionData);
	    this.pSelectionData = this.pSelectionData == "All" ? "" : this.pSelectionData;
	    this.mSelectionData = $(this.options.pageName + ' #marketSelection .measureBox-content').text();
	    this.mSelectionData = $.trim(this.mSelectionData);
	    this.mSelectionData = this.mSelectionData == "All" ? "" : this.mSelectionData;

	    if (this.pSelectionData == "" && this.mSelectionData == "")
	        this.options.chartFooterTitle = "Data is not filtered yet";
	    else
	        this.options.chartFooterTitle = "Data filtered to " + this.pSelectionData + " " + this.mSelectionData;

	    this.setFooterBreadcrumb();

	    // this.options.chartFooterTitle = (this.options.chartFooterTitle).replace(/<b>/g, '');
	    // this.options.chartFooterTitle = (this.options.chartFooterTitle).replace(/<b>/g, '').replace(/<\/b>/g, '');
	    this.options.selectionToFooterTitle = this.options.chartFooterTitle;
	}


	// full container out look changing of performance page
	performancePageChangeLayout() {
		//console.log(this.options.pageName);
	    var originalGridHeight = $(this.options.pageName + ' .gridPart').height();
	    this.options.originalGridHeight = this.options.originalGridHeight == undefined ? originalGridHeight : this.options.originalGridHeight;


	    //console.log($('.app_20186113226-1530516746786_PerformancePage .jqx-widget-content').children().children()[0].id);

	    if (this.options.isDefaultLayout) {
	        var TopContainerID = '#' + $(this.options.pageName + ' .jqx-widget-content').children().children()[0].id;
	        $(TopContainerID + " .selectionPart").removeClass("selectionPartFullWidth");
	        //$(TopContainerID + " .chartPart").removeClass("hide");
	        //$(TopContainerID + " .jqx-splitter-splitbar-vertical").removeClass("hide");
	        //$(this.options.pageName + ' .jqx-splitter-splitbar-horizontal').removeClass("hide");
	        $(TopContainerID + " .chartPart").show();
	        $(TopContainerID + " .jqx-splitter-splitbar-vertical").show();
	        $(this.options.pageName + ' .jqx-splitter-splitbar-horizontal').show();
	        $(this.options.pageName + ' .measureBoxs').removeClass("measurePositionTop").addClass("measurePositionLeft");
	        $(this.options.pageName + ' .gridPart').removeClass("gridPartFullHeight");
	        $(this.options.pageName + ' .gridPart .k-grid-content').height(this.options.originalGridHeight - 50); // set original height
	        this.options.fitPageWidth = true; //  setting Fit to page width by default
	        //this.getChartWithResize(); // refreshing drilldown or overtime chart
	    } else {

	        var TopContainerID = '#' + $(this.options.pageName + ' .jqx-widget-content').children().children()[0].id;
	        $(TopContainerID + " .selectionPart").addClass("selectionPartFullWidth");
	        $(TopContainerID + " .chartPart").hide();
	        $(TopContainerID + " .jqx-splitter-splitbar-vertical").hide();
	        $(this.options.pageName + ' .jqx-splitter-splitbar-horizontal').hide();
	        //$(TopContainerID + " .jqx-splitter-splitbar-vertical").addClass("hide");
	        //$(TopContainerID + " .chartPart").addClass("hide");
	        //$(this.options.pageName + ' .jqx-splitter-splitbar-horizontal').addClass("hide");
	        $(this.options.pageName + ' .measureBoxs').removeClass("measurePositionLeft").addClass("measurePositionTop");
	        $(this.options.pageName + ' .gridPart').addClass("gridPartFullHeight");
	        var newGridHeight = $(this.options.pageName + ' .gridPartFullHeight').height() - 70;
	        // setting bottom grid height with changing layout
	        if (this.options.isStylesheetAdded == undefined) {
	            this.setGridHeight(newGridHeight);
	            this.options.isStylesheetAdded = true;
	        }
	    }


	}

	// setting height of bottom grids of performance page            
	setGridHeight(H) {
	    var styleNode = document.createElement('style');
	    styleNode.type = "text/css";
	    //if (!!(window.attachEvent)) {
	        styleNode.style.cssText = this.options.pageName + " .gridPartFullHeight .k-grid-content { height: " + H + "px!important;}";
	    /*} else {
	        var styleText = document.createTextNode(this.options.pageName + " .gridPartFullHeight .k-grid-content { height: " + H + "px!important;}");
	        styleNode.appendChild(styleText);
	    }*/
	    document.getElementsByTagName('head')[0].appendChild(styleNode);
	}

	/**
	 * watching the isDefaultLayout flag 
	 * when value is changed then calling performancePageChangeLayout method
	 */
	/*this.$watch('options.isDefaultLayout', function(newValue, oldValue) {
	    if (newValue != oldValue)
	        this.performancePageChangeLayout();
	});*/
	open() {
        //this.opened = true;
    }
    close() {
        this.opened = false;
        this.popupRef = null;
    }
    windowopen() {
    	/*this.popupRef = this.popupService.open({
          anchor: this.anchor,
          appendTo: this.container,
          content: this.template
        });*/
        //this.customChartSelectionWindowVisible = true;
        var accessWindow = $(".customChartSelectionWindow").kendoWindow({modal: true}).data("kendoWindow");
		accessWindow.center();
		accessWindow.open();
    }
    windowclose() {
    	this.customChartSelectionWindowVisible = false;
    }

}
