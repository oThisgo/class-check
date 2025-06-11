import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qrcode',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent {
  counter = signal(1);               
  secondsLeft = signal(20);          

  constructor() {
    setInterval(() => {
      this.counter.update((val) => val + 1);   
      this.secondsLeft.set(20);                
    }, 20000);

    setInterval(() => {
      this.secondsLeft.update((val) => val > 0 ? val - 1 : 0); 
    }, 1000);
  }
}
