import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, MenuController } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, RouterModule], 
})
export class HomePage implements OnInit, OnDestroy {
  products: any[] = [];
  ethRate: number = 0; // Cotação atual do Ethereum
  isAuthenticated = false;
  username = '';
  isLoading = false;

  banners = [
    { 
      image: 'assets/banners/banner1.png', 
      alt: 'Banner 1', 
      caption: 'Marketplace Descentralizado',
      subtitle: 'Compre e venda com segurança usando blockchain' 
    },
    { 
      image: 'assets/banners/banner2.png', 
      alt: 'Banner 2', 
      caption: 'Pagamento com Ethereum',
      subtitle: 'Transações rápidas e seguras na blockchain' 
    },
    { 
      image: 'assets/banners/banner3.png', 
      alt: 'Banner 3', 
      caption: 'Sem Taxas Ocultas',
      subtitle: 'Transparência total em todas as transações' 
    }
  ];
  currentBanner = 0;
  bannerInterval: any;
  currentYear = new Date().getFullYear();

  constructor(
    private productService: ProductService, 
    private http: HttpClient, 
    private menu: MenuController, 
    private router: Router,
    private loadingService: LoadingService
  ) {
    // Verifique se o token está no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      this.username = localStorage.getItem('username') || '';
    }
  }

  ngOnInit() {
    this.loadFeaturedProducts();
    this.fetchEthereumRate();
    this.startCarousel();
  }

  async loadFeaturedProducts() {
    try {
      this.isLoading = true;
      this.loadingService.show('Carregando produtos em destaque...');
      
      this.productService.getProducts().subscribe({
        next: (products: any) => {
          this.products = products;
          this.isLoading = false;
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          this.isLoading = false;
          this.loadingService.hide();
        }
      });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.isLoading = false;
      this.loadingService.hide();
    }
  }

  async fetchEthereumRate() {
    try {
      // Use a CoinGecko API para obter a cotação do Ethereum
      this.http
        .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl')
        .subscribe({
          next: (response: any) => {
            this.ethRate = response.ethereum.brl;
          },
          error: (error) => {
            console.error('Erro ao buscar cotação do Ethereum:', error);
            // Fallback para uma cotação padrão
            this.ethRate = 15000; // Valor aproximado em BRL
          }
        });
    } catch (error) {
      console.error('Erro ao buscar cotação do Ethereum:', error);
      this.ethRate = 15000; // Valor aproximado em BRL
    }
  }

  convertToEthereum(price: number): number {
    if (this.ethRate === 0) return 0;
    return price / this.ethRate;
  }

  getProfileLink(): string {
    return this.isAuthenticated ? `/profile/${this.username}` : '/login';
  }

  startCarousel() {
    this.bannerInterval = setInterval(() => {
      this.currentBanner = (this.currentBanner + 1) % this.banners.length;
    }, 5000); // Troca a cada 5 segundos
  }

  goToBanner(index: number) {
    this.currentBanner = index;
    // Reinicia o timer do carousel
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
      this.startCarousel();
    }
  }

  trackByProductId(index: number, product: any): any {
    return product.id;
  }

  onSearchChange(event: any) {
    const searchTerm = event.detail.value;
    if (searchTerm && searchTerm.trim() !== '') {
      // Implementar busca de produtos
      this.searchProducts(searchTerm);
    } else {
      this.loadFeaturedProducts();
    }
  }

  private searchProducts(searchTerm: string) {
    // Implementar busca de produtos
    console.log('Buscando por:', searchTerm);
    // TODO: Implementar serviço de busca
  }

  toggleFavorite(productId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Implementar funcionalidade de favoritos
    console.log('Toggle favorite for product:', productId);
    // TODO: Implementar serviço de favoritos
  }

  ngOnDestroy() {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }
}