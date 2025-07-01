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
  /*nbTotalDeMedailsDuPays: number;
  nbTotalAthletesDuPays: number;

  // données pour le graphique 
  tabNbMedailParAnnee: number[];
  tabAnnéesDeParticipationsAuJO: number[];
  */


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

  idGetDuPays!: number;

  // données des JO sur le pays, à afficher sur la page detail
  nomDuPays: string = "";
  nbParticipationsAuJODuPays: number = 0;
  nbTotalDeMedailsDuPays: number = 0;
  nbTotalAthletesDuPays: number = 0;

  // données pour le graphique 
  tabNbMedailParAnnee: number[] = [];
  tabAnnéesDeParticipationsAuJO: number[] = [];

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

              this.infoEtat = "Erreur, l'id n'est pas un nombre positif";
              return;
            }

        }else{
          this.infoEtat = "Erreur, l'id du pays n'existe pas";
          return;
  
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
            nbParticipationsAuJODuPays: 0
            /*nbTotalDeMedailsDuPays: number;
            nbTotalAthletesDuPays: number;

            // données pour le graphique 
            tabNbMedailParAnnee: number[];
            tabAnnéesDeParticipationsAuJO: number[];
            */

            
          };
        }



        // sinon, s'il ya des données dans dataJO,
        // on remplit les bonnes données sur le pays dans l'observable:

        this.infoEtatObservable = "Données chargé avec succès";

        // Verification si l'id du pays existe dans le fichier json
        // avant de recuperer les infos sur ce pays:

        let resultatRecherche: string = "";

        for(let paysJO of dataDesJO){

          // si l'id correspond à un des pays du fichier json,
          // alors récupération de ses données :
          if(paysJO.id == this.idGetDuPays){
            // récuperations de toutes les données utiles ici :
            resultatRecherche = "ok";

            this.nomDuPays = paysJO.country;

            let tabAnnéesDeParticipationsAuJO: number[] = [];

            let tabParticipationsDuPays = paysJO.participations;

            for(let uneParticipationDuPays of tabParticipationsDuPays){
              tabAnnéesDeParticipationsAuJO.push(uneParticipationDuPays.year);
            }

            this.nbParticipationsAuJODuPays = tabAnnéesDeParticipationsAuJO.length;

          }
        }

        if(resultatRecherche != "ok"){
          this.infoEtatObservable = "Erreur, l'id n'appartient pas à un des pays";
        }
        

        return{

          infoEtatObservable: this.infoEtatObservable,
          nomDuPays: this.nomDuPays,
          nbParticipationsAuJODuPays: this.nbParticipationsAuJODuPays
          
        };

      })
    );

    // abonement à l'observable pour l'executer:
    this.observableInfoJODuPays$.subscribe();


    
  }

}

