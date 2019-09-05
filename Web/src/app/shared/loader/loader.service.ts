import { Injectable } from '@angular/core';

@Injectable()
export class LoaderService {
  isHidden: boolean = true;
  constructor() {
    //
  }

  hide() {
    this.isHidden = true;
  }

  show() {
    this.isHidden = false;
  }
}
