  import { Component, OnInit } from '@angular/core';
  import { ChartData, ChartType, plugins } from 'chart.js';
  import { OlympicService } from 'src/app/core/services/olympic.service';
  import { Olympic } from 'src/app/core/models/Olympic';
  import { Chart } from 'chart.js';
  import { Router } from '@angular/router';
  import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
  import { BehaviorSubject, map, Observable, tap } from 'rxjs';

  // enregistrement du plugin pour afficher les nom des pays 
  // directement sur les parts du graphique
  Chart.register(ChartDataLabels);

  // création de l'interface qui va contenir toutes les données que 
  // j'ai besoin afin, de typer mon observable 
    interface statistiquesJO{
        nbJo: number;
        /*tabNomDesPays: string[];
        infoPourGraphique:{
          nomDuPays: string[];
          idDuPays: number;
          nbDeMedailles: number[];
        } */
    }


  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  })

  export class HomeComponent implements OnInit {

    infoEtat: string = "";


    // création de l'observable qui va reçevoir toutes les données des JO
    observableContenuJO$!: Observable<Olympic[] | null>;

    observableInfoPratiqueJO!: Observable<statistiquesJO | null>;

    // création du constructeur pour injecter automatiquement 
    // le service OlympicService
    constructor(private serviceOlympic: OlympicService){}

    // Pour indiquer le type de graphique dans le Html
    typeGraphique: ChartType = "pie";

    contenuGraphique: ChartData<"pie"> = {

      // noms associés au part du graphique pie
      labels: ["fr", "AN"],

      // proportion de chaque part du graphique pour chaque pays
      datasets: [{data: [10, 90]}]
    
    };

    
    ngOnInit(): void {

      // appel de la fonction load pour charger les données dans l'Observable
      this.serviceOlympic.loadInitialData().subscribe({

        next: () => {
          this.infoEtat = "Données en cours de chargement ...";
        },

        error: () => {
          this.infoEtat = "Erreur lors du chargement des données";
        }
      });
      

      // appel de la fonction get pour recuperer l'observable du service avec 
      // ses données chargés, puis affecter son contenu à observableContenuJO$.
      this.observableContenuJO$ = this.serviceOlympic.getOlympics();
      

      // Création de l'observable qui va contenir toutes les
      // données que j'ai besoin

      this.observableInfoPratiqueJO = this.observableContenuJO$.pipe(
        map(
          () => ({nbJo: 150})
        )
      );



    }



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

    

     }
