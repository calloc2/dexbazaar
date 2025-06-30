import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMessageSubject = new BehaviorSubject<string>('Carregando...');
  
  public isLoading$ = this.isLoadingSubject.asObservable();
  public loadingMessage$ = this.loadingMessageSubject.asObservable();

  constructor() { }

  show(message: string = 'Carregando...') {
    this.loadingMessageSubject.next(message);
    this.isLoadingSubject.next(true);
  }

  hide() {
    this.isLoadingSubject.next(false);
  }

  setMessage(message: string) {
    this.loadingMessageSubject.next(message);
  }
}
