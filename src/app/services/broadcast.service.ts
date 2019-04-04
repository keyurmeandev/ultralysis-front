import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class BroadcastService {
	
	rebuildPageId:any;
    freePageId:any;

    @Output() rebuildPageEmit: EventEmitter<boolean> = new EventEmitter();
    @Output() freePageEmit: EventEmitter<boolean> = new EventEmitter();
  	constructor() { }

  	updatePageSwitched(rebuildPageId, freePageId) {
        if (rebuildPageId != undefined) {
            this.rebuildPageId = rebuildPageId;
            this.rebuildPageEmit.emit(this.rebuildPageId);
        }

        if (freePageId != undefined) {
            this.freePageId = freePageId;
            this.freePageEmit.emit(this.freePageId);
        }
    }

}
