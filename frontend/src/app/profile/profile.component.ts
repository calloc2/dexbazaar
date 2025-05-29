import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReputationService } from '../services/reputation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class ProfileComponent implements OnInit {
  user: any = {};
  products: any[] = [];
  profileUsername = ''; // username do perfil visitado
  loggedUsername = localStorage.getItem('username') || '';
  reputationAverage: number = 0;
  reputationCount: number = 0;
  selectedScore = 0;
  alreadyRated = false;
  @ViewChild('profileImageInput') profileImageInput!: ElementRef<HTMLInputElement>;
  readonly maxProfileImageSizeMB = 2;
  readonly maxProfileImageDim = 256;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private reputationService: ReputationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.profileUsername = params.get('username') || '';
      this.loadProfile();
      this.loadUserProducts();
      this.loadReputation();
    });
  }

  loadProfile() {
    this.http
      .get(`${environment.apiUrl}/api/users/${this.profileUsername}/`)
      .subscribe((data: any) => {
        this.user = data;
      });
  }

  loadUserProducts() {
    this.http
      .get(`${environment.apiUrl}/api/products/?user=${this.profileUsername}`)
      .subscribe((data: any) => {
        this.products = data;
      });
  }

  loadReputation() {
    this.reputationService.getUserReputation(this.profileUsername).subscribe(data => {
      this.reputationAverage = data.average;
      this.reputationCount = data.count;
    });
  }

  isOwner(product: any): boolean {
    return product.user?.username === this.loggedUsername;
  }

  isOwnerProfile(): boolean {
    return this.profileUsername === this.loggedUsername;
  }

  deleteProduct(product: any) {
    if (confirm('Tem certeza que deseja apagar este anúncio?')) {
      this.http.delete(`${environment.apiUrl}/api/products/${product.id}/`).subscribe({
        next: () => {
          this.products = this.products.filter((p: any) => p.id !== product.id);
        },
        error: () => {
          alert('Erro ao apagar anúncio.');
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  }

  giveReputation(score: number) {
    if (this.alreadyRated) return;
    this.selectedScore = score;
    // Use o ID do usuário do perfil visitado
    this.reputationService.giveReputation(this.user.id, score).subscribe({
      next: () => {
        this.loadReputation();
        this.alreadyRated = true;
        alert('Avaliação enviada!');
      },
      error: (err) => {
        if (err.error && err.error.error) alert(err.error.error);
        else alert('Erro ao enviar avaliação.');
        this.alreadyRated = true;
      }
    });
  }

  round(value: number): number {
    return Math.round(value);
  }

  triggerProfileImageInput() {
    this.profileImageInput.nativeElement.click();
  }

  async onProfileImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    if (file.size > this.maxProfileImageSizeMB * 1024 * 1024) {
      alert(`A imagem deve ter no máximo ${this.maxProfileImageSizeMB}MB.`);
      return;
    }

    let optimizedFile: File;
    if (file.type === 'image/gif') {
      // Para GIF, apenas limita o tamanho, não redimensiona para não perder animação
      optimizedFile = file;
    } else {
      optimizedFile = await this.optimizeImage(file);
    }

    const formData = new FormData();
    formData.append('profile_image', optimizedFile);

    this.http.patch(`${environment.apiUrl}/api/users/${this.profileUsername}/`, formData).subscribe({
      next: (data: any) => {
        this.user.profileImage = data.profileImage;
        alert('Foto de perfil atualizada!');
      },
      error: () => {
        alert('Erro ao atualizar foto de perfil.');
      }
    });
  }

  async optimizeImage(file: File): Promise<File> {
    return new Promise<File>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = this.maxProfileImageDim;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          }, 'image/jpeg', 0.8);
        };
      };
      reader.readAsDataURL(file);
    });
  }
}
