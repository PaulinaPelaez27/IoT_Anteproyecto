import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users-view',
  imports: [CommonModule],
  templateUrl: './users-view.html',
  styleUrl: './users-view.css',
})
export class UsersView {
  constructor(public userService: UserService) {}
}
