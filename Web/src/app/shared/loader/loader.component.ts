import { Component, OnInit } from '@angular/core';
import { LoaderService } from "./loader.service";

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent implements OnInit {
  constructor(private service: LoaderService) {
  }

  get isHidden():boolean {
    return this.service.isHidden;
  }

  hide(): void {
    this.service.hide();
  }

  show(): void {
    this.service.show();
  }

  ngOnInit() {
  }
}
