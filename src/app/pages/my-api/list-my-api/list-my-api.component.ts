import { Component } from '@angular/core';
import { Artefacto, MiApiService } from '../../../services/miApi.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-my-api',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './list-my-api.component.html',
  styleUrls: ['./list-my-api.component.css'],
})
export class ListMyApiComponent {
  public artefactos: Artefacto[] = []; // Lista de artefactos completa
  public searchResults: Artefacto[] = []; // Resultados de la búsqueda
  public searchTerm: string = ''; // Término de búsqueda

  constructor(private miApiService: MiApiService) {}

  ngOnInit(): void {
    // Cargar todos los artefactos al iniciar
    this.miApiService.getArtefactos().subscribe((artefactos) => {
      this.artefactos = artefactos;
      this.searchResults = artefactos; // Inicializar la tabla con todos los artefactos
    });
  }

  onSearch(): void {
    // Si el término de búsqueda está vacío, mostrar todos los artefactos
    if (!this.searchTerm.trim()) {
      this.searchResults = this.artefactos;
      return;
    }

    // Verificar si el término de búsqueda podría ser un ID
    if (this.isId(this.searchTerm)) {
      // Buscar por ID
      this.miApiService.getArtefactoById(this.searchTerm).subscribe({
        next: (artefacto) => {
          if (artefacto) {
            console.log(artefacto);
            this.searchResults = [artefacto]; // Mostrar el único resultado encontrado por ID
          } else {
            this.searchResults = []; // No se encontró el artefacto
            alert('No se encontró un artefacto con ese ID.');
          }
        },
        error: (err) => {
          console.error('Error al buscar por ID:', err);
          alert('Hubo un error al buscar por ID.');
        },
      });
    } else {
      // Buscar por nombre (parcial)
      this.miApiService
        .getArtefactosByNombreParcial(this.searchTerm)
        .subscribe({
          next: (resultados) => {
            this.searchResults = resultados; // Actualizar los resultados mostrados en la tabla
            if (resultados.length === 0) {
              alert('No se encontraron artefactos con ese nombre.');
            }
          },
          error: (err) => {
            console.error('Error al buscar artefactos:', err);
            alert('Hubo un error al realizar la búsqueda por nombre.');
          },
        });
    }
  }

  // Método para verificar si el término es un ID
  isId(term: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(term); // Compara si el término tiene la longitud y formato de un ID de MongoDB
  }

  eliminarArtefacto(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este artefacto?')) {
      this.miApiService.deleteArtefactoById(id).subscribe({
        next: (resultado) => {
          if (resultado) {
            alert('Artefacto eliminado con éxito');
            // Actualizar la lista de resultados después de eliminar
            this.searchResults = this.searchResults.filter(
              (artefacto) => artefacto._id !== id
            );
            // Actualizar la lista completa en caso de nuevas búsquedas
            this.artefactos = this.artefactos.filter(
              (artefacto) => artefacto._id !== id
            );
          } else {
            alert('Error al eliminar artefacto');
          }
        },
        error: (err) => console.error('Error al eliminar artefacto:', err),
      });
    }
  }
}
