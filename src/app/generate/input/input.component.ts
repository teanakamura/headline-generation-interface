import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { partition } from 'lodash-es';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
  @ViewChild('inputHighlight', {static: false}) inp: ElementRef;
  // parentText: string;
  // @Input() set setParentText(val: string) {
  //   this.parentText = val;
  //   if (this.inp) this.inp.nativeElement.innerHTML = val;
  // }
  @Output() inputEvent = new EventEmitter();
  @Output() keywordEvent = new EventEmitter();
  selections = {};
  ranges: Range[] = [];
  isSelectingByKey: Boolean = false;

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
    let apartRanges: Range[];
    let overlappingRanges: Range[];
    // console.log(range, this.ranges.length);
    if (this.ranges.length) {
      // console.log(this.ranges.map(e => e.toString()));
      [apartRanges, overlappingRanges] = partition(this.ranges, e => this.isApart(range, e));
      if (overlappingRanges.length) {
        if (range.collapsed) {
          this.ranges = apartRanges;
          overlappingRanges.forEach((r) => {
            let newNode = document.createTextNode(r.toString());
            r.deleteContents();
            r.insertNode(newNode);
          });
        } else {
          return;
        }
      }
    }
    if (range.toString()) {
      this.ranges.push(range);
      let newNode = this.ren.createElement('span');
      // this.ren.addClass(newNode, 'mark1');
      newNode.setAttribute('class', 'mark1');
      // newNode.innerHTML = sel.toString();
      range.surroundContents(newNode);  // |contents| -> <newNode>|contents|<newNode> ;  (||: range)
      // range.deleteContents();  // |contents| -> ||
      // range.insertNode(newNode);  // |contents| -> <newNode></newNode>|contents|
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
    // console.log('keyup');
    // console.log(event.keyCode, this.isSelectingByKey);
    if (event.shiftKey && event.keyCode <= 40 && event.keyCode >= 37) {  // shift + arrows
      this.isSelectingByKey = true;
    } else {
      if (this.isSelectingByKey && event.keyCode == 16) {  // selecting & shift
        let sel = window.getSelection();
        // console.log(sel, sel.rangeCount, sel.getRangeAt(0));
        if (sel.rangeCount && sel.getRangeAt(0).toString()) this.onSelect(sel);
      } else if (event.keyCode == 8) {  // backspace
        this.deleteEmptyRanges();
      }
      this.isSelectingByKey = false;
    }
    // this.inputEvent.emit(this.inp.nativeElement.innerHTML);
  }

  onMouseUp(event: any) {
    let sel = window.getSelection();
    if(sel.rangeCount) this.onSelect(sel);
    this.inputEvent.emit(this.inp.nativeElement.innerHTML);
  }

  onPaste(event: any) {
    // console.log('paste');
    console.log(window.getSelection());
    event.preventDefault();
    // let paste = (event.clipboardData || window.clipboardData).getData('text');
    let paste = event.clipboardData.getData('text');
    const selection = window.getSelection();
    // console.log(paste);
    // this.inp.nativeElement.innerHTML = paste;
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
    this.inputEvent.emit(paste);
  }
}
