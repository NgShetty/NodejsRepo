import { Component, OnInit } from '@angular/core';
import { Roles } from '../Users/_models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

   // Store a reference to the enum
   roles = Roles;
  constructor() { }

  ngOnInit() {
  }

}
