import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() imagen: string = '';
  @Input() pieDeFoto: string = '';
  @Input() fecha: string = '';
  @Input() usuario: string = '';

}
