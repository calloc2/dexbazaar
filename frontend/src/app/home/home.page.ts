import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HouseService } from '../services/house.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule, RouterModule], 
})
export class HomePage implements OnInit {
  houses: any[] = [];
  ethRate: number = 0; // Cotação atual do Ethereum

  constructor(private houseService: HouseService, private http: HttpClient) {}

  ngOnInit() {
    this.loadFeaturedHouses();
    this.fetchEthereumRate();
  }

  loadFeaturedHouses() {
    this.houses = this.houseService.getHouses();
  }

  fetchEthereumRate() {
    // Use a CoinGecko API para obter a cotação do Ethereum
    this.http
      .get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      .subscribe((response: any) => {
        this.ethRate = response.ethereum.usd; // Cotação do Ethereum em USD
      });
  }

  convertToEthereum(price: number): number {
    // Converte o preço para Ethereum
    return price / this.ethRate;
  }
}