import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HouseService {
  private houses: any[] = [];

  getHouses() {
    return this.houses;
  }

  addHouse(house: any) {
    this.houses.push({ ...house, isPublic: false });
  }
}
