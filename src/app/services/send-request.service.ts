import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { GLOBALS } from '../globals';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import * as $ from 'jquery';
import * as jQuery from 'jquery';

@Injectable()
export class SendRequestService {
    options:any;
    startupData: any;
	apiRoot: string = environment.api_url+"comphp/index_new.php";
	constructor(private http: HttpClient, private cookieService: CookieService) { 
    }

    public configurePaceEvents() {
        if(typeof GLOBALS.paceObj != undefined) {
            GLOBALS.paceObj.on("start", function() {
                console.log(GLOBALS.stopPace);
                if (GLOBALS.stopPace) {
                    jQuery("body > .pace").removeClass('pace-active').addClass('pace-inactive');
                }
            });
            GLOBALS.paceObj.on("restart", function() {
                console.log(GLOBALS.stopPace);
                if (GLOBALS.stopPace) {
                    jQuery("body > .pace").removeClass('pace-active').addClass('pace-inactive');
                }
            });
        }
    }

    public filterChange(param, postParams, requestMethod) {

        if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19)
            param = param.join('&');

        var pageTitle = (GLOBALS.default_load_title != undefined) ? GLOBALS.default_load_title : $('#pageTitle').val();

        if (GLOBALS.paramsCookie != undefined && GLOBALS.paramsCookie != '' && (GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19)) // LCL + Nielsen
            param = GLOBALS.paramsCookie + "&" + param + "&commonFilterApplied=true";

        if (GLOBALS.hasGlobalFilter == true && GLOBALS.globalFilterKey != undefined && (GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19)) { 
            if(GLOBALS.selectedGlobalFilter != "" && GLOBALS.selectedGlobalFilter != "ALL") {
                param += "&FSG["+GLOBALS.globalFilterKey+"]=" + GLOBALS.selectedGlobalFilter;
            }
        }
        
