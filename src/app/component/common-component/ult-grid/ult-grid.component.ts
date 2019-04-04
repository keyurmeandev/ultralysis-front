import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HelperService } from '../../../services/helper.service';
import { AgGridNg2 } from 'ag-grid-angular';
import { GridOptions } from "ag-grid/main";
import * as $ from 'jquery';

@Component({
  selector: 'ult-grid',
  templateUrl: './ult-grid.component.html',
  styleUrls: ['./ult-grid.component.scss']
})
export class UltGridComponent implements OnInit {

	@ViewChild('agGrid') agGrid: AgGridNg2;

	@Input() options;

	showNoOfPage:any;
	morePageNext:any;
	morePagePrev:any;
	pageSize:any;
	totalPages:any;
	pages:any;
	isShowMorePagePrev:any;
	isShowMorePageNext:any;
	gridFirstBuild:boolean;
	public gridOptions: GridOptions;
	public gridOptionsLoaded: boolean;

	constructor(private _helperService: HelperService) {
		this.gridOptionsLoaded = false;
		this.gridOptions = <GridOptions>{};
		this.gridFirstBuild = false;
	}

	ngOnInit() {
		// this.dataLoaded = false;		
	}

	ngDoCheck() {
		if(this.options != undefined && this.options.dataLoaded == true && this.gridOptionsLoaded != undefined && !this.gridOptionsLoaded) {
			this.gridOptionsLoaded = true;
			this.getBaseAgGrid(this.options.columns, this.options.data, this.options.options);
			this.gridFirstBuild = true;
			this.options.gridOptions = this.gridOptions;
			this.gridOptions.api.setColumnDefs(this.gridOptions.columnDefs);
			this.gridOptions.api.setRowData(this.gridOptions.rowData);
			this.gridOptions.api.setPinnedBottomRowData(this.gridOptions.pinnedBottomRowData);

			// this.gridOptions.onGridReady = this.gridConfiguration.onGridReady;
			// console.log(this.gridOptions);
	        // this.agGrid.api.setColumnDefs(this.gridConfiguration.columnDefs);
	        // this.agGrid.api.setRowData(this.gridConfiguration.rowData);
	        // this.agGrid.api.setPinnedBottomRowData(this.gridConfiguration.pinnedBottomRowData);
	        // $.extend(this.agGrid, this.gridConfiguration); // marge gridOptions into options
	        // this.agGrid.api.redrawRows();
			/*console.log(this.gridConfiguration);
			console.log(this.agGrid);*/
	        this.showNoOfPage = 10;
			this.resetPagerConfig();
	  	}
	}
	
	resetPagerConfig() {
		this.morePageNext = 1;
		this.morePagePrev = 1;
	}
	
