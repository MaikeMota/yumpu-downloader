import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

import { PIPES } from './pipes';
import { SERVICE_PROVIDES } from './providers';


@NgModule({
  declarations: [
    AppComponent,
    ...PIPES
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    ...SERVICE_PROVIDES
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
