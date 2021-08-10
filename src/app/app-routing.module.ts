import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { SearchComponent } from './components/contributions/search/search.component';
import { OutsideSpendingComponent } from './components/outside-spending/outside-spending/outside-spending.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
};

const routes: Routes = [
  {path: '', redirectTo: 'contributions/search', pathMatch: 'full'},
  {path: 'results', redirectTo: 'contributions/search/results', pathMatch: 'full'},
  {path: 'contributions/search', component: SearchComponent},
  {path: 'contributions/search/results', component: SearchResultsComponent},
  {path: 'outside-spending/candidate', component: OutsideSpendingComponent},
  {path: 'about', component: AboutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
