import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { config } from 'src/config';

@Component({
  selector: 'app-edit-book-dialog',
  templateUrl: './edit-book-dialog.component.html',
  styleUrls: ['./edit-book-dialog.component.scss']
})
export class EditBookDialogComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<EditBookDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient) { }
  public bookData = new FormGroup({
    title: new FormControl(this.data.dataObject['title']),
    category: new FormControl(this.data.dataObject['category']['name']),
    price: new FormControl(this.data.dataObject['price']),
    author: new FormControl(this.data.dataObject['author']),
    description: new FormControl(this.data.dataObject['description']),
  });
  ngOnInit(): void {
    this.bookData.get('category').disable();

    console.log(this.data);

  }
  closeDialog() {
    this.matDialogRef.close({ isClose: true });
  }
  editBook() {
    this.http.put(config.serverName + ':' + config.port + '/books/' + this.data.displayContent['Book ID'], {
      "category": this.bookData.value.category,
      "title": this.bookData.value.title,
      "author": this.bookData.value.author,
      "price": this.bookData.value.price,
      "description": this.bookData.value.description

    }).subscribe(res => {
      console.log(res);
      //   {
      //     "category": 3,
      //     "title": "Overwat",
      //     "author": "Jeff",
      //     "price": "2000.000",
      //     "description": "Interest fund recent consumer enough almost trip least. Across sure raise future price. Easy address decade air power."
      // }
      this.matDialogRef.close({ isEdited: true });

    });
  }

}
