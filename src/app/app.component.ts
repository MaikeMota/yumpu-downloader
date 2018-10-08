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

  private _loading: boolean = false;
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

  public downloadAsPDF() {
    this.yumpuDocument.asPDF.save(this.yumpuDocument.name);
  }

  public downloadAsPng() {
    let fileName = `${this._actualPage + 1}.jpg`;
    FileUtil.downloadFromMemory(fileName, this.yumpuDocument.pages[this.actualPage].data);
  }

  public downloadAsZIP() {
    let fileName = this.yumpuDocument.name + '.zip';
    FileUtil.downloadFromMemory(fileName, this.yumpuDocument.asZIP);
  }

  public onChangeURL($event) {
    this._loading = true;
    this.service
      .retrieveDocumentFromURL($event.target.value)
      .then((document) => {
        this.yumpuDocument = document;
        this._loading = false;
      }).catch((error: YumpuServiceError) => {
        this.handleError(error);
        this._loading = false;
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

  public get loading(): boolean {
    return this._loading;
  }

  public get errorMessage(): string {
    return this._errorMessage;
  }
}
