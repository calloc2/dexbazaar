import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-product',
  templateUrl: './register-product.component.html',
  styleUrls: ['./register-product.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterProductPage {
  productForm!: FormGroup;
  categories = [
    { id: 1, name: 'Smartphones e acessórios' },
    { id: 2, name: 'Computadores e tablets' },
    { id: 3, name: 'TVs e equipamentos de áudio' },
    { id: 4, name: 'Câmeras e drones' },
    { id: 5, name: 'Videogames' },
    { id: 6, name: 'Jogos físicos' },
    { id: 7, name: 'Acessórios gamers' },
    { id: 8, name: 'Bicicletas' },
    { id: 9, name: 'Patinetes elétricos' },
    { id: 10, name: 'Skates' },
    { id: 11, name: 'Roupas femininas/masculinas' },
    { id: 12, name: 'Calçados' },
    { id: 13, name: 'Acessórios (bolsas, relógios, joias)' },
    { id: 14, name: 'Móveis' },
    { id: 15, name: 'Eletrodomésticos' },
    { id: 16, name: 'Itens de decoração' },
    { id: 17, name: 'Equipamentos esportivos' },
    { id: 18, name: 'Artigos para camping e aventura' },
    { id: 19, name: 'Brinquedos' },
    { id: 20, name: 'Roupas infantis' },
    { id: 21, name: 'Carrinhos de bebê/cadeiras' },
    { id: 22, name: 'Guitarras, teclados, baterias' },
    { id: 23, name: 'Equipamentos de áudio' },
    { id: 24, name: 'Livros físicos' },
    { id: 25, name: 'Blu-rays, DVDs, vinis, CDs' },
    { id: 26, name: 'Ferramentas elétricas e manuais' },
    { id: 27, name: 'Materiais de construção' },
    { id: 28, name: 'Action figures' },
    { id: 29, name: 'Moedas, selos, cards' },
    { id: 30, name: 'Memorabilia esportiva' },
    { id: 31, name: 'Cosméticos' },
    { id: 32, name: 'Aparelhos de cuidados pessoais' },
    { id: 33, name: 'Acessórios, brinquedos e alimentos para animais' },
    { id: 34, name: 'Sementes, mudas' },
    { id: 35, name: 'Equipamentos de jardinagem' },
    { id: 36, name: 'Peças e acessórios para veículos' },
    { id: 37, name: 'Pneus e rodas' },
  ];

  images: File[] = [];
  imagePreviews: string[] = [];
  readonly maxImages = 4;
  readonly maxSizeMB = 2;
  city: string = '';
  state: string = '';
  isSubmitting: boolean = false;

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  onImageSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length + this.images.length > this.maxImages) {
      alert(`Máximo de ${this.maxImages} imagens permitidas.`);
      return;
    }
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > this.maxSizeMB * 1024 * 1024) {
        alert(`Imagem "${file.name}" excede ${this.maxSizeMB}MB.`);
        return;
      }
      this.optimizeImage(file).then(optFile => {
        this.images.push(optFile);
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(optFile);
      });
    });
  }

  async optimizeImage(file: File): Promise<File> {
    // Redimensiona para máx 1024px e reduz qualidade para 80%
    return new Promise<File>((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1024;
          let { width, height } = img;
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

  onCepBlur() {
    const cep = this.productForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(data => {
        if (!data.erro) {
          this.city = data.localidade;
          this.state = data.uf;
        } else {
          this.city = '';
          this.state = '';
        }
      });
    } else {
      this.city = '';
      this.state = '';
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  submit() {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();
      Object.entries(this.productForm.value).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      this.images.forEach((img, i) => formData.append('images', img, img.name));
      formData.append('cep', this.productForm.value.cep);
      formData.append('city', this.city);
      formData.append('state', this.state);
      this.productService.addProduct(formData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Produto cadastrado com sucesso!');
          this.productForm.reset();
          this.images = [];
          this.imagePreviews = [];
          this.city = '';
          this.state = '';
          this.router.navigate(['/list-products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.status === 403) {
            alert('Você precisa estar logado para cadastrar um produto.');
            this.router.navigate(['/login']);
          } else {
            alert('Erro ao cadastrar produto. Tente novamente.');
          }
        }
      });
    }
  }
}
