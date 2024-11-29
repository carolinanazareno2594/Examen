import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

export interface Artefacto {
  _id: string;
  nombre: string;
  categoria: string;
  precio: number;
  disponibilidad: string;
  descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class MiApiService {
  private baseUrl = 'http://localhost:3000/api/artefactos'; // Ruta de los artefactos

  constructor(private http: HttpClient) {}

  /** Obtiene todos los artefactos */
  getArtefactos(): Observable<Artefacto[]> {
    return this.http.get<{ artefactos: Artefacto[] }>(this.baseUrl).pipe(
      map((response) => response.artefactos), // Extrae el array de la propiedad `trabajadores`
      catchError((error) => {
        console.error('Error al obtener los artefactos:', error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
  }

  /** Busca un artefacto por ID */
  getArtefactoById(id: string): Observable<Artefacto | undefined> {
    return this.http.get<{ artefactos: Artefacto[] }>(this.baseUrl).pipe(
      map((response) =>
        response.artefactos.find((artefacto) => artefacto._id === id)
      ),
      catchError((error) => {
        console.error('Error al obtener el artefacto por ID:', error);
        return of(undefined); // Devuelve `undefined` en caso de error
      })
    );
  }

  /** Busca artefactos por coincidencia parcial en el nombre */
  getArtefactosByNombreParcial(nombre: string): Observable<Artefacto[]> {
    return this.http
      .get<{ artefactos: Artefacto[] }>(`${this.baseUrl}/nombre/${nombre}`)
      .pipe(
        map((response) => response.artefactos),
        catchError((error) => {
          console.error(
            'Error al obtener artefactos por nombre parcial:',
            error
          );
          return of([]); // Devuelve un arreglo vacío en caso de error
        })
      );
  }

  /** Agrega un nuevo artefacto */
  addArtefacto(artefacto: Omit<Artefacto, '_id'>): Observable<Artefacto> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<Artefacto>(this.baseUrl, artefacto, { headers }).pipe(
      catchError((error) => {
        console.error('Error al agregar artefacto:', error);
        throw error; // Relanza el error para manejarlo externamente
      })
    );
  }

  /** Actualiza un artefacto existente */
  updateArtefacto(artefacto: Artefacto): Observable<Artefacto> {
    if (!artefacto._id) {
      throw Error('El ID del artefacto es requerido para actualizar');
    }

    const { _id, ...artefactoSinId } = artefacto; // Excluir `_id` del cuerpo de la solicitud

    return this.http
      .put<Artefacto>(`${this.baseUrl}/${_id}`, artefactoSinId)
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar artefacto:', error);
          throw error; // Relanza el error para manejarlo externamente
        })
      );
  }

  /** Elimina un artefacto por su ID */
  deleteArtefactoById(id: string): Observable<boolean> {
    if (!id) {
      throw Error('El ID del artefacto es requerido para eliminar');
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true), // Devuelve `true` si la eliminación es exitosa
      catchError((error) => {
        console.error('Error al eliminar artefacto:', error);
        return of(false); // Devuelve `false` en caso de error
      })
    );
  }
}
