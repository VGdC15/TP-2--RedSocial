import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../component/card/card.component';
import { RouterLink } from '@angular/router';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [ReactiveFormsModule, CardComponent, RouterLink],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  @ViewChild('audioPlayer', { static: true }) audioPlayer!: ElementRef<HTMLAudioElement>;
  private http = inject(HttpClient);
  services = inject(ServicesService);

  publicaciones: any[] = [];
  usuarios: any[] = [];

  usuarioControl = new FormControl<string | null>(null);

  offset = 0;
  limit = 10;
  ordenarPor: 'fecha' | 'like' = 'fecha';
  hayMasPublicaciones = false;

  currentSongIndex = 0;
  isPlaying = false;
  audio = new Audio();
  progress = 0;
  currentTime = '0:00';
  duration = '0:00';


  ngOnInit(): void {
    this.loadSong();
    this.audioPlayer.nativeElement.addEventListener('timeupdate', () => {
      this.updateProgress();
    });
    this.audioPlayer.nativeElement.addEventListener('loadedmetadata', () => {
      this.updateProgress();
    });

    this.cargarUsuarios();
    this.usuarioControl.valueChanges.subscribe(() => {
      this.offset = 0;
      this.cargarPublicaciones();
    });
    this.cargarPublicaciones();
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:3000/usuarios', { headers }).subscribe({
      next: (res) => (this.usuarios = res),
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  cargarPublicaciones(): void {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const usuarioId = this.usuarioControl.value;

    const params: any = {
      ordenarPor: this.ordenarPor,
      offset: this.offset,
      limit: this.limit,
    };
    if (usuarioId) {
      params.usuarioId = usuarioId; 
    }

    this.services.obtenerPublicaciones(params).subscribe({
      next: (res: any[]) => {
        this.publicaciones = res;
        this.hayMasPublicaciones = res.length === this.limit;

      },
      error: (err: any) => {
        console.error('Error al cargar publicaciones', err);
      }
    });

  }

  cambiarOrden(orden: 'fecha' | 'like') {
    this.ordenarPor = orden;
    this.offset = 0;
    this.cargarPublicaciones();
  }

  siguientePagina() {
    this.offset += this.limit;
    this.cargarPublicaciones();
  }

  anteriorPagina() {
    this.offset = Math.max(this.offset - this.limit, 0);
    this.cargarPublicaciones();
  }


  limpiarFiltro(): void {
    this.usuarioControl.setValue(null);
    this.offset = 0;
    this.cargarPublicaciones();
  }

  songs = [
    {
      title: 'Distance',
      artist: 'Eelke Kleijn',
      url: 'assets/audio/Distance.mp3'
    },
    {
      title: 'Heaven Scent',
      artist: 'John Digweed',
      url: 'assets/audio/HeavenScent.mp3'
    }
  ];

  loadSong() {
    const song = this.songs[this.currentSongIndex];
    this.audioPlayer.nativeElement.src = song.url;
    this.audioPlayer.nativeElement.load();
    this.updateTrackInfo();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
    } else {
      this.audioPlayer.nativeElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.loadSong();
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
  }

  prevSong() {
    this.currentSongIndex =
      (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.loadSong();
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
  }

  updateTrackInfo() {
    const song = this.songs[this.currentSongIndex];

  }

  updateProgress() {
    const audio = this.audioPlayer.nativeElement;
    const current = audio.currentTime;
    const total = audio.duration || 0;

    this.progress = total ? (current / total) * 100 : 0;
    this.currentTime = this.formatTime(current);
    this.duration = this.formatTime(total);
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  }

  seekTo(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    const duration = this.audioPlayer.nativeElement.duration || 0;
    this.audioPlayer.nativeElement.currentTime = (value / 100) * duration;
  }


}
