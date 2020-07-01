import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { SearchResultsComponent } from './components/search-results/search-results.component';
const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  onSameUrlNavigation: 'reload',
};

const routes: Routes = [
  {path: 'results', component: SearchResultsComponent, runGuardsAndResolvers: 'paramsOrQueryParamsChange'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
