import { Input, Component, OnInit } from '@angular/core';
import { HelperService } from '../../../../../services/helper.service';
import { GLOBALS } from '../../../../../globals/globals';
import { formatNumber } from '@progress/kendo-angular-intl';
import { Surface, Path, Text, Group, Layout, LinearGradient, GradientOptions, ShapeOptions } from '@progress/kendo-drawing';
import { Arc as DrawingArc, GradientStop } from '@progress/kendo-drawing';
import { Arc, Rect, ArcOptions } from '@progress/kendo-drawing/geometry';
import * as $ from 'jquery';

@Component({
	selector: 'performance-grid',
	templateUrl: './performance-grid.component.html',
	styleUrls: ['./performance-grid.component.scss']
})
export class PerformanceGridComponent implements OnInit {

	@Input() options;

	randomData:any;
	rowHeightArray:any;
	whiteSpaceProperty:any;
	showGridID:any;
	showGridContainer:any;
	optionGridName:any;
	skuSingleData:any;
	callback:any;
	splitContainerHeight:any;
	splitterHeight:any;
    gridDivHeight:any;
    showHideGridIDCalled:any;
    customGridsFooter:any;
    isShowLyData:any;
    gridOptions:any;
    isShowTyData:any;
    firstSplitContainer:any;
    secondSplitContainer:any;

	constructor(private _helperService: HelperService) { }

	ngOnInit() {
        
		this.randomData = this._helperService.getRandomData(); // getting random data from commonFunctions.js
        // initial class name for individual bottom grid
        this.options.storeGridClass = "storeGrid_" + this.randomData;
        this.options.groupGridClass = "groupGrid_" + this.randomData;
        this.options.categoryGridClass = "categoryGrid_" + this.randomData;
        this.options.brandGridClass = "brandGrid_" + this.randomData;
        this.options.skuGridClass = "skuGrid_" + this.randomData;
        this.options.loadedGrid = (this.options.loadedGrid != undefined) ? this.options.loadedGrid : "ALL";

        this.rowHeightArray = {};
        this.rowHeightArray[this.options.storeGridClass] = [];
        this.rowHeightArray[this.options.groupGridClass] = [];
        this.rowHeightArray[this.options.categoryGridClass] = [];
        this.rowHeightArray[this.options.brandGridClass] = [];
        this.rowHeightArray[this.options.skuGridClass] = [];
        

        //initial grid text warp property
        this.whiteSpaceProperty = {};
        this.whiteSpaceProperty[this.options.storeGridClass] = "normal"; // initial 'nowrap' for empty
        this.whiteSpaceProperty[this.options.groupGridClass] = "normal"; // initial 'nowrap' for empty
        this.whiteSpaceProperty[this.options.categoryGridClass] = "normal"; // initial 'nowrap' for empty
        this.whiteSpaceProperty[this.options.brandGridClass] = "normal"; // initial 'nowrap' for empty
        this.whiteSpaceProperty[this.options.skuGridClass] = "normal"; // initial 'nowrap' for empty
        
        // initialize context options of STORE grid
        this.options.storeGridContextOptions = {
            container: '.' + this.options.storeGridClass,
            isGrid: true,
            onlyExport: true,
            isTextWrap: true,
            wrapText: 'Remove Wrap', // default text
            refresh: true,
            showIDData: false,
            idName :'',
            csvData: '',
        };
        // initialize context options of GROUP grid
        this.options.groupGridContextOptions = {
            container: '.' + this.options.groupGridClass,
            isGrid: true,
            onlyExport: true,
            isTextWrap: true,
            wrapText: 'Remove Wrap', // default text
            refresh: true,
            showIDData: false,
            idName :'',
            csvData: '',
        };
        // initialize context options of CATEGORY grid
        this.options.categoryGridContextOptions = {
            container: '.' + this.options.categoryGridClass,
            isGrid: true,
            onlyExport: true,
            isTextWrap: true,
            wrapText: 'Remove Wrap', // default text
            refresh: true,
            showIDData: false,
            idName :'',
            csvData: '',
        };
        // initialize context options of BRAND grid
        this.options.brandGridContextOptions = {
            container: '.' + this.options.brandGridClass,
            isGrid: true,
            onlyExport: true,
            isTextWrap: true,
            wrapText: 'Remove Wrap', // default text
            refresh: true,
            showIDData: false,
            idName :'',
            csvData: '',
        };
        // initialize context options of SKU grid
        this.options.skuGridContextOptions = {
            container: '.' + this.options.skuGridClass,
            isGrid: true,
            onlyExport: true,
            isTextWrap: true,
            wrapText: 'Remove Wrap', // default text
            refresh: true,
            showIDData: false,
            idName :'',
            csvData: '',
        };

        this.showGridID = [];
        this.showGridID['brandGrid']      = true;
        this.showGridID['skuGrid']        = true;
        this.showGridID['categoryGrid']   = true;
        this.showGridID['groupGrid']      = true;
        this.showGridID['storeGrid']      = true;

        this.showGridContainer = [];
        this.showGridContainer['BRAND']      = 'brandGrid';
        this.showGridContainer['SKU']        = 'skuGrid';
        this.showGridContainer['CATEGORY']   = 'categoryGrid';
        this.showGridContainer['GROUP']      = 'groupGrid';
        this.showGridContainer['STORE']      = 'storeGrid';

        this.optionGridName = [];
        this.optionGridName['brandGrid']      = 'gridBrand';
        this.optionGridName['skuGrid']        = 'gridSKU';
        this.optionGridName['categoryGrid']   = 'gridCategory';
        this.optionGridName['groupGrid']      = 'gridGroup';
        this.optionGridName['storeGrid']      = 'gridStore';

        // initial all of the grids name are empty
	    this.options.storeName = "";
	    this.options.groupName = "";
	    this.options.categoryName = "";
	    this.options.brandName = "";
	    this.options.skuName = "";

	    this.options.footerstoreName = ""
	    this.options.footergroupName = "";
	    this.options.footercategoryName = "";
	    this.options.footerbrandName = "";
	    this.options.footerskuName = "";


        setTimeout(()=>{
            this.setBottomGridHeight();
        });
    
        // To getting height of bottom grids
        setTimeout(()=>{
            this.splitContainerHeight = $(this.options.pageName + " " + this.options.splitContainer).height();
            this.splitterHeight = $(this.options.pageName + " " + this.options.splitter).height();
            this.gridDivHeight = GLOBALS.heightGrid==undefined?this.splitContainerHeight - this.splitterHeight - 10:GLOBALS.heightGrid;
            GLOBALS.heightGrid = this.gridDivHeight;
        });

        if ($(this.options.pageName).children().length > 0) {
            this.firstSplitContainer = $(this.options.pageName).children()[1].id;
            this.secondSplitContainer = $(this.options.pageName).children().children().children().attr('id');
            $(this.options.pageName + " #" + this.firstSplitContainer).on('resize', function(event) {
                this.getAllGridWithResize();
            });
        }
	}

