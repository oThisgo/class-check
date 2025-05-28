import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === 'admin' && this.password === 'admin') {
      this.loginError = false;
      alert('Login realizado com sucesso!');
      this.router.navigate(['/profile']);

    } else {
      this.loginError = true;
    }
  }
}
