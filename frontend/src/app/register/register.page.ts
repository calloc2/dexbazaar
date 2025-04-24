import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';

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
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
  ],
})
export class RegisterPage {
    firstName: string = '';
    lastName: string = '';
    username: string = '';
    password: string = '';
    confirmPassword: string = '';
    email: string = '';
  
    onRegister() {
      if (this.password !== this.confirmPassword) {
        console.error('As senhas não coincidem!');
        return;
      }
  
      const userData = {
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        password: this.password,
        email: this.email,
      };
  
      console.log('Dados do usuário:', userData);
    }}
  