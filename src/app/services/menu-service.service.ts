import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  private tabSource = new BehaviorSubject<string>("demo");
  public currentMenuTab = this.tabSource.asObservable();

  constructor() { }

  changeTab(tab: string){
    this.tabSource.next(tab);
  }
}
