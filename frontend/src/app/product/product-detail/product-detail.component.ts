import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule, RouterModule],
})
export class ProductDetailComponent implements OnInit {
  product: any;
  loading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.get(`${environment.apiUrl}/api/products/${id}/`).subscribe({
      next: (data: any) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
