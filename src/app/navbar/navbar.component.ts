import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth'; // Importa User directamente desde firebase/auth
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf, AsyncPipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user$!: Observable<User | null>; // Tipo de usuario actualizado
  isLoading = false;
  errorMessage: string = '';

  constructor(private _srvAuth: AuthService) {}

  ngOnInit(): void {
    this.user$ = this._srvAuth.getUser();
  }

  async onGoogleLogin(): Promise <void> {
    this.isLoading = true
    try{
      await this._srvAuth.loginwhitGoogle()
      console.log('Login with google')
    }catch(error){
      this.errorMessage = 'Error al iniciar sesion'
      console.error(error)
    }finally{
      this.isLoading = false
    }
  }

  async logout(): Promise <void> {
    this.isLoading = true
    try{
      await this._srvAuth.logout()
      console.log('Logout')
    }catch(error){
      this.errorMessage = 'Error al cerrar sesion'
      console.error(error)
    }finally{
      this.isLoading = false
    }
  }
}