    ngDoCheck() {
        if(this.options.dataLoaded == true) {
            this.isShowLyData = (this.options.isShowLyData != undefined) ? this.options.isShowLyData : ((GLOBALS.isShowLyData != undefined ) ? GLOBALS.isShowLyData : true);
            this.isShowTyData = (this.options.isShowTyData != undefined) ? this.options.isShowTyData : ((GLOBALS.isShowTyData != undefined ) ? GLOBALS.isShowTyData : true);
            this.callToDataRender();
            this.setGridFirstHeader();
        }
    }

	/**
     * activePageItem event to getting which controller are actived 
     * getting a callback method to return that method after grid refresh or click on grid row
     */
    /*this.$on('activePageItem', function(events, agrs) {
        this.callback = agrs.callBack;
    });*/
    
    /**
     * method: getSingleSkuFromTotal 
     * action: set skuSingleData array for chart from last (sku) grid
     * @param {string} arrayIndex
     * @returns {void}
     */
    getSingleSkuFromTotal(arrayIndex) {
        var i;
        this.skuSingleData = new Array();
        for (i = 0; i < this.options.skuGridData.length; i++) {
            var index = (this.options.skuGridData[i].ID==undefined)?'ACCOUNT':'ID';
            if (this.options.skuGridData[i][index] == arrayIndex) {
                this.skuSingleData.push(this.options.skuGridData[i]);
            }
            
        }
    }
    
    
    
    /**
     * method: clickRowGridDataChange
     * action: to get grid and chart data from server after clicking on row of bottom grid
     * and calling to callback method
     * and set requestType and changeGrid flag
     * @param {string} accountName
     * @param {string} changeGrid
     * @returns {void}
     */
    clickRowGridDataChange(accountName, changeGrid) {
        if (typeof accountName.replace == 'function')
            accountName = accountName.replace("&","AND_SIGN");
        
        // accountName = encodeURIComponent(accountName);
        GLOBALS.requestType = "rowclick";
        GLOBALS.changeGrid = changeGrid;
        if (GLOBALS.changeGrid == "changeStore") {
            this.options.storeName = accountName;
            this.options.groupName = "";
            this.options.categoryName = "";
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 4;
        }
        if (GLOBALS.changeGrid == "changeGroup") {
            this.options.groupName = accountName;
            this.options.categoryName = "";
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 3;
        }
        if (GLOBALS.changeGrid == "changeCategory") {
            this.options.categoryName = accountName;
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 2;
        }
        if (GLOBALS.changeGrid == "changeBrand") {
            this.options.brandName = accountName;
            this.options.skuName = "";
            this.options.gridCount = 1;
        }
        if (GLOBALS.changeGrid == "changeSku") {
            this.options.skuName = accountName;
            GLOBALS.singleSkuName = accountName;
            this.getSingleSkuFromTotal(accountName);
            this.options.gridCount = 0;
        }

        var obj = {
            customParams: "gridCount=" + this.options.gridCount + "&STORE=" + this.options.storeName + "&GROUP=" + this.options.groupName + "&CATEGORY=" + this.options.categoryName + "&BRAND=" + this.options.brandName + "&SKU=" + this.options.skuName + "&FOOTERSTORE=" + this.options.footerstoreName + "&FOOTERGROUP=" + this.options.footergroupName + "&FOOTERCATEGORY=" + this.options.footercategoryName + "&FOOTERBRAND=" + this.options.footerbrandName + "&FOOTERSKU=" + this.options.footerskuName
        }

        if (typeof this.callback != 'function')
            this.callback = GLOBALS.callbackObjPerformance[this.options.servicePageName].callBack;
                          
        this.callback(obj);
    }

