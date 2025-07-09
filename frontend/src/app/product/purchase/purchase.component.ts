import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class PurchaseComponent implements OnInit {
  product: any;
  loading = true;
  quantity = 1;
  ethRate: number = 0; // Cotação atual do Ethereum
  
  // Dados do comprador
  buyerInfo = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    cep: ''
  };

  // Método de pagamento
  paymentMethod = 'crypto';
  selectedCrypto = 'ETH';
  cryptoOptions = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDT', label: 'Tether (USDT)' },
    { value: 'BNB', label: 'Binance Coin (BNB)' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Verificar se o usuário está logado
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.loadProduct(id);
    this.loadUserInfo();
    this.fetchEthereumRate();
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

  loadProduct(id: string | null) {
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }

    this.http.get(`${environment.apiUrl}/api/products/${id}/`).subscribe({
      next: (data: any) => {
        this.product = data;
        this.loading = false;
      },
      error: async () => {
        // Try to load placeholder product if API fails
        this.loadPlaceholderProduct(id);
      }
    });
  }

  private loadPlaceholderProduct(id: string) {
    // Fallback to placeholder data when API is unavailable
    const placeholderProducts = [
      {
        id: '1',
        title: 'iPhone 13 Pro Max',
        description: 'Smartphone Apple 256GB, estado de novo, sem riscos. Acompanha carregador original, caixa e todos os acessórios.',
        price: 3000,
        city: 'São Paulo',
        state: 'SP',
        user: { username: 'techseller' }
      },
      {
        id: '2',
        title: 'Camiseta Nike Dri-FIT',
        description: 'Camiseta esportiva Nike original, tamanho M, cor azul royal.',
        price: 150,
        city: 'Rio de Janeiro',
        state: 'RJ',
        user: { username: 'sportsfan' }
      },
      {
        id: '3',
        title: 'JavaScript: O Guia Definitivo',
        description: 'Livro completo sobre JavaScript, 7ª edição por David Flanagan.',
        price: 80,
        city: 'Belo Horizonte',
        state: 'MG',
        user: { username: 'devbooks' }
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
    console.log('Loaded placeholder product for purchase:', this.product);
  }

  loadUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get<any>(`${environment.apiUrl}/api/users/me/`, {
        headers: { Authorization: `Token ${token}` }
      }).subscribe({
        next: (data) => {
          this.buyerInfo.name = data.first_name + ' ' + data.last_name;
          this.buyerInfo.email = data.email;
        }
      });
    }
  }

  getTotalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  async processPurchase() {
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Processando compra...'
    });
    await loading.present();

    const purchaseData = {
      product_id: this.product.id,
      quantity: this.quantity,
      total_price: this.getTotalPrice(),
      payment_method: this.paymentMethod,
      crypto_currency: this.selectedCrypto,
      buyer_info: this.buyerInfo
    };

    const token = localStorage.getItem('token');
    
    this.http.post(`${environment.apiUrl}/api/orders/create/`, purchaseData, {
      headers: { Authorization: `Token ${token}` }
    }).subscribe({
      next: async (response: any) => {
        await loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Compra Realizada!',
          message: `Sua compra de ${this.product.title} foi processada com sucesso. Pedido #${response.id} criado. Você receberá as instruções de pagamento por email.`,
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/home']);
            }
          }]
        });
        await alert.present();
      },
      error: async (error) => {
        await loading.dismiss();
        
        let errorMessage = 'Erro ao processar compra. Tente novamente.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        const alert = await this.alertController.create({
          header: 'Erro',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

  validateForm(): boolean {
    if (!this.buyerInfo.name || !this.buyerInfo.email || !this.buyerInfo.phone) {
      this.showAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (!this.buyerInfo.address || !this.buyerInfo.city || !this.buyerInfo.state || !this.buyerInfo.cep) {
      this.showAlert('Erro', 'Por favor, preencha todos os dados de entrega.');
      return false;
    }

    return true;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/product', this.product?.id]);
  }
}
