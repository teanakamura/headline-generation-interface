import { Component } from '@angular/core';
import { MenuServiceService } from './services/menu-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  mobile = true;

  constructor(private data: MenuServiceService) { }

  ngOnInit(): void {
    this.data.checkDevice();
    this.data.currentDevice.subscribe(dev => this.mobile = dev == "mobile");
  }
}
