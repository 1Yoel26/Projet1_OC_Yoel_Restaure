import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataset, ChartData } from 'chart.js';

// cette interface va servir à définir le type de mon observable
interface infoUtileJODuPays{

   
  
  // données des JO sur le pays, à afficher sur la page detail
  infoEtatObservable: string;
  nomDuPays: string;
  nbParticipationsAuJODuPays: number;
  nbTotalDeMedailsDuPays: number;
  nbTotalAthletesDuPays: number;

  // données pour le graphique 
  tabNbMedailParAnnee: number[];
  tabAnnéesDeParticipationsAuJO: string[];
  


}


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
  infoEtatObservable: string = "";
  infoErreurId: string = "";
  infoEtatGraphique: string = "";

  idGetDuPays!: number;

  // données des JO sur le pays, à afficher sur la page detail
  nomDuPays: string = "";
  nbParticipationsAuJODuPays: number = 0;
  nbTotalDeMedailsDuPays: number = 0;
  nbTotalAthletesDuPays: number = 0;

  // données pour le graphique 
  tabNbMedailParAnnee: number[] = [];
  tabAnnéesDeParticipationsEnString: string[] = [];

  // variable pour savoir si l'id du pays demandé 
  // appartient bien à un des pays existant
  resultatRecherche: string = "";


  // Configuration du graphique line dans le Html
    typeGraphique: ChartType = "line";

    contenuGraphique: ChartData<"line"> = {

      // noms associés au part du graphique pie
      labels: [],

      // proportion de chaque part du graphique pour chaque pays
      datasets: [{
        data: [],
        label: "Nombres de médails du pays par années"
      }]
    
    };

  // créations de l'observable qui va recuperer tout le contenu des JO
  
  observableContenuDonneesJO$!: Observable<Olympic[] | null>;


  // créations de l'observable qui va calculer et renvoyer toute les
  // données utiles pour la page detail, sur le pays demandé dans l'url

  observableInfoJODuPays$!: Observable<infoUtileJODuPays | null>;
  



  constructor(
    private serviceOlympic: OlympicService,
    private infoSurMonUrl: ActivatedRoute
  ){}

  


  ngOnInit(): void {

    // récupération de l'id dans l'url pour afficher les données de ce pays:
    const idTestExiste = this.infoSurMonUrl.snapshot.paramMap.get("idPays");
        
        let idConversionNumber: number;

        // si l'id existe
        if(idTestExiste){
          idConversionNumber = Number(idTestExiste);
          // si l'id existe, et est de type number positif
          if(Number.isInteger(idConversionNumber) && idConversionNumber >= 0){

              this.idGetDuPays = idConversionNumber;
              
            }
            // si l'id existe mais n'est pas number, ou est négatif
            else{

              this.infoErreurId = "Erreur, l'id n'est pas un nombre positif";
              
            }

        }else{
          this.infoErreurId = "Erreur, l'id du pays n'existe pas";
  
        }


    // tentative de chargement des données dans l'observable :

    this.serviceOlympic.loadInitialData().subscribe({
      next: () => {
        this.infoEtat = "Chargement des données";
        this.infoEtat = "";
      },

      error: () => {

        this.infoEtat = "Erreur lors du chargement des données";
        return;
      }

    });

    this.observableContenuDonneesJO$ = this.serviceOlympic.getOlympics();


    this.observableInfoJODuPays$ = this.observableContenuDonneesJO$.pipe(
      map((dataDesJO) => {

        // si aucune données dans dataDesJO :
        if(!dataDesJO){

          this.infoEtatObservable = "Aucune données Olympic trouvé.";

          return {

            infoEtatObservable: "",
            nomDuPays: "",
            nbParticipationsAuJODuPays: 0,
            nbTotalDeMedailsDuPays: 0,
            nbTotalAthletesDuPays: 0,

            // données pour le graphique 
            tabNbMedailParAnnee: [],
            tabAnnéesDeParticipationsAuJO: []
            

            
          };
        }



        // sinon, s'il ya des données dans dataJO,
        // on remplit les bonnes données sur le pays dans l'observable:

        this.infoEtatObservable = "Données chargé avec succès";

        // Verification si l'id du pays existe dans le fichier json
        // avant de recuperer les infos sur ce pays:

        

        for(let paysJO of dataDesJO){

          // si l'id correspond à un des pays du fichier json,
          // alors récupération de ses données :
          if(paysJO.id == this.idGetDuPays){
            // récuperations de toutes les données utiles ici :
            this.resultatRecherche = "ok";

            this.nomDuPays = paysJO.country;

            let tabLesParticipationsDuPays: number[] = [];

            let tabLesMedailsDuPays: number[] = [];

            let tabLesNbAthletesDuPays: number[] = [];

            let tabParticipationsDuPays = paysJO.participations;

            for(let uneParticipationDuPays of tabParticipationsDuPays){
              
              tabLesParticipationsDuPays.push(uneParticipationDuPays.year);
              
              tabLesMedailsDuPays.push(uneParticipationDuPays.medalsCount);

              tabLesNbAthletesDuPays.push(uneParticipationDuPays.athleteCount);
            }

            
           
            this.tabNbMedailParAnnee = tabLesMedailsDuPays;

            this.nbParticipationsAuJODuPays = tabLesParticipationsDuPays.length;

            this.nbTotalDeMedailsDuPays = tabLesMedailsDuPays.reduce((sommeActuel, valeurAAjouter) => sommeActuel + valeurAAjouter , 0 );

            this.nbTotalAthletesDuPays = tabLesNbAthletesDuPays.reduce((sommeActuel, valeurAAjouter) => sommeActuel + valeurAAjouter , 0 );

            // conversion du tableau des années de participation 
            // en string[], afin qu'il soit utilisable pour le graphique:
            this.tabAnnéesDeParticipationsEnString = tabLesParticipationsDuPays.map( (elt) => 
              elt.toString()
            ); 
          }
        }

        if(this.resultatRecherche != "ok"){
          this.infoEtatObservable = "Erreur, l'id n'appartient pas à un des pays";
        }
        

        return{

          infoEtatObservable: this.infoEtatObservable,
          nomDuPays: this.nomDuPays,
          nbParticipationsAuJODuPays: this.nbParticipationsAuJODuPays,
          nbTotalDeMedailsDuPays: this.nbTotalDeMedailsDuPays,
          nbTotalAthletesDuPays: this.nbTotalAthletesDuPays,
            
          // données pour le graphique 
          tabNbMedailParAnnee: this.tabNbMedailParAnnee,
          tabAnnéesDeParticipationsAuJO: this.tabAnnéesDeParticipationsEnString
    

        };

      })
    );

    // abonement à l'observable pour l'executer:
    this.observableInfoJODuPays$.subscribe((infoDuPays) => {
     
      if(infoDuPays && this.resultatRecherche == "ok"){

        this.contenuGraphique = {
        labels: infoDuPays.tabAnnéesDeParticipationsAuJO,

      // proportion de chaque part du graphique pour chaque pays
      datasets: [{
        data: infoDuPays.tabNbMedailParAnnee,
        label: "Nombres de médails du pays par années"
      }]
      }

      this.infoEtatGraphique = "Données bien chargés dans le graphique";

      }
      
    });


    
  }

}

