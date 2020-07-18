import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { partition } from 'lodash-es';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit {
  @ViewChild('inputHighlight', {static: false}) inp: ElementRef;
  selections = {};
  ranges: Range[] = [];

  constructor(private ren: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
  }

  onSelect(event: any) {
    let selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
    console.log(selection);
    selection in this.selections
      ? this.selections[selection].push([event.target.selectionStart, event.target.selectionEnd])
      : this.selections[selection] = [[event.target.selectionStart, event.target.selectionEnd]];
    console.log(this.selections);
    console.log('on select in input-highlight');
    console.log(window.getSelection().toString());
    document.execCommand("underline");
  }

  isApart(a: Range, b: Range) {
    return a.compareBoundaryPoints(Range.END_TO_START, b) >= 0  // the position of a.start >= b.end
      || a.compareBoundaryPoints(Range.START_TO_END, b) <= 0; // the position of a.end <= b.start
  }

  onDivSelect() {
    console.log('onDivSelect');
    let sel = window.getSelection();
    if (!sel.rangeCount) return;
    let range = sel.getRangeAt(0);
    let removedRanges: Range[];
    if (this.ranges.length) {
      console.log(this.ranges.map(e => e.toString()));
      [this.ranges, removedRanges] = partition(this.ranges, e => this.isApart(range, e));
      removedRanges.forEach((r) => {
        let newNode = document.createTextNode(r.toString());
        console.log(r.toString());
        r.deleteContents();
        r.insertNode(newNode);
      });
    }
    if (range.toString()) {
      this.ranges.push(range);
      let newNode = this.ren.createElement('span');
      // this.ren.addClass(newNode, 'mark1');
      newNode.setAttribute('class', 'mark1');
      newNode.innerHTML = sel.toString();
      console.log(range.toString(), sel.toString());
      range.deleteContents();
      range.insertNode(newNode);
      // setTimeout(range.insertNode.bind(range), 1000, newNode);
    }
    this.inp.nativeElement.normalize();
    // console.log(sel.toString());
    // console.log(range);
    // console.log(range.collapsed);
    // console.log(range.commonAncestorContainer.className);
    // console.log(this.inp.nativeElement.innerHTML);
    // console.log(this.ranges)
  }
}
