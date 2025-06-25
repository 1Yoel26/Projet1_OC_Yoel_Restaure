import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';



@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent implements OnInit {
  // cette variable sert à afficher l'état de l'app (chargement des données, ereeur, ...)
  infoEtat: string = "";
  
  countryData?: Olympic;

  totalMedals: number = 0;
  totalAthletes: number = 0;
  totalParticipations: number = 0;


  // Propriétés du graphique
  barChartLabels: string[] = [];
  barChartData: ChartData<'line'> = {
  labels: [],
  datasets: []
};

  barChartType: ChartType = 'line';
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Médailles par année' }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
  const id = +this.route.snapshot.paramMap.get('id')!;
  
  // On commence par charger les données
  this.infoEtat = "Chargement des données ...";

  this.olympicService.loadInitialData().pipe(take(1)).subscribe({
    next: () => {
      // Une fois les données chargées, on récupère les olympics dans le BehaviorSubject
      this.olympicService.getOlympics().pipe(take(1)).subscribe((olympics) => {
        if (!olympics) {
          this.infoEtat = "Pas de données Olympic trouvé.";
          return;
        }


        const country = olympics.find(o => o.id === id);
        if (country) {
          this.countryData = country;

          this.totalParticipations = country.participations.length;
          this.totalMedals = country.participations.reduce((sum, p) => sum + p.medalsCount, 0);
          this.totalAthletes = country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
          
          this.totalAthletes = country.participations.reduce((sum, p) => sum + p.athleteCount, 0);
          
          // Préparer les données du graphique
          this.barChartData = {
          labels: country.participations.map(p => p.year.toString()),
          datasets: [
            { data: country.participations.map(p => p.medalsCount), label: 'Médailles' }
          ]
        };

        this.infoEtat = "Données chargées avec succès";
        
        } else {
          this.infoEtat = "Erreur, ce pays n'existe pas."
        }
      });
    },
    error: (err) => {
       if (!navigator.onLine) {
        this.infoEtat = "Aucune connexion Internet. Veuillez vérifier votre réseau.";
      } 
      else{
        this.infoEtat = "Erreur lors du chargement des données";
      }
      console.error('Erreur lors du chargement des données', err);
    }
  });
}


}
