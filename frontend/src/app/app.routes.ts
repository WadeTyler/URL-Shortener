import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {CodeComponent} from './code/code.component';
import {HomeComponent} from './home/home.component';

export const routes: Routes = [

  {
    path: "",
    component: HomeComponent,
    title: "Shorten a URL | USHO Pro"
  },
  {
    path: ":code",
    component: CodeComponent,
    title: "Validating URL | USHO Pro"
  },

];
