import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { WindowModule } from '@progress/kendo-angular-dialog';
import { SendRequestService } from '../../../services/send-request.service';
import { HelperService } from '../../../services/helper.service';
import * as jQuery from 'jquery';
import * as $ from 'jquery';

@Component({
  selector: 'market-selection',
  templateUrl: './market-selection.component.html',
  styleUrls: ['./market-selection.component.scss']
})
export class MarketSelectionComponent implements OnInit {

	@Output() selectionDataEvent = new EventEmitter();

	marketModalWidth:any;
	selectedMarketText:any;
	isSetMarketSelectionModule:any;
	marketFilterInnerLoader:any;
	previousMarketIndexLoaded:any;
	marketSelectionTabs:any;
	isShowMarketFilter:any;
    stickyFilterMarket:any;
	backupMarketSelectionTabs:any;
    showMarketFilter:any;
	setSelectionModule:any;
    opened:boolean;
    currentIndex:any;
    fetchProductAndMarketFilterOnTabClick:any;

  	constructor(private _sendRequestService:SendRequestService, private _helperService: HelperService) { 
  		GLOBALS.isShowMarketFilter = (GLOBALS.isShowMarketFilter != undefined) ? GLOBALS.isShowMarketFilter : true;
	    this.selectedMarketText = 'All';
	    this.isSetMarketSelectionModule = (this.isSetMarketSelectionModule == undefined) ? true : this.isSetMarketSelectionModule;
	    this.marketFilterInnerLoader = {"showInnerLoader": false};
	    this.previousMarketIndexLoaded = 0;
	    this.stickyFilterMarket = GLOBALS.stickyFilterMarket;
        this.currentIndex = (this.currentIndex == undefined) ? 0 : this.currentIndex;
        this.fetchProductAndMarketFilterOnTabClick = GLOBALS.fetchProductAndMarketFilterOnTabClick;
        this.isShowMarketFilter = GLOBALS.isShowMarketFilter;
  	}

  	ngOnInit() {
  	}

  	setSelectionData() {
        this.selectionDataEvent.emit();
    }

    setMarketModuleWidth() {
        this.marketModalWidth = (($( window ).width() * 60)/100);
        if (window.innerWidth < 768) {
            this.marketModalWidth = '90%';
        }
    }

    applyMarketStickyFilterToLocalScope() {
        if (this.stickyFilterMarket == 1)
            this.marketSelectionTabs = GLOBALS.ROOT_marketSelectionTabs;

        this.setMarketSelectedLabel();
    }

    setMarketSelectedLabel() {
        var labelText = GLOBALS.makeLabelText(this.marketSelectionTabs);       
        if(labelText == undefined || labelText=='') {
            this.selectedMarketText = 'All';    
        } else {
            this.selectedMarketText = labelText;    
        }            
    }

    checkIsStickyEnabledMarket() {
        if (this.stickyFilterMarket == 1) {
            jQuery('.stickyNote').addClass('blink');
            setTimeout(()=>{
                jQuery('.stickyNote').removeClass('blink');
            }, 5000);
        }
    }

    //INITIAL MARKET SELECTION SETUP
    initialMarketSelectionSetting() {
        setTimeout(()=>{
            if(GLOBALS.isInitialLoaded!=false){
                if(typeof GLOBALS.setMarketSelectionVars == 'function'){GLOBALS.setMarketSelectionVars();}else{alert('Please configure the "setMarketSelectionVars" Method')}
                if(typeof this.setSelectionModule == 'function' && this.isSetMarketSelectionModule==true){
                    this.isSetMarketSelectionModule = false;
                    setTimeout(()=>{
                        this.setSelectionModule();
                        this.setMarketSelectedLabel();
                    });
                } else if (typeof this.setSelectionModule != 'function' && this.isSetMarketSelectionModule==true) {
                    this.isSetMarketSelectionModule=false;
                    alert('Please configure the "setSelectionModule" method on current controller')
                }
            }
            else
                this.initialMarketSelectionSetting();
        });
    }
    
    getMarketSelection() {
        if (this.showMarketFilter == false)
            return "";

        if (this.marketSelectionTabs == undefined)
            this.marketSelectionTabs = this._helperService.clone(GLOBALS.ROOT_marketSelectionTabs);

        this.backupMarketSelectionTabs = this._helperService.clone(this.marketSelectionTabs);
        var params = GLOBALS.makeFilteredValue(this.marketSelectionTabs);
        return params;
    }

    cancelMarketFilters() {
        if(this.backupMarketSelectionTabs == undefined)
            this.backupMarketSelectionTabs = GLOBALS.ROOT_marketSelectionTabs;

        if (GLOBALS.stickyFilterMarket_prestate != undefined)
            GLOBALS.stickyFilterMarket = GLOBALS.stickyFilterMarket_prestate;

        this.marketSelectionTabs = this.backupMarketSelectionTabs;
        
        if (this.marketSelectionTabs[this.previousMarketIndexLoaded]['isDataLoaded'] == false) {
            this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataList'] = [];
            this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataListOrig'] = [];
        }

        if (this.marketSelectionTabs[this.previousMarketIndexLoaded]['selectedDataList'].length > 0) {
            this.marketSelectionTabs[this.previousMarketIndexLoaded]['selectedDataList'] = [];
        }

        this.previousMarketIndexLoaded = 0;
        this.closeMarketPopup();
    }

