import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../../../globals/globals';
import { Surface, Path, Text, Group, Layout, LinearGradient, GradientOptions, ShapeOptions } from '@progress/kendo-drawing';
import { Arc as DrawingArc, GradientStop } from '@progress/kendo-drawing';
import { Arc, Rect, ArcOptions } from '@progress/kendo-drawing/geometry';
import { formatNumber } from '@progress/kendo-angular-intl';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { NformatterPipe } from '../../../../../pipe/nformatter.pipe';
import { HelperService } from '../../../../../services/helper.service';

import * as $ from 'jquery';

@Component({
  selector: 'total-sales-column-chart',
  templateUrl: './total-sales-column-chart.component.html',
  styleUrls: ['./total-sales-column-chart.component.scss']
})
export class TotalSalesColumnChartComponent implements OnInit {
  	
	@Input() options;
  	  
	@ViewChild('chartObj') chartObj;

	randomData:any;
	totalSalesData:any;
	labelsFont:any;
	topLabelsFont:any;
	maxSalesValue:any;
	totalSalesDataWithSort:any;
	windowWidth:any;
	dataLoaded:any;
	sales:any;
	totalSalesChart:any;
	chartdata:any;
	measureDataDecimalPlaces:any;
	unit:any;
	GridData:any;

	constructor(private _helperService: HelperService, private nformatterPipe: NformatterPipe) { 
		this.randomData = this._helperService.getRandomData();
		this.totalSalesChart = {};
		this.totalSalesData = [];
	}

	public onContextMenuSelect({ item }): void {
		if(this[item.logicFunctionName] != undefined)
			this[item.logicFunctionName]();
	}

	ngDoCheck() {
		if(this.options.dataLoaded == true) {
        	GLOBALS.isShowLyData = (GLOBALS.isShowLyData != undefined ) ? GLOBALS.isShowLyData : true;
            GLOBALS.isShowTyData = (GLOBALS.isShowTyData != undefined ) ? GLOBALS.isShowTyData : true;
            GLOBALS.timeSelectionModeVal = (GLOBALS.timeSelectionModeVal != undefined ) ? GLOBALS.timeSelectionModeVal : 1;
    		this.callToDataRender();
		}

		if (this.options.reloadChart == true) {
			this.options.reloadChart = false;
			this.resetChart();
		}
		// this.resizeTotalSalesChart(this.options.pageName);
	}

    ngAfterViewInit() {
        this.options.ContextOptions.containerObj = this.chartObj;
    }