    breadcrumSet(rowDataItem, changeGrid) {
        GLOBALS.changeGrid = changeGrid;
        var accountNameFooter = (rowDataItem != undefined && rowDataItem.ACCOUNT != undefined) ? rowDataItem.ACCOUNT : "";
        if (accountNameFooter != undefined && accountNameFooter != null && accountNameFooter != '') {
            accountNameFooter = accountNameFooter.toString();
            accountNameFooter = accountNameFooter.replace("&","AND_SIGN");
        }
        if (GLOBALS.changeGrid == "changeStore" || GLOBALS.changeGrid == "showAllStore") {
            this.options.footerstoreName = accountNameFooter;
            this.options.footergroupName = "";
            this.options.footercategoryName = "";
            this.options.footerbrandName = "";
            this.options.footerskuName = "";
        }
        if (GLOBALS.changeGrid == "changeGroup" || GLOBALS.changeGrid == "showAllGroup") {
            this.options.footergroupName = accountNameFooter;
            this.options.footercategoryName = "";
            this.options.footerbrandName = "";
            this.options.footerskuName = "";
        }
        if (GLOBALS.changeGrid == "changeCategory" || GLOBALS.changeGrid == "showAllCategory") {
            this.options.footercategoryName = accountNameFooter;
            this.options.footerbrandName = "";
            this.options.footerskuName = "";
        }
        if (GLOBALS.changeGrid == "changeBrand" || GLOBALS.changeGrid == "showAllBrand") {
            this.options.footerbrandName = accountNameFooter;
            this.options.footerskuName = "";
        }
        if (GLOBALS.changeGrid == "changeSku" || GLOBALS.changeGrid == "showAllSku") {
            this.options.footerskuName = accountNameFooter;
        }
    }

    /**
     * method: setGridData
     * action: set grid options
     * @param {json array} data
     * @returns {object} gridOptions
     */
    setAgGridObject(data, gridName, firstColumn) {
    	var gridClass;
        if (gridName == "STORE") {
            gridClass = this.options.storeGridClass;
            var changeGrid = 'changeStore';
        }
        else if (gridName == "GROUP") {
            gridClass = this.options.groupGridClass;
            var changeGrid = 'changeGroup';
        }
        else if (gridName == "CATEGORY") {
            gridClass = this.options.categoryGridClass;
            var changeGrid = 'changeCategory';
        }
        else if (gridName == "BRAND") {
            gridClass = this.options.brandGridClass;
            var changeGrid = 'changeBrand';
        }
        else if (gridName == "SKU") {
            gridClass = this.options.skuGridClass;
            var changeGrid = 'changeSku';
        }else{
            gridClass = "";
            var changeGrid = '';
        }
        this.rowHeightArray[gridClass] = [];
        
        var options = {
            gridClass: gridClass,
            whiteSpaceProperty: this.whiteSpaceProperty,
            textWrap: {field:'ACCOUNT', currentRowHeight:this.rowHeightArray},
            //callbackFooterRow: this.createFooterRow,
            callbackFooterRow: (params) => {
                return this.createFooterRow(params);
            },
            contextMenuItems: ['EXPORT_CSV_EXCEL_BOTH', 'TEXT_WRAP'],
            callbackContextMenu: (params) => {
                return this.getContextMenuItems(params, gridName, gridClass, firstColumn);
            },
            callbackOnRowClick: (dataItem) => {
                this.breadcrumSet(dataItem, changeGrid);
                this.clickRowGridDataChange(dataItem.ID==undefined ? dataItem.ACCOUNT : dataItem.ID, changeGrid);
            },
            callbackOnRowDataChanged : (params) => {
                this.afterGridDataChanged(params, gridName, gridClass); 
            }
        };

        return {columns:this.getAgGridColumns(gridName, firstColumn), data:data, options:options};
    }
    
