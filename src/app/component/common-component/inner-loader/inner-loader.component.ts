import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'inner-loader',
  templateUrl: './inner-loader.component.html',
  styleUrls: ['./inner-loader.component.scss']
})
export class InnerLoaderComponent implements OnInit {

  @Input() options;

  //showInnerLoader:any;
  
  constructor() { }

  ngOnInit() {}

  /*ngDoCheck() {
    if(this.options.showInnerLoader != undefined) {
    	if(this.options.showInnerLoader)
        this.showInnerLoader = false;

    }
  }*/

}
