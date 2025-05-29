import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReputationService {
  constructor(private http: HttpClient) {}

  giveReputation(toUser: string, score: number) {
    return this.http.post(`${environment.apiUrl}/api/reputation/`, { to_user: toUser, score });
  }

  getUserReputation(username: string) {
    return this.http.get<{ average: number, count: number }>(`${environment.apiUrl}/api/users/${username}/reputation/`);
  }
}