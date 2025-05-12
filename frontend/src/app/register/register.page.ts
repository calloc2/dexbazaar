import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { IonHeader } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    CommonModule, 
    FormsModule,  
    HttpClientModule,    
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonicModule
  ],
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  async onRegister() {
    if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'As senhas não coincidem.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      password: this.password,
      email: this.email,
    };

    this.http.post(`${environment.apiUrl}/api/users/register/`, userData).subscribe(
      async (response) => {
        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Usuário registrado com sucesso!',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']);
      },
      async (error) => {
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Ocorreu um erro ao registrar o usuário.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