	/**
	* [textWrappLogic to set/remove grid cell text wrapping]
	* @param  {[boolean]} textWrapped  [by this flag will set/remove text wrapping]
	* @param  {[string]} gridClass     [class name of grid]
	* @param  {[object]} params        [object of grid api]
	* @param  {[object]} textWrapObj   [name of grid field which is contained maximum text and stored hight of grid ]
	* @return {[void]}                 [will set/remove text wrapping]
	*/
	textWrappLogic(textWrapped, gridClass, params, textWrapObj) {
		var clsAttr = "." + gridClass + " .ag-body-container div.ag-cell";
		if (textWrapped) {
			$(clsAttr).addClass('ag-cell-txt-wrap');
			$(clsAttr).removeClass('ag-cell-no-txt-wrap');
			var clsAttrRow = "." + gridClass + " .ag-body-container div.ag-row";
			$(clsAttrRow).removeClass('ag-row-no-animation');
			$( clsAttrRow ).each(function( i ) {
				var rowObj = $(this);
				var rowID = $(this).attr('row-id');

				if(rowID > -1)
				{
					if (textWrapObj.field != undefined && textWrapObj.field != '') {
						if (typeof textWrapObj.field != 'object' && textWrapObj.field != '') {
							var field = textWrapObj.field;
							textWrapObj.field = [field];
						}

						if( textWrapObj.field != undefined && textWrapObj.field.length > 0 ) {
							var gridIndex = '';
							var cellScrollHeight = 0;
							Object.keys(textWrapObj.field).forEach(function(fieldKey) {
								var fieldName = textWrapObj.field[fieldKey];
								var clsAttrCell = "." + gridClass + " .ag-body-container div.ag-row[row-id='"+rowID+"'] > div[col-id='"+fieldName+"']";
								var cellObj = $(clsAttrCell);
								if( cellObj[0]!=undefined && cellObj[0].scrollHeight != undefined ) {
									cellScrollHeight = (cellScrollHeight < cellObj[0].scrollHeight+3) ? cellObj[0].scrollHeight+3 : cellScrollHeight;
									gridIndex = gridIndex+cellObj[0].innerText;
								}
							});

							if (textWrapObj.currentRowHeight[gridClass][gridIndex] == undefined)
								textWrapObj.currentRowHeight[gridClass][gridIndex] = cellScrollHeight;
							else
								cellScrollHeight = textWrapObj.currentRowHeight[gridClass][gridIndex];

							var rowNode = params.api.getRowNode(rowID);
							rowNode.setRowHeight(cellScrollHeight);
						}
					} else {
						var clsAttrCell = "." + gridClass + " .ag-body-container div.ag-row[row-id='"+rowID+"']";
						var cellObj = $(clsAttrCell);
						if( cellObj[0]!=undefined && cellObj[0].childNodes.length > 0 ) {
							var gridIndex = '';
							var cellScrollHeight = 0;
							Object.keys(cellObj[0].childNodes).forEach(function(childNodeKey) {
								var childNode = cellObj[0].childNodes[childNodeKey];
								cellScrollHeight = (cellScrollHeight < cellObj[0].childNodes[childNodeKey].scrollHeight+3) ? cellObj[0].childNodes[childNodeKey].scrollHeight+3 : cellScrollHeight;
								gridIndex = gridIndex+cellObj[0].childNodes[childNodeKey].innerText;
							});

							if (textWrapObj.currentRowHeight[gridClass][gridIndex] == undefined)
								textWrapObj.currentRowHeight[gridClass][gridIndex] = cellScrollHeight;
							else
								cellScrollHeight = textWrapObj.currentRowHeight[gridClass][gridIndex];

							var rowNode = params.api.getRowNode(rowID);
							rowNode.setRowHeight(cellScrollHeight);
						}
					}
				}
			});
		} else {
			$(clsAttr).addClass('ag-cell-no-txt-wrap');
			$(clsAttr).removeClass('ag-cell-txt-wrap');
			params.api.resetRowHeights();
		}

		params.api.onRowHeightChanged();
	}

