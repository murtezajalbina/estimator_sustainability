import { Component, OnInit } from '@angular/core';
import { DataServiceEmissions, SelectedItemService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransformationService } from '../transformation.service';

@Component({
  selector: 'app-product-choice',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-choice.component.html',
  styleUrls: ['../app.component.css']
})
export class ProductChoiceComponent implements OnInit {
  [x: string]: any;
  arrayList: any[] = [];
  selectedValue: string = "Open this select menu"; // Initial value

  constructor( private dataService: DataServiceEmissions,private selectedItemService: SelectedItemService, private driveData: TransformationService) {}

  ngOnInit() {
  /*   this.dataService.getData().subscribe((data) => {
      //read emissions data
      this['data'] = data;
    }); */
    this.driveData.getProducts().subscribe((data) => {
      this['data'] = data;
    });
 
    this.arrayList = this['data'];
    this.selectedValue = this.arrayList[0];

  }

  handleSelectionChange() {
    this.shareSelectedItem(this.selectedValue);
  }

  shareSelectedItem(selectedItem: string) {
    // Implement your logic to share the selected item with other components
    this.selectedItemService.updateSelectedItem(selectedItem);
    // Add your logic here to communicate with other components
  }
}
