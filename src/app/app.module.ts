import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExperimentDetailsComponent } from './experiment-details/experiment-details.component';
import { TrainingStatisticsComponent } from './training-statistics/training-statistics.component';
import { AboutComponent } from './about/about.component';
import {HttpClientModule} from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { GenerateComponent } from './generate/generate.component';
import { SamplesComponent } from './generate/samples/samples.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button'

import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { InputComponent } from './generate/input/input.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InstructionsComponent,
    ExperimentDetailsComponent,
    TrainingStatisticsComponent,
    AboutComponent,
    GenerateComponent,
    SamplesComponent,
    MobileNavComponent,
    InputComponent,
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
