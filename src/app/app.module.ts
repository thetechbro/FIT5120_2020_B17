import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompareDialogComponent } from './compare-dialog/compare-dialog.component';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { SeeMoreDialogComponent } from './see-more-dialog/see-more-dialog.component';
import { SharedModule } from './shared.module';
import { NewTopbarComponent } from './new-topbar/new-topbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { FinancialComponent } from './financial/financial.component';
import { FindAgedCareComponent } from './find-aged-care/find-aged-care.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { Tableau65Component } from './tableau65/tableau65.component';
import { Tableau75Component } from './tableau75/tableau75.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    SearchDialogComponent,
    CompareDialogComponent,
    SeeMoreDialogComponent,
    NewTopbarComponent,
    HomepageComponent,
    FinancialComponent,
    FindAgedCareComponent,
    SearchResultComponent,
    Tableau65Component,
    Tableau75Component,
    FooterComponent,
    
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
