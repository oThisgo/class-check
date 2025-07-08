import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core'; // MODIFICADO: Adicionado OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/browser';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-class',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule, RouterModule, HttpClientModule, FormsModule],
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
  showRegisterForm = false;
  registerData = { nome: '', email: '' };
  qrCodeParams: { eventoId: string, qrToken: string } | null = null;

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

    try {
      const url = new URL(qrCodeContent);
      const eventoId = url.searchParams.get('event');
      const qrToken = url.searchParams.get('token');
      const iParam = url.searchParams.get('i');
      const i = iParam ? Number(iParam) : null;

      if (!eventoId || !qrToken || i === null) {
        alert('QR Code inválido!');
        return;
      }

      const now = new Date();
      const currentMinute = Math.floor(now.getTime() / 60000);
      if (i !== currentMinute) {
        alert('QR Code expirado! Por favor, escaneie o código atualizado.');
        return;
      }

      // Verifica se usuário está logado
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        // Exibe formulário de cadastro
        this.showRegisterForm = true;
        this.qrCodeParams = { eventoId, qrToken };
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
    } catch (e) {
      alert('QR Code inválido!');
      return;
    }
  }

  onRegisterSubmit() {
    // Preenche campos genéricos
    const userData = {
      nome: this.registerData.nome,
      email: this.registerData.email,
      senha: '123456', // senha padrão
      tipo: 'participante',
      empresa: 'N/A',
      telefone: 'N/A',
      // outros campos genéricos se necessário
    };
    this.apiService.register(userData).subscribe({
      next: (user) => {
        localStorage.setItem('userData', JSON.stringify(user));
        this.usuario = {
          nome: user.nome,
          email: user.email,
          imagemUrl: user.imagemUrl || 'assets/images/default-profile.png'
        };
        this.showRegisterForm = false;
        // Após cadastro, registra presença
        if (this.qrCodeParams) {
          this.apiService.registerPresence(this.qrCodeParams.eventoId, this.qrCodeParams.qrToken).subscribe({
            next: (response) => {
              alert('Presença registrada com sucesso!');
            },
            error: (err) => {
              console.error('Erro ao registrar presença:', err);
              alert(`Erro: ${err.error.message || 'Não foi possível registrar a presença.'}`);
            }
          });
        }
      },
      error: (err) => {
        alert('Erro ao cadastrar usuário: ' + (err.error.message || 'Tente novamente.'));
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