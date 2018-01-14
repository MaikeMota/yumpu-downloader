import { Component } from '@angular/core';
import { YumpuDocument } from './model/index';
import { YumpuService } from './services/index';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concat'

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import * as jsPDF from 'jspdf'

import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  private _preview;

  public preview() {
    if (!this._preview && this.doc) {
      let out = this.doc.asPDF.output('datauri');
    }
    return this._preview;
  }

  public doc: YumpuDocument;
  private _actualPage = 0;

  constructor(private service: YumpuService, private domSanitazer: DomSanitizer) {

  }

  public nextPage() {
    if (this._actualPage < this.doc.pages.length - 1)
      this._actualPage++;
  }

  public previousPage() {
    if (this._actualPage > 0) {
      this._actualPage--;
    }
  }

  public download() {
    this.doc.asPDF.save(this.doc.name);
  }

  public onChangeURL($event) {
    this.service
      .retrieveDocumentFromURL($event.target.value)
      .then((document) => {
        this.doc = document;
      }).catch((error) => {
        console.log(error);
      });
  }

  public changeValue() {
    var copyText = (document.getElementById('copy') as HTMLInputElement)
    copyText.select();
    let success = document.execCommand("copy");
    var pasteText = (document.getElementById('paste') as HTMLInputElement);
    pasteText.focus();
    document.execCommand("paste");
    pasteText.blur();
    //alert("Copied the text: " + copyText.value);
  }

  public get actualPage(): number {
    return this._actualPage;
  }

  public get isDevMod(): boolean {
    return !environment.production;
  }
}
