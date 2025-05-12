import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HouseService } from '../services/house.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register-house',
  templateUrl: './register-house.page.html',
  styleUrls: ['./register-house.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterHousePage {
  houseForm!: FormGroup;

  constructor(private houseService: HouseService, private fb: FormBuilder, private router: Router) {
    this.houseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
    });
  }

  submit() {
    if (this.houseForm?.valid) {
      this.houseService.addHouse(this.houseForm.value);
      alert('House registered successfully!');
      this.houseForm.reset();
      this.router.navigate(['/list-houses']);
    }
  }
}