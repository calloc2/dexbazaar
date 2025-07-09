import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButton, 
  IonIcon, 
  IonSearchbar, 
  IonChip, 
  IonLabel, 
  IonItem, 
  IonFooter, 
  IonMenu, 
  IonMenuButton,
  MenuController 
} from '@ionic/angular/standalone';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { LoadingService } from '../services/loading.service';
import { environment } from '../../environments/environment';
import { addIcons } from 'ionicons';
import { 
  gridOutline, 
  phonePortraitOutline, 
  shirtOutline, 
  homeOutline, 
  fitnessOutline, 
  bookOutline, 
  gameControllerOutline,
  watchOutline,
  flowerOutline,
  carOutline,
  bedOutline,
  pricetagOutline,
  appsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonItem,
    IonFooter,
    IonMenu,
    IonMenuButton
  ], 
})
export class HomePage implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  ethRate: number = 0; // Cotação atual do Ethereum
  isAuthenticated = false;
  username = '';
  isLoading = false;
  currentBanner = 0;
  bannerInterval: any;

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
  currentYear = new Date().getFullYear();

  constructor(
    private productService: ProductService, 
    private http: HttpClient, 
    private menu: MenuController, 
    private router: Router,
    private loadingService: LoadingService
  ) {
    // Registrar ícones
    addIcons({
      'grid-outline': gridOutline,
      'phone-portrait-outline': phonePortraitOutline,
      'shirt-outline': shirtOutline,
      'home-outline': homeOutline,
      'fitness-outline': fitnessOutline,
      'book-outline': bookOutline,
      'game-controller-outline': gameControllerOutline,
      'watch-outline': watchOutline,
      'flower-outline': flowerOutline,
      'car-outline': carOutline,
      'bed-outline': bedOutline,
      'pricetag-outline': pricetagOutline,
      'apps-outline': appsOutline
    });

    // Verifique se o token está no localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      this.username = localStorage.getItem('username') || '';
    }
  }

  ngOnInit() {
    this.initializeMenu();
    this.loadFeaturedProducts();
    this.loadCategories();
    this.fetchEthereumRate();
    this.startCarousel();
    
    // Adicionar produtos de teste após um pequeno delay
    setTimeout(() => {
      this.addTestProductsIfNeeded();
    }, 2000);
  }

  async loadFeaturedProducts() {
    try {
      this.isLoading = true;
      this.loadingService.show('Carregando produtos em destaque...');
      
      this.productService.getProducts().subscribe({
        next: (products: any) => {
          this.products = products;
          this.filteredProducts = products;
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
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  onCategoryChange(categoryId: string) {
    console.log('Categoria selecionada:', categoryId);
    console.log('Produtos disponíveis:', this.products);
    this.selectedCategory = categoryId;
    this.applyFilters();
  }

  // Método para testar se o click está funcionando
  testCategoryClick(categoryId: string) {
    console.log('TESTE: Category clicked:', categoryId);
    console.log('Produtos antes:', this.products.length);
    console.log('Categoria atual:', this.selectedCategory);
    
    this.selectedCategory = categoryId;
    console.log('Nova categoria:', this.selectedCategory);
    
    // Chamar o método de filtro real
    this.onCategoryChange(categoryId);
  }

  // Initialize menu for deployment compatibility
  async initializeMenu() {
    try {
      await this.menu.enable(true, 'main-menu');
      console.log('Menu initialized and enabled');
    } catch (error) {
      console.error('Error initializing menu:', error);
    }
  }

  // Manual menu control methods
  async openMenu() {
    try {
      await this.menu.open('main-menu');
      console.log('Menu opened manually');
    } catch (error) {
      console.error('Error opening menu:', error);
    }
  }

  async closeMenu() {
    try {
      await this.menu.close('main-menu');
      console.log('Menu closed manually');
    } catch (error) {
      console.error('Error closing menu:', error);
    }
  }

  async toggleMenu() {
    try {
      const isOpen = await this.menu.isOpen('main-menu');
      if (isOpen) {
        await this.closeMenu();
      } else {
        await this.openMenu();
      }
    } catch (error) {
      console.error('Error toggling menu:', error);
    }
  }

  // Test menu functionality
  async testMenu() {
    console.log('Testing menu functionality...');
    try {
      const isOpen = await this.menu.isOpen();
      console.log('Menu is open:', isOpen);
      if (isOpen) {
        await this.menu.close();
        console.log('Menu closed');
      } else {
        await this.menu.open();
        console.log('Menu opened');
      }
    } catch (error) {
      console.error('Menu error:', error);
    }
  }

  private applyFilters() {
    let filtered = [...this.products];
    console.log('Aplicando filtros - Categoria:', this.selectedCategory, 'Busca:', this.searchTerm);
    console.log('Produtos antes do filtro:', filtered.length);

    // Filtrar por categoria
    if (this.selectedCategory && this.selectedCategory !== 'all') {
      console.log('Filtrando por categoria:', this.selectedCategory);
      
      filtered = filtered.filter(product => {
        // Verificar diferentes formatos possíveis do campo categoria
        const productCategory = product.category?.id || product.category?.name || product.category;
        console.log('Produto:', product.title, 'Categoria do produto:', productCategory);
        
        if (!productCategory) return false;
        
        // Comparar tanto por ID quanto por nome da categoria
        const categoryLower = productCategory.toString().toLowerCase();
        const selectedLower = this.selectedCategory.toLowerCase();
        
        return categoryLower === selectedLower || 
               categoryLower.includes(selectedLower) ||
               selectedLower.includes(categoryLower);
      });
      
      console.log('Produtos após filtro de categoria:', filtered.length);
    }

    // Filtrar por termo de busca
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const searchLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        (product.title && product.title.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
      console.log('Produtos após filtro de busca:', filtered.length);
    }

    this.filteredProducts = filtered;
    console.log('Produtos finais filtrados:', this.filteredProducts.length);
  }

  exploreProducts() {
    // Navegar para a página de lista de produtos com filtros aplicados
    this.router.navigate(['/list-products'], {
      queryParams: {
        search: this.searchTerm,
        category: this.selectedCategory
      }
    });
  }

  private searchProducts(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  toggleFavorite(productId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    // Implementar funcionalidade de favoritos
    console.log('Toggle favorite for product:', productId);
    // TODO: Implementar serviço de favoritos
  }

  async loadCategories() {
    try {
      // Carregar categorias do backend
      this.http.get<any[]>(`${environment.apiUrl}/api/categories/`).subscribe({
        next: (categories) => {
          console.log('Categorias do backend:', categories);
          this.categories = [
            { id: 'all', name: 'Todas as Categorias', icon: 'grid-outline' },
            ...categories.map(cat => ({
              id: cat.id || cat.name?.toLowerCase() || 'categoria',
              name: cat.name || cat.title || 'Categoria',
              icon: this.getCategoryIcon(cat.name || cat.title || '')
            }))
          ];
          console.log('Categorias processadas:', this.categories);
        },
        error: (error) => {
          console.error('Erro ao carregar categorias:', error);
          // Fallback para categorias padrão se houver erro
          this.loadFallbackCategories();
        }
      });
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      this.loadFallbackCategories();
    }
  }

  private loadFallbackCategories() {
    this.categories = [
      { id: 'all', name: 'Todas as Categorias', icon: 'grid-outline' },
      { id: 'eletronicos', name: 'Eletrônicos', icon: 'phone-portrait-outline' },
      { id: 'roupas', name: 'Roupas', icon: 'shirt-outline' },
      { id: 'casa', name: 'Casa & Jardim', icon: 'home-outline' },
      { id: 'esportes', name: 'Esportes', icon: 'fitness-outline' },
      { id: 'livros', name: 'Livros', icon: 'book-outline' },
      { id: 'jogos', name: 'Jogos', icon: 'game-controller-outline' },
      { id: 'tecnologia', name: 'Tecnologia', icon: 'phone-portrait-outline' },
      { id: 'moda', name: 'Moda', icon: 'shirt-outline' }
    ];
    console.log('Usando categorias fallback:', this.categories);
  }

  getCategoryIcon(categoryName: string): string {
    const iconMap: { [key: string]: string } = {
      'eletrônicos': 'phone-portrait-outline',
      'roupas': 'shirt-outline',
      'casa': 'home-outline',
      'esportes': 'fitness-outline',
      'livros': 'book-outline',
      'jogos': 'game-controller-outline',
      'acessórios': 'watch-outline',
      'beleza': 'flower-outline',
      'carros': 'car-outline',
      'móveis': 'bed-outline'
    };
    return iconMap[categoryName.toLowerCase()] || 'pricetag-outline';
  }

  getProductsSectionTitle(): string {
    if (this.searchTerm && this.selectedCategory !== 'all') {
      const categoryName = this.categories.find(cat => cat.id === this.selectedCategory)?.name || 'Categoria';
      return `Resultados para "${this.searchTerm}" em ${categoryName}`;
    } else if (this.searchTerm) {
      return `Resultados para "${this.searchTerm}"`;
    } else if (this.selectedCategory !== 'all') {
      const categoryName = this.categories.find(cat => cat.id === this.selectedCategory)?.name || 'Categoria';
      return `Produtos em ${categoryName}`;
    }
    return 'Produtos em Destaque';
  }

  // Método para adicionar produtos de teste se necessário
  addTestProductsIfNeeded() {
    if (this.products.length === 0) {
      this.products = [
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
        },
        {
          id: '4',
          title: 'PlayStation 5 Console',
          description: 'Console PlayStation 5 novo na caixa, completamente lacrado. Inclui controle DualSense wireless, cabo HDMI 2.1, cabo USB e cabo de energia. Garantia Sony de 1 ano. Modelo padrão com leitor de discos.',
          category: 'jogos',
          categoryName: 'Games & Consoles',
          price: 4500,
          city: 'Porto Alegre',
          state: 'RS',
          created_at: '2024-12-12T14:10:00Z',
          status: 'active',
          views: 892,
          user: { 
            username: 'gamercollector',
            email: 'gamercollector@example.com',
            profile_image: 'https://randomuser.me/api/portraits/men/15.jpg',
            reputation: 4.7,
            total_sales: 12
          },
          images: [
            { image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop' }
          ],
          specifications: {
            'Modelo': 'CFI-1015A',
            'Armazenamento': '825GB SSD',
            'Tipo': 'Com leitor de discos',
            'Estado': 'Novo lacrado',
            'Garantia': '1 ano Sony',
            'Voltagem': 'Bivolt'
          },
          shipping: {
            free: true,
            methods: ['Sedex 10', 'Transportadora'],
            estimated_days: '1-3 dias úteis'
          }
        },
        {
          id: '5',
          title: 'MacBook Air M2',
          description: 'MacBook Air 2022 com chip Apple M2, 8GB de RAM unificada, SSD de 256GB. Cor Meia-noite. Usado por apenas 3 meses para estudos, como novo. Acompanha carregador MagSafe 3 original e caixa.',
          category: 'eletronicos',
          categoryName: 'Eletrônicos',
          price: 7500,
          city: 'Curitiba',
          state: 'PR',
          created_at: '2024-12-11T11:30:00Z',
          status: 'active',
          views: 437,
          user: { 
            username: 'applelover',
            email: 'applelover@example.com',
            profile_image: 'https://randomuser.me/api/portraits/women/22.jpg',
            reputation: 4.9,
            total_sales: 8
          },
          images: [
            { image: 'https://cdn.awsli.com.br/2510/2510599/produto/216199033/macbook-air-136-chip-m2-8gb-512gb-ssd-meia-noite-70a0b805.jpeg' }
          ],
          specifications: {
            'Processador': 'Apple M2',
            'RAM': '8GB unificada',
            'Armazenamento': '256GB SSD',
            'Tela': '13.6" Liquid Retina',
            'Cor': 'Meia-noite',
            'Estado': 'Seminovo'
          },
          shipping: {
            free: true,
            methods: ['Sedex 10', 'Retirada local'],
            estimated_days: '1-2 dias úteis'
          }
        },
        {
          id: '6',
          title: 'Tênis Adidas Ultraboost',
          description: 'Tênis de corrida Adidas Ultraboost 22, número 42, cor preta com detalhes brancos. Tecnologia Boost para máximo retorno de energia. Usado poucas vezes, excelente estado de conservação. Ideal para corrida e caminhada.',
          category: 'roupas',
          categoryName: 'Roupas & Acessórios',
          price: 320,
          city: 'Salvador',
          state: 'BA',
          created_at: '2024-12-10T16:45:00Z',
          status: 'active',
          views: 203,
          user: { 
            username: 'runnerstore',
            email: 'runnerstore@example.com',
            profile_image: 'https://randomuser.me/api/portraits/men/38.jpg',
            reputation: 4.8,
            total_sales: 156
          },
          images: [
            { image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' }
          ],
          specifications: {
            'Tamanho': '42 BR',
            'Cor': 'Preto/Branco',
            'Tecnologia': 'Boost + Primeknit',
            'Tipo': 'Corrida/Caminhada',
            'Estado': 'Usado - Excelente',
            'Marca': 'Adidas'
          },
          shipping: {
            free: true,
            methods: ['Correios', 'Retirada local'],
            estimated_days: '4-8 dias úteis'
          }
        }
      ];
      this.filteredProducts = [...this.products];
      console.log('Produtos de teste adicionados:', this.products);
    }
  }

  ngOnDestroy() {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }
}