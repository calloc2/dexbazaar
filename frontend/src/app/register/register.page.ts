import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonItem, IonLabel, AlertController, IonIcon } from '@ionic/angular/standalone';
import { IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  personAddOutline, 
  atOutline, 
  mailOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  warningOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
    IonIcon,
    IonProgressBar,
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
  passwordIcon: string = 'eye-off-outline';
  passwordStrength: number = 0;
  passwordStrengthLevel: string = 'low';
  passwordStrengthText: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController
  ) {
    // Register icons
    addIcons({
      'person-outline': personOutline,
      'person-add-outline': personAddOutline,
      'at-outline': atOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'warning-outline': warningOutline,
    });
  }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off-outline';
    }
  }

  checkPasswordStrength(password: string) {
    const strength = this.calculatePasswordStrength(password);
    this.passwordStrength = strength / 100;

    // Set strength level and text
    if (strength <= 40) {
      this.passwordStrengthLevel = 'low';
      this.passwordStrengthText = 'Senha fraca';
    } else if (strength <= 75) {
      this.passwordStrengthLevel = 'medium';
      this.passwordStrengthText = 'Senha média';
    } else {
      this.passwordStrengthLevel = 'high';
      this.passwordStrengthText = 'Senha forte';
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
