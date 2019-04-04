import { Component, ContentChild, EventEmitter, Input, Output, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
// import { PopupModule } from '@progress/kendo-angular-popup';
import { Group, exportImage } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';
import * as $ from 'jquery';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnDestroy {

    public show: boolean;
    public eventSubscribed: boolean;
    public dataItem: any;
    public offset: any;

    public documentClickSubscription: any;

    @Output()
    public menuSelect: EventEmitter<any> = new EventEmitter<any>();

    @Input() contextOptions;

    ngDoCheck(){
        if (this.contextOptions.container != undefined && this.eventSubscribed != undefined && !this.eventSubscribed) {
            this.eventSubscribed = true;
            this.unsubscribe();
            $( this.contextOptions.container ).contextmenu((event) => {
                this.onPlotAreaClick(event);
            });
        }
    }

    constructor(private renderer: Renderer2) {
        this.eventSubscribed = false;
        this.onPlotAreaClick = this.onPlotAreaClick.bind(this);
        this.documentClickSubscription = this.renderer.listen('document', 'click', () => {
            this.show = false;
        });
    }

    public ngOnDestroy(): void {
        this.unsubscribe();
        this.documentClickSubscription();
    }

    public menuItemSelected(event: any): void {
        var item = event.item;
        if (item.functionScope == 'self'){
            this[item.logicFunctionName](item);
        } else {
            this.menuSelect.emit({ item: item });
        }
    }

    public fnChartExportAsImage(options: any): void {
        var fileName = (options.exportImageName != undefined) ? options.exportImageName : "chart_export";
        fileName += ".png";

        console.log(fileName);
        console.log(this.contextOptions);
        
        if (this.contextOptions.containerObj != undefined) {
            this.contextOptions.containerObj.exportImage().then((dataURI) => {
                saveAs(dataURI, fileName);
            });
        }
    }

    public onPlotAreaClick({ originalEvent }): void {
        if (originalEvent != undefined && originalEvent.type === 'contextmenu') {
            originalEvent.preventDefault();
            this.show = true;
            this.offset = { 'left': originalEvent.pageX, 'top': originalEvent.pageY };
        }
    }

    public unsubscribe(): void {
        $( this.contextOptions.container ).unbind( "contextmenu" );
    }
}
