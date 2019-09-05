import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightQuery } from '../directives/HighlightQuery';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    HighlightQuery
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  exports: [
    HighlightQuery,
    NgxDatatableModule
  ]
})
export class GridModule { }
