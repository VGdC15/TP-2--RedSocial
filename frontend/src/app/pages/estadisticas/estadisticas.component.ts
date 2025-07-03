import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';
import { ServicesService } from '../../services/services.service'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  @ViewChild('graficoPublicaciones') graficoPublicacionesRef!: ElementRef;
  @ViewChild('graficoComentarios') graficoComentariosRef!: ElementRef;
  @ViewChild('graficoComentariosPorPub') graficoComentariosPorPubRef!: ElementRef;

  fechaInicio!: string;
  fechaFin!: string;

  constructor(private estadisticasService: ServicesService) {}

  ngOnInit(): void {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(hoy.getMonth() - 1);

    this.fechaInicio = haceUnMes.toISOString().split('T')[0];
    this.fechaFin = hoy.toISOString().split('T')[0];

    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    const desde = this.fechaInicio;
    const hasta = this.fechaFin;

    this.estadisticasService.getEstadisticasPublicaciones(desde, hasta).subscribe({
      next: (data) => this.renderGraficoPublicaciones(data),
      error: (err) => console.error('Error publicaciones:', err)
    });

    this.estadisticasService.getEstadisticasComentarios(desde, hasta).subscribe({
      next: (data) => this.renderGraficoComentarios(data),
      error: (err) => console.error('Error comentarios:', err)
    });

    this.estadisticasService.getComentariosPorPublicacion(desde, hasta).subscribe({
      next: (data) => this.renderGraficoComentariosPorPublicacion(
        data.map(d => ({ publicacion: d.pieDeFoto, cantidad: d.cantidad }))
      ),
      error: (err) => console.error('Error comentarios por publicación:', err)
    });
  }

  renderGraficoPublicaciones(data: { nombre: string; cantidad: number }[]) {
    if (!this.graficoPublicacionesRef) return;

    const chart = echarts.init(this.graficoPublicacionesRef.nativeElement);
    const option = {
      title: { text: 'Publicaciones por Usuario', left: 'center', textStyle: { color: 'white' } },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(d => d.nombre),
        axisLabel: { color: 'white' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'white' }
      },
      series: [
        {
          type: 'bar',
          data: data.map(d => d.cantidad),
          itemStyle: { color: '#ff66b2' }
        }
      ],
      backgroundColor: 'transparent'
    };
    chart.setOption(option);
  }

  renderGraficoComentarios(data: { fecha: string; cantidad: number }[]) {
    if (!this.graficoComentariosRef) return;

    const chart = echarts.init(this.graficoComentariosRef.nativeElement);
    const option = {
      title: { text: 'Comentarios por Día', left: 'center', textStyle: { color: 'white' } },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: data.map(d => d.fecha),
        axisLabel: { color: 'white' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'white' }
      },
      series: [
        {
          type: 'line',
          data: data.map(d => d.cantidad),
          itemStyle: { color: '#66ccff' },
          smooth: true
        }
      ],
      backgroundColor: 'transparent'
    };
    chart.setOption(option);
  }


  renderGraficoComentariosPorPublicacion(data: { publicacion: string; cantidad: number }[]) {
    if (!this.graficoComentariosPorPubRef) return;

    const chart = echarts.init(this.graficoComentariosPorPubRef.nativeElement);
    const option = {
      title: { text: 'Comentarios por Publicación', left: 'center', textStyle: { color: 'white' } },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: data.map(d => d.publicacion),
        axisLabel: { color: 'white', rotate: 45 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'white' }
      },
      series: [
        {
          type: 'bar',
          data: data.map(d => d.cantidad),
          itemStyle: { color: '#99ff66' }
        }
      ],
      backgroundColor: 'transparent'
    };
    chart.setOption(option);
  }
}
