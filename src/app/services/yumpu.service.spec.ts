import {
  JsonpModule,
  Jsonp,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from "@angular/http";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { TestBed, fakeAsync, tick, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockBackend } from "@angular/http/testing";

import { YumpuService } from './yumpu.service';
import { YumpuDocument } from '../model/index';

const JSON_RESPONSE_59723863 = {
  document: {
    pages: {
      length: 46
    }
  }
}
const JSON_RESPONSE_59723392 = {
  document: {
    pages: {
      length: 30
    }
  }
}

describe('YumpuService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        YumpuService
      ]
    });

  });

  it('should be created', inject(
    [
      YumpuService
    ],
    (yumpService: YumpuService) => {
      expect(yumpService).toBeTruthy();
    }));

  it('should issue a request',
    async(
      // 2. inject HttpClient and HttpTestingController into the test
      inject(
        [
          YumpuService,
          HttpTestingController
        ],
        (yumpService: YumpuService, backend: HttpTestingController) => {
          yumpService
            .retrieveDocumentFromURL('https://www.yumpu.com/xx/document/view/59723863/loop-pijamas-outono-inverno-2018')
            .subscribe(document => {
            });

          backend.expectOne({
            url: 'https://www.yumpu.com/xx/document/json/59723863',
            method: 'GET'
          });
        })
    )
  );

  it('should get a YumpuDocument (59723863) after request',
    async(
      inject(
        [
          YumpuService,
          HttpTestingController
        ],
        (yumpService: YumpuService, backend: HttpTestingController) => {
          yumpService
            .retrieveDocumentFromURL('https://www.yumpu.com/xx/document/view/59723863/loop-pijamas-outono-inverno-2018')
            .subscribe(document => {
              expect(document).toBeDefined();
              expect(document.id).toBe('59723863');
              expect(document.name).toBe('loop-pijamas-outono-inverno-2018')
              expect(document.pages.length).toBe(46);
            });

          backend.match({
            url: 'https://www.yumpu.com/xx/document/json/59723863',
            method: 'GET'
          })[0].flush(JSON_RESPONSE_59723863);
        }
      )
    ));
  it('should get a YumpuDocument (59723392) after request',
    async(
      inject(
        [
          YumpuService,
          HttpTestingController
        ],
        (yumpService: YumpuService, backend: HttpTestingController) => {
          yumpService
            .retrieveDocumentFromURL('https://www.yumpu.com/xx/document/view/59723392/loop-bolsas-outono-inverno-2018')
            .subscribe(document => {
              expect(document).toBeDefined();
              expect(document.id).toBe('59723392');
              expect(document.name).toBe('loop-bolsas-outono-inverno-2018')
              expect(document.pages.length).toBe(30);
            });

          backend.match({
            url: 'https://www.yumpu.com/xx/document/json/59723392',
            method: 'GET'
          })[0].flush(JSON_RESPONSE_59723392);
        }
      )
    ))



  // Perform a request and make sure we get the response we expect
  /* service
    .retrieveDocumentFromURL('https://www.yumpu.com/xx/document/view/59723863/loop-pijamas-outono-inverno-2018')
    .then((document => {
      expect(document).toBeDefined();
      expect(document.name).toEqual("loop-pijamas-outono-inverno-2018");
      expect(document.pages.length).toEqual(46);
    })); */
});