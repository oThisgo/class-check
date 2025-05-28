import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Adicione esta linha

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule], // Inclua CommonModule aqui
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  password2 = '';
  registerError = false;

  onRegister(): void {
    if (this.name === 'admin' && this.password === 'admin' && this.password2 === this.password) {
      this.registerError = false;
      alert('Cadastro realizado com sucesso!');
    } else {
      this.registerError = true;
    }
  }
}
