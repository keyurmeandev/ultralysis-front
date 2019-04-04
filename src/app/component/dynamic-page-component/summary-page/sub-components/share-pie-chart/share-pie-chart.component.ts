import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../../../globals/globals';
import { NumberFormatPipe } from '../../../../../pipe/number-format.pipe';
import { formatNumber } from '@progress/kendo-angular-intl';
import { HelperService } from '../../../../../services/helper.service';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import * as $ from 'jquery';

@Component({
  selector: 'share-pie-chart',
  templateUrl: './share-pie-chart.component.html',
  styleUrls: ['./share-pie-chart.component.scss']
})
export class SharePieChartComponent implements OnInit {
 
  	@Input() options;

    @ViewChild('sharechartObj') sharechartObj;
  	
  	shareByData:any;
  	isDataFormated:any;
  	shareChartGridClass:any;
  	randomData:any;
  	shareChart:any;
  	shareChartData:any;
  	labelsFont:any;
  	ChartData:any;
  	windowWidth:any;
  	tempclrObj:any;
  	ultChartColors:any;
    totalValChart:any;
    chartunit:any;
    measureDataDecimalPlaces:any;
    showItemOptions:any;

  	constructor(private _helperService: HelperService) { 
	  	this.shareChart = {};
	  	this.shareChartData = [];
  	}

    public onContextMenuSelect({ item }): void {
        if(this[item.logicFunctionName] != undefined)
            this[item.logicFunctionName](item);
    }

  	ngOnInit() {
        this.options.isDataFormated = (this.options.isDataFormated==undefined) ? false : this.options.isDataFormated;
        this.randomData = this._helperService.getRandomData();
        this.options.defaultGridHeight = "100%"; // grid height
        this.options.chartContainerName = "chart_container_"+Math.floor((Math.random() * 100) + 1);
        this.options.shareChartGridClass = "shareChartContainer_" + this.randomData+Math.floor((Math.random() * 100) + 1);
        this.showItemOptions = [
            {data : 6, menuText : '5', logicFunctionName: 'fnSetVisibleItems', functionScope: 'parentComponent'},
            {data : 11, menuText : '10', logicFunctionName: 'fnSetVisibleItems', functionScope: 'parentComponent'},
            {data : 16, menuText : '15', logicFunctionName: 'fnSetVisibleItems', functionScope: 'parentComponent'},
            {data : 21, menuText : '20', logicFunctionName: 'fnSetVisibleItems', functionScope: 'parentComponent'},
            {data : 'All', menuText : 'All', logicFunctionName: 'fnSetVisibleItems', functionScope: 'parentComponent'},
        ];
        this.options.ContextOptions = {
            container: "." + this.options.shareChartGridClass,
            isGrid: false,
            maxVisibleItems : 10,
            menuItems: [
                {menuSlug: 'SHOW_HIDE_LABELS', menuText: 'Show/Hide Labels', logicFunctionName: 'fnSetShowHideLabelShareChart', functionScope: 'parentComponent'},
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnSetShareGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Share Pie Chart', functionScope: 'self'},
                {menuSlug: 'SHOW_ITEMS', menuText: 'Show Items', items: this.showItemOptions },
            ]
        };
    }

  	ngDoCheck() {
	  	if(this.options.dataLoaded == true) {
            this.callToDataRender();
	  	}

        if (this.options.reloadChart == true) {
            this.options.reloadChart = false;
            this.resetChart();
        }
	  	//this.resizeShareByChart(this.options.pageName);
  	}

    ngAfterViewInit() {
        this.options.ContextOptions.containerObj = this.sharechartObj;
    }

  	fnSetVisibleItems(selectedEle){
        this.options.ContextOptions.maxVisibleItems = selectedEle.data;
        this.options.dataLoaded = true;
    }
    