    /**
     * method: renderGridRowClickData
     * action: rendering the grid data according to changeGrid flag
     * @returns {void}
     */
    renderGridRowClickData() {
        if (GLOBALS.changeGrid == "changeStore") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridGroup' || this.options.loadedGrid == 'ALL')
					this.options.groupGrid = this.setGridData(this.options.groupGridData, "GROUP", this.options.gridGroupFirstColumn);
            /* }).then(function() { */
				if (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')
					this.options.categoryGrid = this.setGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.changeGrid == "changeGroup") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')
					this.options.categoryGrid = this.setGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
            /* }).then(function() { */
				if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.changeGrid == "changeCategory") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
                    this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
                    this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.changeGrid == "changeBrand") {
			if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL'){
                this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
                
                
            }
        }
        else if (GLOBALS.changeGrid == "changeSku") {
        }
    }
    
    /**
     * method: clickReloadAll
     * action: to get grid and chart data from server after clicking on refresh button of bottom grid
     * and calling to callback method
     * and set requestType and showAllGridName flag
     * @param {string} showAllGridName
     * @returns {void}
     */
    clickReloadAll(gridName) {
        GLOBALS.requestType = "reload";
        
        if (gridName == "STORE") {
            var showAllGridName = 'showAllStore';
        }
        else if (gridName == "GROUP") {
            var showAllGridName = 'showAllGroup';
        }
        else if (gridName == "CATEGORY") {
            var showAllGridName = 'showAllCategory';
        }
        else if (gridName == "BRAND") {
            var showAllGridName = 'showAllBrand';
        }
        else if (gridName == "SKU") {
            var showAllGridName = 'showAllSku';
        }else{
            var showAllGridName = '';
        }

        GLOBALS.showAllGridName = showAllGridName;
        this.breadcrumSet("", showAllGridName);

        if (GLOBALS.showAllGridName == "showAllStore") {
            this.options.storeName = "";
            this.options.groupName = "";
            this.options.categoryName = "";
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 5;
        }
        if (GLOBALS.showAllGridName == "showAllGroup") {
            this.options.groupName = "";
            this.options.categoryName = "";
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 4;
        }
        if (GLOBALS.showAllGridName == "showAllCategory") {
            this.options.categoryName = "";
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 3;
        }
        if (GLOBALS.showAllGridName == "showAllBrand") {
            this.options.brandName = "";
            this.options.skuName = "";
            this.options.gridCount = 2;
        }
        if (GLOBALS.showAllGridName == "showAllSku") {
            this.options.skuName = "";
            this.options.gridCount = 1;
        }

        var obj = {
            customParams: "gridCount=" + this.options.gridCount + "&STORE=" + this.options.storeName + "&GROUP=" + this.options.groupName + "&CATEGORY=" + this.options.categoryName + "&BRAND=" + this.options.brandName + "&SKU=" + this.options.skuName + "&FOOTERSTORE=" + this.options.footerstoreName + "&FOOTERGROUP=" + this.options.footergroupName + "&FOOTERCATEGORY=" + this.options.footercategoryName + "&FOOTERBRAND=" + this.options.footerbrandName + "&FOOTERSKU=" + this.options.footerskuName
        }

        //console.log(obj);

        if (typeof this.callback != 'function')
            this.callback = GLOBALS.callbackObjPerformance[this.options.servicePageName].callBack;

        this.callback(obj);
    }
    
    /**
     * method: renderReloadData
     * action: rendering the grid data according to showAllGridName flag
     * @returns {void}
     */
    renderReloadData() {
        if (GLOBALS.showAllGridName == "showAllStore") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridStore' || this.options.loadedGrid == 'ALL')
					this.options.storeGrid = this.setGridData(this.options.storeGridData, "STORE", this.options.gridStoreFirstColumn);
            /* }).then(function() { */
				if (this.options.loadedGrid == 'gridGroup' || this.options.loadedGrid == 'ALL')
					this.options.groupGrid = this.setGridData(this.options.groupGridData, "GROUP", this.options.gridGroupFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')
					this.options.categoryGrid = this.setGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.showAllGridName == "showAllGroup") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridGroup' || this.options.loadedGrid == 'ALL')
					this.options.groupGrid = this.setGridData(this.options.groupGridData, "GROUP", this.options.gridGroupFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')
					this.options.categoryGrid = this.setGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.showAllGridName == "showAllCategory") {
            /* this.wait().then(function() { */
                if (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')
					this.options.categoryGrid = this.setGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
				if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.showAllGridName == "showAllBrand") {
            /* this.wait().then(function() { */
				if (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')
					this.options.brandGrid = this.setGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
            /* }).then(function() { */
                if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
					this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
            /* }); */
        }
        else if (GLOBALS.showAllGridName == "showAllSku") {
            if (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')
				this.options.skuGrid = this.setGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
        }
    }

    /**
     * method: window.calculateSummaryVarper
     * action: calculating verpercent data
     * @param {array} data
     * @returns {string} VARPER 
     */ 
    /*window.calculateSummaryVarper = function(data) {
        var selectedMeasure = $filter('filter')(this.options.measuresOptiondata,{measureID : this.options.selectedMeasureID }, true );
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;

        var VARPER = 0;
        if (data[LYFIELD].sum > 0) {
            VARPER = ((data[TYFIELD].sum - data[LYFIELD].sum) * 100) / data[LYFIELD].sum;
        }
        return kendo.toString(VARPER, 'n1');
    }*/

    // To getting height of bottom grids
    setBottomGridHeight() {
        this.splitContainerHeight = $(this.options.pageName + " " + this.options.splitContainer).height();
        this.splitterHeight = $(this.options.pageName + " " + this.options.splitter).height();
        this.gridDivHeight = GLOBALS.heightGrid==undefined?this.splitContainerHeight - this.splitterHeight - 10:GLOBALS.heightGrid;
        GLOBALS.heightGrid = this.gridDivHeight;
    }
    /*$timeout(function() {
        this.setBottomGridHeight();
    });*/
    
    // To getting height of bottom grids
    /*$timeout(function() {
        this.splitContainerHeight = $(this.options.pageName + " " + this.options.splitContainer).height();
        this.splitterHeight = $(this.options.pageName + " " + this.options.splitter).height();
        this.gridDivHeight = GLOBALS.heightGrid==undefined?this.splitContainerHeight - this.splitterHeight - 10:GLOBALS.heightGrid;
        GLOBALS.heightGrid = this.gridDivHeight;
    });*/

    /*if ($(this.options.pageName).children().length > 0) {
        this.firstSplitContainer = $(this.options.pageName).children()[1].id;
        this.secondSplitContainer = $(this.options.pageName).children().children().children().attr('id');
        $(this.options.pageName + " #" + this.firstSplitContainer).on('resize', function(event) {
            this.getAllGridWithResize();
        });
    }*/

    getAllGridWithResize() {
        this.refreshGrid('#brandGrid');
        this.refreshGrid('#skuGrid');
        this.refreshGrid('#categoryGrid');
        this.refreshGrid('#groupGrid');
        this.refreshGrid('#storeGrid');
    }

    refreshGrid(container) {
        var gridOptions = $(this.options.pageName + " "+container).data("kendoGrid");
        if (gridOptions != undefined) {
            gridOptions.refresh();
        }
    }

    showHideGridID(container) {
        this.showHideGridIDCalled = true;
        this.options.showPodLoader[this.optionGridName[container]].showInnerLoader = true;

        this.showGridID[container] = !this.showGridID[container];
        this.options[container].columns[0].hidden = this.showGridID[container];
    }


    getAgGridColumns(gridName, firstColumn) {
    	var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
        //console.log(dataDecimalPlaces);

        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;

        var vsTextLyear = GLOBALS.vsLabel == "Last Period" ? "LAST YEAR" : "PREVIOUS PERIOD";
        var vsTextTyear = GLOBALS.vsLabel == "Last Period" ? "THIS YEAR" : "THIS PERIOD";

        // configuring default columns
        var columnsName = [];

        if(firstColumn.ID != undefined && firstColumn.ID != ""){
            columnsName.push({
                field: "ID",
                headerName: firstColumn.ID,
                // width:15,
                columnTypes: "string",
                headerClass: ["text-left"],
                cellClass: ["text-left"],
                hide : this.showGridID[this.showGridContainer[gridName]]
            });
        }

        this.customGridsFooter = {};
        if(this.options.customGrids != undefined){

			Object.keys(this.options.customGrids[gridName]).forEach(function(key) {
				var obj = this.options.customGrids[gridName][key];
				this.customGridsFooter[obj.field] = obj.footerTemplate;
                columnsName.push(obj);
			});
        }else{
            columnsName.push({
                field: "ACCOUNT",
                headerName: firstColumn.NAME,
                columnTypes: "string",
                headerClass: ["text-left"],
                cellClass: ["text-left"],
                suppressMenu: true
            },
            {
                field: LYFIELD,
                headerName: vsTextLyear,
                columnTypes: "number",
                cellClass: ["text-left"],
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); },
                hide: !this.isShowLyData,
                suppressMenu: true
            }, {
                field: TYFIELD,
                headerName: vsTextTyear,
                columnTypes: "number",
                cellClass: ["text-left"],
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); },
                hide: !GLOBALS.isShowTyData,
                suppressMenu: true
            }, {
                field: "VAR",
                headerName: "VAR",
                columnTypes: "number",
                cellClass: ["text-left"],
                valueFormatter: function(params) { return formatNumber(params.value, 'n'+dataDecimalPlaces); },
                hide: !(this.isShowLyData && this.isShowTyData),
                suppressMenu: true
            }, {
                field: "VARPER",
                headerName: "VAR%",
                columnTypes: "number",
                cellClass: ["text-left"],
                valueFormatter: function(params) { return formatNumber(params.value, 1); },
                hide: !(this.isShowLyData && this.isShowTyData),
                suppressMenu: true
            });
        }

        return columnsName;
    }

    
    textWrappLogic(textWrapped, gridClass, gridOptions, params) {
        var clsAttr = "." + gridClass + " .ag-body-container div.ag-cell";

        if (textWrapped) {
            $(clsAttr).addClass('ag-cell-txt-wrap');
            $(clsAttr).removeClass('ag-cell-no-txt-wrap');
            var clsAttrRow = "." + gridClass + " .ag-body-container div.ag-row";
            $(clsAttrRow).removeClass('ag-row-no-animation');
            $( clsAttrRow ).each(function( i ) {
                var rowObj = $(this);
                var rowID = $(this).attr('row-id');
                var clsAttrCell = "." + gridClass + " .ag-body-container div.ag-row[row-id='"+rowID+"'] > div[col-id='ACCOUNT']";
                var cellObj = $(clsAttrCell);
                var cellScrollHeight = cellObj[0].scrollHeight+3;
                
                if (this.rowHeightArray[gridClass][cellObj[0].innerText] == undefined)
                    this.rowHeightArray[gridClass][cellObj[0].innerText] = cellScrollHeight;
                else
                    cellScrollHeight = this.rowHeightArray[gridClass][cellObj[0].innerText];

                var rowNode = params.api.getRowNode(rowID);
                rowNode.setRowHeight(cellScrollHeight);
            });
        } else {
            $(clsAttr).addClass('ag-cell-no-txt-wrap');
            $(clsAttr).removeClass('ag-cell-txt-wrap');
            params.api.resetRowHeights();
        }

        params.api.onRowHeightChanged();
    }

    getContextMenuItems(params, gridName, gridClass, firstColumn) {
        var result = [{
            name: 'Reset/Send To Chart',
            action: () => {
                this.clickReloadAll(gridName);
            }
        }];

        if(firstColumn.ID != undefined && firstColumn.ID != ""){
            result.push({
                name: 'Show/Hide '+firstColumn.ID,
                action: () => {
                    params.columnApi.setColumnVisible("ID", this.showGridID[this.showGridContainer[gridName]]);
            		this.showGridID[this.showGridContainer[gridName]] = !this.showGridID[this.showGridContainer[gridName]];

				    var clsAttr = "." + gridClass + " .ag-body-container div.ag-cell";
                    if ( $(clsAttr).hasClass('ag-cell-no-txt-wrap') ) {
                        var allColumnIds = [];
                        params.columnApi.getAllColumns().forEach(function(column) {
					        allColumnIds.push(column.colId);
					    });
					    params.columnApi.autoSizeColumns(allColumnIds);
                    } else {
                        params.api.sizeColumnsToFit();
                    }
                }
            });
        }

        return result;
    }

    createFooterRow(data) {
		var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;

        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;

        var result = [];
        var dataRow = {
            ACCOUNT:'Total',
            [LYFIELD]:this.sum(data, LYFIELD),
            [TYFIELD]:this.sum(data, TYFIELD),
            ['VAR']:this.setVar(data, [TYFIELD], [LYFIELD]),
            ['VARPER']:this.setVarPer(data, [TYFIELD], [LYFIELD])
        };
        //console.log(dataRow);
        $.extend(dataRow, this.customGridsFooter); // marge if exists custom grids
        result.push(dataRow);
        return result;
    }

    sum(data, prop) {
        var total = 0
        for ( var i = 0, _len = data.length; i < _len; i++ ) {
            total += data[i][prop];
        }
        return total;
    }

    setVar(data, TYFIELD, LYFIELD) {
        var totalty = this.sum(data, TYFIELD);
        var totally = this.sum(data, LYFIELD);
        var res = totalty - totally;
        return res;
    }

    setVarPer(data, TYFIELD, LYFIELD) {
        var totalty = this.sum(data, TYFIELD);
        var totally = this.sum(data, LYFIELD);
        var res = ((totalty - totally) * 100) / totally;
        return res;
    }

    /**
     * method: setGridData
     * action: set grid options
     * @param {json array} data
     * @param {string gridName
     * @param {string} firstColumn
     * @returns {object} gridOptions
     */
    setGridData(data, gridName, firstColumn) {

        this.setBottomGridHeight();
        var gridClass;
        if (gridName == "STORE") {
            gridClass = this.options.storeGridClass;
        }
        else if (gridName == "GROUP") {
            gridClass = this.options.groupGridClass;
        }
        else if (gridName == "CATEGORY") {
            gridClass = this.options.categoryGridClass;
        }
        else if (gridName == "BRAND") {
            gridClass = this.options.brandGridClass;
        }
        else if (gridName == "SKU") {
            gridClass = this.options.skuGridClass;
        }else{
            gridClass = "";
        }

        var clsAttr = "." + gridClass + " .k-grid-content td";
        this.whiteSpaceProperty[gridClass] = (this.whiteSpaceProperty[gridClass]=="") ? "nowrap" : $(clsAttr).css("white-space")==undefined?this.whiteSpaceProperty[gridClass]:$(clsAttr).css("white-space");

        var vsTextLyear = GLOBALS.vsLabel == "Last Period" ? "LAST YEAR" : "PREVIOUS PERIOD";
        var vsTextTyear = GLOBALS.vsLabel == "Last Period" ? "THIS YEAR" : "THIS PERIOD";
        // when need to add custom grid

        var selectedMeasure = this._helperService.where(this.options.measuresOptiondata,{measureID:this.options.selectedMeasureID});
        var dataDecimalPlaces = selectedMeasure[0].dataDecimalPlaces;
        //console.log(dataDecimalPlaces);

        var TYFIELD = "TY" + selectedMeasure[0].jsonKey;
        var LYFIELD = "LY" + selectedMeasure[0].jsonKey;

        // configuring default columns
        var columnsName = [];

        if(firstColumn.ID != undefined && firstColumn.ID != ""){
            columnsName.push({
                field: "ID",
                title: firstColumn.ID,
                width:"15%",
                type: "string",
                headerAttributes: {"class": "text-left"},
                attributes: {"class": "text-left"},
                hidden : this.showGridID[this.showGridContainer[gridName]]
            });
        }

        if(this.options.customGrids != undefined){

            var fieldsType = {};
            Object.keys(this.options.customGrids[gridName]).forEach(function(key) {            
            	var obj = this.options.customGrids[gridName][key];
                fieldsType[obj.field] = {type:obj.type};
                columnsName.push(obj);
            });
        }else{
        	var fieldsType = {};

                columnsName.push({
                    field: "ACCOUNT",
                    title: firstColumn.NAME,
                    type: "string",
                    headerAttributes: {"class": "text-left"},
                    attributes: {"class": "text-left"},
                    footerTemplate: '<div style="text-align: left">Total</div>'
                },
                {
                    // field: "LYVALUE",
                    field: LYFIELD,
                    title: vsTextLyear,
                    type: "number",
                    footerTemplate: '#= kendo.toString(sum, "n'+dataDecimalPlaces+'") #',
					attributes: {"class": "text-left"},
                    format: "{0:n"+dataDecimalPlaces+"}",
                    hidden: !this.isShowLyData
                }, {
                    // field: "TYVALUE",
                    field: TYFIELD,
                    title: vsTextTyear,
                    type: "number",
					attributes: {"class": "text-left"},
                    footerTemplate: '#= kendo.toString(sum, "n'+dataDecimalPlaces+'") #',
                    format: "{0:n"+dataDecimalPlaces+"}",
                    hidden: !this.isShowTyData
                }, {
                    field: "VAR",
                    title: "VAR",
                    type: "number",
                    width: "15%",
					attributes: {"class": "text-left"},
                    footerTemplate: '#= kendo.toString(sum, "n'+dataDecimalPlaces+'") #',
                    format: "{0:n"+dataDecimalPlaces+"}",
                    hidden: !(this.isShowLyData && this.isShowTyData)
                }, {
                    field: "VARPER",
                    title: "VAR%",
                    type: "number",
                    width: "15%",
					attributes: {"class": "text-left"},
                    // footerTemplate: "<div>#= window.calculateSummaryVarper(data) #</div>",
                    format: "{0:n1}",
                    hidden: !(this.isShowLyData && this.isShowTyData)
                });
            // configuring default fields type
            fieldsType = {
                ACCOUNT: {type: "string"},
                ID: {type: "string"},
                // TYVALUE: {type: "number"},
                // LYVALUE: {type: "number"},
                VAR: {type: "number"},
                VARPER: {type: "number"}
            };
        }
        
        this.gridOptions = {
            resizable: true,
            selectable: "row",
            dataSource: {
                schema: {
                    model: {
                        fields: fieldsType
                    }
                },
                type: "json",
                transport: {
                    read: function(options) {
                        options.success(data);
                        if (gridName == "STORE") {
                            this.options.storeGridContextOptions.csvData = this.getCsvData(columnsName, data);
                            if(firstColumn.ID != undefined && firstColumn.ID != ""){
                                this.options.storeGridContextOptions.showIDData = true;
                                this.options.storeGridContextOptions.idName = firstColumn.ID;
                            }
                        }
                        else if (gridName == "GROUP") {
                            this.options.groupGridContextOptions.csvData = this.getCsvData(columnsName, data);
                            if(firstColumn.ID != undefined && firstColumn.ID != ""){
                                this.options.groupGridContextOptions.showIDData = true;
                                this.options.groupGridContextOptions.idName = firstColumn.ID;
                            }
                        }
                        else if (gridName == "CATEGORY") {
                            this.options.categoryGridContextOptions.csvData = this.getCsvData(columnsName, data);
                            if(firstColumn.ID != undefined && firstColumn.ID != ""){
                                this.options.categoryGridContextOptions.showIDData = true;
                                this.options.categoryGridContextOptions.idName = firstColumn.ID;
                            }
                        }
                        else if (gridName == "BRAND") {
                            this.options.brandGridContextOptions.csvData = this.getCsvData(columnsName, data);
                            if(firstColumn.ID != undefined && firstColumn.ID != ""){
                                this.options.brandGridContextOptions.showIDData = true;
                                this.options.brandGridContextOptions.idName = firstColumn.ID;
                            }
                        }
                        else if (gridName == "SKU") {
                            //var skutempCsvData = removeItem(['ID'], data);
                            this.options.skuGridContextOptions.csvData = this.getCsvData(columnsName, data);
                            if(firstColumn.ID != undefined && firstColumn.ID != ""){
                                this.options.skuGridContextOptions.showIDData = true;
                                this.options.skuGridContextOptions.idName = firstColumn.ID;
                            }
                        }
                    }
                },
                parameterMap: function(data) {
                    return JSON.stringify(data);
                },
                //                        pageSize: 50,
                serverPaging: false,
                serverSorting: false,
                serverFiltering: false,
                aggregate: [
                    {field: LYFIELD, aggregate: "sum"},
                    {field: TYFIELD, aggregate: "sum"},
                    {field: "VAR", aggregate: "sum"},
                    {field: "VARPER", aggregate: "sum"},
                ],
            },
            dataBound: function(e) {                        
                $(clsAttr).css({"white-space": this.whiteSpaceProperty[gridClass]});

                if (this.showHideGridIDCalled){
                    this.showHideGridIDCalled = false;
                    this.options.showPodLoader[this.optionGridName[this.showGridContainer[gridName]]].showInnerLoader = false;
                }
            },
            sortable: true,
            filterable: false,
            columns: columnsName,
            height: this.gridDivHeight + "px"
        };

        //console.log(this.gridOptions);
        return this.gridOptions;
    }
    
    /**
     * method: callToDataRender
     * action: calling a method to data render according to request type
     * @returns {void}
     */
    callToDataRender() {
        if (this.options.dataLoaded==true) {
            this.options.dataLoaded=false;
            if (GLOBALS.requestType == "initial") {
                this.renderInitialData();
            }
            else if (GLOBALS.requestType == "rowclick") {
                this.updateGridData();
            }
            else if (GLOBALS.requestType == "reload") {
                this.updateGridData();
            }
        }
    }
    
    setGridFirstHeader() {
        GLOBALS.gridFirstHeader = {
            storeGrid: (this.options.gridStoreFirstColumn != undefined ) ? this.options.gridStoreFirstColumn.NAME : "",
            groupGrid: (this.options.gridGroupFirstColumn != undefined ) ? this.options.gridGroupFirstColumn.NAME : "",
            categoryGrid: (this.options.gridCategoryFirstColumn != undefined ) ? this.options.gridCategoryFirstColumn.NAME : "",
            brandGrid: (this.options.gridBrandFirstColumn != undefined ) ? this.options.gridBrandFirstColumn.NAME : "",
            skuGrid: (this.options.gridSKUFirstColumn != undefined ) ? this.options.gridSKUFirstColumn.NAME : ""
        }
    }

    /*wait() {
        var deferred = $q.defer();
        deferred.resolve('');
        return deferred.promise;
    };*/

    updateGridOptions(gridOption, gridData, gridName, firstColumn, isColumnUpdate, gridClass) {

        this.rowHeightArray[gridClass] = [];

        if (isColumnUpdate == true){
            this.options[gridOption].gridOptions.api.setColumnDefs(this.getAgGridColumns(gridName, firstColumn));
        }
        this.options[gridOption].gridOptions.api.setRowData(gridData);
        this.options[gridOption].gridOptions.api.setPinnedBottomRowData(this.createFooterRow(gridData));
        this.options[gridOption].gridOptions.api.sizeColumnsToFit();
        this.options[gridOption].gridOptions.api.deselectAll();   
    }

    afterGridDataChanged(gridOptions, gridName, gridClass) {
        
        //console.log(gridName);
        //console.log(gridClass);
        setTimeout(()=>{

            var textWrapped = (this.whiteSpaceProperty[gridClass] == 'normal') ? true : false;
            //console.log(textWrapped);
            
            this.textWrappLogic(textWrapped, gridClass, gridOptions, {field:'ACCOUNT', currentRowHeight:this.rowHeightArray});

            if (this.options.selectedRow != undefined && Object.keys(this.options.selectedRow).length > 0 && this.options.selectedRow[gridName] != '') {
                
                gridOptions.api.forEachNode( function(rowNode) {

                    var thisRowData = rowNode.data;
                    if (thisRowData['ID'] != undefined && thisRowData['ID'] == this.options.selectedRow[gridName]){
                        rowNode.setSelected(true, true);
                    } else if (thisRowData['ACCOUNT'] != undefined && thisRowData['ACCOUNT'] == this.options.selectedRow[gridName]){
                        rowNode.setSelected(true, true);
                    }

                });

            }

        }, 100);
    }

    /**
     * method: updateGridData
     * action: rendering all grid data
     * @returns {void}
     */
    updateGridData() {
        if (this.options.storeGridData && (this.options.loadedGrid == 'gridStore' || this.options.loadedGrid == 'ALL')) {
            this.updateGridOptions('storeGrid', this.options.storeGridData, 'STORE', this.options.gridStoreFirstColumn, true, this.options.storeGridClass);
        }

        if (this.options.groupGridData && (this.options.loadedGrid == 'gridGroup' || this.options.loadedGrid == 'ALL')) {
            this.updateGridOptions('groupGrid', this.options.groupGridData, 'GROUP', this.options.gridGroupFirstColumn, true, this.options.groupGridClass);
        }

        if (this.options.categoryGridData && (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')) {
            this.updateGridOptions('categoryGrid', this.options.categoryGridData, 'CATEGORY', this.options.gridCategoryFirstColumn, true, this.options.categoryGridClass);
        }

        if (this.options.brandGridData && (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')) {
            this.updateGridOptions('brandGrid', this.options.brandGridData, 'BRAND', this.options.gridBrandFirstColumn, true, this.options.brandGridClass);
        }

        if (this.options.skuGridData && (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')) {
            this.updateGridOptions('skuGrid', this.options.skuGridData, 'SKU', this.options.gridSKUFirstColumn, true, this.options.skuGridClass);
            // this.options.skuGrid.api.setRowData(this.options.skuGridData);
        }
    }

    /**
     * method: renderInitialData
     * action: rendering all grid data
     * @returns {void}
     */
    renderInitialData() {
        this.options.storeName = "";
        this.options.groupName = "";
        this.options.categoryName = "";
        this.options.brandName = "";
        this.options.skuName = "";

        this.options.footerstoreName = ""
        this.options.footergroupName = "";
        this.options.footercategoryName = "";
        this.options.footerbrandName = "";
        this.options.footerskuName = "";

        this.options.gridGap = 1;
        this.options.gridGapTotalWidth = (this.options.totalGrid - 1) * this.options.gridGap;
        this.options.singleGridWidth = (100 - this.options.gridGapTotalWidth) / this.options.totalGrid;

        this.options.gridStore = (this.options.gridStore == undefined) ? true : this.options.gridStore;
        this.options.gridGroup = (this.options.gridGroup == undefined) ? true : this.options.gridGroup;
        this.options.gridCategory = (this.options.gridCategory == undefined) ? true : this.options.gridCategory;
        this.options.gridBrand = (this.options.gridBrand == undefined) ? true : this.options.gridBrand;
        this.options.gridSku = (this.options.gridSku == undefined) ? true : this.options.gridSku;
        //console.log(this.options.loadedGrid);
		if (this.options.storeGridData && (this.options.loadedGrid == 'gridStore' || this.options.loadedGrid == 'ALL')) {
			
            if ( this.options.storeGrid == undefined ){
                // this.options.storeGrid = this.setAgGridData(this.options.storeGridData, "STORE", this.options.gridStoreFirstColumn);
                this.options.storeGrid = this.setAgGridObject(this.options.storeGridData, "STORE", this.options.gridStoreFirstColumn);
                this.options.storeGrid.dataLoaded = true;
            }else{
                this.updateGridOptions('storeGrid', this.options.storeGridData, 'STORE', this.options.gridStoreFirstColumn, true, this.options.storeGridClass);
            }
		}

        if (this.options.groupGridData && (this.options.loadedGrid == 'gridGroup' || this.options.loadedGrid == 'ALL')) {
            
            if ( this.options.groupGrid == undefined ){
                // this.options.groupGrid = this.setAgGridData(this.options.groupGridData, "GROUP", this.options.gridGroupFirstColumn);
                this.options.groupGrid = this.setAgGridObject(this.options.groupGridData, "GROUP", this.options.gridGroupFirstColumn);
                this.options.groupGrid.dataLoaded = true;
            }else{
                this.updateGridOptions('groupGrid', this.options.groupGridData, 'GROUP', this.options.gridGroupFirstColumn, true, this.options.groupGridClass);
            }
        }

        if (this.options.categoryGridData && (this.options.loadedGrid == 'gridCategory' || this.options.loadedGrid == 'ALL')) {
            
            if (this.options.categoryGrid == undefined){
                // this.options.categoryGrid = this.setAgGridData(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
                this.options.categoryGrid = this.setAgGridObject(this.options.categoryGridData, "CATEGORY", this.options.gridCategoryFirstColumn);
                //console.log(this.options.categoryGrid);
                this.options.categoryGrid.dataLoaded = true;
                
            }else{
                this.updateGridOptions('categoryGrid', this.options.categoryGridData, 'CATEGORY', this.options.gridCategoryFirstColumn, true, this.options.categoryGridClass);
            }
        }

        if (this.options.brandGridData && (this.options.loadedGrid == 'gridBrand' || this.options.loadedGrid == 'ALL')) {
            
            if ( this.options.brandGrid == undefined ){
                // this.options.brandGrid = this.setAgGridData(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
                this.options.brandGrid = this.setAgGridObject(this.options.brandGridData, "BRAND", this.options.gridBrandFirstColumn);
                this.options.brandGrid.dataLoaded = true;
            }else{
                this.updateGridOptions('brandGrid', this.options.brandGridData, 'BRAND', this.options.gridBrandFirstColumn, true, this.options.brandGridClass);
            }
        }

        if (this.options.skuGridData && (this.options.loadedGrid == 'gridSKU' || this.options.loadedGrid == 'ALL')) {
            
            if ( this.options.skuGrid == undefined ){
                // this.options.skuGrid = this.setAgGridData(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
                this.options.skuGrid = this.setAgGridObject(this.options.skuGridData, "SKU", this.options.gridSKUFirstColumn);
                this.options.skuGrid.dataLoaded = true;
            }else{
                this.updateGridOptions('skuGrid', this.options.skuGridData, 'SKU', this.options.gridSKUFirstColumn, true, this.options.skuGridClass);
            }
        }
        //console.log(this.options.categoryGrid);
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

}
