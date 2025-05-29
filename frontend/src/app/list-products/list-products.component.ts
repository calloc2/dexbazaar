import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
})
export class ListProductsPage implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }
}