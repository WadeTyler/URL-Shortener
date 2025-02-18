import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {CodeComponent} from './code/code.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [

  {
    path: "",
    component: HomeComponent,
    title: "Wade's URL Shortener"
  },
  {
    path: ":code",
    component: CodeComponent,
    title: "URL Validator | Wade's URL Shortener"
  },

];
