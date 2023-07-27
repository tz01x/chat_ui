import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-user-avatar',
  imports: [NgStyle],
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvaterComponent implements OnInit {
  @Input() displayName!: string;
  @Input() photoURL!: string;
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal'
  @Input() imageWidth: number = 40;

  constructor() { }

  ngOnInit(): void {
  }

}
