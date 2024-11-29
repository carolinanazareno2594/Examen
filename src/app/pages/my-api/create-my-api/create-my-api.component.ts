import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MiApiService, Artefacto } from '../../../services/miApi.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-my-api.component.html',
  styleUrls: ['./create-my-api.component.css'],
})
export class CreateMyApiComponent {
  // Formulario reactivo con validaciones básicas para el artefacto
  public artefactoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    disponibilidad: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
  });

  constructor(private miApiService: MiApiService, public router: Router) {}

  onSubmit() {
    if (this.artefactoForm.valid) {
      const nuevoArtefacto = this.artefactoForm.value as Artefacto;

      console.log('Datos a enviar:', nuevoArtefacto);

      this.miApiService.addArtefacto(nuevoArtefacto).subscribe({
        next: () => {
          console.log('Artefacto agregado con éxito');
          this.router.navigate(['/miapi/list']); // Redirige a la lista de artefactos
        },
        error: (err) => {
          console.error('Error al agregar artefacto:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.artefactoForm.value);
    }
  }
}
