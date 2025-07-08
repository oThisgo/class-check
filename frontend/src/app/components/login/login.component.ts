import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service'; 
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loginError = false;

  constructor(private router: Router, private apiService: ApiService) {}

  onLogin(): void {
    const credentials = { email: this.email, senha: this.password };
    
    this.apiService.login(credentials).subscribe({
      next: (response) => {

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        this.loginError = false;
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.loginError = true;
      }
    });
  }
}
