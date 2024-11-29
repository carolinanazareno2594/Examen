import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Character {
  _id: string;
  name: string;
  alias: string;
  description: string;
  deathNoteOwner: boolean;
  shinigami: boolean;
  intelligence: number;
  image: string;
  abilities: string[];
  status: string;
  relationships: any[];
}

export interface ApiResponse {
  success: boolean;
  count?: number; // count es opcional en algunas respuestas
  data: Character[] | Character; // Puede ser un array o un solo objeto
}

@Injectable({
  providedIn: 'root'
})
export class DeathNoteService {
  private apiUrl = 'http://localhost:4001/api/characters';

  constructor(private http: HttpClient) {}

  // Obtener todos los personajes
  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError<ApiResponse>('getCharacters'))
      );
  }

  // Buscar personajes por nombre
  searchCharacters(name: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/name/${encodeURIComponent(name)}`; // Cambié a /name/ para que coincida con tu API
    return this.http.get<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('searchCharacters'))
      );
  }

  // Crear un nuevo personaje
  createCharacter(character: Character): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, character)
      .pipe(
        catchError(this.handleError<ApiResponse>('createCharacter'))
      );
  }

  // Actualizar un personaje existente
  updateCharacter(id: string, character: Character): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ApiResponse>(url, character)
      .pipe(
        catchError(this.handleError<ApiResponse>('updateCharacter'))
      );
  }

  // Eliminar un personaje
  deleteCharacter(id: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<ApiResponse>(url)
      .pipe(
        catchError(this.handleError<ApiResponse>('deleteCharacter'))
      );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<T> => {
      // Aquí puedes agregar más lógica para manejar diferentes tipos de errores
      console.error(`${operation} failed:`, error); // Imprimir el error en la consola
      // Retornar un objeto vacío como respuesta
      return of({ success: false, data: [] } as unknown as T); // Retornar un objeto que indique el fallo
    };
  }
}