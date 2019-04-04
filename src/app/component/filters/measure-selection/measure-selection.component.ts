import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { SendRequestService } from '../../../services/send-request.service';
import { HelperService } from '../../../services/helper.service';

@Component({
  selector: 'measure-selection',
  templateUrl: './measure-selection.component.html',
  styleUrls: ['./measure-selection.component.scss']
})
export class MeasureSelectionComponent implements OnInit {

	@Output() selectionDataEvent = new EventEmitter();

	isDefaultMeasureSeted:any;
	measuresOptiondata:any;
	selectedMeasureID:any;

  	constructor(private _helperService: HelperService) { 
  		this.isDefaultMeasureSeted = false;
  		if(GLOBALS.ROOT_measureSelectionList != undefined){
	        GLOBALS.measuresOptiondata = GLOBALS.ROOT_measureSelectionList;
	        this.measuresOptiondata = GLOBALS.measuresOptiondata;
	        this.setDefaultMeasureSelectionID(false);
    	}
  	}

  	ngOnInit() {
  	}

  	setSelectionData() {
        this.selectionDataEvent.emit();
    }

  	
  	setDefaultMeasureSelectionID(isInitCall) {
        if(!this.isDefaultMeasureSeted){
            if(isInitCall)
                this.isDefaultMeasureSeted = true;
            if(this.measuresOptiondata != undefined && this.measuresOptiondata.length > 0){
            	var selectedMeasureData = this._helperService.where(this.measuresOptiondata,{selected : true });
            	//console.log(selectedMeasureData);
                if(selectedMeasureData.length == 1 ){
                    this.selectedMeasureID = selectedMeasureData[0]['measureID'];
                }else{
                    this.selectedMeasureID = this.measuresOptiondata[0]['measureID'];
                }
                //console.log(this.selectedMeasureID);
            }
        }
    }

    

    initialMeasureSelectionSetting() {
        setTimeout(()=>{
            if (GLOBALS.isInitialLoaded != false) {
                if (typeof GLOBALS.setMeasureSelectionVars == 'function') {
                    GLOBALS.setMeasureSelectionVars();
                } else {
                    alert('Please configure the "setMeasureSelectionVars" Method')
                }
                this.measuresOptiondata = GLOBALS.measuresOptiondata;
                this.setDefaultMeasureSelectionID(true);
            }
            else
                this.initialMeasureSelectionSetting();
        });
    }

    getMeasureSelection() {
        var params = "ValueVolume=" + this.selectedMeasureID;
        return params;
    }

    updateMeasureSelectionVars(measuresOptiondata) {
        setTimeout(()=>{
            this.measuresOptiondata = measuresOptiondata;
            this.isDefaultMeasureSeted = false;
            this.setDefaultMeasureSelectionID(true);
        });
    }

}
