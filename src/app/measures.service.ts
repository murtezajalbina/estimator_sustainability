import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  toggles: { [key: string]: boolean[] } = {
    'Aluminum': [false, false, false, false],
    'Steel': [false, false, false, false],
    'Other': [false, false, false, false]
  };

  getToggles(rowName: string): boolean[] {
    return this.toggles[rowName];
  }

  setToggle(rowName: string, toggles: boolean[]): void {
    this.toggles[rowName] = toggles;
  }
}
