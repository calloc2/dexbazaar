import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate {

  constructor(
    private loadingService: LoadingService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.loadingService.show('Carregando página...');
      
      // Simulate loading time for page transition
      setTimeout(() => {
        this.loadingService.hide();
        resolve(true);
      }, 800);
    });
  }
}
