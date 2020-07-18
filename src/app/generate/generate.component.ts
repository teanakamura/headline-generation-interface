import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})

export class GenerateComponent implements OnInit {
  private URL = 'https://api.okazakilab.org/';
  generatedHeadline = '（ここに生成された見出しが表示されます）';
  text = '';
  length = 30;
  selections = {};
  isLengthControl = new FormControl(false);
  isTruthful = new FormControl(false);

  private httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + environment.apiKey})
  };

  changed: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
    this.changed.pipe(
      debounceTime(500))
      .subscribe(() => {
        if (this.text === '') {
          return;
        }
        this.generatedHeadline = '生成中……';
        let model = 'basic';
        if (this.isLengthControl.value) {
          if (this.isTruthful.value) {
            model = 'both';
          } else {
            model = 'length_control';
          }
        } else if (this.isTruthful.value) {
          model = 'truthful';
        }
        const body: object = {src: [this.text], model, length: this.length};
        this.http.post(this.URL + 'generate', body, this.httpOptions)
          .subscribe(
          (data) => { this.generatedHeadline = data['0']['hypos'][0]; },
          error => console.log(error)
      ); });
  }

  ngOnInit() {
    this.isLengthControl.valueChanges
    .subscribe(this.changed);
    this.isTruthful.valueChanges
    .subscribe(this.changed);
  }

  onNumKey(event: any) {
    this.length = event.target.value;
    if (Math.sign(this.length) === 1) {
      this.changed.next();
    }
  }

  onKey(event: any) {
    this.text = event.target.value;
    this.changed.next();
  }

  receiveArticle(article: string) {
    this.text = article;
    this.changed.next();
  }

  onSelect(event: any) {
    let selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
    selection in this.selections
      ? this.selections[selection].push([event.target.selectionStart, event.target.selectionEnd])
      : this.selections[selection] = [[event.target.selectionStart, event.target.selectionEnd]];
    console.log(this.selections);
    console.log('on select');
    console.log(window.getSelection().toString());
    document.execCommand("underline");
  }

}