import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-multi-text',
  templateUrl: './multi-text.component.html',
  styleUrls: ['./multi-text.component.css']
})
export class MultiTextComponent implements OnInit {

  @Input() label: string;
  @Input() elements: string[];
  @Input() max: number;

  constructor() { }

  ngOnInit(): void {
  }

  canAddElement() {
    return this.max? this.elements.length < this.max : true;
  }

  addElement() {
    if (this.elements[this.elements.length - 1].length > 0) {
      if (!this.max) {
        this.elements.push("");
      }
      if (this.max && this.elements.length < this.max) {
        this.elements.push("");
      }
    }
  }

  removeElement(index: number) {
    this.elements.splice(index, 1);
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

}
