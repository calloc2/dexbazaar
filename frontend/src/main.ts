import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
import { authInterceptor } from './app/services/auth.interceptor';
import { addIcons } from 'ionicons';
import { 
  menuOutline, 
  cartOutline, 
  personOutline, 
  locationSharp, 
  calendarOutline, 
  trashOutline, 
  starOutline, 
  star, 
  cameraOutline,
  lockClosedOutline,
  warningOutline,
  eyeOutline,
  eyeOffOutline,
  logoGoogle,
  walletOutline,
  arrowBackOutline,
  addCircleOutline,
  heartOutline,
  personCircleOutline,
  notificationsOutline,
  settingsOutline,
  storefrontOutline,
  searchOutline,
  imageOutline,
  locationOutline,
  timeOutline,
  addOutline,
  rocketOutline,
  informationCircleOutline,
  imagesOutline,
  cloudUploadOutline,
  closeOutline,
  checkmarkOutline,
  listOutline,
  location
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

addIcons({
  'menu-outline': menuOutline,
  'cart-outline': cartOutline,
  'person-outline': personOutline,
  'location-sharp': locationSharp,
  'calendar-outline': calendarOutline,
  'trash-outline': trashOutline,
  'star-outline': starOutline,
  'star': star,
  'camera-outline': cameraOutline,
  'lock-closed-outline': lockClosedOutline,
  'warning-outline': warningOutline,
  'eye-outline': eyeOutline,
  'eye-off-outline': eyeOffOutline,
  'logo-google': logoGoogle,
  'wallet-outline': walletOutline,
  'arrow-back-outline': arrowBackOutline,
  'add-circle-outline': addCircleOutline,
  'heart-outline': heartOutline,
  'person-circle-outline': personCircleOutline,
  'notifications-outline': notificationsOutline,
  'settings-outline': settingsOutline,
  'storefront-outline': storefrontOutline,
  'search-outline': searchOutline,
  'image-outline': imageOutline,
  'location-outline': locationOutline,
  'time-outline': timeOutline,
  'add-outline': addOutline,
  'rocket-outline': rocketOutline,
  'information-circle-outline': informationCircleOutline,
  'images-outline': imagesOutline,
  'cloud-upload-outline': cloudUploadOutline,
  'close-outline': closeOutline,
  'checkmark-outline': checkmarkOutline,
  'list-outline': listOutline,
  'location': location,
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
