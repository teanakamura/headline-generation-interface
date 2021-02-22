import { Component, OnInit } from '@angular/core';
import { MenuServiceService } from '../../services/menu-service.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {
  menuTab = 'home';
  constructor(private data: MenuServiceService) { }

  ngOnInit() {
    this.data.currentMenuTab.subscribe(tab => this.menuTab = tab);
  }

  receiveMessage($event) {
    this.menuTab = $event;
  }

}
