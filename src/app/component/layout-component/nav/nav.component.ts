import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GLOBALS } from '../../../globals/globals';
import { SplitTextPipe } from '../../../pipe/split-text.pipe';
import { Pace } from 'pace-js';
import * as jQuery from 'jquery';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

	@Output() clickEvent = new EventEmitter<string>();

	keys:any;
	mainmenus:any;
    main_page:any;
    page_slug:any;
	
	constructor(private splitPipe: SplitTextPipe, public locationStrategy: LocationStrategy, public location:Location) { }
	ngOnInit() {
		if(GLOBALS.menuList) {
			this.mainmenus = GLOBALS.menuList;
			this.keys = Object.keys(GLOBALS.menuList);
		}
		this.page_slug = GLOBALS.default_menu_item.slug;
	}
	
	clickOnPageItem(pageObj, mainMenuObj) {
        this.main_page = mainMenuObj;
        this.page_slug = pageObj.slug;
		
        pageObj.mainPage = this.splitPipe.transform(mainMenuObj);
        GLOBALS.page_title = pageObj.title;
        var current_path = this.getPath();
        var ext_url = this.locationStrategy.prepareExternalUrl("/"+pageObj.slug);
        if(current_path.indexOf("#/") == -1) {
        	this.location.go(current_path + ext_url);
        } else {
        	var path_str = current_path.slice(0, current_path.indexOf('#/'));
        	current_path = path_str;
        	this.location.go(current_path+ext_url);
        }
		this.clickEvent.emit(pageObj);
	}

	getPath() {
		return this.location.path();
	}

}