    ngOnInit() {
        this.options.isDataFormated = (this.options.isDataFormated == undefined) ? false : this.options.isDataFormated; // initially set the isDataFormated is false 
        this.options.shareValue = (this.options.shareValue == undefined) ? 0 : this.options.shareValue;
        this.options.defaultGridHeight = "100%";
        this.options.ChartGridClass = "ChartContainer_" + this.randomData+Math.floor((Math.random() * 100) + 1);
        this.options.ContextOptions = {
            container: "." + this.options.ChartGridClass,
            isGrid:false,
            menuItems: [
            	{menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnSetGrid', functionScope: 'parentComponent'},
            	{menuSlug: 'CHART_EXPORT_AS_PNG', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Total Sales Chart.png', functionScope: 'self'}
            ]
        };
    }

    dataFormating(arrOfObj) {
        this.totalSalesData = arrOfObj;
        var shareValueRounded = Math.round(this.options.shareValue * 10 ) / 10;
        if (shareValueRounded <= -1) {
            this.options.ChartTitleBackColor = "#FABBBB";
        }
        else if (shareValueRounded >= 1) {
            this.options.ChartTitleBackColor = "#B4E8A7";
        }
        else {
            this.options.ChartTitleBackColor = "#FF9900";
        }
        var sign = this.options.shareValue > 0 ? "+" : "";
        var titleParts = [];
        if (GLOBALS.isShowTyData)
            titleParts.push(this.totalSalesData[0].ACCOUNT);

        if ((GLOBALS.isShowLyData) || (GLOBALS.isShowTyData && GLOBALS.timeSelectionModeVal == 2))
            titleParts.push(this.totalSalesData[1].ACCOUNT);

        this.totalSalesData[0].SALES = Number(this.totalSalesData[0].SALES).toFixed(0); 
        this.totalSalesData[1].SALES = Number(this.totalSalesData[1].SALES).toFixed(0); 

        this.options.ChartTitle =  titleParts.join(" VS ");
        this.options.ChartTitle += (titleParts.length > 1) ? ": " + sign + formatNumber(this.options.shareValue, "#,##0.#") + ' %' : '';
        return this.totalSalesData;
    }
    
    setAgGridObject(data) {
        var options = {
            callbackFooterRow: this.createFooterRow,
            myContextMenuItems: [{
                name:'SHOW_CHART', 
                text:'Show Chart', 
                callback: () => {
                    this.fnSetChart()
                }
            }],
            contextMenuItems: ['SHOW_CHART', 'EXPORT_CSV_EXCEL_BOTH']
        };
        return {columns:this.getAgGridColumns(), data:data, options:options};
    }

    updateGrid(gridOptions, data) {
        gridOptions.api.setColumnDefs(this.getAgGridColumns());
        gridOptions.api.setRowData(data);
        gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
    }

    createFooterRow(data) {
        var SALES = 0;
        data.forEach(function(obj, key){
            SALES += parseFloat(obj.SALES);
        });

        var result = [{
            ACCOUNT: 'Total',
            SALES: SALES
        }];

        return result;
    }

    getAgGridColumns() {

        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        this.options.measureLabel = selectedMeasure[0]['measureName'];
        var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];

        var columnsName = [{
                field: "ACCOUNT",
                headerName: "PERIOD",
                headerClass: {"class": "text-left"},
                cellClass: {"class": "text-left"},
                suppressMenu: true
            }, {
                field: "SALES",
                headerName: this.options.measureLabel.toUpperCase(),
                type: "numericColumn",
                headerClass: {"class": "text-left"},
                cellClass: {"class": "text-left"},
                valueFormatter: function(params) { return formatNumber(params.value, measureDataDecimalPlaces); },
                suppressMenu: true
            }
        ];                           
        
        return columnsName;
    }

    getGridData() {
        var data = [];
        
        if (GLOBALS.isShowTyData)
            data.push(this.options.data[0]);

        if ((GLOBALS.isShowLyData) || (GLOBALS.isShowTyData && GLOBALS.timeSelectionModeVal == 2))
            data.push(this.options.data[1]);

        return data;
    }

    setTotalSalesChart() {
		//var maxMin = $(this.options.pageName).attr("maxmin");
		// var maxMin = "min";
		if (this.options.isMax) {
		    this.labelsFont = "16px Arial,Helvetica,sans-serif";
		    this.topLabelsFont = "16px Arial,Helvetica,sans-serif";
		    var podWidth = $(this.options.pageName + " .TOTAL_SALES_POD_CONTAINER .podContainer").width();
		    var textWidth = this.getFontWidth(this.options.ChartTitle,"16px Arial,Helvetica,sans-serif"); 
		    var titlePadding = ((podWidth - textWidth)/2);
		}
		else {
		    this.labelsFont = "12px Arial,Helvetica,sans-serif";
		    this.topLabelsFont = "12px Arial,Helvetica,sans-serif";
		    var podWidth = $(this.options.pageName + " .TOTAL_SALES_POD_CONTAINER .podContainer").width();
		    var textWidth = this.getFontWidth(this.options.ChartTitle,"12px Arial,Helvetica,sans-serif"); 
		    var titlePadding = ((podWidth - textWidth)/2);
		}

		this.totalSalesData = [];

		if (GLOBALS.isShowTyData) {
			this.options.data[0].SALES = this.options.data[0].SALES*1;
		    this.totalSalesData.push(this.options.data[0]);
		}

		if ((GLOBALS.isShowLyData) || (GLOBALS.isShowTyData && GLOBALS.timeSelectionModeVal == 2)){
			this.options.data[1].SALES = this.options.data[1].SALES*1;
		    this.totalSalesData.push(this.options.data[1]);
		}

		if (this.totalSalesData.length > 1)
		    var maxSales = (Number(this.totalSalesData[0].SALES) > Number(this.totalSalesData[1].SALES)) ? this.totalSalesData[0].SALES : this.totalSalesData[1].SALES;
		else
		    var maxSales = this.totalSalesData[0].SALES;

		this.maxSalesValue = Number(maxSales) + Math.ceil((maxSales * 10) / 100);

		var color = ["#4AD2DE", "#2B80B5"];
		for (let index in this.totalSalesData) {
			this.totalSalesData[index].color = color[index];
		}
		var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
		this.measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
		this.unit = " " + selectedMeasure[0]['measureName'];

		this.totalSalesDataWithSort = this.totalSalesData;
		this.totalSalesDataWithSort = this.totalSalesDataWithSort.reverse();

		var chartAreaObj = {};
		this.windowWidth = window.innerWidth;		
		// if(this.windowWidth<768 && maxMin != "max" ){		
		if(this.windowWidth<768 && !this.options.isMax ){		
		    chartAreaObj = { height:200 };		
		}

		this.totalSalesChart = {
		    chartArea: chartAreaObj,
		    dataSource: {
		        data: this.totalSalesDataWithSort
		    },
		    title:{
		        text: this.options.ChartTitle,
		        font: this.topLabelsFont,
		        color: "#000",
		        background: this.options.ChartTitleBackColor,
		        visible: true,
		        padding:{
		            left: titlePadding,
		            right: titlePadding,
		            top: 5,
		            bottom:5
		        },
		        margin:{
		            top:0
		        }
		     },
		    series: [
		        {field: 'SALES', format: "{0:n"+selectedMeasure[0]['dataDecimalPlaces']+"}", name:'SALES'}
		    ],
		    seriesDefaults: {
		        type: 'column',
		        style: 'smooth',
		        gap: 0.2,
		        labels: {
		            visible: true,
		            position: "bottom",
		            background: "transparent",
		            font: this.labelsFont,
		            color: "#000",
		            template: function(e) {
		            	return ((e.dataItem.SALES > 1000000) ? GLOBALS.nFormatter(Number(e.dataItem.SALES), selectedMeasure[0]['dataDecimalPlaces']) : formatNumber(Number(e.dataItem.SALES), "n"+selectedMeasure[0]['dataDecimalPlaces']));
		            }
		        }
		    },
		    valueAxis: {
		        min: 0,
		        max: this.maxSalesValue,
		        visible: false,
		        minorGridLines: {
		            visible: true
		        }
		    },
		    categoryAxis: {
		        field: "ACCOUNT",
		        labels: {
		            font: this.labelsFont
		        },
		        minorGridLines: {
		            visible: true
		        },
		    },
		    legend: {
		        visible: true,
		        position: "bottom",
		        labels: {
		            font: this.labelsFont
		        }
		    },
		    tooltip: {
		        visible: true
		    }
		};
	}

	// set GRID function
	fnSetGrid() {
		this.options.ContextOptions.isGrid = true;
		this.GridData = this.totalSalesData;
        if(this.options.totalSalesGrid == undefined ) {
            this.options.totalSalesGrid = this.setAgGridObject(this.GridData);
            this.options.totalSalesGrid.dataLoaded = true;
        }
        else{
            this.updateGrid(this.options.totalSalesGrid.gridOptions, this.GridData);
        }
	}

	// set CHART function
	fnSetChart() {
		this.options.ContextOptions.isGrid = false;
		this.setTotalSalesChart();
	}

	renderChart() {
		if(this.options.ContextOptions.isGrid){
            if(this.options.totalSalesGrid == undefined) {
                this.options.totalSalesGrid = this.setAgGridObject(this.getGridData());
                this.options.totalSalesGrid.dataLoaded = true;
            }
            else
                this.updateGrid(this.options.totalSalesGrid.gridOptions, this.getGridData());
        } else {

            this.setTotalSalesChart();
        }
	}
	
	callToDataRender() {
		if(!this.options.isDataFormated && this.options.data != undefined){
		    this.dataFormating(this.options.data);
		}
		if (this.options.dataLoaded == true) {
		    this.options.dataLoaded = false;
		    this.renderInitialData();
		}
	}

	renderInitialData() {
		this.renderChart();
	}
	
	resetChart(){
		this.setTotalSalesChart();
	}

	getCsvData(tempHeaders, tempRows) {
	    var headers = {};
	    for (var i = 0; i < tempHeaders.length; i++)
	    {
	        headers[tempHeaders[i]['field']] = tempHeaders[i]['title'];
	    }
	    var tempData = [];
	    tempData.push(headers);
	    for (var i = 0; i < tempRows.length; i++)
	    {
	        var tempRowObj = new Object();
	        for (var j = 0; j < tempHeaders.length; j++)
	        {
	            tempRowObj[tempHeaders[j]['field']] = tempRows[i][tempHeaders[j]['field']];
	        }
	        tempData.push(tempRowObj);
	    }
	    return tempData;
	}

	getFontWidth(str, fontSize) {
	    var canvas = document.createElement('canvas');
	    var ctx = canvas.getContext("2d");
	    ctx.font = fontSize;
	    var width = ctx.measureText(str).width;
	    return width;
	}
/*
	resizeTotalSalesChart(pageName) {
    
    	setTimeout(function(){
            //var pageName = $(".getTotalSalesPageName").val();        
            $(pageName + " .TOTAL_SALES_POD_CONTAINER .jarviswidget-fullscreen-btn").click(function() {
                
                setTimeout(function(){
                var podWidth = $(pageName + " .TOTAL_SALES_POD_CONTAINER .podContainer").width();
                var isMax = $(pageName + " .TOTAL_SALES_POD_CONTAINER").closest('#jarviswidget-fullscreen-mode').length;
                //isMax = isMax==0?1:0;
                var podHeight = isMax == 0 ? $(this).closest('.jarviswidget').height() - 25 : "100%";

                if (isMax == 0) {
                    $(pageName).attr("maxmin", "min");
                    $(".jarviswidget-ctrls .tooltip").css("display", "none");
                }
                else {
                    $(pageName).attr("maxmin", "max");
                }
                var maxMin = $(pageName).attr("maxmin");
                if ($(pageName + " .TOTAL_SALES_POD_CONTAINER .totalSalesChartClass").data("kendoChart") != undefined) {
                    var chart = $(pageName + " .TOTAL_SALES_POD_CONTAINER .totalSalesChartClass").data("kendoChart");
                    if (maxMin == "max") {                    
                        var textWidth = this.getFontWidth(chart.options.title.text,"16px Arial,Helvetica,sans-serif");
                        var titlePadding = ((podWidth - textWidth)/2);
                        
                        chart.options.title.padding.left = titlePadding;
                        chart.options.title.padding.right = titlePadding;
                        
                        chart.options.categoryAxis.labels.font = "16px Arial,Helvetica,sans-serif";
                        chart.options.legend.labels.font = "16px Arial,Helvetica,sans-serif";
                        chart.options.valueAxis.title.font = "16px Arial,Helvetica,sans-serif";

                        if (chart.options.title != undefined) {
                            chart.options.title.font = "16px Arial,Helvetica,sans-serif";
                        }
                        if (chart.options.series[0] != undefined)
                            chart.options.series[0].labels.font = "16px Arial,Helvetica,sans-serif";
                    }
                    else {
                            var textWidth = this.getFontWidth(chart.options.title.text,"12px Arial,Helvetica,sans-serif");
                            var titlePadding = ((podWidth - textWidth)/2);

                            chart.options.title.padding.left = titlePadding;
                            chart.options.title.padding.right = titlePadding;
                            
                            chart.options.categoryAxis.labels.font = "12px Arial,Helvetica,sans-serif";
                            chart.options.legend.labels.font = "12px Arial,Helvetica,sans-serif";
                            chart.options.valueAxis.title.font = "12px Arial,Helvetica,sans-serif";



                            if (chart.options.title != undefined)
                                chart.options.title.font = "12px Arial,Helvetica,sans-serif";
                            if (chart.options.series[0] != undefined)
                                chart.options.series[0].labels.font = "12px Arial,Helvetica,sans-serif";
                        
                    }
                    setTimeout(function(){
                        chart.refresh();
                    });
                }
                
                if ($(pageName + " .TOTAL_SALES_POD_CONTAINER .totalSalesGridClass").data("kendoGrid") != undefined) {
                    $(pageName + " .TOTAL_SALES_POD_CONTAINER .totalSalesGridClass").data("kendoGrid").wrapper.height(podHeight);
                    $(pageName + " .TOTAL_SALES_POD_CONTAINER .totalSalesGridClass").data("kendoGrid").resize(true);
                }
                
                });
            });
            
        },500);
    }*/
}