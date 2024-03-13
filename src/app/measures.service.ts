import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  toggles: { [key: string]: boolean[] } = {
    'Aluminum': [false, false, false, false],
    'Steel': [false, false, false, false],
    'Other': [false, false, false, false]
  };

  private toggleChangedSubject = new BehaviorSubject<object>({}); // Hier geben wir ein leeres Objekt als Standardwert an
  toggleChanged = this.toggleChangedSubject.asObservable();
  

  getToggles(rowName: string): boolean[] {
    return this.toggles[rowName];
  }

  setToggle(rowName: string, toggles: boolean[]): void {
    this.toggles[rowName] = toggles;
    this.toggleChangedSubject.next({}); // Emitting a value to indicate changes
  }
}
