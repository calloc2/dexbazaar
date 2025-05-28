import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-redirect',
  templateUrl: './profile-redirect.component.html',
  styleUrls: ['./profile-redirect.component.scss'],
  standalone: true,
})
export class ProfileRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    const username = localStorage.getItem('username');
    if (username) {
      this.router.navigate(['/profile', username]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
