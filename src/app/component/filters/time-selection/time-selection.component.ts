import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { HelperService } from '../../../services/helper.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { WindowModule } from '@progress/kendo-angular-dialog';
import * as jQuery from 'jquery';

@Component({
  selector: 'time-selection',
  templateUrl: './time-selection.component.html',
  styleUrls: ['./time-selection.component.scss']
})
export class TimeSelectionComponent implements OnInit {

    @Output() selectionDataEvent = new EventEmitter();

    showVsDropdown:any;
    showLyRangeTextInTimeSelection:any;
    //calculateWeekYearList:any;
    selectedTimeSelection:any;
    timeSelectionSeasonal:any;
    showFacingsSelection:any;
    selectedFacing:any;
    timeSelectionModalWidth:any;
    randomId:any;
    weekYearListArray:any;
    selectedWeekYearFrom:any;
    //setSelectedLabel:any;
    selectedTYWeekYearFrom:any;
    selectedWeekYearTo:any;
    weekYearList:any;
    selectedLYWeekYearFrom:string;
    selectedLYWeekYearTo:any;
    selectedLYWeekYearFromLabel:any;
    selectedLYWeekYearToLabel:any;
    selectedTYWeekYearTo:any;
    selectedTYWeekYearToLabel:any;
    selectedTYWeekYearFromLabel:any;
    timeSelectionMode:any;
    timeSelectionStyleDDArray:any;
    marketSelectionTabs:any;
    timeSelectionStyle:any;
    timeSelectionUnit:any;
    showDateInWeeks:any;
    opened:boolean;
    fromIndex:any;
    toIndex:any;
    //timeSelectionObj:any;

    /*set timeSelection(obj: TimeSelection) {
        console.log(obj.timSelectionObj);
    }*/

  	constructor(private _helper: HelperService) { 
  		this.showVsDropdown = (GLOBALS.showVsDropdownTimeSelection != undefined) ? GLOBALS.showVsDropdownTimeSelection : true;
    	this.showLyRangeTextInTimeSelection = (GLOBALS.showLyRangeTextInTimeSelection != undefined) ? GLOBALS.showLyRangeTextInTimeSelection:true;
        //this.calculateWeekYearList = this.calculateWeekYearList(this.fromIndex);
        //this.setSelectedLabel = this.setSelectedLabelFunc();
        GLOBALS.getTimeSelection = this.getTimeSelection();
        //this.timeSelectionStyle = GLOBALS.timeSelectionStyle;
        this.timeSelectionStyle = 'DROPDOWN';
        this.showDateInWeeks = GLOBALS.showDateInWeeks;
        //this.timeSelectionUnit = GLOBALS.timeSelectionUnit;
        this.timeSelectionUnit = 'weekYear';
        this.timeSelectionMode = 1;
        this.setTimeSelectionModuleWidth();
  	}

  	ngOnInit() {
        /*this.initSelectedTimeSelection();
        this.initFacingsSelection();*/
        if (GLOBALS.isInitialLoaded != undefined && GLOBALS.isInitialLoaded == true) {
            this.initialTimeSelectionSetting();
        }
        if (GLOBALS.pageSwitched != undefined && GLOBALS.pageSwitched == true) {
            GLOBALS.pageSwitched = false;
            if (typeof GLOBALS.setTimeSelectionVars == 'function') {
                GLOBALS.setTimeSelectionVars();
            } else {
                alert('Please configure the "setTimeSelectionVars" Method')
            }
        }
    }
  	setTimeSelectionDD() {
        if(this.selectedTimeSelection != undefined){
            if(typeof this.timeSelectionSeasonal == 'function'){
                this.timeSelectionSeasonal();    
            }
        }
    }

    setSelectionData() {
    	//this.selectionDataEvent.emit(this.timeSelectionObj);
        this.selectionDataEvent.emit();
    }

    initFacingsSelection() {
        if (GLOBALS.timeSelectionUnit == 'seasonal')
            this.showFacingsSelection = true;
        else 
            this.showFacingsSelection = false;

        this.selectedFacing = 0;
    }

