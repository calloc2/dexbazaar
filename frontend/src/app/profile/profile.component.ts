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
  username = localStorage.getItem('username') || '';

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

  isOwner(product: any): boolean {
    return product.user?.username === this.username;
  }

  deleteProduct(product: any) {
    if (confirm('Tem certeza que deseja apagar este anúncio?')) {
      this.http.delete(`${environment.apiUrl}/api/products/${product.id}/`).subscribe({
        next: () => {
          this.products = this.products.filter((p: any) => p.id !== product.id);
        },
        error: () => {
          alert('Erro ao apagar anúncio.');
        }
      });
    }
  }

  isOwnerProfile(): boolean {
    return this.user?.username === this.username;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }
}
