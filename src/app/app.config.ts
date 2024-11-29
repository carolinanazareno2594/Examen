import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

import { firebaseConfig } from './environment/firebase';
import { initializeApp, provideFirebaseApp, getApps } from '@angular/fire/app'; // Agregamos `getApps`
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    
    // Modificación para evitar el error de app duplicada
    provideFirebaseApp(() => {
      if (!getApps().length) {
        return initializeApp(firebaseConfig); // Si no hay app, inicializa Firebase
      } else {
        return getApps()[0]; // Si ya existe, usa la app existente
      }
    }),
    
    provideAuth(() => getAuth()), // Servicio de autenticación
    provideFirestore(() => getFirestore()) // Servicio de Firestore
  ]
};
