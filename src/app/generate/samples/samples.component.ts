import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ARTICLES } from './articles';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss']
})

export class SamplesComponent {
  articles = ARTICLES;
  selectedArticle = new FormControl('');
  @Output() event = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.selectedArticle.valueChanges
    .subscribe(v => {
      this.event.emit(v);
    });
  }
}
