import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  menuAberto = false;
  larguraTela = window.innerWidth;

  usuario: any = { nome: 'Carregando...' };
  eventosCriados: any[] = [];
  eventosParticipados: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {
    this.verificarLarguraTela();
  }

  ngOnInit(): void {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      this.usuario = JSON.parse(userDataString);
      if (!this.usuario.imagemUrl) {
        this.usuario.imagemUrl = 'assets/images/default-profile.png';
      }
      this.carregarEventos();
    } else {
      this.isLoading = false;
      this.errorMessage = "Não foi possível carregar os dados do usuário. Faça o login novamente.";
    }
  }

  carregarEventos(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const userId = this.usuario.id;

    if (!userId) {
      this.errorMessage = "ID do usuário não encontrado.";
      this.isLoading = false;
      return;
    }

    this.apiService.getCreatedEvents(userId).subscribe({
      next: data => {
        // Adiciona as propriedades 'expandido', 'participantes' e 'participantesLoading'
        this.eventosCriados = data.map((evento: any) => ({
          ...evento,
          expandido: false,
          participantes: [],
          participantesLoading: false
        }));
        this.isLoading = false;
      },
      error: err => {
        console.error("Erro ao buscar eventos criados", err);
        this.errorMessage = "Não foi possível carregar seus eventos criados.";
        this.isLoading = false;
      }
    });

    this.apiService.getParticipatedEvents(userId).subscribe({
      next: data => {
        this.eventosParticipados = data.map((evento: any) => ({ ...evento, expandido: false }));
      },
      error: err => {
        console.error("Erro ao buscar eventos participados", err);
      }
    });
  }

  toggleDetalhes(evento: any, isCriadoPorMim = false): void {
    evento.expandido = !evento.expandido;

    // Se o evento foi criado pelo usuário e está sendo expandido, busca os participantes
    if (isCriadoPorMim && evento.expandido && evento.participantes.length === 0) {
      evento.participantesLoading = true;
      this.apiService.getAttendees(evento.id).subscribe({
        next: (participantes) => {
          evento.participantes = participantes;
          evento.participantesLoading = false;
        },
        error: (err) => {
          console.error(`Erro ao buscar participantes para o evento ${evento.id}`, err);
          evento.participantesLoading = false;
          // Você pode adicionar uma mensagem de erro específica para os participantes aqui se desejar
        }
      });
    }
  }

  toggleMenu(): void { this.menuAberto = !this.menuAberto; }
  fecharMenu(): void { if (this.menuAberto) { this.menuAberto = false; } }
  @HostListener('window:resize', ['$event'])
  onResize(event?: Event): void { this.verificarLarguraTela(); }
  private verificarLarguraTela(): void { this.larguraTela = window.innerWidth; }
  pararPropagacao(event: MouseEvent): void { event.stopPropagation(); }
}