import { Component, signal, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements OnInit {
  secondsLeft = signal(20);

  isLoading = true;
  errorMessage: string | null = null;
  eventId: number= 1; // Substitua pelo ID do evento real
  qrCodeToken: string = '';
  object: any = {};

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
     this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.eventId  = Number(id) ;
    });

    setInterval(() => {
      this.secondsLeft.update((val) => val > 0 ? val - 1 : 0);
    }, 1000);
  }

  ngOnInit() {
    console.log(1)
    this.apiService.getEvent(this.eventId).subscribe({
      next: data => {
        this.qrCodeToken = data.qr_code_token;
      },
      error: err => {
        console.error("Erro ao buscar eventos criados", err);
        this.errorMessage = "Não foi possível carregar seus eventos criados.";
        this.isLoading = false;
      }
    });
  }
}
