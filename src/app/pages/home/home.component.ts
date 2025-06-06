import { Component, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { take } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels); 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChartType: ChartType = 'pie';

  public ChartDataLabels = ChartDataLabels;

  // pour afficher le nom de chaque pays a coté de sa part du graphique
  public pieChartOptions = {
  plugins: {
    datalabels: {
      formatter: (value: number, context: any) => {
        return context.chart.data.labels[context.dataIndex];
      },
      color: '#000',
    },
  },
};


  public nombreDeJO: number = 0;
  public nombreDePays: number = 0;

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    console.log('ngOnInit lancé !');

    this.olympicService.loadInitialData().pipe(take(1)).subscribe(() => {
      
      this.olympicService.getOlympics().pipe(take(1)).subscribe((olympics) => {
        
        if (!olympics || olympics.length === 0) {
          console.warn('⚠️ Aucune donnée reçue !');
          return;
        }

        // Compte le nb total de JO en comptant le nb d'année unique
        const allYears = olympics
        .flatMap(country => country.participations.map(p => p.year)); // récupère toutes les années
        const uniqueYears = [...new Set(allYears)]; // garde uniquement les années uniques
        this.nombreDeJO = uniqueYears.length;

        this.nombreDePays = olympics.length;

        const labels = olympics.map((country) => country.country);
        const data = olympics.map((country) =>
          country.participations.reduce((total, p) => total + p.medalsCount, 0)
        );

        this.pieChartData = {
          labels,
          datasets: [{ data }],
        };
      });
    });
  }
}
