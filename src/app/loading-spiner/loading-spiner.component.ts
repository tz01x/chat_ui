import { CommonModule } from '@angular/common';
import { Component, OnInit,Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-loading-spiner',
  templateUrl: './loading-spiner.component.html',
  styleUrls: ['./loading-spiner.component.scss']
})
export class LoadingSpinerComponent implements OnInit {
  @Input()diameter: string='100';
  @Input()isLoading: Observable<boolean> = of(true);
  constructor() { }

  ngOnInit(): void {
  }

}
