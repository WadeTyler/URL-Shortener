import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="loader">
      <circle cx="35" cy="35" r="33" stroke="url(#paint0_linear_2_2)" stroke-width="4"/>
      <defs>
        <linearGradient id="paint0_linear_2_2" x1="35" y1="0" x2="35" y2="70" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFC400"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>
  `,
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
