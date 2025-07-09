import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
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
  IonCheckbox,
  IonSpinner,
  IonAlert,
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
    IonInput,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonSpinner,
    IonAlert,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class LoginPage {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  
  // Error handling
  usernameError: string = '';
  passwordError: string = '';
  showAlert: boolean = false;
  alertMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingService: LoadingService
  ) {
    // Check if user details are saved
    const savedUsername = localStorage.getItem('savedUsername');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedRememberMe && savedUsername) {
      this.username = savedUsername;
      this.rememberMe = true;
    }
  }

  validateForm(): boolean {
    this.usernameError = '';
    this.passwordError = '';
    
    let isValid = true;
    
    if (!this.username.trim()) {
      this.usernameError = 'Usuário é obrigatório';
      isValid = false;
    } else if (this.username.length < 3) {
      this.usernameError = 'Usuário deve ter pelo menos 3 caracteres';
      isValid = false;
    }
    
    if (!this.password) {
      this.passwordError = 'Senha é obrigatória';
      isValid = false;
    } else if (this.password.length < 6) {
      this.passwordError = 'Senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }
    
    return isValid;
  }

  async onLogin() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.loadingService.show('Fazendo login...');
    
    try {
      const response: any = await this.http.post(`${environment.apiUrl}/api/login/`, {
        username: this.username,
        password: this.password,
      }).toPromise();

      const token = response.token || response.access || '';
      localStorage.setItem('token', token);

      // Handle remember me
      if (this.rememberMe) {
        localStorage.setItem('savedUsername', this.username);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('rememberMe');
      }

      // Fetch user info using the token
      try {
        this.loadingService.setMessage('Carregando dados do usuário...');
        const user = await this.http.get<any>(`${environment.apiUrl}/api/users/me/`, {
          headers: { Authorization: `Token ${token}` }
        }).toPromise();

        localStorage.setItem('username', user.username);
        localStorage.setItem('userEmail', user.email || '');
        
        this.loadingService.setMessage('Redirecionando...');
        
        // Small delay to show the loading message
        setTimeout(async () => {
          this.loadingService.hide();
          await this.showSuccessAlert('Login realizado com sucesso!');
          this.router.navigate(['/home']);
        }, 1000);
        
      } catch (userError) {
        console.error('Error fetching user data', userError);
        this.loadingService.hide();
        this.showErrorAlert('Erro ao buscar dados do usuário.');
      }

    } catch (error: any) {
      console.error('Login failed', error);
      this.loadingService.hide();
      
      let errorMessage = 'Usuário ou senha inválidos.';
      
      if (error.status === 0) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
      
      this.showErrorAlert(errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  forgotPassword() {
    // Navigate to forgot password page or show modal
    console.log('Forgot password clicked');
    // TODO: Implement forgot password functionality
    this.showInfoAlert('Funcionalidade em desenvolvimento', 'Entre em contato com o suporte para recuperar sua senha.');
  }

  async loginWithGoogle() {
    console.log('Google login clicked');
    // TODO: Implement Google login
    this.showInfoAlert('Em breve', 'Login com Google será implementado em breve.');
  }

  async loginWithMetaMask() {
    console.log('MetaMask login clicked');
    // TODO: Implement MetaMask login
    this.showInfoAlert('Em breve', 'Login com MetaMask será implementado em breve.');
  }

  private async showSuccessAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Sucesso',
      message: message,
      buttons: ['OK'],
      cssClass: 'success-alert'
    });
    await alert.present();
  }

  private showErrorAlert(message: string) {
    this.alertMessage = message;
    this.showAlert = true;
  }

  private async showInfoAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      cssClass: 'info-alert'
    });
    await alert.present();
  }

  // Clear field errors when user starts typing
  onUsernameChange() {
    if (this.usernameError) {
      this.usernameError = '';
    }
  }

  onPasswordChange() {
    if (this.passwordError) {
      this.passwordError = '';
    }
  }
}
