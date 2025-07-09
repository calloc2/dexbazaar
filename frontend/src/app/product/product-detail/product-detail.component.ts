import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
import { RouterModule, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, RouterModule],
})
export class ProductDetailComponent implements OnInit {
  product: any;
  loading = true;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiUrl}/api/products/${id}/`).subscribe({
      next: (data: any) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        // If API fails, try to load from placeholder data
        this.loadPlaceholderProduct(id);
      }
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>(`${environment.apiUrl}/api/users/me/`, {
        headers: { Authorization: `Token ${token}` }
      }).subscribe({
        next: (data) => {
          this.username = data.username;
        },
        error: () => {
          console.log('Unable to fetch user data');
        }
      });
    }
  }

  private loadPlaceholderProduct(id: string | null) {
    // Fallback to placeholder data when API is unavailable
    const placeholderProducts = [
      {
        id: '1',
        title: 'iPhone 13 Pro Max',
        description: 'Smartphone Apple 256GB, estado de novo, sem riscos. Acompanha carregador original, caixa e todos os acessórios. Bateria com 95% de capacidade. Sempre usado com película e capinha.',
        category: 'eletronicos',
        categoryName: 'Eletrônicos',
        price: 3000,
        city: 'São Paulo',
        state: 'SP',
        created_at: '2024-12-15T10:30:00Z',
        status: 'active',
        views: 245,
        user: { 
          username: 'techseller',
          email: 'techseller@example.com',
          profile_image: 'https://randomuser.me/api/portraits/men/32.jpg',
          reputation: 4.8,
          total_sales: 47
        },
        images: [
          { image: 'https://www.apple.com/newsroom/images/product/iphone/geo/Apple_iPhone-13-Pro_iPhone-13-Pro-Max_GEO_09142021_inline.jpg.large.jpg' },
          { image: 'https://images.unsplash.com/photo-1592286000411-a8f8c0b0eadd?w=800&h=600&fit=crop' }
        ],
        specifications: {
          'Armazenamento': '256GB',
          'Cor': 'Azul Sierra',
          'Estado': 'Seminovo',
          'Garantia': '6 meses',
          'Bateria': '95%'
        },
        shipping: {
          free: true,
          methods: ['Sedex', 'PAC', 'Retirada local'],
          estimated_days: '2-5 dias úteis'
        }
      },
      {
        id: '2',
        title: 'Camiseta Nike Dri-FIT',
        description: 'Camiseta esportiva Nike original, tamanho M, cor azul royal. Tecnologia Dri-FIT para absorção do suor. Perfeita para corrida, academia e atividades esportivas. Tecido respirável e confortável.',
        category: 'roupas',
        categoryName: 'Roupas & Acessórios',
        price: 150,
        city: 'Rio de Janeiro',
        state: 'RJ',
        created_at: '2024-12-14T15:20:00Z',
        status: 'active',
        views: 89,
        user: { 
          username: 'sportsfan',
          email: 'sportsfan@example.com',
          profile_image: 'https://randomuser.me/api/portraits/women/45.jpg',
          reputation: 4.6,
          total_sales: 23
        },
        images: [
          { image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop' }
        ],
        specifications: {
          'Tamanho': 'M',
          'Cor': 'Azul Royal',
          'Material': '100% Poliéster',
          'Estado': 'Novo',
          'Tecnologia': 'Dri-FIT'
        },
        shipping: {
          free: false,
          cost: 15,
          methods: ['Correios', 'Retirada local'],
          estimated_days: '3-7 dias úteis'
        }
      },
      {
        id: '3',
        title: 'JavaScript: O Guia Definitivo',
        description: 'Livro completo sobre JavaScript, 7ª edição por David Flanagan. Ótimo estado de conservação, sem rasuras ou anotações. Ideal para programadores iniciantes e avançados. Capa dura, 1096 páginas.',
        category: 'livros',
        categoryName: 'Livros & Educação',
        price: 80,
        city: 'Belo Horizonte',
        state: 'MG',
        created_at: '2024-12-13T09:45:00Z',
        status: 'active',
        views: 156,
        user: { 
          username: 'devbooks',
          email: 'devbooks@example.com',
          profile_image: 'https://randomuser.me/api/portraits/men/28.jpg',
          reputation: 4.9,
          total_sales: 78
        },
        images: [
          { image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop' }
        ],
        specifications: {
          'Autor': 'David Flanagan',
          'Editora': 'O\'Reilly Media',
          'Edição': '7ª',
          'Páginas': '1096',
          'Estado': 'Usado - Muito Bom',
          'Idioma': 'Português'
        },
        shipping: {
          free: true,
          methods: ['Sedex', 'PAC'],
          estimated_days: '5-10 dias úteis'
        }
      }
    ];

    const foundProduct = placeholderProducts.find(p => p.id === id);
    if (foundProduct) {
      this.product = foundProduct;
    } else {
      // Default fallback product if ID not found
      this.product = placeholderProducts[0];
    }
    this.loading = false;
    console.log('Loaded placeholder product:', this.product);
  }

  isOwner(): boolean {
    return this.product?.user?.username === this.username;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  goToPurchase() {
    if (!this.product) return;
    this.router.navigate(['/purchase', this.product.id]);
  }

  async deleteProduct() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
    message: 'Tem certeza que deseja apagar este anúncio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          handler: () => {
            const token = localStorage.getItem('token');
            this.http.delete(`${environment.apiUrl}/api/products/${this.product.id}/`, {
              headers: { Authorization: `Token ${token}` }
            }).subscribe({
              next: () => {
                this.router.navigate(['/profile', this.username]);
              },
              error: async () => {
                const errorAlert = await this.alertController.create({
                  header: 'Erro',
                  message: 'Erro ao apagar anúncio.',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
