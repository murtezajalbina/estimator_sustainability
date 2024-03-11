// selected-item.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedItemService {
  private selectedItemSubject = new BehaviorSubject<string | null>(null);
  selectedItem$ = this.selectedItemSubject.asObservable();

  /**
   * Die Methode `clearSelectedItem` wird verwendet, um die ausgewählte Maßnahme zu löschen.
   * Sie setzt den Wert des `selectedItemSubject` auf `null`, was bedeutet, dass keine Maßnahme ausgewählt ist.
   */
  clearSelectedItem() {
    this.selectedItemSubject.next(null);
  }
}