    initSelectedTimeSelection() {
        this.selectedTimeSelection = 'YTD';
        if(GLOBALS.timeSelectionStyleDDArray != undefined && GLOBALS.timeSelectionStyleDDArray[0] != undefined) {
            //console.log(GLOBALS.timeSelectionStyleDDArray);
            var objselectedIndexTo = this._helper.where(GLOBALS.timeSelectionStyleDDArray,{selected : true});
            //console.log(objselectedIndexTo);
            if(objselectedIndexTo.length == 1){
                //this.selectedTimeSelection = GLOBALS.timeSelectionStyleDDArray[0].data;
                this.selectedTimeSelection = objselectedIndexTo[0].data;
            }
        }
    }

    // $scope.timeSelectionModalWidth = (($( window ).width() * 60)/100);
    setTimeSelectionModuleWidth() {
        this.timeSelectionModalWidth = '530';
        if (window.innerWidth < 768) {
            this.timeSelectionModalWidth = '90%';
        }
    }

    //INITIAL TIME SELECTION SETUP
    initialTimeSelectionSetting() {
        //$timeout(function() {
            if (GLOBALS.isInitialLoaded != false) {
                this.randomId = this.getRandomData();
                if (typeof GLOBALS.setTimeSelectionVars == 'function') {
                    GLOBALS.setTimeSelectionVars();
                } else {
                    alert('Please configure the "setTimeSelectionVars" Method')
                }
                //console.log(GLOBALS.weekYearList);
                this.weekYearListArray = GLOBALS.weekYearList;
                this.calculateWeekYearList('reset');
                this.setSelectedLabel();
            }
            else
                this.initialTimeSelectionSetting();
        //}
    }
    // $scope.initialTimeSelectionSetting();
    
    onChangeYearFrom(data) {
        this.selectedWeekYearFrom = data;
        this.changeFromMonthYear();
    }
    
    changeFromMonthYear() {
    	if (this.selectedWeekYearFrom == undefined)
			return;

        //console.log(data);
        var changeToSelection = false;
        var toId = this.randomId+"_weekYearListTo";

        var selectedWeekYearFrom = this.selectedWeekYearFrom;
        var selectedWeekYearTo = this.selectedWeekYearTo;
        //console.log('#'+toId+' > option[value!=""]');
        //console.log(jQuery('#'+toId));
        //console.log(jQuery('#'+toId+' > option[value!=""]'));
        
        jQuery('#'+toId+' > option[value!=""]').each(function(index, monthYearToObj) {
            /*console.log(selectedWeekYearFrom);
            console.log(selectedWeekYearFrom.numdata);
            console.log(selectedWeekYearFrom['numdata']);*/
            var diff = selectedWeekYearFrom.numdata - 52;
            if ((jQuery(monthYearToObj).val() > selectedWeekYearFrom.numdata) || (jQuery(monthYearToObj).val() <= diff)) {
				if (selectedWeekYearTo.numdata == jQuery(monthYearToObj).val())
                    changeToSelection = true;

                console.log(jQuery(monthYearToObj));
                jQuery(monthYearToObj).attr('disabled', 'disabled');
            }
            else
                jQuery(monthYearToObj).removeAttr('disabled');
        });

        if (changeToSelection) {
            var selectedIndex = jQuery('#'+toId+' > option:not([disabled])').first().val();
            this.selectedWeekYearTo = this.weekYearListArray[selectedIndex];
        }
    }

