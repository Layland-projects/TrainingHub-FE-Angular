import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from '../../models/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roles: Role[] = [
    { name: 'Admin', value: 0 },
    { name: 'Trainer', value: 1 },
    { name: 'Trainee', value: 2 }
  ];
  constructor() { }

  getRoles(): Observable<Role[]> {
    return of(this.roles);
  }

  getRoleByValue(id: number): Observable<Role | undefined> {
    return of(this.roles.find(x => x.value === id));
  }

  getRoleByName(name: string): Observable<Role | undefined> {
    return of(this.roles.find(x => x.name === name));
  }
}
