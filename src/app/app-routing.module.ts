import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { FinancialComponent } from './financial/financial.component';
import { FindAgedCareComponent } from './find-aged-care/find-aged-care.component';



const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Home' },
  { path: 'Home', component: HomepageComponent },
  { path: 'financial', component: FinancialComponent },
  { path: 'aged-care-search', component: FindAgedCareComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
