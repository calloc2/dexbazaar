import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HouseService } from '../services/house.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, RouterModule], 
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

  constructor(private houseService: HouseService) {
    this.loadFeaturedHouses();
  }

  loadFeaturedHouses() {
    const publicHouses = this.houseService.getHouses().filter(house => house.isPublic);
    this.cards = [
      ...this.cards, // Mantém o exemplo de produto
      ...publicHouses.map(house => ({
        title: house.title,
        description: house.description,
        price: house.price,
      })),
    ];
  }
}