import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonSpinner, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { storefront } from 'ionicons/icons';
import { LoadingService } from '../../services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSpinner,
    IonProgressBar,
  ]
})
export class LoadingComponent implements OnInit, OnDestroy {
  isVisible = false;
  loadingMessage = 'Carregando...';
  private subscriptions: Subscription[] = [];

  constructor(private loadingService: LoadingService) {
    addIcons({
      'storefront': storefront,
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.loadingService.isLoading$.subscribe(isLoading => {
        this.isVisible = isLoading;
      }),
      this.loadingService.loadingMessage$.subscribe(message => {
        this.loadingMessage = message;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
