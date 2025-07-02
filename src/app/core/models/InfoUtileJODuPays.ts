export interface InfoUtileJODuPays {
  
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