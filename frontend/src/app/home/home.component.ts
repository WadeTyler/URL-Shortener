import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ShortenerService} from '../../shortener.service';
import {ShortenedURL} from '../../types/ShortenedURL';
import {Clipboard, ClipboardModule} from '@angular/cdk/clipboard';
import {LoaderComponent} from '../loader/loader.component';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    ClipboardModule,
    LoaderComponent
  ],
  template: `
    <div class="content">
      <div class="container">
        <h1>USHO Pro - URL Shortener</h1>
        <p style="text-align: center; font-style: italic; color: var(--accent)">Fast, Simple, Reliable</p>
        <hr>
        @if (!shortenedURL) {
          <form [formGroup]="shortenURLForm" (submit)="handleSubmit()">
            <label for="url">URL</label>
            <input type="text" id="url" formControlName="url" placeholder="URL - Ex: https://google.com" required>

            <label for="expires">EXPIRES</label>
            <select id="expires" formControlName="expires" [value]="shortenURLForm.value.expires" required>
              <option value="1">1 Day</option>
              <option value="3">3 Days</option>
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>

            @if(!shortenerService.isShorteningURL) {
              <button>Shorten URL</button>
            }
            @else {
              <section class="">
                <app-loader></app-loader>
              </section>
            }

            @if (shortenerService.shortenURLErrorMessage) {
              <p class="error-message">{{ shortenerService.shortenURLErrorMessage }}</p>
            }
          </form>
        }

        @if (shortenedURL) {
          <div class="shortened-url-container">
            <p>URL Shortened!</p>
            <section class="">
              <a href="{{ codePrefix }}{{ shortenedURL.code }}" target="_blank">{{ codePrefix }}{{ shortenedURL.code }}</a>
              <button>
                <span class="material-symbols-outlined" (click)="copyURL()">file_copy</span>
              </button>
            </section>
            @if (isCopied) {
              <p>URL Copied</p>
            }
            <p class="go-back-btn" (click)="resetShortenedURL()">Shorten another URL</p>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'USHO Pro';

  codePrefix = environment.codePrefix;
shortenerService: ShortenerService = inject(ShortenerService);
  shortenedURL: ShortenedURL | undefined;

  shortenURLForm = new FormGroup({
    url: new FormControl("", [Validators.required, Validators.min(1)]),
    expires: new FormControl("7", [Validators.required, Validators.min(1)])
  });

  clipboard: Clipboard = inject(Clipboard);
  isCopied: boolean = false;

  async handleSubmit() {

    if (!this.shortenURLForm.value.expires || !this.shortenURLForm.value.url) return;

    // Convert expires to date format
    const date = new Date();
    date.setDate(date.getDate() + parseInt(this.shortenURLForm.value.expires));

    const expires = date.toISOString().slice(0, 10);
    console.log(expires);

    const shortenedURL = await this.shortenerService.shortenURL(this.shortenURLForm.value.url, expires);

    if (shortenedURL) {
      this.shortenedURL = shortenedURL;
    }
  }

  resetShortenedURL() {
    this.shortenerService.resetShortenedURL();
    this.shortenedURL = undefined;

    // Reset form values
    this.shortenURLForm.setValue({ url: "", expires: "7" });
    this.isCopied = false;
  }

  copyURL() {
    if (!this.shortenedURL) return;
    this.clipboard.copy(this.codePrefix + this.shortenedURL.code);
    this.isCopied = true;
  }
}
