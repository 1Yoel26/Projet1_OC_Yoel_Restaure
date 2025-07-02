import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})


export class OlympicService {

  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() : Observable <Olympic[]> {
    // Si les données sont déjà chargées, ne pas refaire l'appel HTTP
    if (this.olympics$.value) {
      return of(this.olympics$.value);
    }

    // Sinon, on fait l'appel HTTP une seule fois
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      
      catchError((error, caught) => {
        console.error(error);
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }
}
