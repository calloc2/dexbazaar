import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class HomePage {
  // Lista de cards
  cards = [
    {
      title: 'Exemplo de Produto',
      description: 'Descrição do produto',
      price: 100,
    },
  ];

  constructor() {}
}