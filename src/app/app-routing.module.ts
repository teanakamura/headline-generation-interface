import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { DownloaderComponent } from './downloader/downloader.component';

const routes: Routes = [
  { path: '', component: DemoComponent },
  { path: 'downloader', component: DownloaderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
