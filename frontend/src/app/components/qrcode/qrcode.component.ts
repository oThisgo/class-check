import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent implements OnInit, OnDestroy {
  isLoading = true;
  errorMessage: string | null = null;
  eventId: number= 1;
  qrCodeValue: string = '';
  intervalId: any;
  i: number = 0;
  baseUrl: string = window.location.origin; // base da URL para o link do QR code

  constructor(private apiService: ApiService, private route: ActivatedRoute) {
     this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.eventId  = Number(id) ;
    });
  }

  ngOnInit() {
    this.apiService.getEvent(this.eventId).subscribe({
      next: data => {
        this.updateQrCodeValue(data);
        this.isLoading = false;
        // Atualiza o QR code a cada minuto
        this.intervalId = setInterval(() => {
          this.i += 1;
          this.updateQrCodeValue(data);
        }, 60000);
      },
      error: err => {
        console.error("Erro ao buscar evento", err);
        this.errorMessage = "Não foi possível carregar o QR code do evento.";
        this.isLoading = false;
      }
    });
  }

  updateQrCodeValue(data: any) {
    // Exemplo de link: https://dominio.com/check-class?event={id}&token={token}&i={i}
    this.qrCodeValue = `${this.baseUrl}/check-class?event=${data.id}&token=${data.qr_code_token}&i=${this.i}`;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