        if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19)
            param = param.split('&');

        var projectType = GLOBALS.getProjectType(GLOBALS.projectTypeId);
        var encodeParams = [];
        param.forEach((value : any, key: any) => {
            var temp = [];
            temp = value.split('=');
            var tempValue = temp[1];
            if (tempValue == undefined || tempValue == "") {
                // nothing to do
            } else {
                tempValue = tempValue.replace("AND_SIGN", "&");
            }
            encodeParams.push(temp[0] + "=" + encodeURIComponent(tempValue));
        });
        encodeParams.push("projectType=" + projectType);
        encodeParams.push("projectID=" + GLOBALS.projectID);
        encodeParams.push("pageTitle=" + pageTitle);

        if((GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27)) 
            encodeParams.push("clusterID=" + GLOBALS.defaultClusterID);
        if((GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) && GLOBALS.territoryLevel != undefined)
            encodeParams.push("territoryLevel=" + GLOBALS.territoryLevel);
        if(GLOBALS.SIF != undefined && GLOBALS.SIF && GLOBALS.projectTypeId == 2)
            encodeParams.push("SIF=YES");
        if(GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27))
            encodeParams.push("SIF=YES");
        if(GLOBALS.dcViewState != undefined && (GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27)) 
            encodeParams.push("dcViewState=" + GLOBALS.dcViewState);
        var parameters = encodeParams.join('&');

        if (requestMethod == 'post' && GLOBALS.projectTypeId == 2) {
            GLOBALS.setScreenLock();
            GLOBALS.onGoingRequests.push(GLOBALS.getRandomId());
            let promise = new Promise((resolve, reject) => {
                this.configurePaceEvents();
                const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");
                var parameters = encodeParams.join('&');
                var apiURL = this.apiRoot+'?'+parameters;
                this.http.post(apiURL,{headers})
                    .toPromise()
                    .then((res : any) => {
                            if (res.default_load_pageID != undefined)
                                GLOBALS.default_load_pageID = res.default_load_pageID;

                            if (res.access != undefined && res.access == "unothorized")
                                window.location.href = "http://www.ultralysis.com/";
                            else if (res.access != undefined && res.access == "maintainance"){
                                if (res.reload != undefined)
                                    GLOBALS.showMaintainanceReload = res.reload;

                                GLOBALS.showMaintainancePopup = true;
                                resolve(res);
                            }
                            else if (res.configuration != undefined && res.configuration.status != undefined && res.configuration.status == "fail")
                                GLOBALS.checkProjectHealth(res.configuration.messages);
                            else
                                resolve(res);

                            GLOBALS.removeScreenLock();
                            GLOBALS.onGoingRequests.pop();
                            GLOBALS.updateGlobalStopPace();
                        },
                        msg => { // Error
                            GLOBALS.removeScreenLock();
                            GLOBALS.onGoingRequests.pop();
                            GLOBALS.updateGlobalStopPace();
                            reject(msg);
                        }
                    );
            });
            return promise;
        }
        else if (requestMethod == 'file' && (GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27))
        {
            GLOBALS.setScreenLock();
            GLOBALS.onGoingRequests.push(GLOBALS.getRandomId());
            let promise = new Promise((resolve, reject) => {
                this.configurePaceEvents();
                var form = new FormData();
                form.append('file1', postParams.file1);
                form.append('file2', postParams.file2);

                const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");
                var parameters = encodeParams.join('&');
                var apiURL = this.apiRoot+'?'+parameters;
                this.http.post(apiURL, form, {headers}).toPromise()
                .then(
                    res => { // Success
                        GLOBALS.removeScreenLock();
                        GLOBALS.onGoingRequests.pop();
                        GLOBALS.updateGlobalStopPace();
                        resolve(res);
                    },
                    msg => { // Error
                        GLOBALS.removeScreenLock();
                        GLOBALS.onGoingRequests.pop();
                        GLOBALS.updateGlobalStopPace();
                        reject(msg);
                    }
                );
            });
            return promise;
        }            
        else
        {
            GLOBALS.setScreenLock();
            GLOBALS.onGoingRequests.push(GLOBALS.getRandomId());
            let promise = new Promise((resolve, reject) => {
                this.configurePaceEvents();
                var apiURL = this.apiRoot+'?'+parameters;
                // const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");
                this.http.get(apiURL).toPromise()
                    .then((res : any) => {
                        if ( typeof res == 'string' && res.match(/error/) ){
                            $('body .podLoader').css('display','none');
                            alert('got error '+res);
                        }
                        if (res.default_load_pageID != undefined)
                            GLOBALS.default_load_pageID = res.default_load_pageID;

                        if (res.myProductBasedate != undefined && GLOBALS.projectTypeId == 2) { // RL+
                            var datetodisplay = new Date(res.myProductBasedate);
                            var convertedDate = datetodisplay.toDateString();
                            GLOBALS.myProductBaseDate = convertedDate;
                            
                            GLOBALS.weekEndingText = "Week Ending";
                            if(res.weekEndingText != undefined && res.weekEndingText != "")
                                GLOBALS.weekEndingText = res.weekEndingText;                            
                        }

                        if (res.myStoreBasedate != undefined && GLOBALS.projectTypeId == 2) { // RL+
                            var datetodisplay = new Date(res.myStoreBasedate);
                            var convertedDate = datetodisplay.toDateString();
                            GLOBALS.myStoreBaseDate = convertedDate;
                        }
                            
                        if (res.access != undefined && res.access == "unothorized")
                            window.location.href = "http://www.ultralysis.com/";

                        if (res.access != undefined && res.access == "maintainance") {
                            if (res.reload != undefined)
                                GLOBALS.showMaintainanceReload = res.reload;

                            GLOBALS.showMaintainancePopup = true;
                            resolve(res);
                        }
                        else if (res.configuration != undefined && res.configuration.status != undefined && res.configuration.status == "fail")
                            GLOBALS.checkProjectHealth(res.configuration.messages);
                        else
                            resolve(res);

                        GLOBALS.removeScreenLock();
                        GLOBALS.onGoingRequests.pop();
                        GLOBALS.updateGlobalStopPace();
                        console.log(GLOBALS.onGoingRequests);
                    },
                    msg => { // Error
                        GLOBALS.removeScreenLock();
                        GLOBALS.onGoingRequests.pop();
                        GLOBALS.updateGlobalStopPace();
                        reject(msg);
                    }
                );
            });
            
            console.log(GLOBALS.onGoingRequests);
            return promise;
        }
    }

    public setDefaultServices(serviceName, params, isDefaultSelectedWeek) {

        //var deferred = $q.defer();
        var parameters = "";
        var pageTitle = (GLOBALS.defaultLoadPageTitle != undefined) ? GLOBALS.defaultLoadPageTitle : $('#pageTitle').val();
        if (params != 'undefined' && params != '') {

            let promise = new Promise((resolve, reject) => {

                if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 19) {
                    if (GLOBALS.isShowPrivateLabel == undefined)
                        var PLabel = false;
                    else
                        var PLabel = GLOBALS.isShowPrivateLabel;
                }
                if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19) {
                    if (GLOBALS.paramsCookie != undefined && GLOBALS.paramsCookie != '')
                        params = params + "&" + GLOBALS.paramsCookie + "&commonFilterApplied=true";
                    else
                        params = params + "&" + "&VeryFirstRequest=true";     
                    
                    var encodeParams = [];
                    params = params.split('&');
                    params.forEach((value : any, key: any) => {
                        var temp = [];
                        temp = value.split('=');
                        var tempValue = temp[1];
                        if (tempValue == undefined || tempValue == "") {
                            // nothing to do
                        } else {
                            tempValue = tempValue.replace("AND_SIGN", "&");
                        }
                        encodeParams.push(temp[0] + "=" + encodeURIComponent(tempValue));
                    });
                    encodeParams.push("trackRequest=true");
                    var parameters = encodeParams.join('&');

                    var isDefaultSelectedWeek = (isDefaultSelectedWeek) ? isDefaultSelectedWeek : true;
                    var defaultWeekSelection = "";
                    if (isDefaultSelectedWeek == true) 
                        defaultWeekSelection = GLOBALS.defaultFromWeek != "" ? "FromWeek=" + GLOBALS.defaultFromWeek + "&ToWeek=" + GLOBALS.defaultToWeek : "";
                    var globalFilterSelection = "";
                    if (GLOBALS.hasGlobalFilter == true && GLOBALS.globalFilterKey != undefined) {
                        if(GLOBALS.selectedGlobalFilter != "" && GLOBALS.selectedGlobalFilter != "ALL") {
                            globalFilterSelection = "FSG["+GLOBALS.globalFilterKey+"]=" + GLOBALS.selectedGlobalFilter;
                        }
                    }
                }
                else
                    parameters = params;

                if(GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) {
                    var isDefaultSelectedWeek = (isDefaultSelectedWeek) ? isDefaultSelectedWeek : true;
                    var defaultWeekSelection = "";
                    if (isDefaultSelectedWeek == true)
                        defaultWeekSelection = GLOBALS.defaultFromWeek != "" ? "FromDate=" + GLOBALS.defaultFromWeek : "";
                }
                if(GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27 ) 
                    encodeParams.push("trackRequest=true");
                if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 19 || GLOBALS.projectTypeId == 27)
                    encodeParams.push(defaultWeekSelection);
                if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 19)
                    encodeParams.push(globalFilterSelection);
                if(GLOBALS.projectTypeId == 1 || GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 19 )
                    encodeParams.push("HidePrivate="+PLabel)
                if(GLOBALS.projectTypeId == 2)
                    encodeParams.push("clusterID=" + GLOBALS.defaultClusterID)
                if((GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) && GLOBALS.tsdSif != undefined && GLOBALS.tsdSif == true) 
                    encodeParams.push("SIF=YES")
                if((GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) && GLOBALS.dcViewState != undefined)
                    encodeParams.push("dcViewState=" + GLOBALS.dcViewState)
                if((GLOBALS.projectTypeId == 2 || GLOBALS.projectTypeId == 15 || GLOBALS.projectTypeId == 27) && GLOBALS.territoryLevel != undefined)
                    encodeParams.push("territoryLevel=" + GLOBALS.territoryLevel)
                    
                parameters = encodeParams.join('&');

                var projectType = GLOBALS.getProjectType(GLOBALS.projectTypeId);
                GLOBALS.setScreenLock();
                GLOBALS.onGoingRequests.push(GLOBALS.getRandomId());
                // const headers = new HttpHeaders().set("X-Requested-With", "XMLHttpRequest");
                var apiURL = this.apiRoot+'?'+parameters;
                this.http.get(apiURL).toPromise().then( (res: any) => { 
                    console.log(res);
                    if (res.access != undefined && res.access == "unothorized")
                        window.location.href = "http://www.ultralysis.com/";
                    else 
                    {
                        if (res.default_load_pageID != undefined)
                            GLOBALS.default_load_pageID = res.default_load_pageID;

                        if(GLOBALS.projectTypeId == 2) {

                            if (res.myProductBasedate != undefined) {
                                var datetodisplay = new Date(res.myProductBasedate);
                                var convertedDate = datetodisplay.toDateString();
                                GLOBALS.myProductBaseDate = convertedDate;
                                
                                GLOBALS.weekEndingText = "Week Ending";
                                if(res.weekEndingText != undefined && res.weekEndingText != "")
                                    GLOBALS.weekEndingText = res.weekEndingText;
                            }

                            if (res.myStoreBasedate != undefined) {
                                var datetodisplay = new Date(res.myStoreBasedate);
                                var convertedDate = datetodisplay.toDateString();
                                GLOBALS.myStoreBaseDate = convertedDate;
                            }
                        }

                        if (res.access != undefined && res.access == "unothorized")
                            window.location.href = "http://www.ultralysis.com/";
                        else if (res.access != undefined && res.access == "maintainance") {
                            if (res.reload != undefined)
                                GLOBALS.showMaintainanceReload = res.reload;

                            GLOBALS.showMaintainancePopup = true;
                            resolve(res);
                        }
                        else if (res.configuration != undefined && res.configuration.status != undefined && res.configuration.status == "fail")
                            GLOBALS.checkProjectHealth(res.configuration.messages);
                        else
                            resolve(res);
                        
                        GLOBALS.removeScreenLock();
                        GLOBALS.onGoingRequests.pop();
                        GLOBALS.updateGlobalStopPace();
                    }
                },
                msg => { // Error
                    GLOBALS.removeScreenLock();
                    GLOBALS.onGoingRequests.pop();
                    GLOBALS.updateGlobalStopPace();
                    reject(msg);
                });
            });
            this.configurePaceEvents();
            return promise;
        }
    }

}