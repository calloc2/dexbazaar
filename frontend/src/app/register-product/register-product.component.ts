import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private productService: ProductService, private fb: FormBuilder, private router: Router) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  submit() {
    if (this.productForm?.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.productForm.reset();
          this.router.navigate(['/list-products']);
        },
        error: (err) => {
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
