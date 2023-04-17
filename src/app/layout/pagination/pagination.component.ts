import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {PaginationConfig} from './uib-pagination.config';

@Component({
  selector: 'app-pagination-template',
  templateUrl: './pagination.component.html',
  styleUrls: ['pagination.scss']
})
export class PaginationComponent implements OnInit {
  @Input() page: number;
  @Input() totalItems: number;
  @Input() itemsPerPage: number;

  @Output() onPageChanged = new EventEmitter<any>();

  constructor(private paginationConfig: PaginationConfig) {}

  ngOnInit() {
    console.log('PaginationComponent inited!');
  }

  pageChanged(event: any): void {
    this.onPageChanged.emit(event);
  }

  getCountFrom() {
    return (this.page - 1) * this.itemsPerPage === 0 ? 1 : (this.page - 1) * this.itemsPerPage + 1;
  }

  getCountTo() {
    return this.page * this.itemsPerPage < this.totalItems ? this.page * this.itemsPerPage : this.totalItems;
  }
}
