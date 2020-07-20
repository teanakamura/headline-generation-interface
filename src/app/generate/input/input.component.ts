import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { partition } from 'lodash-es';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
  @ViewChild('inputHighlight', {static: false}) inp: ElementRef;
  parentText: string;
  @Input() set setParentText(val: string) {
    this.parentText = val;
    if (this.inp) this.inp.nativeElement.innerHTML = val;
  }
  @Output() inputEvent = new EventEmitter();
  @Output() keywordEvent = new EventEmitter();
  selections = {};
  ranges: Range[] = [];

  constructor(private ren: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
  }

  isApart(a: Range, b: Range) {
    return a.compareBoundaryPoints(Range.END_TO_START, b) >= 0  // the position of a.start >= b.end
      || a.compareBoundaryPoints(Range.START_TO_END, b) <= 0; // the position of a.end <= b.start
  }

  onSelect(sel: Selection) {
    // let sel = window.getSelection();
    // if (!sel.rangeCount) return;
    let range = sel.getRangeAt(0);
    let removedRanges: Range[];
    if (this.ranges.length) {
      // console.log(this.ranges.map(e => e.toString()));
      // console.log(range);
      [this.ranges, removedRanges] = partition(this.ranges, e => this.isApart(range, e));
      removedRanges.forEach((r) => {
        let newNode = document.createTextNode(r.toString());
        r.deleteContents();
        r.insertNode(newNode);
      });
    }
    if (range.toString()) {
      this.ranges.push(range);
      let newNode = this.ren.createElement('span');
      // this.ren.addClass(newNode, 'mark1');
      newNode.setAttribute('class', 'mark1');
      // newNode.innerHTML = sel.toString();
      range.surroundContents(newNode);
      range.deleteContents();
      range.insertNode(newNode);
    }
    this.inp.nativeElement.normalize();
    this.keywordEvent.emit(this.ranges.map(e => e.toString()));
  }

  deleteEmptyRanges() {
    if (this.ranges.length) {
      this.ranges = this.ranges.filter(e => e.toString());
      this.inp.nativeElement.normalize();
      this.keywordEvent.emit(this.ranges.map(e => e.toString()));
    }
  }

  removeEmptyRanges() {
    let removedRanges: Range[];
    if (this.ranges.length) {
      [this.ranges, removedRanges] = partition(this.ranges, e => e.toString());
      removedRanges.forEach((r) => r.deleteContents());
      this.inp.nativeElement.normalize();
    }
  }

  onKeyUp(event: any) {
    let sel = window.getSelection();
    if(sel.rangeCount && sel.getRangeAt(0).toString()) this.onSelect(sel);
    if(event.keyCode == 8) this.deleteEmptyRanges();
    this.inputEvent.emit(this.inp.nativeElement.innerHTML);
  }

  onMouseUp(event: any) {
    let sel = window.getSelection();
    if(sel.rangeCount) this.onSelect(sel);
    this.inputEvent.emit(this.inp.nativeElement.innerHTML);
  }
}
