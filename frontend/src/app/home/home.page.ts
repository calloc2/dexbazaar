import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule],
})
export class HomePage {
  constructor() {}
}
