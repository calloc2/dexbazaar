import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-redirect',
  template: '',
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
