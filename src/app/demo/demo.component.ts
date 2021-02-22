import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuServiceService } from '../services/menu-service.service';
import { DOCUMENTS } from './documents';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  menuTab: string;
  mobile = true;
  documents = DOCUMENTS;

  constructor(private data: MenuServiceService) { }

  ngOnInit() {
    this.data.currentMenuTab.subscribe(tab => this.menuTab = tab);
    this.data.currentDevice.subscribe(dev => this.mobile = dev == "mobile");
  }

  receiveMessage($event) {
    this.menuTab = $event;
  }
}
