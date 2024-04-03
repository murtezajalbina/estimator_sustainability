import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MaterialRelatedMeasure } from './material-related-measure';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  toggles: { [key: string]: boolean[] } = {
    'Aluminium': [false, false, false, false],
    'Steel': [false, false, false, false],
    'Other': [false, false, false, false]
  };

  private toggleChangedSubject = new BehaviorSubject<object>({});
  toggleChanged = this.toggleChangedSubject.asObservable();

  getToggles(rowName: string): boolean[] {
    return this.toggles[rowName];
  }

  setToggle(rowName: string, toggles: boolean[]): void {
    this.toggles[rowName] = toggles;
    this.toggleChangedSubject.next({}); // emit an event indicating toggle change
  }
}

@Injectable({
  providedIn: 'root'
})
export class SelectedValuesService {
  private selectedValues: any[] = [];

  addSelectedValue(selectedValue: any) {
    this.selectedValues.push(selectedValue);
  }

  row: { [key: string]: any } = {
    'Measure': ['Select Measure'],
    'Material': ['Select Material'],
    'Year': [0],
    'Percent': [0]
  };

  private rowChangedSubject = new BehaviorSubject<object>({});
  rowChanged = this.rowChangedSubject.asObservable();

  getSelectedValues(rowName: string): any[] {
    return this.row[rowName];
  }

  setSelectedValues(rowName: string, row: any[]): void {
    this.row[rowName] = row;
    this.rowChangedSubject.next({}); // emit an event indicating row change
  }
}

@Injectable({
  providedIn: 'root'
})
export class TableUpdateService {
  rowAdded: EventEmitter<MaterialRelatedMeasure[]> = new EventEmitter<MaterialRelatedMeasure[]>();

  constructor() { }

  emitRowAdded(tableData: MaterialRelatedMeasure[]) {
    this.rowAdded.emit(tableData);
  }
}
