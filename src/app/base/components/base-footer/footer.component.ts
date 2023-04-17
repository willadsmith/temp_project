import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class BaseFooterComponent implements OnInit {
  test: Date = new Date();

  constructor() { }

  ngOnInit() {
  }

}
