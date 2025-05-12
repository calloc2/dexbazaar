import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HouseService } from '../services/house.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-houses',
  templateUrl: './list-houses.page.html',
  styleUrls: ['./list-houses.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class ListHousesPage implements OnInit {
  houses: any[] = [];

  constructor(private houseService: HouseService) {}

  ngOnInit() {
    this.houses = this.houseService.getHouses();
  }
}