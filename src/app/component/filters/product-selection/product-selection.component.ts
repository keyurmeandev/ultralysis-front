import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { SendRequestService } from '../../../services/send-request.service';
import { HelperService } from '../../../services/helper.service';
import * as jQuery from 'jquery';
import * as $ from 'jquery';

@Component({
  selector: 'product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss']
})
export class ProductSelectionComponent implements OnInit {

	@Output() selectionDataEvent = new EventEmitter();

	productModalWidth:any;
    selectedProductText:any;
    isSetSelectionModule:any;
    productFilterInnerLoader:any;
    previousIndexLoaded:any;
	productSelectionTabs:any;
	isShowProductFilter:any;
	stickyFilter:any;
	backupProductSelectionTabs:any;
	showProductFilter:any;
	setSelectionModule:any;
	opened:boolean;
    currentIndex:any;
    fetchProductAndMarketFilterOnTabClick:any;

	constructor(private _sendRequestService: SendRequestService, private _helperService: HelperService) {
		GLOBALS.isShowProductFilter = (GLOBALS.isShowProductFilter != undefined) ? GLOBALS.isShowProductFilter : true;
	    this.selectedProductText = 'All';
	    this.isSetSelectionModule = (this.isSetSelectionModule == undefined) ? true : this.isSetSelectionModule;
	    this.productFilterInnerLoader = {"showInnerLoader": false};
	    this.previousIndexLoaded = 0;
	    this.isShowProductFilter = GLOBALS.isShowProductFilter;
	    this.stickyFilter = GLOBALS.stickyFilter;
        this.currentIndex = (this.currentIndex == undefined) ? 0 : this.currentIndex;
        this.fetchProductAndMarketFilterOnTabClick = GLOBALS.fetchProductAndMarketFilterOnTabClick;
	}
	
	ngOnInit() { 
	}

	setSelectionData() {
        this.selectionDataEvent.emit();
    }
	
    setProductModuleWidth() {
        this.productModalWidth = (($( window ).width() * 60)/100);
        if (window.innerWidth < 768) {
            this.productModalWidth = '90%';
        }
    }

    applyProductStickyFilterToLocalScope() {
        if (this.stickyFilter == 1)
        	this.productSelectionTabs = GLOBALS.ROOT_productSelectionTabs;

        this.setProductSelectedLabel();
    }

    setProductSelectedLabel() {
        var labelText = GLOBALS.makeLabelText(this.productSelectionTabs);
        if(labelText == undefined || labelText == ''){
            this.selectedProductText = 'All';
        } else {
            this.selectedProductText = labelText;
        }
    } 

    checkIsStickyEnabledProduct() {
        if (this.stickyFilter == 1) {
            jQuery('.stickyNote').addClass('blink');
            setTimeout(()=>{
            	jQuery('.stickyNote').removeClass('blink');
            },5000);
        }
    }

    //INITIAL PRODUCT SELECTION SETUP
    initialProductSelectionSetting() {
    	setTimeout(()=>{
    		if(GLOBALS.isInitialLoaded!=false){
        		if(typeof GLOBALS.setProductSelectionVars == 'function'){GLOBALS.setProductSelectionVars();}else{alert('Please configure the "setProductSelectionVars" Method')}
        		if(typeof this.setSelectionModule == 'function' && this.isSetSelectionModule==true){
        			this.isSetSelectionModule=false;
        			setTimeout(()=>{
            			this.setSelectionModule();
            			this.setProductSelectedLabel();
        			});
        		} else if(typeof this.setSelectionModule != 'function' && this.isSetSelectionModule==true) {
        			this.isSetSelectionModule=false;
        			alert('Please configure the "setSelectionModule" method on current controller');
        		}
            }
            else
            	this.initialProductSelectionSetting();
        });
    }
    
    getProductSelection() {
        if (this.showProductFilter == false)
            return "";

        if (this.productSelectionTabs == undefined)
        	this.productSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);