	/**
	* [getBaseAgGrid common based grid class for all ag-grid]
	* @param  {[array]} columns        [array of objects for grid columns]
	* @param  {[array]} data           [array of objects for grid rows]
	* @param  {[object]} gridOptions   [grid options]
	* @return {[object]}               [return grid object]
	*/
	getBaseAgGrid(columns, data, gridOptions) {
		if(columns==undefined){
			console.log("Sorry you didn't set grid columns");
			return false;
		}
		if(data==undefined){
			console.log("Sorry you didn't set grid data");
			return false;
		}

		var options = {
			callbackOnGridReady: '', // [function] initial grid functionalities
			gridClass: '', // [string] class name of grid
			agGridId: '', // [string] class name of grid
			agGridClass: '', // [string] class name of grid
			enableFilter: false,
			groupMultiAutoColumn: false,
			groupDefaultExpanded: 0,
			pagination: false,
			customPaginationConfig: {
				pagination: false,
				paginationPageSize: undefined
			},
			autoGroupColumnDef: {},
			fixHeight: undefined,
			domLayout: undefined,
			rowBuffer: undefined,
			headerHeight: undefined,
			paginationPageSize: undefined,
			whiteSpaceProperty: {}, // [object] keep the flag as object of text wrap of gird
			textWrap: {field:'', currentRowHeight:''}, // [object] field name of grid column which column will be counted to get height and current height as currentRowHeight
			myContextMenuItems: [], // [array] if we need custom contex menu items then we can push/add by this option
			contextMenuItems: [],
			callbackContextMenu: '', // [function] callback context menu if needed custom function
			callbackFooterRow: '', // [function] callback footer row function to bind footer row
			callbackOnRowClick: '', // [function] callback to callbackOnRowClick once clicked on row
			callbackOnRowDoubleClick: '', // [function] callback to callbackOnRowDoubleClick once double clicked on row
			callbackOnRowDataChanged: '', // [function] callback to callbackOnRowDataChanged once the grid data changed
			callbackGetRowStyle: undefined, // [function] callback to set row style
			angularCompileRows: false, //[boolean] support angular functionalities in row or cell
		};

		$.extend(options, gridOptions); // marge gridOptions into options
		// $.extend(this.gridOptions, options); // marge gridOptions into options
		//console.log(options);
		var gridClass = options.gridClass;
		this.gridOptions['rowData'] = data;
		this.gridOptions['enableColResize'] = true;
		this.gridOptions['enableSorting'] = true;
		this.gridOptions['agGridId'] = options.agGridId;
		this.gridOptions['agGridClass'] = options.agGridClass;
		this.gridOptions['enableFilter'] = options.enableFilter;
		this.gridOptions['groupMultiAutoColumn'] = options.groupMultiAutoColumn;
		this.gridOptions['groupDefaultExpanded'] = options.groupDefaultExpanded;
		this.gridOptions['angularCompileRows'] = options.angularCompileRows;
		this.gridOptions['customPaginationConfig'] = options.customPaginationConfig;
		this.gridOptions['autoGroupColumnDef'] = options.autoGroupColumnDef;
		this.gridOptions['columnDefs'] = columns;

		this.gridOptions.onGridReady = (params) => {
			if( typeof options.callbackOnGridReady=='function' ){
				options.callbackOnGridReady(params);
			}else{ 
				// by default settings when grid is ready
				params.api.sizeColumnsToFit();
				params.api.deselectAll();
				if (options.fixHeight != undefined) {
					var eGridDiv = <HTMLElement>document.querySelector("#" + options.agGridId);
					if (eGridDiv != undefined) {
						eGridDiv.style.height = options.fixHeight;
						params.api.doLayout();
					}
				}
			}
		};
		
		this.gridOptions.onRowClicked = (params) => {
			if( typeof options.callbackOnRowClick=='function' ){
				var dataItem = params.data;
				if (dataItem != undefined && dataItem.isPinnedRow != undefined && dataItem.isPinnedRow == 'YES') {
			//
				}else{
					params.api.forEachNode( function(rowNode) {
						if (rowNode.rowIndex == params.rowIndex) {
							rowNode.setSelected(true, true);
							// params.api.selectNode(rowNode, true);
						}
					});
					options.callbackOnRowClick(dataItem);
				}
			}
		};
		
		this.gridOptions.onRowDataChanged = (params) => {
			// should check the text wrap after change grid data
			if (this.gridFirstBuild) {
				this.gridOptions.onGridReady(params);
				this.gridFirstBuild = false;
			} else {
				this.setTextWarp(params, options);
				params.api.sizeColumnsToFit();

				if( typeof options.callbackOnRowDataChanged=='function' ){
					options.callbackOnRowDataChanged(params);
				}
				if (options.pagination != undefined && options.pagination == true && gridOptions.customPaginationConfig.pagination != undefined && gridOptions.customPaginationConfig.pagination == true)
				{
					if(this.options != undefined && (this.options.keepPagination == undefined || this.options.keepPagination == false))
					{
						this.resetPagerConfig();
						this.buildPager(params, "next", true);
					}
				}
			}
		};

		this.gridOptions.onRowDoubleClicked = (params) => {
			if( typeof options.callbackOnRowDoubleClick=='function' ){
				var dataItem = params.data;
				if (dataItem != undefined && dataItem.isPinnedRow != undefined && dataItem.isPinnedRow == 'YES') {
					//
				}else{
					params.api.forEachNode( function(rowNode) {
						if (rowNode.rowIndex == params.rowIndex) {
							rowNode.setSelected(true, true);
						}
					});
					options.callbackOnRowDoubleClick(dataItem);
				}
			}
		};

		this.gridOptions.onViewportChanged = (params) => {
			this.setTextWarp(params, options);
		};

		this.gridOptions.onSortChanged = (params) => {
			this.setTextWarp(params, options);
		};

		// this.gridOptions.onRowDataChanged = (params) => {
		// // should check the text wrap after change grid data
		// 	this.setTextWarp(params, options);

		// 	if( typeof options.callbackOnRowDataChanged=='function' ){
		// 		options.callbackOnRowDataChanged(params);
		// 	}
		// 	if (options.pagination != undefined && options.pagination == true && gridOptions.customPaginationConfig.pagination != undefined && gridOptions.customPaginationConfig.pagination == true)
		// 	{
		// 		if(this.options != undefined && (this.options.keepPagination == undefined || this.options.keepPagination == false))
		// 		{
		// 			this.resetPagerConfig();
		// 			this.buildPager(params, "next", true);
		// 		}
		// 	}
		// };

		this.gridOptions.onFilterChanged = (params) => {
			if (options.pagination != undefined && options.pagination == true && gridOptions.customPaginationConfig.pagination != undefined && gridOptions.customPaginationConfig.pagination == true)
			{
				this.resetPagerConfig();
				this.buildPager(params, "next", true);
			}
		};

		this.gridOptions.onPinnedRowDataChanged = (params) => {
			var tmpPinnedBtnCnt = params.api.getPinnedBottomRowCount();
			if (tmpPinnedBtnCnt != undefined && tmpPinnedBtnCnt > 0) {
				var tmpPinnedBtnDataArr = []; var isPinnedRowUpdated = false;
				for (var icnt = 0; icnt < tmpPinnedBtnCnt; icnt++) {
					var tmpObj = params.api.getPinnedBottomRow(icnt).data;
					if (tmpObj != undefined && tmpObj != '' && tmpObj.isPinnedRow == undefined) {
						isPinnedRowUpdated = true;
						tmpObj['isPinnedRow'] = 'YES';
						tmpPinnedBtnDataArr.push(tmpObj);
					}
				}
				if(isPinnedRowUpdated)
					params.api.setPinnedBottomRowData(tmpPinnedBtnDataArr);
			}
		};

		this.gridOptions.getContextMenuItems = (params) => {
			var result = [];

			if ( typeof options.callbackContextMenu == 'function' ) {
				var localResult = options.callbackContextMenu(params);
				if (localResult.length > 0) {
					Object.keys(localResult).forEach(function(fieldKey) {
						var localResultData = localResult[fieldKey];
						result.push(localResultData);
					});
				}
			}

			if ( options.contextMenuItems != undefined && options.contextMenuItems.length > 0) {
				var contextMenuItemConfiguration = this.getContextMenuItemConfiguration(options, params);
				Object.keys(options.contextMenuItems).forEach(function(key) {
					var value = options.contextMenuItems[key];
					if (contextMenuItemConfiguration[value] != undefined) {
						result.push(contextMenuItemConfiguration[value]);
					}
				});
			}
			return result;
		};

		this.gridOptions.onGridSizeChanged = (params) => {
			params.api.sizeColumnsToFit();
		};

		// grid footer row
		if(typeof options.callbackFooterRow=='function') {
			var tmpTotalData = options.callbackFooterRow(data);
			if (tmpTotalData != undefined) {
				Object.keys(tmpTotalData).forEach(function(key) {
					tmpTotalData[key].isPinnedRow = 'YES';
				});
				this.gridOptions.pinnedBottomRowData = tmpTotalData;
			}
		}

		// grid row style
		if( typeof options.callbackGetRowStyle == 'function' ){
			this.gridOptions.getRowStyle = (params) => {
				return options.callbackGetRowStyle(params);
			}
		}

		if( typeof options.domLayout != undefined ){
			this.gridOptions.domLayout = options.domLayout;
		}

		if( typeof options.rowBuffer != undefined ){
			this.gridOptions.rowBuffer = options.rowBuffer;
		}

		if( typeof options.headerHeight != undefined ){
			this.gridOptions.headerHeight = options.headerHeight;
		}

		//grid client side pagination code
		if (options.pagination != undefined && options.pagination == true) 
		{
			this.gridOptions.pagination = true;
			if (options.paginationPageSize != undefined && options.paginationPageSize != '') {
				this.gridOptions.paginationPageSize = options.paginationPageSize;
			} else {
				this.gridOptions.paginationPageSize = 100;
			}

			// Custom Pagination
			if(options.customPaginationConfig != undefined && options.customPaginationConfig.pagination != undefined && 
				options.customPaginationConfig.pagination == true)
			{
				this.gridOptions.pagination = true;
				this.gridOptions.suppressPaginationPanel = true;
				this.gridOptions.paginationPageSize = (options.customPaginationConfig.paginationPageSize != undefined) ? options.customPaginationConfig.paginationPageSize : 100;
				this.pageSize = this.gridOptions.paginationPageSize;
			}
		}

		// this.gridConfiguration = {
		// 	rowData: data,
		// 	// debug: true,
		// 	enableColResize: true,
		// 	enableSorting: true,
		// 	agGridId: options.agGridId,
		// 	agGridClass: options.agGridClass,
		// 	enableFilter: (options.enableFilter != undefined) ? options.enableFilter : false,
		// 	groupMultiAutoColumn: (options.groupMultiAutoColumn != undefined) ? options.groupMultiAutoColumn : false,
		// 	groupDefaultExpanded: (options.groupDefaultExpanded != undefined) ? options.groupDefaultExpanded : 0,
		// 	angularCompileRows: options.angularCompileRows,
		// 	customPaginationConfig: (options.customPaginationConfig != undefined) ? options.customPaginationConfig : {},
		// 	autoGroupColumnDef: (options.autoGroupColumnDef != undefined) ? options.autoGroupColumnDef : {},

		// 	onGridReady: function (params) {
		// 		console.log(params);
		// 		if( typeof options.callbackOnGridReady=='function' ){
		// 			options.callbackOnGridReady(params);
		// 		}else{ 
		// 			// by default settings when grid is ready
		// 			params.api.sizeColumnsToFit();  
		// 			params.api.deselectAll();
		// 			if (options.fixHeight != undefined) {
		// 				var eGridDiv = document.querySelector("#" + options.agGridId);
		// 				eGridDiv.style.height = options.fixHeight;
		// 				params.api.doLayout();
		// 			}
		// 		}
		// 	},
		// 	onRowClicked: (params) => {
		// 		if( typeof options.callbackOnRowClick=='function' ){
		// 			var dataItem = params.data;
		// 			if (dataItem != undefined && dataItem.isPinnedRow != undefined && dataItem.isPinnedRow == 'YES') {
		// 		//
		// 			}else{
		// 				params.api.forEachNode( function(rowNode) {
		// 					if (rowNode.rowIndex == params.rowIndex) {
		// 						rowNode.setSelected(true, true);
		// 						// params.api.selectNode(rowNode, true);
		// 					}
		// 				});
		// 				options.callbackOnRowClick(dataItem);
		// 			}
		// 		}
		// 	},
		// 	onRowDoubleClicked: function (params) {
		// 		if( typeof options.callbackOnRowDoubleClick=='function' ){
		// 			var dataItem = params.data;
		// 			if (dataItem != undefined && dataItem.isPinnedRow != undefined && dataItem.isPinnedRow == 'YES') {
		// 				//
		// 			}else{
		// 				params.api.forEachNode( function(rowNode) {
		// 					if (rowNode.rowIndex == params.rowIndex) {
		// 						rowNode.setSelected(true, true);
		// 					}
		// 				});
		// 				options.callbackOnRowDoubleClick(dataItem);
		// 			}
		// 		}
		// 	},
		// 	onViewportChanged:  function (params) {
		// 		this.setTextWarp(params, options);
		// 	},
		// 	onSortChanged: function(params){
		// 		this.setTextWarp(params, options);
		// 	},
		// 	onRowDataChanged: function(params){
		// 	// should check the text wrap after change grid data
		// 		this.setTextWarp(params, options);

		// 		if( typeof options.callbackOnRowDataChanged=='function' ){
		// 			options.callbackOnRowDataChanged(params);
		// 		}
		// 		if (options.pagination != undefined && options.pagination == true && gridOptions.customPaginationConfig.pagination != undefined && gridOptions.customPaginationConfig.pagination == true)
		// 		{
		// 			if(this.options != undefined && (this.options.keepPagination == undefined || this.options.keepPagination == false))
		// 			{
		// 				this.resetPagerConfig();
		// 				this.buildPager(params, "next", true);
		// 			}
		// 		}
		// 	},
		// 	onFilterChanged: function(params){
		// 		if (options.pagination != undefined && options.pagination == true && gridOptions.customPaginationConfig.pagination != undefined && gridOptions.customPaginationConfig.pagination == true)
		// 		{
		// 			this.resetPagerConfig();
		// 			this.buildPager(params, "next", true);
		// 		}
		// 	},
		// 	onPinnedRowDataChanged: function(params) {
		// 		var tmpPinnedBtnCnt = params.api.getPinnedBottomRowCount();
		// 		if (tmpPinnedBtnCnt != undefined && tmpPinnedBtnCnt > 0) {
		// 			var tmpPinnedBtnDataArr = []; var isPinnedRowUpdated = false;
		// 			for (var icnt = 0; icnt < tmpPinnedBtnCnt; icnt++) {
		// 				var tmpObj = params.api.getPinnedBottomRow(icnt).data;
		// 				if (tmpObj != undefined && tmpObj != '' && tmpObj.isPinnedRow == undefined) {
		// 					isPinnedRowUpdated = true;
		// 					tmpObj['isPinnedRow'] = 'YES';
		// 					tmpPinnedBtnDataArr.push(tmpObj);
		// 				}
		// 			}
		// 			if(isPinnedRowUpdated)
		// 				params.api.setPinnedBottomRowData(tmpPinnedBtnDataArr);
		// 		}
		// 	},
		// 	getContextMenuItems: function (params) {
		// 		var result = [];

		// 		if ( typeof options.callbackContextMenu == 'function' ) {
		// 			var localResult = options.callbackContextMenu(params);
		// 			if (localResult.length > 0) {
		// 				Object.keys(localResult).forEach(function(fieldKey) {
		// 					var localResultData = localResult[fieldKey];
		// 					result.push(localResultData);
		// 				});
		// 			}
		// 		}

		// 		if ( options.contextMenuItems != undefined && options.contextMenuItems.length > 0) {
		// 			var contextMenuItemConfiguration = this.getContextMenuItemConfiguration(options, params);
		// 			Object.keys(options.contextMenuItems).forEach(function(key) {
		// 				var value = options.contextMenuItems[key];
		// 				if (contextMenuItemConfiguration[value] != undefined) {
		// 					result.push(contextMenuItemConfiguration[value]);
		// 				}
		// 			});
		// 		}
		// 		return result;
		// 	},
		// 	onGridSizeChanged: function(params){
		// 		params.api.sizeColumnsToFit();
		// 	},
		// 	columnDefs: columns
		// }

		// // grid footer row
		// if(typeof options.callbackFooterRow=='function') {
		// 	var tmpTotalData = options.callbackFooterRow(data);
		// 	if (tmpTotalData != undefined) {
		// 		Object.keys(tmpTotalData).forEach(function(key) {
		// 			tmpTotalData[key].isPinnedRow = 'YES';
		// 		});
		// 		this.gridConfiguration.pinnedBottomRowData = tmpTotalData;
		// 	}
		// }

		// // grid row style
		// if( typeof options.callbackGetRowStyle=='function' ){
		// 	this.gridConfiguration.getRowStyle = function(params){
		// 		return options.callbackGetRowStyle(params);
		// 	}
		// }

		// if( typeof options.domLayout != undefined ){
		// 	this.gridConfiguration.domLayout = options.domLayout;
		// }

		// if( typeof options.rowBuffer != undefined ){
		// 	this.gridConfiguration.rowBuffer = options.rowBuffer;
		// }

		// if( typeof options.headerHeight != undefined ){
		// 	this.gridConfiguration.headerHeight = options.headerHeight;
		// }

		// //grid client side pagination code
		// if (options.pagination != undefined && options.pagination == true) 
		// {
		// 	this.gridConfiguration.pagination = true;
		// 	if (options.paginationPageSize != undefined && options.paginationPageSize != '') {
		// 		this.gridConfiguration.paginationPageSize = options.paginationPageSize;
		// 	} else {
		// 		this.gridConfiguration.paginationPageSize = 100;
		// 	}

		// 	// Custom Pagination
		// 	if(this.gridConfiguration.customPaginationConfig.pagination != undefined && this.gridConfiguration.customPaginationConfig.pagination == true)
		// 	{
		// 		this.gridConfiguration.pagination = true;
		// 		this.gridConfiguration.suppressPaginationPanel = true;
		// 		this.gridConfiguration.paginationPageSize = (this.gridConfiguration.customPaginationConfig.paginationPageSize != undefined) ? this.gridConfiguration.customPaginationConfig.paginationPageSize : 100;
		// 		this.pageSize = this.gridConfiguration.paginationPageSize;
		// 	}
		// }

		// return this.gridConfiguration;
	}