    // CLEAR FILTERS WHEN RESET BUTTON WILL BE CLICKED
    marketClearFilters() {
        var marketSelectionTabs = this.marketSelectionTabs;
        if(confirm('Are you sure you want to reset filters? It will clear all your filter selection. Click "OK" to clear filter.')){
            if(marketSelectionTabs.length > 0){
            	Object.keys(marketSelectionTabs).forEach(function(key) {
            		var value = marketSelectionTabs[key];
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
            this.marketSelectionTabs = this._helperService.clone(marketSelectionTabs);
            this.setMarketSelectedLabel();
            this.setSelectionData();
            this.applyStickyFilterMarket(this.marketSelectionTabs);
            this.closeMarketPopup();
        }
    }

    closeMarketPopup() {
        if (this.marketSelectionTabs != undefined && this.marketSelectionTabs[this.previousMarketIndexLoaded]['isDataLoaded'] == false) {
            setTimeout(()=>{
                this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataList'] = [];
                this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataListOrig'] = [];
            });
            this.previousMarketIndexLoaded = 0;
        } else
            this.previousMarketIndexLoaded = 0;

        this.opened = false;
    }

    openMarketWindow() {
        if (this.marketSelectionTabs != undefined && this.marketSelectionTabs[this.previousMarketIndexLoaded]['isDataLoaded'] == false) {
            this.opened = true;
            this.getKeyDataMarket(this.marketSelectionTabs[this.previousMarketIndexLoaded]['data'],this.previousMarketIndexLoaded).then(result => {
            });
        } else
            this.opened = true;
    }

    getKeyDataMarket(account, index) {
        if (this.marketSelectionTabs[index]['isDataLoaded'] == false)
        {
            var previousMarketIndexLoaded = (this.previousMarketIndexLoaded != undefined) ? this.previousMarketIndexLoaded : 0;
            GLOBALS.stopPace = true;
            this.marketFilterInnerLoader.showInnerLoader = true;
            var labelText = '';

            if (this.marketSelectionTabs[index]['selectedDataList'].length > 0) {
                for(let obj of this.marketSelectionTabs[index]['selectedDataList']){
                    labelText += encodeURIComponent(obj.data) + ',';
                }
                labelText = labelText.substring(0, labelText.length - 1);
            }

            var params = new Array();
            params.push("destination=SelectionData");
            params.push("action=getTabDatalist");
            params.push("filterType=market");
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
                        this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataList'] = [];
                        this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataListOrig'] = [];
                        
                        this.marketSelectionTabs[this.currentIndex]['isDataLoaded'] = false;
                        this.marketSelectionTabs[this.currentIndex]['dataList'] = result.selectionTabsData[0]['dataList'];
                        this.marketSelectionTabs[this.currentIndex]['dataListOrig'] = this._helperService.clone(result.selectionTabsData[0]['dataList']);
                    }
                    this.marketFilterInnerLoader.showInnerLoader = false;
                    this.previousMarketIndexLoaded = this.currentIndex;
                }
            });
        }
    }

    itemFilter(inputText) {
        this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataList'] = this._helperService.arrayContainsString(this.marketSelectionTabs[this.previousMarketIndexLoaded]['dataListOrig'],'label',inputText);
    }

    pushAndPopItems(dataList, selectedItem, pushArr, tabIndex, action) {
        for(var i=0; i<selectedItem.length; i++){
            var idx = GLOBALS.getIndex(dataList,selectedItem[i].data);
            var idxo = GLOBALS.getIndex(this.marketSelectionTabs[tabIndex]['dataListOrig'],selectedItem[i].data);
            if(idx>-1){
                pushArr.push(selectedItem[i]);
                dataList.splice(idx, 1);

                if (action == 'PUSH')
                    this.marketSelectionTabs[tabIndex]['dataListOrig'].push(selectedItem[i]);
                else if (action == 'POP')
                    this.marketSelectionTabs[tabIndex]['dataListOrig'].splice(idxo, 1);
            }
        }
        var len = selectedItem.length;
        for(var i=0; i<len; i++){
            selectedItem.splice((len-1)-i,1);
        }
    }

    applyStickyFilterMarket(marketSelectionTabs) {
        GLOBALS.stickyFilter_prestate = this._helperService.clone(GLOBALS.stickyFilterMarket);
        if (GLOBALS.stickyFilterMarket == 1) {
            if (marketSelectionTabs != undefined){
                GLOBALS.ROOT_marketSelectionTabs = marketSelectionTabs;
            }
        } else {
            GLOBALS.ROOT_marketSelectionTabs = GLOBALS.ROOT_stickyBackup_marketSelectionTabs;
        }
    }

    open() {
        this.opened = true;
    }
    close() {
        this.opened = false;
    }
}