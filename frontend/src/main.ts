import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { authInterceptor } from './app/services/auth.interceptor';
import { addIcons } from 'ionicons';
import { menuOutline, cartOutline, personOutline, locationSharp, calendarOutline } from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  'menu-outline': menuOutline,
  'cart-outline': cartOutline,
  'person-outline': personOutline,
  'location-sharp': locationSharp,
  'calendar-outline': calendarOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
});
