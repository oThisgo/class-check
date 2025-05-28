import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/browser';

@Component({
  selector: 'app-check-class',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule], // Add RouterModule
  templateUrl: './check-class.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./check-class.component.scss']
})
export class CheckClassComponent {
  isScanning = false;
  formats = [BarcodeFormat.QR_CODE];
  currentDevice: MediaDeviceInfo | undefined;

  // Propriedades e métodos do menu lateral (copiados/adaptados do ProfileComponent)
  menuAberto = false;
  larguraTela = window.innerWidth;
  usuario = { // Dados mocados para o menu lateral, se necessário
    nome: 'Usuário Teste',
    imagemUrl: 'https://via.placeholder.com/80',
    email: 'usuario.teste&#64;example.com'
  };

  constructor() {
    this.verificarLarguraTela();
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      if (videoDevices.length > 0) {
        this.currentDevice = videoDevices[0];
      }
    }).catch(err => console.error("Erro ao enumerar dispositivos:", err));
  }

  onScanSuccess(qrCodeContent: string): void {
    console.log('QR Code lido:', qrCodeContent);
    this.isScanning = false;
    // Idealmente, em vez de alert, você faria algo mais integrado (ex: mostrar um modal, navegar, etc.)
    alert(`Conteúdo do QR Code: ${qrCodeContent}`);
  }

  startScanning(): void {
    this.isScanning = true;
    // Pode ser útil re-verificar dispositivos aqui se houver problemas
    // ou se o usuário puder mudar de câmera enquanto a página está aberta.
  }

  // Métodos do menu
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