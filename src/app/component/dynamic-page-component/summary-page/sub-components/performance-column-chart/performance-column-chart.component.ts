import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../../../globals/globals';
import { OrderByPipe } from '../../../../../pipe/order-by.pipe';
import { NformatterPipe } from '../../../../../pipe/nformatter.pipe';
import { formatNumber, toString } from '@progress/kendo-angular-intl';
import { PopupService, PopupRef } from '@progress/kendo-angular-popup';
import { HelperService } from '../../../../../services/helper.service';
import * as $ from 'jquery';

@Component({
  selector: 'performance-column-chart',
  templateUrl: './performance-column-chart.component.html',
  styleUrls: ['./performance-column-chart.component.scss']
})
export class PerformanceColumnChartComponent implements OnInit {
  
  	@Input() options;

    @ViewChild('performancechartObj') performancechartObj;

  	performanceChart:any;
  	labelsFont:any;
  	leftLabelsFont:any;
  	ChartData:any;
  	GridData:any;
  	performanceVarData:any;
  	performanceData:any;
  	randomData:any;
  	performanceVarPerData:any;
  	tempObj:any;
  	tempclrObj:any;
    activeTab:any;
    unit:any;
    chartName:any;
    signicon:any;

  	constructor(private orderPipe: OrderByPipe, private _helperService: HelperService) {
        this.performanceChart = {};
        this.performanceVarData = [];
        this.performanceVarPerData = [];
    }

    public onContextMenuSelect({ item }): void {
        if(this[item.logicFunctionName] != undefined)
            this[item.logicFunctionName]();
    }

  	ngOnInit() {
        // initial options
        this.options.isDataFormated = (this.options.isDataFormated==undefined) ? false : this.options.isDataFormated;
        this.randomData = this._helperService.getRandomData(); // getting random data from commonFunctions.js
        
        // initial some variables
        this.options.defaultGridHeight = "100%"; // grid height
        this.options.chartContainerName = "chart_container_"+Math.floor((Math.random() * 100) + 1);
        
        // initial class name for chart grid
        this.options.performanceChartGridClass = "performanceChartContainer_" + this.randomData+Math.floor((Math.random() * 100) + 1);

        // initialize context options of DRILL DOWN grid
        this.options.ContextOptions = {
            container: "." + this.options.performanceChartGridClass,
            isGrid: false,
            // isTab: true,
            // showItems: true,
            maxVisibleItems : 10,
            activeTab:'',
            firstTabEvent:'',
            secondTabEvent:'',
            menuItems: [
                {menuSlug: 'SHOW_GRID', menuText: 'Show Grid', logicFunctionName: 'fnSetPerformanceGrid', functionScope: 'parentComponent'},
                {menuSlug: 'CHART_EXPORT_AS_PNG', menuText: 'Chart Export', logicFunctionName: 'fnChartExportAsImage', exportImageName: 'Performance Chart', functionScope: 'self'}
            ]
        };
        this.options.ContextOptions.activeTab = ((this.options.ContextOptions.activeTab != '') ? this.options.ContextOptions.activeTab : 'one');
        this.options.ContextOptions.firstTabEvent = ((this.options.ContextOptions.firstTabEvent != '') ? this.options.ContextOptions.firstTabEvent : 'chart');
        this.options.ContextOptions.secondTabEvent = ((this.options.ContextOptions.secondTabEvent != '') ? this.options.ContextOptions.secondTabEvent : 'chart');
    }

  	ngDoCheck() {
	  	if(this.options.dataLoaded == true) {
	  		this.callToDataRender();
	  	}
        
        if (this.options.reloadChart == true) {
            this.options.reloadChart = false;
            this.renderChart();
        }
	  	//this.resizeTotalSalesChart(this.options.pageName);
  	}

    ngAfterViewInit() {
        this.options.ContextOptions.containerObj = this.performancechartObj;
    }

  	fnSetVisibleItems() {
        this.options.dataLoaded = true;
    }
        
    setChartColor(arrOfObj) {
        var temp = [];
        var i = 0;
        for(let obj of arrOfObj){
        	var tempclrObj = {};
        	tempclrObj = {
        		ACCOUNT:obj.ACCOUNT,
            	TYEAR:Number(obj.TYEAR),
            	LYEAR:Number(obj.LYEAR),
            	color:(GLOBALS.ultChartColors[i] != undefined ) ? GLOBALS.ultChartColors[i] : GLOBALS.getRandomColor()
        	};            
            temp.push(tempclrObj);
            i++;
        };
        return temp;
    }
        