    onChangeYearTo(data) {
        this.selectedWeekYearTo = data;
        this.changeToMonthYear();
    }
    changeToMonthYear() {
		if (this.selectedWeekYearTo == undefined)
			return;

        var changeFromoSelection = false;
        var fromId = this.randomId+"_weekYearListFrom";
        var selectedWeekYearFrom = this.selectedWeekYearFrom;
        var selectedWeekYearTo = this.selectedWeekYearTo;

        jQuery('#'+fromId+' > option[value!=""]').each(function(index, monthYearFromObj) {
            if (jQuery(monthYearFromObj).val() < selectedWeekYearTo.numdata) {
                if (selectedWeekYearFrom.numdata == jQuery(monthYearFromObj).val())
                    changeFromoSelection = true;

                jQuery(monthYearFromObj).attr('disabled', 'disabled');
            }
            else
                jQuery(monthYearFromObj).removeAttr('disabled');
        });

        if (changeFromoSelection) {
            var selectedIndex = jQuery('#'+fromId+' > option:not([disabled])').first().val();
            this.selectedWeekYearFrom = this.weekYearListArray[selectedIndex];
        }
    }

    // TO GET CALCULATED TIME 
    //this.calculateWeekYearList = calculateWeekYearListFunc(fromIndex) {
    calculateWeekYearList(fromIndexVal) {
        if (fromIndexVal == 'reset') {
        	//console.log(GLOBALS.selectedIndexFrom);
            this.selectedWeekYearFrom = this.weekYearListArray[GLOBALS.selectedIndexFrom];
            this.selectedWeekYearTo = this.weekYearListArray[GLOBALS.selectedIndexTo];
            //console.log(this.weekYearListArray[0]);
        }
        else if (fromIndexVal == 'xmas') {
            this.selectedWeekYearFrom = this.weekYearListArray[15];
            this.selectedWeekYearTo = this.weekYearListArray[8];
        }
        else {
        	//console.log(GLOBALS.selectedIndexTo);
        	//console.log(fromIndexVal);
            var setFromIndex = parseInt(GLOBALS.selectedIndexTo) + parseInt(fromIndexVal) - 1;
            this.selectedWeekYearFrom = this.weekYearListArray[setFromIndex];
            this.selectedWeekYearTo = this.weekYearListArray[GLOBALS.selectedIndexTo];
        }
		
        this.changeFromMonthYear();
        this.changeToMonthYear();
    }

    doBeforeCancel() {
        if(this.weekYearListArray == undefined)
            return true;
        
        if(this.selectedTYWeekYearFrom == undefined)
            return true;
    }

    // TO GET SELECTED LABEL TEXT
    
