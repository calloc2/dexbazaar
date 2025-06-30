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
        this.loading = false;
      }
    });

    const token = localStorage.getItem('token');
    this.http.get<any>(`${environment.apiUrl}/api/users/me/`, {
      headers: { Authorization: `Token ${token}` }
    }).subscribe({
      next: (data) => {
        this.username = data.username;
      }
    });
  }

  isOwner(): boolean {
    return this.product?.user?.username === this.username;
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
