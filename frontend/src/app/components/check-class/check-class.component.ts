import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core'; // MODIFICADO: Adicionado OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/browser';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-check-class',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule, HttpClientModule],
  templateUrl: './check-class.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./check-class.component.scss']
})

export class CheckClassComponent implements OnInit { 
  isScanning = false;
  formats = [BarcodeFormat.QR_CODE];
  currentDevice: MediaDeviceInfo | undefined;

  menuAberto = false;
  larguraTela = window.innerWidth;

  usuario = {
    nome: 'Usuário',
    email: 'Carregando...',
    imagemUrl: 'assets/images/default-profile.png' 
  };

  constructor(private apiService: ApiService) {
    this.verificarLarguraTela();
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      if (videoDevices.length > 0) {
        this.currentDevice = videoDevices[0];
      }
    }).catch(err => console.error("Erro ao enumerar dispositivos:", err));
  }

  ngOnInit(): void {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      this.usuario = {
        nome: userData.nome || 'Usuário',
        email: userData.email || 'email@exemplo.com',
        imagemUrl: userData.imagemUrl || 'assets/images/default-profile.png'
      };
    }
  }

  onScanSuccess(qrCodeContent: string): void {
    console.log('QR Code lido:', qrCodeContent);
    this.isScanning = false;

    const [eventoId, qrToken] = qrCodeContent.split(';');

    if (!eventoId || !qrToken) {
      alert('QR Code inválido!');
      return;
    }
    
    this.apiService.registerPresence(eventoId, qrToken).subscribe({
      next: (response) => {
        alert('Presença registrada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao registrar presença:', err);
        alert(`Erro: ${err.error.message || 'Não foi possível registrar a presença.'}`);
      }
    });
  }

  startScanning(): void {
    this.isScanning = true;
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    if (this.menuAberto) {
      this.menuAberto = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void {
    this.verificarLarguraTela();
  }

  private verificarLarguraTela(): void {
    this.larguraTela = window.innerWidth;
  }

  pararPropagacao(event: MouseEvent): void {
    event.stopPropagation();
  }
}