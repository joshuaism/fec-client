import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ContributionTableComponent } from './components/contribution-table/contribution-table.component';
import { MultiTextComponent } from './components/multi-text/multi-text.component';
import { UsStatesComponent } from './components/us-states/us-states.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ErrorIntercept } from './services/error.interceptor';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { OutsideSpendingComponent } from './components/outside-spending/outside-spending/outside-spending.component';
import { SearchComponent } from './components/contributions/search/search.component';
import { AboutComponent } from './components/about/about.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateDropdownComponent } from './components/outside-spending/candidate-dropdown/candidate-dropdown.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OutsideSpendingResultsComponent } from './components/outside-spending/outside-spending-results/outside-spending-results.component';
import { ExpenditureTableComponent } from './components/outside-spending/expenditure-table/expenditure-table.component';

@NgModule({
  declarations: [
    AppComponent,
    ContributionTableComponent,
    MultiTextComponent,
    UsStatesComponent,
    BarChartComponent,
    SearchResultsComponent,
    OutsideSpendingComponent,
    SearchComponent,
    AboutComponent,
    CandidateDropdownComponent,
    OutsideSpendingResultsComponent,
    ExpenditureTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule,
    NoopAnimationsModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
