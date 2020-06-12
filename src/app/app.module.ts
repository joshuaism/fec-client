import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { ContributionTableComponent } from './contribution-table/contribution-table.component';
import { MultiTextComponent } from './multi-text/multi-text.component';
import { UsStatesComponent } from './us-states/us-states.component';

@NgModule({
  declarations: [
    AppComponent,
    ContributionTableComponent,
    MultiTextComponent,
    UsStatesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
