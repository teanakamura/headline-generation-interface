import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { SummaryApiService } from '../../services/summary-api.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss'],
  providers: [ SummaryApiService ]
})

export class GenerateComponent implements OnInit {
  generatedHeadline = '（ここに生成された見出しが表示されます）';
  postEditHeadline = '';
  public text = '';
  length = 30;
  selections = {};
  isLengthControl = new FormControl(false);
  isTruthful = new FormControl(false);
  keywords: string[] = [];
  changed: Subject<string> = new Subject<string>();

  constructor(
    private summaryApiService: SummaryApiService,
  ) {
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
        this.summaryApiService.getSummary(this.text, model, this.length)
          .subscribe(
            data => {
              const summary = data['0']['hypos'][0]
              this.generatedHeadline = summary;
              this.postEditHeadline = summary;
            }
          )
      });
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

  htmlTagRemover(html: string) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  }

  replacer(html: string) {
    // return html.replace(/<(\/?)span[^>]*?class="mark1"[^>]*?>/g, "@$1key@");
    return html.replace(/<span[^>]*?class="mark1"[^>]*?>(.+?)<\/span>/g, "@key@$1@@key@@");
  }

  receiveInput(articleWithHTML: string) {
    let text = this.replacer(articleWithHTML);
    text = this.htmlTagRemover(text);
    console.log(text);
    this.changed.next();
  }

  receiveKeyword(keywords: string[]) {
    this.keywords = keywords;
  }
}