	buildPager(params, direction, isLast) {
		this.totalPages = params.api.paginationGetTotalPages();
		this.pages = [];
		var start:any;
		var end:any;

		if(direction == "next") {
			start = this.morePageNext;
			end = this.showNoOfPage + (start-1);
			end = (end > this.totalPages) ? this.totalPages : end;
			this.isShowMorePagePrev = (this.morePageNext == 1) ? false : true;
			this.morePageNext = end + 1;
			this.isShowMorePageNext = (this.morePageNext > this.totalPages) ? false : true;

			for(var i=start; i<=end; i++)
			{
				this.pages.push(i);
			}
			this.morePagePrev = start;
			if(isLast == undefined)
				this.jumpTo(params, start);
		}
		else
		{
			start = parseInt(this.morePagePrev) - parseInt(this.showNoOfPage);
			end = this.showNoOfPage + (start-1);
			this.isShowMorePageNext = true;
			this.morePagePrev = start;
			this.isShowMorePagePrev = (this.morePagePrev == 1) ? false : true;
			for(var i=start; i<=end; i++)
			{
				this.pages.push(i);
			}            
			this.morePageNext = end+1;
			this.jumpTo(params, end);
		}
	}

	jumpTo(options, page) {
		options.api.paginationGoToPage(page-1);
	}