    // setting chart color function
    setChartColor(arrOfObj) {
        var temp = [];
        var i = 0;
        Object.keys(arrOfObj).forEach(function(key) {
            var obj = arrOfObj[key];
        	var tempObj = {};
            tempObj = {
                ACCOUNT:obj.ACCOUNT,
                TYEAR:Number(obj.TYEAR),
                LYEAR:Number(obj.LYEAR),
                color:(GLOBALS.ultChartColors[i] != undefined ) ? GLOBALS.ultChartColors[i] : GLOBALS.getRandomColor()
            };
            temp.push(tempObj);
			i++;
		});
        return temp;
    }
    
    /*
     * Action: Generating data of share chart or grid
     * Params: Array of Object
     * Return: Array without TOTAL data
     */
    makeShareData(arrOfObj) {

        var maxLength = (this.options.ContextOptions.maxVisibleItems == 'All') ? arrOfObj.length : (this.options.ContextOptions.maxVisibleItems-1) ;
        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];

        var temp = [];
        var otherTY = 0;
        var otherLY = 0;
        var count = 0

        for (let key in arrOfObj) {
        //Object.keys(arrOfObj).forEach(function(key) {
            var obj = arrOfObj[key];
            var tempObj = {};
            if (count < maxLength ) {
                var varPct = obj.LYEAR != 0 ? (((obj.TYEAR / obj.LYEAR) - 1) * 100).toFixed(1) : 0;
                tempObj = {
                    ACCOUNT:obj.ACCOUNT,
                    TYEAR:Number(obj.TYEAR),
                    LYEAR:Number(obj.LYEAR).toFixed(measureDataDecimalPlaces),
                    varPer:Number(varPct),
                    color:obj.color
                };
                temp.push(tempObj);
            }
            if (count >= maxLength ) {
                otherTY = Number(otherTY) + Number(obj.TYEAR);
                otherLY = Number(otherLY) + Number(obj.LYEAR);
            }
            count++;
        }
        if((arrOfObj.length) > maxLength) {
            var tempObj = {};
            var varPct = otherLY != 0 ? (((otherTY / otherLY) - 1) * 100).toFixed(1) : 0;
            tempObj = {
                ACCOUNT:"All Other",
                TYEAR:Number(otherTY).toFixed(measureDataDecimalPlaces),
                LYEAR:Number(otherLY).toFixed(measureDataDecimalPlaces),
                varPer:Number(varPct),
                color:GLOBALS.getRandomColor()
            };
            temp.push(tempObj);
        }
        return temp;
    }
    
    // share data formation
    dataFormating(arrOfObj) {
        this.shareByData = arrOfObj;
        this.shareByData = this.setChartColor(this.shareByData);
        this.shareByData = this.makeShareData(this.shareByData); 
        this.shareByData = this._helperService.order(this.shareByData, 'TYEAR', 'desc');
        return this.shareByData;
    }

    /**
     * method: setGridObject
     * action: set grid options
     * @param {json array} data
     * @param {sting} gridName
     * @returns {object} gridOptions
    */

    setAgGridObject(data,) {
        var options = {
            callbackFooterRow: this.createFooterRow,
            myContextMenuItems: [{
                name:'SHOW_CHART', 
                text:'Show Chart', 
                callback: () => {
                    this.fnSetShareChart()
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
        var TYEAR = 0;
        data.forEach(function(obj, key) {
        	TYEAR += parseFloat(obj.TYEAR);
        });
        var result = [{
            ACCOUNT: 'Total',
            TYEAR: TYEAR
        }];
        return result;
    }

    getAgGridColumns() {
        if(GLOBALS.measuresOptiondata != undefined)
            var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
            this.options.measureLabel = selectedMeasure[0]['measureName'];
            var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];

        	var columnsName = [{
                field: "ACCOUNT",
                headerName: this.options.firstColumnName,
                suppressMenu: true
            },
            {
                field: "TYEAR",
                headerName: (GLOBALS.measuresOptiondata != undefined) ? this.options.measureLabel.toUpperCase() : "VALUE",
                type: "numericColumn",
                valueFormatter: function(params) {
                	return formatNumber(params.value, "n"+measureDataDecimalPlaces);
                },
                suppressMenu: true
            }
        ];
        return columnsName;
    }

    setChartData() {
        //var maxMin = $(this.options.pageName).attr("maxmin");
        // var maxMin = "min";
        // if($(this.options.pageKey).hasClass('fullscreen'))
        //     maxMin = "max";

        if (this.options.isMax) {
            this.labelsFont = "12px Arial,Helvetica,sans-serif";
        } else {
            this.labelsFont = "8px Arial,Helvetica,sans-serif";
        }
        this.ChartData = this.options.data;
        var totalValue = 0;
        this.ChartData.forEach(function(value, key) {
        	totalValue = Number(totalValue) + Number(value.TYEAR);
        });
        this.totalValChart = totalValue;
        var isLables = this.options.ContextOptions.isLables;
        var lablePosition = (this.options.ContextOptions.lablePosition != undefined) ? this.options.ContextOptions.lablePosition : 'outsideEnd';
        var paddingValue = isLables == true ? 100 : 10;

        this.windowWidth = window.innerWidth;
        // if(this.windowWidth<768 && maxMin != "max" ){
        if(this.windowWidth<768 && !this.options.isMax ){
            var chartAreaObj = { height:200 };
        }
        /* Measure */
        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        this.measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
        this.chartunit = " " + selectedMeasure[0]['measureName'];

        this.shareChart = {
            chartArea: chartAreaObj,
            title: (this.options.chartTitle != undefined) ? this.options.chartTitle : "",
            series: [
                {field: 'TYEAR', categoryField: "ACCOUNT", padding: paddingValue}
            ],
            seriesDefaults: {
                type: 'pie',
                style: 'smooth',
                labels: {
                    position: lablePosition,
                    visible: isLables,
                    background: "transparent",
                    template: function(e) {
                        var upDownText = Number(e.dataItem.varPer) > 0 ? "Up " : "Down ";
                        if(GLOBALS.measuresOptiondata != undefined)
                        {
                            var unit = " " + selectedMeasure[0]['measureName']; 
                            return e.dataItem.ACCOUNT + " \n" +
                                ((e.dataItem.TYEAR > 1000000) ? GLOBALS.nFormatter(Number(e.dataItem.TYEAR), selectedMeasure[0]['dataDecimalPlaces']) : 
                                    formatNumber( Number(e.dataItem.TYEAR), "{0:n"+selectedMeasure[0]['dataDecimalPlaces']+"}")) + unit + " Sales \n" + 
                                    GLOBALS.getPercent(totalValue, Number(e.dataItem.TYEAR)) + "% Share \n"+
                                    upDownText + e.dataItem.varPer + "%";
                        }
                        else
                        {
                            return e.dataItem.ACCOUNT + " \n " +
                                ((e.dataItem.TYEAR > 1000000) ? GLOBALS.nFormatter(Number(e.dataItem.TYEAR), selectedMeasure[0]['dataDecimalPlaces']) : 
                                    formatNumber( Number(e.dataItem.TYEAR), "{0:n"+selectedMeasure[0]['dataDecimalPlaces']+"}")) + " Total \n" +
                                    GLOBALS.getPercent(totalValue, Number(e.dataItem.TYEAR)) + "% Share \n"+
                                    upDownText + e.dataItem.varPer + "%";
                        }
                    },
                    font: 'bold '+ this.labelsFont
                }
            },
            valueAxis: {
                visible: true,
                minorGridLines: {
                    visible: true
                }
            },
            categoryAxis: {
                visible: true,
                field: "ACCOUNT",
                labels: {
                    font: this.labelsFont
                },
                minorGridLines: {
                    visible: true
                }
            },
            legend: {
                position: "right",
                offsetX: -0,
                offsetY: 0,
                labels: {
                    font: this.labelsFont
                }
            },
            tooltip: {
                visible: true
            }   
        };
    }

    // share by brand GRID function
    fnSetShareGrid() {
        this.options.ContextOptions.isGrid = true;
        this.options.ContextOptions.isShowHide = false;
        if(this.options.shareGrid==undefined) {
            this.options.shareGrid = this.setAgGridObject(this.options.data);
            this.options.shareGrid.dataLoaded = true;
        } else {
            this.updateGrid(this.options.shareGrid.gridOptions, this.options.data);
        }
    }
    
    // share by brand PIE chart function
    fnSetShareChart() {
        this.options.ContextOptions.isGrid = false;
        this.options.ContextOptions.isShowHide = true;
        this.setChartData();
    }
    
    // share by brand show/hide lables  function
    fnSetShowHideLabelShareChart() {
        this.options.ContextOptions.lablePosition = 'outsideEnd';
        this.options.ContextOptions.isLables = (this.options.ContextOptions.isLables == true) ? false : true;
        this.setChartData();
    }

    renderChart() {
        if(this.options.ContextOptions.isGrid){
            if(this.options.shareGrid==undefined){
                this.options.shareGrid = this.setAgGridObject(this.options.data);
                this.options.shareGrid.dataLoaded = true;
            }
            else{
                this.updateGrid(this.options.shareGrid.gridOptions, this.options.data);
            }
        }else{
            this.setChartData();
        }
    }

    /**
     * method: callToDataRender
     * action: calling a method to data render
     * @returns {void}
     */
    callToDataRender() {
        // need when dada are not formated for share chart or grid
        if(!this.options.isDataFormated){
            this.options.AllShareByData = (this.options.AllShareByData != undefined) ? this.options.AllShareByData : this.options.data;
            this.options.data = this.dataFormating(this.options.AllShareByData);
        }
        if (this.options.dataLoaded == true) {
            this.options.dataLoaded = false;
            this.renderInitialData();
        }
    }

    /**
     * method: renderInitialData
     * action: rendering all chart data
     * @returns {void}
     */
    renderInitialData() {
        this.renderChart();
    }

    /**
     * method: resetChart
     * action: chart rebind
     * @return: (void)
     */
    resetChart() {
        this.setChartData();
    }

    /*resizeShareByChart(pageName) {
        setTimeout(function(){
            //var pageName = $(".getSharePageName").val();
            $(pageName + " .SHARE_POD_CONTAINER .jarviswidget-fullscreen-btn").on("click", function() {
                var containerID = "#"+$(this).closest(".SHARE_POD_CONTAINER")[0].id;

                setTimeout(function(){
                    var isMax = $(containerID).closest('#jarviswidget-fullscreen-mode').length;
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

                    if ($(containerID + " .shareChartClass").data("kendoChart") != undefined) {
                        var chart = $(containerID + " .shareChartClass").data("kendoChart");

                        if (maxMin == "max") { 
                            chart.options.categoryAxis.labels.font = "16px Arial,Helvetica,sans-serif";
                            chart.options.legend.labels.font = "16px Arial,Helvetica,sans-serif";
                            chart.options.valueAxis.title.font = "16px Arial,Helvetica,sans-serif";

                            if (chart.options.title != undefined) {
                                chart.options.title.font = "16px Arial,Helvetica,sans-serif";
                            }
                            if (chart.options.series[0] != undefined)
                                chart.options.series[0].labels.font = "bold 12px Arial,Helvetica,sans-serif";
                        }
                        else {
                                chart.options.categoryAxis.labels.font = "8px Arial,Helvetica,sans-serif";
                                chart.options.legend.labels.font = "8px Arial,Helvetica,sans-serif";
                                chart.options.valueAxis.title.font = "11px Arial,Helvetica,sans-serif";
                                if (chart.options.title != undefined)
                                    chart.options.title.font = "12px Arial,Helvetica,sans-serif";
                                if (chart.options.series[0] != undefined)
                                    chart.options.series[0].labels.font = "bold 8px Arial,Helvetica,sans-serif";

                        }
                        setTimeout(function(){
                            chart.refresh();
                        });
                    }
                    
                    if ($(containerID + " .shareGridClass").data("kendoGrid") != undefined) {
                        $(containerID + " .shareGridClass").data("kendoGrid").wrapper.height(podHeight);
                        $(containerID + " .shareGridClass").data("kendoGrid").resize(true);
                    }
                });
            });
        },500);
    }*/

}
