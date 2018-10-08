import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { YumpuDocument, YumpuDocumentPage, PageDimensions } from '../model'

import * as jsPDF from 'jspdf'

import 'rxjs/add/operator/map'
import { FileUtil } from '../utils/FileUtil';

@Injectable()
export class YumpuService {

  constructor(private httpClient: HttpClient) {

  }

  public async retrieveDocumentFromURL(url: string): Promise<YumpuDocument> {
    let matchs: RegExpMatchArray = url.match(PLACEHOLDERS.URL_REGEX);
    if (matchs) {
      let language = matchs[1];
      let documentId = matchs[2];
      let documentName = matchs[3];
      let jsonApiUrl = YumpuURLs.JSON_API.replace(PLACEHOLDERS.LANGUAGE, language)
        .replace(PLACEHOLDERS.DOCUMENT_ID, documentId);
      let totalPages = await this.getTotalPages(jsonApiUrl);
      let yDoc: YumpuDocument = {
        id: documentId,
        name: documentName,
        pages: [],
      }
      await this.processPDF(yDoc, totalPages);
      await this.processZIP(yDoc);
      return Promise.resolve(yDoc);
    }
    return Promise.reject({
      code: 1,
      message: 'URL Inválida'
    });
  }

  private async processZIP(yDoc: YumpuDocument) {
    yDoc.asZIP = await FileUtil.zipDocument(yDoc);
  }

  private async processPDF(yDoc: YumpuDocument, totalPages: number) {
    yDoc.asPDF = new jsPDF();
    for (let i = 0; i < totalPages; i++) {
      yDoc.pages[i] = await this.getPage(yDoc.id, i + 1)
      if (i != 0) {
        yDoc.asPDF.addPage();
        //yDoc.asPDF.addPage([ yDoc.pages[i].dimensions.height,  yDoc.pages[i].dimensions.width]);
      }
      yDoc.asPDF.addImage(yDoc.pages[i].data, 0, 0, yDoc.asPDF.internal.pageSize.width, yDoc.asPDF.internal.pageSize.height);
    }
    Promise.resolve();
  }

  public async getTotalPages(url: string): Promise<number> {
    return this.httpClient.get(url).map((res: any) => res.document.pages.length).toPromise();;
  }

  public async getPage(documentId: string, pageNumber: number): Promise<YumpuDocumentPage> {
    return new Promise<YumpuDocumentPage>((resolve, reject) => {
      let requestUrl = YumpuURLs.IMAGE_API.replace(PLACEHOLDERS.DOCUMENT_ID, documentId)
        .replace(PLACEHOLDERS.PAGE_NUMBER, pageNumber.toString())
        .replace(PLACEHOLDERS.RESOLUTION, '1024x768')
      this.httpClient.get(requestUrl, {
        responseType: 'blob'
      }).toPromise()
        .then((res: any) => {
          let reader = new FileReader();
          reader.addEventListener("load", async () => {
            let data: string = reader.result;
            let pageDimensions: PageDimensions = await this.getPageDimensions(data);
            resolve({
              data: data,
              dimensions: pageDimensions
            });
          }, false);
          if (res) {
            reader.readAsDataURL(res);
          }
        })
    });
  }

  private async getPageDimensions(data: string): Promise<PageDimensions> {
    return new Promise<PageDimensions>((resolve, reject) => {
      let image = new Image();
      image.onload = () => {
        resolve({
          width: image.width,
          height: image.height
        });
      }
      image.src = data;
    });
  }

}

const PLACEHOLDERS = {
  DOCUMENT_ID: '{DOCUMENT_ID}',
  LANGUAGE: '{LANGUAGE}',
  PAGE_NUMBER: '{PAGE_NUMBER}',
  RESOLUTION: '{RESOLUTION}',
  URL_REGEX: /^https:\/\/www\.yumpu\.com\/([\w-]*)\/document\/view\/([\d]*)\/([\w-]*)$/,
}

const YumpuURLs = {
  IMAGE_API: `https://img.yumpu.com/${PLACEHOLDERS.DOCUMENT_ID}/${PLACEHOLDERS.PAGE_NUMBER}/${PLACEHOLDERS.RESOLUTION}`,
  JSON_API: `https://www.yumpu.com/${PLACEHOLDERS.LANGUAGE}/document/json/${PLACEHOLDERS.DOCUMENT_ID}`,

}

export interface YumpuServiceError {
  code: number;
  message: string;
}
