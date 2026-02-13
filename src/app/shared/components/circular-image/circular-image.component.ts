import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-circular-image',
  imports: [MatIcon, CommonModule],
  standalone: true,
  templateUrl: './circular-image.component.html',
  styleUrls: ['./circular-image.component.scss'],
})
export class CircularImageComponent {
  @Input() imageUrl: string = ''; // Input for the image URL
}
