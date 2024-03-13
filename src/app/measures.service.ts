import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  toggles: { [key: string]: boolean[] } = {
    'Aluminum': [false, false, false, false],
    'Steel': [false, false, false, false],
    'Other': [false, false, false, false]
  };

  private toggleChangedSubject = new BehaviorSubject<object>([]);
  toggleChanged = this.toggleChangedSubject.asObservable();

  getToggles(rowName: string): boolean[] {
    return this.toggles[rowName];
  }

  setToggle(rowName: string, toggles: boolean[]): void {
    this.toggles[rowName] = toggles;
    this.toggleChangedSubject.next([]); // emit an event indicating toggle change
  }
}
