import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-house',
  templateUrl: './register-house.page.html',
  styleUrls: ['./register-house.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegisterHousePage {
  houseForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.houseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
    });
  }

  submit() {
    if (this.houseForm.valid) {
      this.apiService.addHouse(this.houseForm.value).subscribe(() => {
        alert('House registered successfully!');
      });
    }
  }
}