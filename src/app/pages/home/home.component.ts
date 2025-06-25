  import { Component, OnInit } from '@angular/core';
  import { ChartData, ChartType, plugins } from 'chart.js';
  import { OlympicService } from 'src/app/core/services/olympic.service';
  import { Olympic } from 'src/app/core/models/Olympic';
  import { Chart } from 'chart.js';
  import { Router } from '@angular/router';
  import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';

  // enregistrement du plugin pour afficher les nom des pays 
  // directement sur les parts du graphique
  Chart.register(ChartDataLabels);

  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  })

  export class HomeComponent implements OnInit {

    nombreDeJO: number = 0;
    nombreDePays: number = 0;

    // Pour indiquer le type de graphique dans le Html
    typeGraphique: ChartType = "pie";

    contenuGraphique: ChartData<"pie"> = {

      // noms associés au part du graphique pie
      labels: ["France", "Italie", "Angleterre"],

      // proportion de chaque part du graphique pour chaque pays
      datasets: [{data: [20, 45, 35]}]
    };


    // ajout des noms des pays sur les parts du graphique 
    // en configurant ce plugin :

    // ajout de la propriété CharDataLabel pour le html
    public ChartDataLabels = ChartDataLabels;

    public pluginDataLabel = {
      plugins : {
        datalabels : {
          formatter : (_value : number, ctx: Context) => {
            return ctx.chart.data.labels?.[ctx.dataIndex];
          },
          color: '#000' // texte avec couleur noir
        }
      }
    };

    
    
  

    ngOnInit(): void {

    }
     }
