import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
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
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ChartsModule
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
