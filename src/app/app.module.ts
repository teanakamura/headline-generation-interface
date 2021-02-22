import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MobileNavComponent } from './mobile-nav/mobile-nav.component';
import { DemoComponent } from './demo/demo.component';
import { GenerateComponent } from './demo/generate/generate.component';
import { InputComponent } from './demo/generate/input/input.component';
import { SamplesComponent } from './demo/generate/samples/samples.component';
import { MenuComponent } from './menu/menu.component';
import { InstructionsComponent } from './demo/instructions/instructions.component';
import { AboutComponent } from './demo/about/about.component';
import { ExperimentDetailsComponent } from './demo/experiment-details/experiment-details.component';
import { TrainingStatisticsComponent } from './demo/training-statistics/training-statistics.component';
import { DownloaderComponent } from './downloader/downloader.component';


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
    DownloaderComponent,
    DemoComponent,
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
    MatSnackBarModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
