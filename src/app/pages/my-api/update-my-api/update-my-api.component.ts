import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Artefacto, MiApiService } from '../../../services/miApi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-my-api',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-my-api.component.html',
  styleUrls: ['./update-my-api.component.css'],
})
export class UpdateMyApiComponent implements OnInit {
  public artefactoForm: FormGroup;

  private artefactoId: string | null = null;

  constructor(
    private miApiService: MiApiService,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Inicializa el formulario con valores vacíos o por defecto
    this.artefactoForm = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      precio: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0),
      ]),
      disponibilidad: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Obtener el ID del artefacto desde la URL
    this.activatedRoute.paramMap.subscribe((params) => {
      this.artefactoId = params.get('id');
      if (this.artefactoId) {
        // Cargar los datos del artefacto si existe el ID
        this.miApiService
          .getArtefactoById(this.artefactoId)
          .subscribe((artefacto) => {
            if (artefacto) {
              this.artefactoForm.patchValue(artefacto); // Pone los valores en el formulario
            }
          });
      }
    });
  }

  onSubmit(): void {
    if (this.artefactoForm.valid && this.artefactoId) {
      const updatedArtefacto: Artefacto = {
        _id: this.artefactoId,
        ...this.artefactoForm.value, // Combina el ID con el resto de los datos
      };

      this.miApiService.updateArtefacto(updatedArtefacto).subscribe({
        next: () => {
          console.log('Artefacto actualizado con éxito');
          this.router.navigate(['/miapi/list']); // Redirige a la lista de artefactos
        },
        error: (err) => {
          console.error('Error al actualizar artefacto:', err);
        },
      });
    } else {
      console.error('Formulario inválido:', this.artefactoForm.value);
    }
  }
}
