import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-houses',
  templateUrl: './list-houses.page.html',
  styleUrls: ['./list-houses.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class ListHousesPage implements OnInit {
  houses: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getHouses().subscribe((data: any) => {
      this.houses = data;
    });
  }
}