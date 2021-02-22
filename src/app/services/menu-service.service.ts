import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  private tabSource = new BehaviorSubject<string>("demo");
  public currentMenuTab = this.tabSource.asObservable();
  private device = new BehaviorSubject<string>("immobile");
  public currentDevice = this.device.asObservable();

  constructor() { }

  changeTab(tab: string){
    this.tabSource.next(tab);
  }

  checkDevice() {
    if (window.screen.width < 768) {
      this.device.next('mobile');
    }
  }
}