    setSelectedLabel() {
        if (this.selectedWeekYearFrom == undefined)
            return;
        // BEFORE VS TEXT LABEL
        this.selectedTYWeekYearFrom = this.selectedWeekYearFrom.data;
        this.selectedTYWeekYearTo = this.selectedWeekYearTo.data;
        //console.log(this.selectedTYWeekYearFrom);
        //console.log(this.selectedTYWeekYearTo);
        if (GLOBALS.showDateInWeeks != undefined && GLOBALS.showDateInWeeks == true)
        {
            this.selectedTYWeekYearFromLabel = this.selectedWeekYearFrom.label;
            this.selectedTYWeekYearToLabel = this.selectedWeekYearTo.label;
        }
        else
        {
            this.selectedTYWeekYearFromLabel = this.selectedTYWeekYearFrom;
            this.selectedTYWeekYearToLabel = this.selectedTYWeekYearTo;
        }
        //console.log(this.selectedTYWeekYearFromLabel);
        //console.log(this.selectedTYWeekYearToLabel);
        // AFTER VS TEXT LABEL
        if (this.timeSelectionMode == 1) {
            var totalWeek = this.weekYearListArray.length;
            var fromTemArr = this.selectedWeekYearFrom.data.split('-');
            var toTemArr = this.selectedWeekYearTo.data.split('-');
            this.selectedLYWeekYearFrom = fromTemArr[0] + '-' + (fromTemArr[1] - 1);
            this.selectedLYWeekYearTo = toTemArr[0] + '-' + (toTemArr[1] - 1);
            
            if (GLOBALS.showDateInWeeks != undefined && GLOBALS.showDateInWeeks == true)
            {

                if (this.selectedWeekYearFrom != undefined)
                {
                	//console.log(GLOBALS.timeSelectionUnit);
                    if(GLOBALS.timeSelectionUnit == 'period')
                    {
                        //var objPeriod = $filter('filter')(this.weekYearListArray,{data : this.selectedLYWeekYearFrom }, true);
                        var objPeriod = this._helper.where(this.weekYearListArray,{data : this.selectedLYWeekYearFrom });
                        this.fromIndex = this.selectedWeekYearFrom.numdata + (objPeriod[0].numdata - this.selectedWeekYearFrom.numdata);
                    }
                    else if(GLOBALS.timeSelectionUnit == 'weekMonth')
                    {
                        //var objPeriod = $filter('filter')(this.weekYearListArray,{data : this.selectedLYWeekYearFrom }, true);
                        var objPeriod = this._helper.where(this.weekYearListArray,{data : this.selectedLYWeekYearFrom });
                        this.fromIndex = this.selectedWeekYearFrom.numdata + (objPeriod[0].numdata - this.selectedWeekYearFrom.numdata);
                    }
                    else
                    {
                        this.fromIndex = this.selectedWeekYearFrom.numdata + 52;
                        //console.log(this.fromIndex);
                        if(GLOBALS.timeSelectionUnit == 'date' && GLOBALS.selectedLyIndexFrom != undefined && GLOBALS.selectedLyIndexFrom != '') {
                        	//console.log(GLOBALS.selectedLyIndexFrom);
                            this.fromIndex = parseInt(GLOBALS.selectedLyIndexFrom);
                        }
                    }
                }
                else if (GLOBALS.selectedLyIndexFrom != undefined && GLOBALS.selectedLyIndexFrom != '')
                    this.fromIndex = GLOBALS.selectedLyIndexFrom;
                else
                    this.fromIndex = this.selectedWeekYearFrom.numdata + 52;

                if (this.selectedWeekYearTo != undefined)
                {
                    if(GLOBALS.timeSelectionUnit == 'period')
                        
                        this.toIndex = this.selectedWeekYearTo.numdata + (objPeriod[0].numdata - this.selectedWeekYearFrom.numdata);
                    else if(GLOBALS.timeSelectionUnit == 'weekMonth')
                        //var toIndex = this.selectedWeekYearTo.numdata + (objPeriod[0].numdata - this.selectedWeekYearFrom.numdata);
                        this.toIndex = this.selectedWeekYearTo.numdata + (objPeriod[0].numdata - this.selectedWeekYearFrom.numdata);
                    else{
                        this.toIndex = this.selectedWeekYearTo.numdata + 52;
                        if(GLOBALS.timeSelectionUnit == 'date' && GLOBALS.selectedLyIndexTo != undefined && GLOBALS.selectedLyIndexTo != '') {
                            this.toIndex = GLOBALS.selectedLyIndexTo;
                        }
                    }
                }
                else if (GLOBALS.selectedLyIndexTo != undefined && GLOBALS.selectedLyIndexTo != '')
                    var toIndex = GLOBALS.selectedLyIndexTo;
                else
                    //var toIndex = this.selectedWeekYearTo.numdata + 52;
                	var toIndex = GLOBALS.selectedLyIndexTo;

                if(GLOBALS.timeSelectionUnit == 'weekMonth' && this.selectedWeekYearFrom == undefined)
                {
                    this.fromIndex = GLOBALS.selectedLyIndexFrom;
                    this.toIndex = GLOBALS.selectedLyIndexTo;
                }
                    
                this.selectedLYWeekYearFromLabel = this.fromIndex >= totalWeek ? 'No pre year' : this.weekYearListArray[this.fromIndex].label;
                this.selectedLYWeekYearToLabel = this.toIndex >= totalWeek ? 'No pre year' : this.weekYearListArray[this.toIndex].label;
                //console.log(this.selectedLYWeekYearFromLabel);
                //console.log(this.selectedLYWeekYearToLabel);
            }
        }
        else if (this.timeSelectionMode == 2) {
            
            var totalWeek = this.weekYearListArray.length;
            var weekRange = (this.selectedWeekYearFrom.numdata - this.selectedWeekYearTo.numdata) + 1;
            //this.fromIndex = parseInt(this.selectedWeekYearFrom.numdata) + parseInt(weekRange);
            this.fromIndex = this.selectedWeekYearFrom.numdata;
            this.toIndex = parseInt(this.selectedWeekYearFrom.numdata) + 1;

            if (this.toIndex >= totalWeek) {
                // We have used this.selectedWeekYearFrom in toDate calculation intentionally so do not change it
                // Its added to resolve if user will select last week available as a filter
                var toTemArr = this.selectedWeekYearFrom.data.split('-');
                if (toTemArr[0] > 1)
                    this.selectedLYWeekYearTo = (toTemArr[0]-1) + '-' + toTemArr[1];
                else
                    this.selectedLYWeekYearTo = '52-' + (toTemArr[1]-1);
            } else 
                this.selectedLYWeekYearTo = this.weekYearListArray[this.toIndex].data;

            if (this.fromIndex >= totalWeek) {
                if (this.toIndex < totalWeek) {
                    this.fromIndex = (totalWeek-1);
                    this.selectedLYWeekYearFrom = this.weekYearListArray[this.fromIndex].data;
                } else {
                    var fromTemArr = this.selectedWeekYearFrom.data.split('-');
                    if (fromTemArr[0] > 1)
                        this.selectedLYWeekYearFrom = (fromTemArr[0]-1) + '-' + fromTemArr[1];
                    else
                        this.selectedLYWeekYearFrom = '52-' + (fromTemArr[1]-1);
                }
            } else 
                this.selectedLYWeekYearFrom = this.weekYearListArray[this.fromIndex].data;
            
            if (GLOBALS.showDateInWeeks != undefined && GLOBALS.showDateInWeeks == true)
            {
                this.selectedLYWeekYearFromLabel = this.fromIndex >= totalWeek ? 'No pre week' : this.weekYearListArray[this.fromIndex].label;
                this.selectedLYWeekYearToLabel = this.toIndex >= totalWeek ? 'No pre week' : this.weekYearListArray[this.toIndex].label;
            }
        }
    }

