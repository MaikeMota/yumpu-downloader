import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { YumpuDocument, YumpuDocumentPage } from '../model'
import { Observable } from 'rxjs/Observable';

import * as jsPDF from 'jspdf'

import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map'

@Injectable()
export class YumpuService {

  constructor(private httpClient: HttpClient) {

  }

  public async retrieveDocumentFromURL(url: string): Promise<YumpuDocument> {
    let matchs: RegExpMatchArray = url.match(PLACEHOLDERS.URL_REGEX);
    if (matchs) {
      let documentId = matchs[1];
      let documentName = matchs[2];
      let jsonApiUrl = YumpuURLs.JSON_API.replace(PLACEHOLDERS.DOCUMENT_ID, documentId);
      let totalPages = await this.getTotalPages(jsonApiUrl);
      let yDoc: YumpuDocument = {
        id: documentId,
        name: documentName,
        pages: [],
      }
      let pdf = new jsPDF();

      for (let i = 0; i < totalPages; i++) {
        yDoc.pages[i] = {
          data: await this.getImage(documentId, i+1)
        }
        if (i != 0) {
          pdf.addPage();
        }
        pdf.addImage(yDoc.pages[i].data, 0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height);
      }
      yDoc.asPDF = pdf;
      return Promise.resolve(yDoc);
    }
    return Promise.reject('Cannot resolve URL');
  }

  public async getTotalPages(url: string): Promise<number> {
    return this.httpClient.get(url).map((res: any) => res.document.pages.length).toPromise();;
  }

  public async getImage(documentId: string, pageNumber: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get(`https://img.yumpu.com/${documentId}/${pageNumber}/1920x1080`, {
        responseType: 'blob'
      }).toPromise()
        .then((res: any) => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            resolve(reader.result);
          }, false);
          if (res) {
            reader.readAsDataURL(res);
          }
        })
    });
  }

}

const PLACEHOLDERS = {
  DOCUMENT_ID: '{DOCUMENT_ID}',
  URL_REGEX: /^https:\/\/www\.yumpu\.com\/xx\/document\/view\/([\d]*)\/([\w-]*)$/,
}

const YumpuURLs = {
  JSON_API: `https://www.yumpu.com/xx/document/json/${PLACEHOLDERS.DOCUMENT_ID}`,

}
