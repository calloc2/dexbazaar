import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, FormsModule],
})
export class ListProductsPage implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  selectedFilter: string = 'all';
  isLoading: boolean = false;
  ethRate: number = 15000; // Fallback rate

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.fetchEthereumRate();
  }

  async loadProducts() {
    this.isLoading = true;
    try {
      this.productService.getProducts().subscribe({
        next: (data: any) => {
          this.products = data;
          this.filteredProducts = [...this.products];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar produtos:', error);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      this.isLoading = false;
    }
  }

  fetchEthereumRate() {
    this.http
      .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=brl')
      .subscribe({
        next: (response: any) => {
          this.ethRate = response.ethereum.brl;
        },
        error: (error) => {
          console.error('Erro ao buscar cotação do Ethereum:', error);
          // Keep fallback rate
        }
      });
  }

  filterProducts() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchTerm && this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(product => {
        switch (this.selectedFilter) {
          case 'active':
            return product.status === 'active' || !product.status;
          case 'pending':
            return product.status === 'pending';
          case 'sold':
            return product.status === 'sold';
          default:
            return true;
        }
      });
    }

    this.filteredProducts = filtered;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.filteredProducts = [...this.products];
  }

  trackByProductId(index: number, product: any): any {
    return product.id;
  }

  convertToEthereum(price: number): number {
    if (this.ethRate === 0) return 0;
    return price / this.ethRate;
  }

  // Stats methods
  getActiveProducts(): number {
    return this.products.filter(p => p.status === 'active' || !p.status).length;
  }

  getPendingProducts(): number {
    return this.products.filter(p => p.status === 'pending').length;
  }

  getSoldProducts(): number {
    return this.products.filter(p => p.status === 'sold').length;
  }

  getTotalValue(): number {
    return this.products.reduce((total, product) => total + (product.price || 0), 0);
  }

  // Status methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'active';
      case 'pending':
        return 'pending';
      case 'sold':
        return 'sold';
      default:
        return 'active'; // Default to active
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'sold':
        return 'Vendido';
      default:
        return 'Ativo';
    }
  }

  // Navigation methods
  viewProduct(productId: string) {
    this.router.navigate(['/product', productId]);
  }

  editProduct(productId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/edit-product', productId]);
  }

  async deleteProduct(productId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // TODO: Implement confirmation dialog
    const confirmed = confirm('Tem certeza que deseja excluir este produto?');
    
    if (confirmed) {
      try {
        // TODO: Implement delete API call
        console.log('Deleting product:', productId);
        // After successful deletion, reload products
        this.loadProducts();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  }
}