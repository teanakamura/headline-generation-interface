import { Component, OnInit} from '@angular/core';
import { MenuServiceService } from '../services/menu-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isCollapsed = false;
  menuTab;

  constructor(private data: MenuServiceService) { }

  ngOnInit() {
    this.data.currentMenuTab.subscribe(tab => this.menuTab = tab);
  }

  setMenu(selection){
    this.data.changeTab(selection);
  }
}
