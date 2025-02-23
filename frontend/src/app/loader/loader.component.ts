import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `
      <div class="wave-decoration">
        <svg viewBox="0 0 120 28">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feColorMatrix in="blur" values="
                                1 0 0 0 0
                                0 1 0 0 0
                                0 0 1 0 0
                                0 0 0 13 -9" result="goo" />
            </filter>
          </defs>
          <g filter="url(#goo)">
            <circle cx="15" cy="15" r="4" />
            <circle cx="35" cy="15" r="4" />
            <circle cx="55" cy="15" r="4" />
            <circle cx="75" cy="15" r="4" />
            <circle cx="95" cy="15" r="4" />
          </g>
        </svg>
      </div>
      <p>© 2020-2025 USHO Pro. All rights reserved.</p>
  `,
  styleUrl: './loader.component.css'
})
export class LoaderComponent {

}