        this.backupProductSelectionTabs = this._helperService.clone(this.productSelectionTabs);
        //console.log(this.backupProductSelectionTabs);
        var params = GLOBALS.makeFilteredValue(this.productSelectionTabs);
        return params;
    }

    cancelProductFilters() {
        // console.log(this.backupProductSelectionTabs);
        // return;
        if(this.backupProductSelectionTabs == undefined)
        	this.backupProductSelectionTabs = this._helperService.clone(GLOBALS.ROOT_productSelectionTabs);

        if (GLOBALS.stickyFilter_prestate != undefined)
        	GLOBALS.stickyFilter = this._helperService.clone(GLOBALS.stickyFilter_prestate);

        this.productSelectionTabs = this._helperService.clone(this.backupProductSelectionTabs);

        if (this.productSelectionTabs[this.previousIndexLoaded]['isDataLoaded'] == false) {
            this.productSelectionTabs[this.previousIndexLoaded]['dataList'] = [];
            this.productSelectionTabs[this.previousIndexLoaded]['dataListOrig'] = [];
        }

        this.previousIndexLoaded = 0;
        this.closePopup();
    }

    // CLEAR FILTERS WHEN RESET BUTTON WILL BE CLICKED
    productClearFilters() {
        var productSelectionTabs = this.productSelectionTabs;
        if(confirm('Are you sure you want to reset filters? It will clear all your filter selection. Click "OK" to clear filter.')){
            if(productSelectionTabs.length > 0){
            	Object.keys(productSelectionTabs).forEach(function(key) {
            		var value = productSelectionTabs[key];
                    if(value.selectedDataList.length>0){
                		Object.keys(value.selectedDataList).forEach(function(objKey) {
                			var obj = value.selectedDataList[objKey];
                            value.dataList.push(obj);
                			value.dataListOrig.push(obj);
                		});
                		value.selectedDataList = [];
                    }
            	});
            }
            this.productSelectionTabs = this._helperService.clone(productSelectionTabs);
        	this.setProductSelectedLabel();
            this.setSelectionData();
            this.applyStickyFilter(this.productSelectionTabs);
            this.closePopup();
        }
    }

    closePopup() {
        if (this.productSelectionTabs != undefined && this.productSelectionTabs[this.previousIndexLoaded]['isDataLoaded'] == false) {
        	setTimeout(()=>{
                this.productSelectionTabs[this.previousIndexLoaded]['dataList'] = [];
        		this.productSelectionTabs[this.previousIndexLoaded]['dataListOrig'] = [];
        	});
            this.previousIndexLoaded = 0;
        } else 
            this.previousIndexLoaded = 0;

        this.opened = false;
    }

    openWindow() {
        //console.log(this.productSelectionTabs);
        if (this.productSelectionTabs != undefined && this.productSelectionTabs[this.previousIndexLoaded]['isDataLoaded'] == false) {
            this.opened = true;
            this.getKeyData(this.productSelectionTabs[this.previousIndexLoaded]['data'],this.previousIndexLoaded).then(result => {
            });
        } else
        	this.opened = true;
    }

    getKeyData(account, index) {
        if (this.productSelectionTabs[index]['isDataLoaded'] == false)
        {
            var previousIndexLoaded = (this.previousIndexLoaded != undefined) ? this.previousIndexLoaded : 0;
            GLOBALS.stopPace = true;
            this.productFilterInnerLoader.showInnerLoader = true;
            var labelText = '';

            if (this.productSelectionTabs[index]['selectedDataList'].length > 0) {
                for(let obj of this.productSelectionTabs[index]['selectedDataList']){
                    labelText += encodeURIComponent(obj.data) + ',';
                }
                labelText = labelText.substring(0, labelText.length - 1);
            }

            var params = new Array();
            params.push("destination=SelectionData");
            params.push("action=getTabDatalist");
            params.push("filterType=product");
            params.push("account=" + account);

            if (labelText != '')
                params.push("selectedData=" + labelText);

            params.push("pageID=" + GLOBALS.default_load_pageID);
            params.push("projectType=lcl");
            params.push("projectID=Gxl4WhZsudtDbUe_gY2gfA0Bxw0LREHOjgpdNKsEB7s");
            params.push("pageTitle=Executive%20Summary");
            this.currentIndex = index;

            return this._sendRequestService.filterChange(params,'','').then((result: any) => {
                if (result.selectionTabsData != undefined) {
                    if (result.selectionTabsData[0] != undefined && result.selectionTabsData[0]['dataList'] != undefined) {
                        this.productSelectionTabs[this.previousIndexLoaded]['dataList'] = [];
                        this.productSelectionTabs[this.previousIndexLoaded]['dataListOrig'] = [];
                        
                        this.productSelectionTabs[this.currentIndex]['isDataLoaded'] = false;
                        this.productSelectionTabs[this.currentIndex]['dataList'] = result.selectionTabsData[0]['dataList'];
                        this.productSelectionTabs[this.currentIndex]['dataListOrig'] = this._helperService.clone(result.selectionTabsData[0]['dataList']);
                    }
                    this.productFilterInnerLoader.showInnerLoader = false;
                    this.previousIndexLoaded = this.currentIndex;
                }
            });
        }
    }

    itemFilter(inputText) {
        this.productSelectionTabs[this.previousIndexLoaded]['dataList'] = this._helperService.arrayContainsString(this.productSelectionTabs[this.previousIndexLoaded]['dataListOrig'],'label',inputText);
    }

    pushAndPopItems(dataList, selectedItem, pushArr, tabIndex, action) {
        for(var i=0; i<selectedItem.length; i++){
            var idx = GLOBALS.getIndex(dataList,selectedItem[i].data);
            var idxo = GLOBALS.getIndex(this.productSelectionTabs[tabIndex]['dataListOrig'],selectedItem[i].data);
            if(idx>-1){
                pushArr.push(selectedItem[i]);
                dataList.splice(idx, 1);

                if (action == 'PUSH')
                    this.productSelectionTabs[tabIndex]['dataListOrig'].push(selectedItem[i]);
                else if (action == 'POP')
                    this.productSelectionTabs[tabIndex]['dataListOrig'].splice(idxo, 1);
            }
        }
        var len = selectedItem.length;
        for(var i=0; i<len; i++){
            selectedItem.splice((len-1)-i,1);
        }
    }

    applyStickyFilter(productSelectionTabs) {
        GLOBALS.stickyFilter_prestate = this._helperService.clone(GLOBALS.stickyFilter);
        if (GLOBALS.stickyFilter == 1) {
            if (productSelectionTabs != undefined){
                GLOBALS.ROOT_productSelectionTabs = productSelectionTabs;
            }
        } else {
            GLOBALS.ROOT_productSelectionTabs = GLOBALS.ROOT_stickyBackup_productSelectionTabs;
        }
    }

    open() {
        this.opened = true;
    }
    close() {
        this.opened = false;
    }
}