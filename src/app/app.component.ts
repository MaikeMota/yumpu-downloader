import { YumpuServiceError } from './services/yumpu.service';
import { Component } from '@angular/core';
import { YumpuDocument } from './model/index';
import { YumpuService } from './services/index';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/concat'

import * as jszip from 'jszip';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import * as jsPDF from 'jspdf'

import { environment } from '../environments/environment';
import { FileUtil } from './utils/FileUtil';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  private _preview;
  private _errorMessage: string;

  public preview() {
    if (!this._preview && this.yumpuDocument) {
      let out = this.yumpuDocument.asPDF.output('datauri');
    }
    return this._preview;
  }

  public yumpuDocument: YumpuDocument;
  private _actualPage = 0;

  constructor(private service: YumpuService, private domSanitazer: DomSanitizer) {

  }

  public nextPage() {
    if (this._actualPage < this.yumpuDocument.pages.length - 1)
      this._actualPage++;
  }

  public previousPage() {
    if (this._actualPage > 0) {
      this._actualPage--;
    }
  }

  public downloadPage() {
    var url = this.yumpuDocument.pages[this.actualPage].data;
    location.href = url;
  }

  public downloadAsPDF() {
    this.yumpuDocument.asPDF.save(this.yumpuDocument.name);
  }

  public downloadAsZIP() {
    let a = document.createElement("a");
    document.body.appendChild(a);
    let url = window.URL.createObjectURL(this.yumpuDocument.asZIP);
    a.href = url;
    a.download = this.yumpuDocument.name + '.zip';
    a.click();
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url);
  }

  public onChangeURL($event) {
    this.service
      .retrieveDocumentFromURL($event.target.value)
      .then((document) => {
        this.yumpuDocument = document;
      }).catch((error: YumpuServiceError) => {
        this.handleError(error);
      });
  }

  private handleError(error: YumpuServiceError) {
    this._errorMessage = error.message;
    setTimeout(() => {
      this._errorMessage = undefined;
    }, 15000);
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

  public get errorMessage(): string {
    return this._errorMessage;
  }
}
