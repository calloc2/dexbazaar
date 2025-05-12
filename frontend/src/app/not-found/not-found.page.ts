import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-not-found',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Página Não Encontrada</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div style="text-align: center;">
        <h1>404</h1>
        <p>A página que você está procurando não existe.</p>
        <a routerLink="/home">
          <ion-button>Voltar para a Home</ion-button>
        </a>
      </div>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule],
})
export class NotFoundPage {}
