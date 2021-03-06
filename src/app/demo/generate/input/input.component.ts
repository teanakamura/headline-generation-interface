import { Component, OnInit, Renderer2, ElementRef, ViewChild, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
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
  @Input() childModel: string;
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

    if (this.ranges.length) {
      [apartRanges, overlappingRanges] = partition(this.ranges, e => this.isApart(range, e));
    } else {
      overlappingRanges = [];
    }

    if (overlappingRanges.length) {
      if (range.collapsed) {  // delete range
        this.ranges = apartRanges;
        overlappingRanges.forEach((r) => {
          let newNode = document.createTextNode(r.toString());
          r.deleteContents();
          r.insertNode(newNode);
        });
      } else {  // do nothing
        return;
      }
    } else {
      if (range.toString()) {  // add range
        this.ranges.push(range);
        let newNode = this.ren.createElement('span');
        // this.ren.addClass(newNode, 'mark1');
        newNode.setAttribute('class', 'mark1');
        // newNode.innerHTML = sel.toString();
        range.surroundContents(newNode);  // |contents| -> <newNode>|contents|<newNode> ;  (||: range)
        // range.deleteContents();  // |contents| -> ||
        // range.insertNode(newNode);  // |contents| -> <newNode></newNode>|contents|
      } else {  // do nothing
        return;
      }
    }

    if (this.ranges.length) {
      this.ranges = this.ranges.filter(e => e.toString());
    }
    this.inp.nativeElement.normalize();
    this.keywordEvent.emit(this.ranges.map(e => e.toString()));
  }

  deleteEmptyRanges() {
    if (this.ranges.length) {
      const selection = window.getSelection();
      selection.getRangeAt(0).insertNode(document.createTextNode(''));
      this.ranges = this.ranges.filter(e => e.toString());
      this.inp.nativeElement.normalize();
      this.keywordEvent.emit(this.ranges.map(e => e.toString()));
    }
  }

  removeEmptyRanges() {
    let removedRanges: Range[];
    if (this.ranges.length) {
      const selection = window.getSelection();
      selection.getRangeAt(0).insertNode(document.createTextNode(''));
      [this.ranges, removedRanges] = partition(this.ranges, e => e.toString());
      removedRanges.forEach((r) => r.deleteContents());
      this.inp.nativeElement.normalize();
      this.keywordEvent.emit(this.ranges.map(e => e.toString()));
    }
  }

  onKeyUp(event: any) {
    if (event.shiftKey && event.keyCode <= 40 && event.keyCode >= 37) {  // shift + arrows
      this.isSelectingByKey = true;
    } else {
      if (this.isSelectingByKey && event.keyCode == 16) {  // selecting & shift
        let sel = window.getSelection();
        if (sel.rangeCount && sel.getRangeAt(0).toString()) this.onSelect(sel);
      }
      this.isSelectingByKey = false;
    }
    // this.inputEvent.emit(this.inp.nativeElement.innerText);
  }

  onMouseUp(event: any) {
    let sel = window.getSelection();
    if(sel.rangeCount) this.onSelect(sel);
    // this.inputEvent.emit(this.inp.nativeElement.innerText);
  }

  onPaste(event: any) {
    event.preventDefault();
    // let paste = (event.clipboardData || window.clipboardData).getData('text');
    let paste = event.clipboardData.getData('text');
    const selection = window.getSelection();
    // this.inp.nativeElement.innerHTML = paste;
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(paste));
    this.inputEvent.emit(this.inp.nativeElement.innerText);
  }

  onInput(event: any) {
    // this.removeEmptyRanges();
    this.deleteEmptyRanges();
    this.inputEvent.emit(this.inp.nativeElement.innerText);
  }

  ngOnChanges(changes: {[property: string]: SimpleChange}) {
    if (this.inp && !changes['childModel'].currentValue) this.inp.nativeElement.innerHTML = null;
  }
}
