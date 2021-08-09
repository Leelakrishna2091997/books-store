import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { config } from 'src/config';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditBookDialogComponent } from '../edit-book-dialog/edit-book-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private matDialog: MatDialog) { }
  public categorySelect: any;
  public categoriesArray: any = [];
  public dataSource: any;
  public tableheaders: any;
  public tableData: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageSize: any = 5;
  pageNumber: any = 0;

  ngOnInit(): void {
    if (this.categoriesArray.length == 0) {
      this.getCategories();
    }

  }
  // books/category
  getCategories() {
    this.http.get(config.serverName + ':' + config.port + '/books/category', { observe: 'response' }).subscribe(res => {
      if (res && res.status == 200) {
        this.categoriesArray = res.body;
      }
    })
  }
  searchBook() {
    this.http.get(config.serverName + ':' + config.port + '/books/category-books/' + this.categorySelect).subscribe(res => {
      if (res) {
        this.setBooksTabularData(res);
      }
    })
  }
  setBooksTabularData(data) {
    this.tableData = data;
    this.dataSource = data.map((eachItem) => {
      let obj = {};
      Object.entries(eachItem).map((eachPair) => {
        if (eachPair[0] === "id") {
          obj['Book ID'] = eachPair[1];
        } else if (eachPair[0] !== "category") {
          obj[eachPair[0]] = eachPair[1];
        }
      });
      obj['Action'] = '';
      return obj;
    });
    this.tableheaders = Object.keys(this.dataSource[0]);
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }
  tabChanged(event) {
    console.log(event.index);

  }

  pagechg(event) {
    console.log(event);
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  // editBook(element) {
  // this.http.put(config.serverName+':'+config.port+'/books/'+element['Book ID'], {}, {observe: 'response'}).subscribe(res => {

  // })
  // }
  editBook(element, index) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '15vh',
      left: '15vw',
    };
    dialogConfig.closeOnNavigation = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '70vw';
    dialogConfig.height = '70vh';
    dialogConfig.data = {
      displayContent: element,
      dataObject: this.tableData[index]
    };
    const dialogRef = this.matDialog.open(EditBookDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // this.confirmCreation();
      }
    });
  }

  deleteBook(element) {
    this.http.delete(config.serverName + ':' + config.port + '/books/' + element['Book ID'], { observe: 'response' }).subscribe(res => {
      console.log(res);
      this.searchBook();
    });

  }
}