    getRandomData() {
        var d = new Date();
        var randomData = d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
        return randomData;
    }

    // TO GET TIME SELECTION
    getTimeSelection() {
        GLOBALS.timeSelectionModeVal = this.timeSelectionMode;
        var params = "";
        //console.log(GLOBALS.timeSelectionStyle);
        if(GLOBALS.timeSelectionStyle == 'DROPDOWN')
        {
            params += 'timeFrame=' + this.selectedTimeSelection;
            if (GLOBALS.timeSelectionUnit == 'seasonal' && this.showFacingsSelection == true && this.selectedFacing != undefined)
                params += '&facings=' + this.selectedFacing;
        }
        else
        {
            params += 'FromWeek=' + this.selectedTYWeekYearFrom;
            params += '&ToWeek=' + this.selectedTYWeekYearTo;
            params += '&TSM=' + this.timeSelectionMode;
            params += '&FromWeekPrv=' + this.selectedLYWeekYearFrom;
            params += '&ToWeekPrv=' + this.selectedLYWeekYearTo;
        }
        //console.log(params);
        return params;
    }

    /*GLOBALS.$watch("isInitialLoaded", function(){
        if (GLOBALS.isInitialLoaded != undefined && GLOBALS.isInitialLoaded == true) {
            this.initialTimeSelectionSetting();
        }
    });
    GLOBALS.$watch("pageSwitched", function(){
        if (GLOBALS.pageSwitched != undefined && GLOBALS.pageSwitched == true) {
            GLOBALS.pageSwitched = false;
            if (typeof GLOBALS.setTimeSelectionVars == 'function') {
                GLOBALS.setTimeSelectionVars();
            } else {
                alert('Please configure the "setTimeSelectionVars" Method')
            }
        }
    });*/ 

    open() {
        this.opened = true;
    }
    close() {
        this.opened = false;
    }

}
