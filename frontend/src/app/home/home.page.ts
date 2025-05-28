import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, RouterModule], 
})
export class HomePage implements OnInit {
  products: any[] = [];
  ethRate: number = 0; // Cotação atual do Ethereum
  isAuthenticated = false;
  username = '';

  constructor(private productService: ProductService, private http: HttpClient, private menu: MenuController, private router: Router) {
    // Exemplo: verifique se o token está no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      // Pegue o username do localStorage ou de um serviço de autenticação
      this.username = localStorage.getItem('username') || '';
    }
  }

  ngOnInit() {
    this.loadFeaturedProducts();
    this.fetchEthereumRate();
  }

  loadFeaturedProducts() {
    this.productService.getProducts().subscribe((products: any) => {
      this.products = products;
    });
  }

  fetchEthereumRate() {
    // Use a CoinGecko API para obter a cotação do Ethereum
    this.http
      .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl')
      .subscribe((response: any) => {
        this.ethRate = response.ethereum.brl; // Cotação do Ethereum em BRL
      });
  }

  convertToEthereum(price: number): number {
    // Converte o preço para Ethereum
    return price / this.ethRate;
  }

  getProfileLink() {
    return this.isAuthenticated ? `/profile/${this.username}` : '/login';
  }
}