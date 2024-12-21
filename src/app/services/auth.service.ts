import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  userId: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password))
      .pipe(
        map(userCredential => {
          const user = {
            userId: userCredential.user.uid,
            email: userCredential.user.email || ''
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  signUp(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password))
      .pipe(
        map(userCredential => {
          const user = {
            userId: userCredential.user.uid,
            email: userCredential.user.email || ''
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout(): void {
    signOut(this.auth).then(() => {
      localStorage.removeItem('user');
      this.userSubject.next(null);
    });
  }

  getUser(): User | null {
    return this.userSubject.value;
  }
}
