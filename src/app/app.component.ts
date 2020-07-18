import { Component } from '@angular/core';
import { MenuServiceService } from './menu-service.service';
import { DOCUMENTS } from './documents';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  menuTab: string;
  mobile = false;
  documents = DOCUMENTS;

    constructor(private data: MenuServiceService) { }

    ngOnInit() {
      this.data.currentMenuTab.subscribe(tab => this.menuTab = tab);
      if (window.screen.width < 768) {
        this.mobile = true;
      }
    }

    receiveMessage($event) {
      this.menuTab = $event;
    }
}
