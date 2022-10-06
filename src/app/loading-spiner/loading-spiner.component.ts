import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-loading-spiner',
  templateUrl: './loading-spiner.component.html',
  styleUrls: ['./loading-spiner.component.scss']
})
export class LoadingSpinerComponent implements OnInit {
  @Input()diameter: string='100';
  @Input()isLoading: boolean=true;
  constructor() { }

  ngOnInit(): void {
  }

}
