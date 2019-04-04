import { Injectable, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { environment } from 'environments/environment';
import { SendRequestService } from '../services/send-request.service';
import { HelperService } from '../services/helper.service';
import { HttpClient } from "@angular/common/http";
import { GLOBALS } from '../globals';
import { Subject } from 'rxjs/Subject';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class InitializeProjectService {
    apiRoot: string = environment.api_url+"comphp/index_new.php";
    apiURL:string;

    constructor(private _sendRequestService: SendRequestService, private httpClient: HttpClient, private location: Location, private _helperService: HelperService, private cookieService: CookieService) { 
        var params = this.parseURL(location.path());
        if (params['projectID'] != undefined)
            GLOBALS.projectID = params['projectID'];
    }

    public parseURL (url) {
        var pairs = url.substring(1).split("&");
        var obj = {};
        var pair;
        var i;

        for ( i in pairs ) {
            if ( pairs[i] === "" ) continue;

            pair = pairs[i].split("=");
            obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
        }

        return obj;
      };

    public initalizeApplication() {

        //var requestMethod = 'get';
        let params = [];
        params.push("destination=InitialiseProject");
        params.push("fetchConfig=true");
        params.push("DataHelper=true");
        params.push("trackRequest=true");
        return this._sendRequestService.filterChange(params,'','').then((data: any) => {
            this.setGlobalVars(data);
        });
    }

    setGlobalVars(data) {
        if(data.MENU_LIST != undefined)
            GLOBALS.menuList = data.MENU_LIST;
        if (data.MENU_LIST != undefined)
            GLOBALS.menuList = data.MENU_LIST;
        if (data.selectedIndexTo != undefined)
            GLOBALS.selectedIndexTo = data.selectedIndexTo;
        if (data.selectedIndexFrom != undefined)
            GLOBALS.selectedIndexFrom = data.selectedIndexFrom;
        if (data.selectedLyIndexTo != undefined)
            GLOBALS.selectedLyIndexTo = data.selectedLyIndexTo;
        if (data.selectedLyIndexFrom != undefined)
            GLOBALS.selectedLyIndexFrom = data.selectedLyIndexFrom;
        if (data.gridWeek != undefined)
            GLOBALS.gridWeek = data.gridWeek;
        if (data.dateList != undefined)
            GLOBALS.dateList = data.dateList;
        if (data.default_load_title != undefined)
            GLOBALS.default_load_title = data.default_load_title;
        if (data.measureSelectionList != undefined)
            GLOBALS.measureSelectionList = data.measureSelectionList;
        if (data.measureSelectionList != undefined)
            GLOBALS.ROOT_measureSelectionList = data.measureSelectionList;
        if(data.measureSelectionList != undefined)
            GLOBALS.measuresOptiondata = data.measureSelectionList;
        if (data.productSelectionTabs != undefined)
            GLOBALS.productSelectionTabs = data.productSelectionTabs;
        if (data.productSelectionTabs != undefined)
            GLOBALS.ROOT_productSelectionTabs = data.productSelectionTabs;
        if (data.marketSelectionTabs != undefined)
            GLOBALS.marketSelectionTabs = data.marketSelectionTabs;
        if (data.marketSelectionTabs != undefined)
            GLOBALS.ROOT_marketSelectionTabs = data.marketSelectionTabs;
        if (data.skuSelectionTabs != undefined)
            GLOBALS.skuSelectionTabs = data.skuSelectionTabs;
        if (data.projectID != undefined)
            GLOBALS.projectID = data.projectID;
        if (data.projectName != undefined)
            GLOBALS.projectName = data.projectName;
        if (data.COMPANY_NAME != undefined)
            GLOBALS.COMPANY_NAME = data.COMPANY_NAME;
        if (data.settings != undefined) {
            GLOBALS.settings = data.settings;
            GLOBALS.isShowPrivateLabel = (GLOBALS.settings['has_private_label'] != undefined) ? (parseInt(GLOBALS.settings['has_private_label']) == 1 ? true : false) : false;
            GLOBALS.isShowLyData = (GLOBALS.settings['has_ly_data'] != undefined) ? (parseInt(GLOBALS.settings['has_ly_data']) == 1 ? true : false) : true;
            GLOBALS.isShowTyData = (GLOBALS.settings['has_ty_data'] != undefined) ? (parseInt(GLOBALS.settings['has_ty_data']) == 1 ? true : false) : true;
            GLOBALS.isShowMarketFilter = (GLOBALS.settings['has_market_filter'] != undefined) ? (parseInt(GLOBALS.settings['has_market_filter']) == 1 ? true : false) : true;
            GLOBALS.isShowProductFilter = (GLOBALS.settings['has_product_filter'] != undefined) ? (parseInt(GLOBALS.settings['has_product_filter']) == 1 ? true : false) : true;
            GLOBALS.isShowSkuFilter = (GLOBALS.settings['has_sku_filter'] != undefined) ? (parseInt(GLOBALS.settings['has_sku_filter']) == 1 ? true : false) : true;
        }
        if (data.filter_list != undefined)
            GLOBALS.filter_list = data.filter_list;
        if (data.territoryList != undefined)
            GLOBALS.territoryList = data.territoryList;
        if (data.clientID != undefined)
            GLOBALS.clientID = data.clientID;
        if (data.currencySign != undefined)
            GLOBALS.currencySign = data.currencySign;
        if (data.timeSelectionUnit != undefined)
            GLOBALS.timeSelectionUnit = data.timeSelectionUnit
        if (data.default_load_pageID != undefined)
            GLOBALS.default_load_pageID = data.default_load_pageID;
        if (data.default_page_slug != undefined)
            GLOBALS.default_page_slug = data.default_page_slug;
        if (data.is_static_page != undefined)
            GLOBALS.is_static_page = data.is_static_page;
        if (data.with_future_gridWeek != undefined)
            GLOBALS.with_future_gridWeek = data.with_future_gridWeek;
        if (data.with_future_selectedIndexTo != undefined)
            GLOBALS.with_future_selectedIndexTo = data.with_future_selectedIndexTo;
        if (data.with_future_selectedIndexFrom != undefined)
            GLOBALS.with_future_selectedIndexFrom = data.with_future_selectedIndexFrom;
        if (data.with_future_selectedLyIndexTo != undefined)
            GLOBALS.with_future_selectedLyIndexTo = data.with_future_selectedLyIndexTo;
        if (data.with_future_selectedLyIndexFrom != undefined)
            GLOBALS.with_future_selectedLyIndexFrom = data.with_future_selectedLyIndexFrom;
        if (data.hasGlobalFilter != undefined)
            GLOBALS.hasGlobalFilter = data.hasGlobalFilter;
        if (data.globalFilterJsonKey != undefined)
            GLOBALS.globalFilterJsonKey = data.globalFilterJsonKey;
        if (data.globalFilterKey != undefined)
            GLOBALS.globalFilterKey = data.globalFilterKey;
        if (data.defaultGlobalFilterVal != undefined)
            GLOBALS.defaultGlobalFilterVal = data.defaultGlobalFilterVal;
        if (data.globalFilter_SNAME != undefined)
            GLOBALS.globalFilter_SNAME = data.globalFilter_SNAME;
        if (data.globalFilterEnabledList != undefined)
            GLOBALS.globalFilterEnabledList = data.globalFilterEnabledList;
        if (data.productAndMarketFilterData != undefined)
            GLOBALS.productAndMarketFilterData = data.productAndMarketFilterData;
        if (data.fetchProductAndMarketFilterOnTabClick != undefined)
            GLOBALS.fetchProductAndMarketFilterOnTabClick = data.fetchProductAndMarketFilterOnTabClick;
        if (data.positiveStartColorCode != undefined)
            GLOBALS.positiveStartColorCode = data.positiveStartColorCode;
        if (data.positiveEndColorCode != undefined)
            GLOBALS.positiveEndColorCode = data.positiveEndColorCode;
        if (data.negativeStartColorCode != undefined)
            GLOBALS.negativeStartColorCode = data.negativeStartColorCode;
        if (data.negativeEndColorCode != undefined)
            GLOBALS.negativeEndColorCode = data.negativeEndColorCode;
        if (data.newItemColorCode != undefined)
            GLOBALS.newItemColorCode = data.newItemColorCode;
        if(data.gridWeek != undefined)
            GLOBALS.ROOT_weekYearList = data.gridWeek;
        if(data.selectedIndexFrom != undefined)
            GLOBALS.ROOT_selectedIndexFrom = data.selectedIndexFrom;
        if(data.selectedIndexTo != undefined)
            GLOBALS.ROOT_selectedIndexTo = data.selectedIndexTo;
        if(data.selectedLyIndexFrom != undefined)
            GLOBALS.ROOT_selectedLyIndexFrom = data.selectedLyIndexFrom;
        if(data.selectedLyIndexTo != undefined)
            GLOBALS.ROOT_selectedLyIndexTo = data.selectedLyIndexTo;

        if (data.timeSelectionStyle != undefined)
            GLOBALS.timeSelectionStyle = data.timeSelectionStyle;
        else
            GLOBALS.timeSelectionStyle = "GENERAL";
        if (data.defaultFromWeek != undefined)
            GLOBALS.defaultFromWeek = data.defaultFromWeek;
        if (data.defaultToWeek != undefined)
            GLOBALS.defaultToWeek = data.defaultToWeek;
        if (data.defaultMeasureSelectionID != undefined)
            GLOBALS.defaultMeasureSelectionID = data.defaultMeasureSelectionID;
        if (data.measureSelectionListSIF != undefined)
            GLOBALS.ROOT_measureSelectionListSIF = data.measureSelectionListSIF;

        if (GLOBALS.ROOT_selectedIndexFrom != undefined && GLOBALS.ROOT_weekYearList[GLOBALS.ROOT_selectedIndexFrom] != undefined)
            GLOBALS.defaultFromWeek = GLOBALS.ROOT_weekYearList[GLOBALS.ROOT_selectedIndexFrom].data;

        if (GLOBALS.ROOT_selectedIndexTo != undefined && GLOBALS.ROOT_weekYearList[GLOBALS.ROOT_selectedIndexTo] != undefined)
            GLOBALS.defaultToWeek = GLOBALS.ROOT_weekYearList[GLOBALS.ROOT_selectedIndexTo].data;

        if(GLOBALS.ROOT_measureSelectionList != undefined && GLOBALS.ROOT_measureSelectionList.length > 0) {
            var selectedMeasureData = this._helperService.where(GLOBALS.ROOT_measureSelectionList,{selected : true});
            if(selectedMeasureData.length == 1 ){
                GLOBALS.defaultMeasureSelectionID = selectedMeasureData[0]['measureID'];
            }else{
                GLOBALS.defaultMeasureSelectionID = GLOBALS.ROOT_measureSelectionList[0]['measureID'];
            }
        }
        GLOBALS.pageUniqueId = 'app_'+GLOBALS.getRandomId();
        /* Global Filter Data */
        if (data.globalFilterJsonKey != undefined && data[data.globalFilterJsonKey] != undefined) {
            GLOBALS.globalFilterData = data[GLOBALS.globalFilterJsonKey];
            var cookieName = "global_"+GLOBALS.globalFilterJsonKey+"_"+GLOBALS.projectID;
            var selectedGlobalFilter = "";
            if(data.defaultGlobalFilterVal != undefined && data.defaultGlobalFilterVal != ""){
                GLOBALS.defaultGlobalFilterVal = data.defaultGlobalFilterVal;
                var selectedGlobalFilterData = this._helperService.where(GLOBALS.globalFilterData,{data : data.defaultGlobalFilterVal});
                if(selectedGlobalFilterData.length == 1 ){
                    selectedGlobalFilter = data.defaultGlobalFilterVal;
                }else{
                    selectedGlobalFilter = GLOBALS.globalFilterData[0].data;
                }
            }else{
                selectedGlobalFilter = GLOBALS.globalFilterData[0].data;
            }
            GLOBALS.selectedGlobalFilter = (this.cookieService.get(cookieName) != '') ? this.cookieService.get(cookieName) : selectedGlobalFilter;
            this.cookieService.delete(cookieName);
        }
        /* End */
        if(data.default_menu_item != undefined) {
            GLOBALS.default_menu_item = data.default_menu_item;
        }
    }

}
