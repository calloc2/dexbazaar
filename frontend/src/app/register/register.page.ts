import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel, AlertController, IonIcon, IonSelect, IonSelectOption, IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent,
} from '@ionic/angular/standalone';
import { IonProgressBar } from '@ionic/angular/standalone';

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
    IonIcon,
    IonProgressBar,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent,
  ],
})
export class RegisterPage {
  firstName: string = '';
  lastName: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  email: string = '';
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  passwordStrength: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
  }

  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  checkPasswordStrength(password: string) {
    const strength = this.calculatePasswordStrength(password);
    this.passwordStrength = strength / 100;

    const progressBar = document.querySelector('ion-progress-bar');
    if (progressBar) {
      progressBar.classList.remove('low', 'medium', 'high');
      if (strength <= 50) {
        progressBar.classList.add('low');
      } else if (strength <= 75) {
        progressBar.classList.add('medium');
      } else {
        progressBar.classList.add('high');
      }
    }
  }

  private calculatePasswordStrength(password: string): number {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[@$!%*?&#]/.test(password)) strength += 25;
    return strength;
  }

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
