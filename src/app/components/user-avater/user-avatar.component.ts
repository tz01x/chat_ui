import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvaterComponent implements OnInit {
  @Input() displayName!: string;
  @Input() photoURL!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
