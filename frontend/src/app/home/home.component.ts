import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators, ValueChangeEvent} from '@angular/forms';
import {ShortenerService} from '../../shortener.service';
import {ShortenedURL} from '../../types/ShortenedURL';
import {Clipboard, ClipboardModule} from '@angular/cdk/clipboard';
import {LoaderComponent} from '../loader/loader.component';
import {environment} from '../../environments/environment';
import {HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule,
    ClipboardModule,
    LoaderComponent
  ],
  templateUrl: 'home.component.html',
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

  isDarkTheme: boolean = false;

  ngOnInit(): void {
    const theme = localStorage.getItem('data-theme');
    this.isDarkTheme = theme === 'dark';
    if (this.isDarkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      (document.getElementById('checkbox') as HTMLInputElement).checked = true;
    }
  }

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
    this.shortenURLForm.setValue({url: "", expires: "7"});
    this.isCopied = false;
  }

  copyURL() {
    if (!this.shortenedURL) return;
    this.clipboard.copy(this.codePrefix + this.shortenedURL.code);
    this.isCopied = true;
  }

  handleThemeSwitch(e: any) {
    const isCheck = (e.target as HTMLInputElement).checked;
    this.isDarkTheme = isCheck;
    document.documentElement.setAttribute('data-theme', isCheck ? 'dark' : 'light');
    localStorage.setItem('data-theme', isCheck ? 'dark' : 'light');
  }
}