    /*
     * Action: Generating data of performance chart or grid
     * Params: Array of Object and Return Type
     * Return: Array Data
     */
    makePerformanceData(arrOfObj, returnType) {
    	//var maxLength = (this.options.ContextOptions.maxVisibleItems == 'All') ? arrOfObj.length : (this.options.ContextOptions.maxVisibleItems-1) ;
        //var selectedMeasure = $filter('filter')($rootScope.measuresOptiondata,{measureID : $scope.options.selectedMeasureID }, true );
        //var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];

        var maxLength = (this.options.ContextOptions.maxVisibleItems == 'All') ? arrOfObj.length : (this.options.ContextOptions.maxVisibleItems-1) ;
        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{selected:true});
        var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];

        //var maxLength = 10;
        //var measureDataDecimalPlaces = 2;

        var tempVar = [];
        var totalTY = 0; var otherTY = 0;
        var totalLY = 0; var otherLY = 0;
        var count = 0;

       	for(let obj of arrOfObj){
        	var tempObj = {};
            var variance = (obj.TYEAR - obj.LYEAR).toFixed(measureDataDecimalPlaces);
            var varPct = obj.LYEAR != 0 ? (((obj.TYEAR / obj.LYEAR) - 1) * 100).toFixed(1) : 0;

            if (returnType == 'VARIANCE') {
            	tempObj = {
            		ACCOUNT:obj.ACCOUNT,
                	TYEAR:Number(obj.TYEAR),
                	data:Number(variance),
                	color:obj.color,
            	};
                
                //if (obj.ACCOUNT != 'TOTAL' ) {
                if (count < maxLength) {
                    tempVar.push(tempObj);
                }

                if (count >= maxLength ) {
                    otherTY = Number(otherTY) + Number(obj.TYEAR);
                    otherLY = Number(otherLY) + Number(obj.LYEAR);
                }
            }
            else if (returnType == 'VAR_PERCENT' ) {
            	tempObj = {
            		ACCOUNT:obj.ACCOUNT,
                	TYEAR:Number(obj.TYEAR),
                	data:Number(varPct),
                	color:obj.color,
            	};
                if(count < maxLength)
                    tempVar.push(tempObj);
                if(count >= maxLength){
                    otherTY = Number(otherTY) + Number(obj.TYEAR);
                    otherLY = Number(otherLY) + Number(obj.LYEAR);
                }

                totalTY = Number(totalTY) + Number(obj.TYEAR);
                totalLY = Number(totalLY) + Number(obj.LYEAR);
            }
            count++;
        }


        if( returnType == 'VARIANCE' && (arrOfObj.length) > maxLength){
            var tempObj = {};
            var variance = (otherTY - otherLY).toFixed(1);
            tempObj = {
            	ACCOUNT:"All Other",
            	TYEAR:Number(otherTY),
            	data:Number(variance),
            	color:GLOBALS.getRandomColor()
            };
            tempVar.push(tempObj);
        }

        if( returnType == 'VAR_PERCENT' && (arrOfObj.length) > maxLength){
            var tempObj = {};
            var varPct = otherLY != 0 ? (((otherTY / otherLY) - 1) * 100).toFixed(1) : 0;
            tempObj = {
            	ACCOUNT:"All Other",
            	TYEAR:Number(otherTY),
            	data:Number(varPct),
            	color:GLOBALS.getRandomColor()
            };
            tempVar.push(tempObj);
        }

        if( returnType == 'VAR_PERCENT'){
            var tempObj = {};
            var varPct = totalLY != 0 ? (((totalTY / totalLY) - 1) * 100).toFixed(1) : 0;
            tempObj = {
            	ACCOUNT:"TOTAL",
            	TYEAR:Number(totalTY),
            	data:Number(varPct),
            	color:GLOBALS.getRandomColor()
            };
            tempVar.push(tempObj);
        }
        return tempVar;
    }
    
    // share data formation
    dataFormating (arrOfObj) {
    	this.performanceData = arrOfObj;
        this.performanceData = this.setChartColor(this.performanceData); // setting color
        this.performanceVarData = this.makePerformanceData(this.performanceData, 'VARIANCE');
        this.options.performanceVarData = this.orderPipe.transform(this.performanceVarData,'data',true);
        this.performanceVarPerData = this.makePerformanceData(this.performanceData, 'VAR_PERCENT');
        this.options.performanceVarPerData = this.orderPipe.transform(this.performanceVarPerData, 'data', true);
    }
        
       
        /**
         * method: setGridObject
         * action: set grid options
         * @param {json array} data
         * @param {sting} gridName
         * @returns {object} gridOptions
         */
    setAgGridObject(data, chartName) {
        
        var options = {
            callbackFooterRow: this.createFooterRow,
            myContextMenuItems: [{
                name:'SHOW_CHART', 
                text:'Show Chart', 
                callback: () => {
                    this.fnSetPerformanceChart(chartName)
                }
            }],
            contextMenuItems: ['SHOW_CHART', 'EXPORT_CSV_EXCEL_BOTH']
        };

        return {columns:this.getAgGridColumns(chartName), data:data, options:options};

    }

    updateGrid(gridOptions, data, chartName) {
        gridOptions.api.setColumnDefs(this.getAgGridColumns(chartName));
        gridOptions.api.setRowData(data);
        gridOptions.api.setPinnedBottomRowData(this.createFooterRow(data));
    }

    createFooterRow(griddata) {
        return 0;
        /*var data = 0;
        griddata.foreach(obj => {
        	data += parseFloat(obj.data);
        });
        var result = [{
            ACCOUNT: 'Total',
            data: data
        }];
        return result;*/
    }

    getAgGridColumns(chartName) {

        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{selected:true});
        var dataDecimalPlaces = (chartName == 'VARIANCE') ? selectedMeasure[0]['dataDecimalPlaces'] : 1;

        var columnsName = [{
                field: "ACCOUNT",
                headerName: this.options.firstColumnName,
                headerClass: {"class": "text-left"},
                cellClass: {"class": "text-left"},
                suppressMenu: true
            }, {
                field: "data",
                headerName: "VARIANCE",
                type: "numericColumn",
                headerClass: {"class": "text-left"},
                cellClass: {"class": "text-left"},
                suppressMenu: true,
                valueFormatter: function(params) { 
                	return formatNumber(params.value, "n"+dataDecimalPlaces);
                }
            }
        ];
        return columnsName;
    }
        
    // performance GRID
    setPerformanceGrid (chartName) {
        if(chartName=='VARIANCE'){
            this.GridData = this.options.performanceVarData;
        }else{
            this.GridData = this.options.performanceVarPerData;
        }
        if(this.options.performanceGrid==undefined){
            this.options.performanceGrid = this.setAgGridObject(this.GridData, chartName);
            this.options.performanceGrid.dataLoaded = true;
        }
        else {
            this.updateGrid(this.options.performanceGrid.gridOptions, this.GridData, chartName);
        }
        //console.log(this.options.performanceGrid);
    }
             
    setPerformanceChart (chartName) {
    	//manage category axis and series default axis label font size for maximise and minimise
        //var maxMin = $(this.options.pageName).attr("maxmin");
        // var maxMin = "min";
        if (this.options.isMax) {
            this.labelsFont = "16px Arial,Helvetica,sans-serif";
            this.leftLabelsFont = "16px Arial,Helvetica,sans-serif";
        }
        else {
            this.labelsFont = "8px Arial,Helvetica,sans-serif";
            this.leftLabelsFont = "12px Arial,Helvetica,sans-serif";
        }

        var signicon = (chartName == 'VARIANCE') ? '' : '%';

        
        var selectedMeasure = this._helperService.where(GLOBALS.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        this.options.measureLabel = selectedMeasure[0]['measureName'];
        var measureDataDecimalPlaces = selectedMeasure[0]['dataDecimalPlaces'];
        
        var leftText = this.options.measureLabel + " Variance " + signicon;

        if(chartName=='VARIANCE'){
            this.ChartData = this.options.performanceVarData;
        }else{
            this.ChartData = this.options.performanceVarPerData;
        }

        //For Tooltip
        this.unit = " VALUE ";
        this.chartName = chartName;
        this.signicon = signicon;
        //End

        this.performanceChart = {
            series: [
                {field: 'data'}
            ],
            seriesDefaults: {
                type: 'column',
                style: 'smooth',
                labels: {
                    visible: true,
                    position: "top",
                    padding: {
                        top: -20,
                    },
                    //rotation: rotation,
                    background: "transparent",
                    template: function(e) {
                        //var valueItem = (chartName == 'VARIANCE') ? ((e.dataItem.data > 1000000 || e.dataItem.data < -1000000) ? nFormatter(e.dataItem.data) : kendo.format("{0:n"+measureDataDecimalPlaces+"}", Number(e.dataItem.data))) : nFormatter(e.dataItem.data, 1);
                        //var valueItem = (chartName == 'VARIANCE') ? ((e.dataItem.data > 1000000 || e.dataItem.data < -1000000) ? this.nFormatter(e.dataItem.data, 2) : formatNumber(Number(e.dataItem.data), "n2")) : this.nFormatter(e.dataItem.data, 1);
                        var valueItem = (chartName == 'VARIANCE') ? ((e.dataItem.data > 1000000 || e.dataItem.data < -1000000) ? GLOBALS.nFormatter(e.dataItem.data, "n"+measureDataDecimalPlaces+"") : formatNumber(Number(e.dataItem.data), "n"+measureDataDecimalPlaces+"")) : formatNumber(e.dataItem.data, "n1");
                        return valueItem;
                        //return ((e.dataItem.SALES > 1000000) ? this.nFormatter(e.dataItem.data) : formatNumber(e.dataItem.data, "n1"));
                    }
                }
            },
            valueAxis: [{
                title: {
                    text: leftText,
                    font: this.leftLabelsFont,
                    position: "center"
                },
                labels: {
                    template: function(e) {
                        return formatNumber(e.value, "n0")
                    }
                 }
            }],
            categoryAxis: {
                field: "ACCOUNT",
                labels: {
                        rotation: -90,
                        font: this.labelsFont,
                        template: (e) => {
                            return GLOBALS.getWordWrap(e.value, this.ChartData);
                        }
                }
            },
            legend: {
                visible: false,
                position: "right",
                labels: {
                    font: this.labelsFont
                }
            },
            tooltip: {
                visible: true
            }
        };
    }

    fnSetPerformanceGrid (tabType) {
        this.options.ContextOptions.isGrid = true;
        if (this.options.ContextOptions.activeTab == 'one') {
            this.options.ContextOptions.firstTabEvent = 'grid';
            this.setPerformanceGrid('VAR_PERCENT');
        }
        else if (this.options.ContextOptions.activeTab == 'two') {
            this.options.ContextOptions.secondTabEvent = 'grid';
            this.setPerformanceGrid('VARIANCE');
        }
    }
    // brand variance percent performance CHART 
    fnSetPerformanceChart(tabType) {
        this.options.ContextOptions.isGrid = false;
        if (tabType == 'VAR_PERCENT') {
            this.options.ContextOptions.firstTabEvent = 'chart';
            this.setPerformanceChart('VAR_PERCENT');
        }
        else if (tabType == 'VARIANCE') {
            this.options.ContextOptions.secondTabEvent = 'chart';
            this.setPerformanceChart('VARIANCE');
        }

    }

    // changing the chart of brand performance pod with tab click
    performanceTabClickEvent (tabType, activeTab) {
        this.options.ContextOptions.activeTab = activeTab;
        if (tabType == 'VAR_PERCENT' && this.options.ContextOptions.firstTabEvent == 'chart') {
            this.fnSetPerformanceChart(tabType);
        }
        else if (tabType == 'VAR_PERCENT' && this.options.ContextOptions.firstTabEvent == 'grid') {
            this.fnSetPerformanceGrid(tabType);
        }
        else if (tabType == 'VARIANCE' && this.options.ContextOptions.secondTabEvent == 'chart') {
            this.fnSetPerformanceChart(tabType);
        }
        else if (tabType == 'VARIANCE' && this.options.ContextOptions.secondTabEvent == 'grid') {
            this.fnSetPerformanceGrid(tabType);
        }
    }
    
    /**
     * method: renderChart
     * actin: set chart data and calling to render chart
     * @param {json array} data
     * @returns {void}
     */
    renderChart() {
        if (this.options.ContextOptions.firstTabEvent == 'grid' && this.options.ContextOptions.activeTab == 'one') {
            this.setPerformanceGrid('VAR_PERCENT');
        } else if (this.options.ContextOptions.firstTabEvent == 'chart' && this.options.ContextOptions.activeTab == 'one') {
            this.setPerformanceChart('VAR_PERCENT');
        } else if (this.options.ContextOptions.secondTabEvent == 'grid' && this.options.ContextOptions.activeTab == 'two') {
            this.setPerformanceGrid('VARIANCE');
        } else if (this.options.ContextOptions.secondTabEvent == 'chart' && this.options.ContextOptions.activeTab == 'two') {
          this.setPerformanceChart('VARIANCE');
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
            this.options.AllPerformanceData = (this.options.AllPerformanceData != undefined) ? this.options.AllPerformanceData : this.options.data;
            this.options.data = this.dataFormating(this.options.AllPerformanceData);
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
}