import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit {
  eventData: any = {
    titulo: '',
    descricao: '',
    data_hora_inicio: '',
    data_hora_fim: '',
    localizacao: '',
    capacidade: null,
    categoria_id: null
  };
  
  categories: any[] = [
    { id: 1, nome: 'Aula' },
    { id: 2, nome: 'Palestra' },
    { id: 3, nome: 'Show' },
    { id: 4, nome: 'Workshop' },
    { id: 5, nome: 'Reunião' },
    { id: 6, nome: 'Outro' }
  ];

  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
  }

  loadCategories(): void {
    this.apiService.getEventCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.errorMessage = 'Não foi possível carregar as categorias de evento.';
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.eventData.capacidade !== null) {
      this.eventData.capacidade = Number(this.eventData.capacidade);
    }

    this.apiService.createEvent(this.eventData).subscribe({
      next: (response) => {
        alert('Evento criado com sucesso!');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Erro ao criar evento:', err);
        this.errorMessage = `Erro ao criar evento: ${err.error.message || 'Verifique os dados e tente novamente.'}`;
      }
    });
  }
}