	onBtFirst(options) {
		this.resetPagerConfig();
		this.buildPager(options, "next", true);
		options.api.paginationGoToFirstPage();
	}

	onBtPrevious(options) {
		if(this.morePagePrev == (options.api.paginationGetCurrentPage()+1))
			this.buildPager(options, "prev", true);
		else
			options.api.paginationGoToPreviousPage();
	}

	onBtNext(options) {
		if(this.morePageNext == (options.api.paginationGetCurrentPage()+2))
			this.buildPager(options, "next", true);
		else
			options.api.paginationGoToNextPage();
	}

	onBtLast(options) {
		options.api.paginationGoToLastPage();
		var calcMorepage = this.totalPages/this.showNoOfPage;
		this.morePageNext = Math.floor(this.totalPages / this.showNoOfPage);

		if(calcMorepage == this.morePageNext)
			this.morePageNext = (this.morePageNext-1);

		this.morePageNext = (this.morePageNext*this.showNoOfPage)+1;
		this.morePageNext = (this.morePageNext <= 0) ? 1 : this.morePageNext;
		this.buildPager(options, "next", true);
	}

	changePageSize(options) {
		options.api.paginationSetPageSize(this.pageSize);
		this.resetPagerConfig();
		this.buildPager(options, "next", true);
		this.totalPages = options.api.paginationGetTotalPages();
	}

