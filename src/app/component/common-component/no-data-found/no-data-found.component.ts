import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.scss']
})
export class NoDataFoundComponent implements OnInit {

  @Input() options;

  constructor() { }

  ngOnInit() {
  }

}
