import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, catchError } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SummaryApiService } from '../../services/summary-api.service';
import { ToastService } from '../../services/toast.service';

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
  work: {time: number, src: string, summary: string, postEdit?: string, keywords: string[]}[] = [];

  constructor(
    private summaryApiService: SummaryApiService,
    private http: HttpClient,
    private _toastService: ToastService
  ) {
    this.changed.pipe(
      debounceTime(700))
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
        model = 'jiji_keyword'
        this.summaryApiService.getSummary(this.text, model, this.length, this.keywords)
          .subscribe(
            data => {
              const summary: string = data['0']['hypos'][0]
              this.work.push({
                time: Date.now(),
                summary: summary,
                keywords: data['0']['keywords'],
                src: data['0']['src']
              });
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

  // onNumKey(event: any) {
  //   this.length = event.target.value;
  //   if (Math.sign(this.length) === 1) {
  //     this.changed.next();
  //   }
  // }

  // onKey(event: any) {
  //   this.text = event.target.value;
  //   this.changed.next();
  // }

  // receiveArticle(article: string) {
  //   this.text = article;
  //   this.changed.next();
  // }

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
    // let text = this.replacer(articleWithHTML);
    // text = this.htmlTagRemover(text);
    this.text = this.htmlTagRemover(articleWithHTML);
    this.changed.next();
  }

  receiveKeyword(keywords: string[]) {
    this.keywords = keywords;
    this.changed.next();
  }

  onClickComplete() {
    let loggerURL = '/api/logger/work';
    if (this.work.length) this.work[this.work.length - 1].postEdit = this.postEditHeadline;
    if (!this.postEditHeadline) {
      this._toastService.open('ERROR: 空の送信です', false);
      return;
    }
    this.http.post(loggerURL, this.work)
      // .pipe(
      //   catchError(err => {
      //     console.log(err);
      //     this._toastService.open('ERROR: サーバーエラー', false);
      //     return err;
      //   })
      // )
      .subscribe({
        next: res => {
          // this.generatedHeadline = '（ここに生成された見出しが表示されます）';
          // this.postEditHeadline = '';
          // this.text = '';
          // this.keywords = [];
          this._toastService.open('送信しました', true);
          // console.log(res.status);
        },
        error: err => {
          console.log(err);
          this._toastService.open('ERROR: 記録に失敗しました', false);
        }
      });
  }
}