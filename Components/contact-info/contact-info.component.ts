import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-contact-info',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})
export class ContactInfoComponent {
  @Input() contactTitle: string = '';
  @Input() email: string | null = '';


}
