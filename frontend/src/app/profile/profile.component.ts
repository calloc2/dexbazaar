import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, IonicModule, HttpClientModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  products: any[] = [];
  username: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username') || '';
      this.loadProfile();
      this.loadUserProducts();
    });
  }

  loadProfile() {
    this.http
      .get(`${environment.apiUrl}/api/users/${this.username}/`)
      .subscribe((data: any) => {
        this.user = data;
      });
  }

  loadUserProducts() {
    this.http
      .get(`${environment.apiUrl}/api/products/?user=${this.username}`)
      .subscribe((data: any) => {
        this.products = data;
      });
  }
}
