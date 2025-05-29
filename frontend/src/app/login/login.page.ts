import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonButton, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
  AlertController,
  IonIcon,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,  
    HttpClientModule, 
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onLogin() {
    this.http.post(`${environment.apiUrl}/api/login/`, {
      username: this.username,
      password: this.password,
    }).subscribe({
      next: async (response: any) => {
        const token = response.token || response.access || '';
        localStorage.setItem('token', token);

        // Fetch user info using the token
        this.http.get<any>(`${environment.apiUrl}/api/users/me/`, {
          headers: { Authorization: `Token ${token}` }
        }).subscribe({
          next: async (user) => {
            localStorage.setItem('username', user.username);
            await this.showAlert('Sucesso', 'Login realizado com sucesso!');
            this.router.navigate(['/home']);
          },
          error: async () => {
            await this.showAlert('Erro', 'Erro ao buscar dados do usuário.');
          }
        });
      },
      error: async (err) => {
        console.error('Login failed', err);
        await this.showAlert('Erro', 'Usuário ou senha inválidos.');
      },
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
