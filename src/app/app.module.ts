import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { ContributionTableComponent } from './contribution-table/contribution-table.component';
import { MultiTextComponent } from './multi-text/multi-text.component';
import { UsStatesComponent } from './us-states/us-states.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ErrorIntercept } from './services/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ContributionTableComponent,
    MultiTextComponent,
    UsStatesComponent,
    BarChartComponent
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