	getContextMenuItemConfiguration(options, params) {
		var contextMenuItemConfigurationObj = {
			"EXPORT_CSV_EXCEL_BOTH": "export",
			"EXPORT_CSV": "csvExport",
			"EXPORT_EXCEL": "excelExport",
			"TEXT_WRAP": {
				// custom item
				name: 'Add/Remove Text Wrap',
				action: () => {
					var clsAttr = "." + options.gridClass + " .ag-body-container div.ag-cell";
					var textWrapped = ($(clsAttr).hasClass('ag-cell-no-txt-wrap')) ? true : false;

					if (textWrapped)
						options.whiteSpaceProperty[options.gridClass] = 'normal';
					else
						options.whiteSpaceProperty[options.gridClass] = 'nowrap';

					console.log(options.whiteSpaceProperty[options.gridClass]);

					this.textWrappLogic(textWrapped, options.gridClass, params, options.textWrap);
				}
			}
		};
		// Custom Item if needed
		if( options.myContextMenuItems.length>0 ){
			Object.keys(options.myContextMenuItems).forEach(function(key) {
				var obj = options.myContextMenuItems[key];
				if(obj.name==undefined || obj.text==undefined || obj.callback==undefined){
					console.log("In Custom contextMenuItems must be {'name','text','callback'}");
				}else{
					contextMenuItemConfigurationObj[obj.name] = {
						// custom item
						name: obj.text,
						action: () => {
						//action: function() {
							obj.callback(params, options);
							//$scope.apply();
						}
					}
				}
			});
		}
		return contextMenuItemConfigurationObj;
	}

	setTextWarp(params, options) {
		setTimeout(() => {
			if( typeof options.whiteSpaceProperty=='object' && Object.keys(options.whiteSpaceProperty).length>0 )
			{
				var textWrapped = (options.whiteSpaceProperty[options.gridClass] == 'normal') ? true : false; 
				this.textWrappLogic(textWrapped, options.gridClass, params, options.textWrap);
			}
		},500);
	}

	/**
	* $watch event to bind grid data when data is configured
	*/
	/*$scope.$watch("options.dataLoaded", function(n, o) {
		if( n !== o && n==true ){
			this.options.gridOptions = this.getBaseAgGrid(this.options.columns, this.options.data, this.options.options);
		}
	});*/

}
