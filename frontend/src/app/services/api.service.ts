import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://class-check-api.onrender.com/api';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventos`, eventData);
  }

  getEventCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias`);
  }

  getEvent(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/eventos/${eventId}`);
  }

  getCreatedEvents(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${userId}/eventos-criados`);
  }

  getParticipatedEvents(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${userId}/eventos-participados`);
  }

  registerPresence(eventoId: string, qrToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/eventos/${eventoId}/presenca/checkin/qr`, { qrToken });
  }

  getAttendees(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/eventos/${eventId}/presenca/participantes`);
  }

}
