import { Injectable } from '@angular/core';
import {ShortenedURL} from './types/ShortenedURL';
import {environment} from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShortenerService {

  private API_URL: string = environment.apiUrl;

  shortenURLErrorMessage: string = "";
  isShorteningURL: boolean = false;
  validateCodeErrorMessage: string = "";
  isValidatingCode: boolean = false;

  constructor() {

  }

  public async shortenURL(url: string, expires: string): Promise<ShortenedURL | undefined> {

    this.isShorteningURL = true;
    this.shortenURLErrorMessage = "";

    try {
      const response = await fetch(`${this.API_URL}/url/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url,
          expires
        })
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message);
      }

      this.isShorteningURL = false;

      return json.data;

    } catch (err) {
      this.shortenURLErrorMessage = (err as Error).message || "Failed to shorten URL";
      this.isShorteningURL = false;
      return undefined;
    }

  }

  public resetShortenedURL(): void {
    this.shortenURLErrorMessage = "";
    this.isShorteningURL = false;
  }

  public async validateCode(code: string): Promise<ShortenedURL | undefined> {
    this.isValidatingCode = true;
    this.validateCodeErrorMessage = "";
    try {
      const response = await fetch(`${this.API_URL}/url/validate/${code}`);

      const json = await response.json();

      if (!response.ok) throw new Error(json.message);

      this.isValidatingCode = false;

      return json.data;
    } catch (err) {
      this.isValidatingCode = false;
      this.validateCodeErrorMessage = (err as Error).message || "Failed to validate code";
      return undefined;
    }

  }

}
