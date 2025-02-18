import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ShortenerService} from '../../shortener.service';
import {LoaderComponent} from '../loader/loader.component';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  template: `
    <div>
      @if (!shortenerService.isValidatingCode && shortenerService.validateCodeErrorMessage) {
        <p>Sorry, the URL you're looking for is invalid.</p>
        <p>{{ shortenerService.validateCodeErrorMessage }}</p>
        <button (click)="navigateToShorten()">Shorten a URL</button>
      }
      @if (shortenerService.isValidatingCode) {

        <section>
          <app-loader></app-loader>
        </section>

      }

    </div>
  `,
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  shortenerService: ShortenerService = inject(ShortenerService);

  code: string = "";

  constructor() {
    this.code = this.route.snapshot.params["code"];
    console.log(this.code);

    this.loadURL(this.code);
  }

  async loadURL(code: string) {
    const shortenedURL = await this.shortenerService.validateCode(code);

    if (shortenedURL) {
      window.location.href = shortenedURL.url;
    }
  }

  async navigateToShorten() {
    await this.router.navigateByUrl("");
  }
}
