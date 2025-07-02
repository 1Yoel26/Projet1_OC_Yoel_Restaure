  import { Component, OnInit } from '@angular/core';
  import { ActiveElement, ChartData, ChartEvent, ChartType, elements, plugins } from 'chart.js';
  import { OlympicService } from 'src/app/core/services/olympic.service';
  import { Olympic } from 'src/app/core/models/Olympic';
  import { Chart } from 'chart.js';
  import { Router } from '@angular/router';
  import ChartDataLabels, { Context } from 'chartjs-plugin-datalabels';
  import { BehaviorSubject, map, Observable } from 'rxjs';
import { StatistiquesJO } from 'src/app/core/models/StatistiquesJO';

  // enregistrement du plugin pour afficher les nom des pays 
  // directement sur les parts du graphique
  Chart.register(ChartDataLabels);



  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  })

  export class HomeComponent implements OnInit {


    infoEtat: string = "";

    // création de l'observable qui va reçevoir toutes les données des JO
    observableContenuJO$!: Observable<Olympic[] | null>;

    observableInfoPratiqueJO$!: Observable<StatistiquesJO | null>;

    // création du constructeur pour injecter automatiquement 
    // le service OlympicService
    constructor(
      private serviceOlympic: OlympicService,
      private monRouter: Router
    ){}

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
          this.infoEtat = "";
        },

        // dans le cas ou il ya une erreur uniquement, 
        // afficher un message d'erreur:
        error: () => {
          this.infoEtat = "Erreur lors du chargement des données";
          return;
        }
      });
      

      // appel de la fonction get pour recuperer l'observable du service avec 
      // ses données chargés, puis affecter son contenu à observableContenuJO$.
      this.observableContenuJO$ = this.serviceOlympic.getOlympics();
      

      // Création de l'observable qui va contenir toutes les
      // données que j'ai besoin

      this.observableInfoPratiqueJO$ = this.observableContenuJO$.pipe(
        map(
          (dataJo) => {

            // si aucune données dans dataJO
            if(!dataJo){

              this.infoEtat = "Aucune données Olympic trouvés.";

              return {
                nbDeJo: 0,
                tabNomDesPays: [],
                nbDePays: 0,
                tabNbTotalDeMedaillesParPays: []
                
              };
            }

            // Sinon, si il ya des données dans dataJO

            // programme 1 pour récuperer le nb de JO en recuperant le nombre d'anné unique:
            let nbJo: number = 0;

            let tabToutesLesAnnees: number[] = [];

            let tabParticipations = dataJo.map(obj => obj.participations);

            let tabParticipationsApplati = tabParticipations.flat();

            tabToutesLesAnnees = tabParticipationsApplati.map(o => o.year);

            let tabToutesLesAnneesUnique = Array.from(new Set(tabToutesLesAnnees));

            nbJo = tabToutesLesAnneesUnique.length;


            // programme 2 pour récuperer dynamiquement la liste 
            // de tous les pays, et le nombre total de pays :

            let tabNomDesPays: string[] = [];

            tabNomDesPays = dataJo.map(obj => obj.country);

            let nbPays: number = tabNomDesPays.length;


            // programme 3 pour faire le dico qui contiendra 
            // le nombre total de médailles par pays pour le graphique
            
            let tabNbTotalDeMedaillesParPays: number[] = [];
           
            
            for(let infoJOParPays of dataJo){

              let infoParticipationParPays = infoJOParPays.participations;

              let tableauDesMedaillesParPays: number[] = [];

              for(let infoParParticipation of infoParticipationParPays){
                
                tableauDesMedaillesParPays.push(infoParParticipation.medalsCount);
              
              }

              let totalDeMedailsParPays: number = 0;

              totalDeMedailsParPays = tableauDesMedaillesParPays.reduce(
                (accumulateur, valeurAajouter) => 
                  accumulateur + valeurAajouter, 0
                
              );

              tabNbTotalDeMedaillesParPays.push(totalDeMedailsParPays);

              
            }


            return {
              nbDeJo : nbJo,
              tabNomDesPays: tabNomDesPays,
              nbDePays: nbPays,
              tabNbTotalDeMedaillesParPays: tabNbTotalDeMedaillesParPays
            };
          }
        )
      ); // fin de l'observable observableInfoPratiqueJO

      // test si l'observable affiche qq chose
      this.observableInfoPratiqueJO$.subscribe((infoPratiqueJO)=> {

        // si cette observable contient bien des données :
        if(infoPratiqueJO){

          this.contenuGraphique = {
          labels: infoPratiqueJO.tabNomDesPays,
          datasets: [{data: infoPratiqueJO.tabNbTotalDeMedaillesParPays}]
        };
        }  
      });
    }

    // ajout de l'évènement clique sur le graphique pour
    // rediriger vers la page detail/idPays
    
    fonctionRedirection(infoClique: {event?: ChartEvent ; active?: any[]} ) {
      if(infoClique.active && infoClique.active.length > 0){

        // typage de any verifié
        const ActiveObjet = infoClique.active as ActiveElement[];

        // récuperation de l'index (l'id) de la part
        // selectionné
        let indexLabel = ActiveObjet[0].index;

        // on rajoute +1, car le premier id de pays = 1, 
        // et le premier id de la part du graphique 
        // selectionné = 0.
        indexLabel = indexLabel + 1;

        const lienRedirection: string = "/detail/";

        this.monRouter.navigate([lienRedirection, indexLabel]);
      }
    }

    // ajout des noms des pays sur les parts du graphique 
    // en configurant ce plugin :

    // ajout de la propriété CharDataLabel pour le html
    public ChartDataLabels = ChartDataLabels;

    public pluginDataLabel = {
      plugins : {
        datalabels : {
          font:{
            size: 14
          },
          formatter : (_value : number, ctx: Context) => {
            return ctx.chart.data.labels?.[ctx.dataIndex];
          },
          color: '#000' // texte avec couleur noir
        }
      }
    };
     }
