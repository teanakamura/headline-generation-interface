import { Component, OnInit } from '@angular/core';
import { DOCUMENTS } from '../documents';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: ['./mobile-nav.component.scss']
})
export class MobileNavComponent implements OnInit {
  documents = DOCUMENTS;

  constructor() { }

  ngOnInit() {
  }

}
