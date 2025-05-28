import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Interface para eventos que o usuário participou
interface EventoParticipado {
  id: number;
  titulo: string;
  data: string;
  status: 'Presente' | 'Falta';
  detalhes?: {
    local: string;
    horario: string;
    professor: string;
    observacoes: string;
    arquivos: string[];
  };
  expandido?: boolean;
}

// Interface para participantes de um evento criado pelo usuário
interface ParticipanteEvento {
  nome: string;
  horarioPresenca: string;
}

// Interface para eventos criados pelo usuário
interface EventoCriado {
  id: number;
  titulo: string;
  // data: string; // Data do evento, se necessário
  participantes: ParticipanteEvento[];
  linkQrCode: string; // e.g., '/qrcode' ou pode ser dinâmico '/qrcode/eventoId'
  expandido?: boolean;
}


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  menuAberto = false;
  larguraTela = window.innerWidth;

  usuario = {
    nome: 'Thiago Schiedeck',
    imagemUrl: 'https://preview.redd.it/1icg9y867o461.jpg?auto=webp&s=40c7e7ba390e56382c1ab0f8efcbed5a3eb86521',
    email: 'thiago@gmail.com' // E-mail corrigido
  };

  // Eventos que o usuário participou
  eventosParticipados: EventoParticipado[] = [
    {
      id: 1,
      titulo: 'Aula de Angular Avançado',
      data: '25/05/2024',
      status: 'Presente',
      detalhes: {
        local: 'Sala 101',
        horario: '19:00 - 22:00',
        professor: 'Dr. Angular',
        observacoes: 'Trazer notebook e muita vontade de aprender.',
        arquivos: ['material_aula.pdf', 'exercicios.zip']
      },
      expandido: false
    },
    {
      id: 2,
      titulo: 'Workshop Microfrontends',
      data: '10/06/2024',
      status: 'Falta',
      detalhes: {
        local: 'Auditório Principal',
        horario: '09:00 - 17:00',
        professor: 'Maria Frontend',
        observacoes: 'Evento de dia inteiro, com coffee break.',
        arquivos: ['apresentacao.pptx']
      },
      expandido: false
    }
  ];

  // Eventos criados pelo usuário (mock data)
  eventosCriados: EventoCriado[] = [
    {
      id: 101,
      titulo: 'Palestra de Introdução ao TypeScript',
      // data: '30/05/2024',
      participantes: [
        { nome: 'Carlos Silva', horarioPresenca: '14:05' },
        { nome: 'Amanda Souza', horarioPresenca: '14:07' },
        { nome: 'Rodrigo Alves', horarioPresenca: '14:15' }
      ],
      linkQrCode: '/qrcode', // Ou, por exemplo, `/qrcode/101` se for dinâmico
      expandido: false
    },
    {
      id: 102,
      titulo: 'Meetup Desenvolvedores Locais',
      // data: '15/06/2024',
      participantes: [
        { nome: 'Juliana Lima', horarioPresenca: '19:02' },
        { nome: 'Fernando Costa', horarioPresenca: '19:03' }
      ],
      linkQrCode: '/qrcode', // Ou `/qrcode/102`
      expandido: false
    }
  ];


  constructor() {
    this.verificarLarguraTela();
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu(): void {
    if (this.menuAberto) {
      this.menuAberto = false;
    }
  }

  // Método genérico para toggle de detalhes
  toggleDetalhes(item: { expandido?: boolean }): void {
    item.expandido = !item.expandido;
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