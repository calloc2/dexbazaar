import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrinho',
  templateUrl: 'carrinho.page.html',
  styleUrls: ['carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CarrinhoPage {
  itens = [
    { nome: 'Produto 1', quantidade: 2, preco: 10.5, imagem: 'https://via.placeholder.com/60' },
    { nome: 'Produto 2', quantidade: 1, preco: 20, imagem: 'https://via.placeholder.com/60' }
  ];

  removerItem(item: any) {
    this.itens = this.itens.filter(i => i !== item);
  }

  calcularTotal() {
    return this.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  finalizarCompra() {
    alert('Compra finalizada!');
  }
}