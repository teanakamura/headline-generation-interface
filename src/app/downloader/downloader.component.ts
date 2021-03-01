import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-downloader',
  templateUrl: './downloader.component.html',
  styleUrls: ['./downloader.component.css']
})
export class DownloaderComponent implements OnInit {
  dates: string[] = [];
  selectedDate: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    let loggerURL = '/api/logger/works';
    this.http.get(loggerURL)
      .subscribe({
        next: res => {
          if (res instanceof Array) this.dates = res.map(e => e.split('.')[1]);
        }
      })
  }

  dateFormat = (dateStr: string): string => dateStr.replace(/(.{4})(.{2})(.{2})/, '$1/$2/$3');

  private changeLogFormat(logArray: any): any {
    const csvKeys = ['src', 'keywords', 'summary', 'postEdit'];
    let ret = logArray.map(entry =>
      csvKeys.map(key => {
        let data = entry[key];
        if (key == 'keywords') {
          data = data.join(',');
        } else if (key == 'src') {
          data = data.replace(/<@>(.*?)<\/@>/g, '$1');
        }
        return data;
      })
    )
    ret.unshift(csvKeys);
    return ret;
  }

  onClickDownload() {
    let params = { date: this.selectedDate };
    let loggerURL = '/api/logger/work';
    if (params) loggerURL += '?' + Object.entries(params).map(e => `${e[0]}=${e[1]}`).join('&');
    const csvFormat = (col => `"${col}"`);  // Blobを作る際に区切り文字として使用されている,や\nをエスケープ処理するために必要？
    this.http.get(loggerURL)
      .subscribe({
        next: res => {
          let logArray = this.changeLogFormat(res);
          let csvData = logArray.map(row => row.map(csvFormat).join(',')).join('\r\n');
          const writeData = new Blob([csvData], { type: 'text/csv' });
          saveAs(writeData, `log-${this.selectedDate}.csv`);
        },
        error: err => {
          console.error(err);
        }
      })
  }
}
