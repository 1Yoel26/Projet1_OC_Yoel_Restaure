
# 🏅 JO Dashboard - Application Angular Jeux Olympiques

Une application Angular qui présente des données sur les Jeux Olympiques, avec des visualisations graphiques dynamiques utilisant `ng2-charts` et `chart.js`.

---

## 📋 Description

Cette application permet de :

- Afficher la liste des pays participants aux Jeux Olympiques
- Visualiser le nombre total de médailles remportées par chaque pays via un graphique en camembert (`pie chart`)
- Afficher les détails des participations aux Jeux pour chaque pays via une page dédiée
- Naviguer facilement entre les pays à travers le graphique interactif
- Suivre le nombre total de Jeux Olympiques et le nombre de pays participants
- Offrir une interface simple, moderne et responsive

---

## 🗂️ Structure principale

- `src/app/core/models/Olympic.ts` : Modèle de données pour les JO
- `src/app/core/services/olympic.service.ts` : Service pour charger les données depuis un fichier JSON
- `src/app/...` : Le dossier qui contient chaque composant Angular de l'application, avec un fichier.ts, un fichier.html, et un fichier.scss
- `src/assets/mock/olympic.json` : Données mockées des Jeux Olympiques

---

## 🚀 Installation et lancement

```bash
git clone <https://github.com/1Yoel26/Projet1_OC_Yoel_Restaure>
cd Votre_Chemin/Projet1_OC_Yoel_Restaure
npm install
ng serve
```

Ouvrez ensuite [http://localhost:4200](http://localhost:4200) dans votre navigateur.

---

## ⚙️ Fonctionnalités clés

- Chargement des données via un service Angular avec Observable
- Calcul dynamique du nombre de JO, des pays, et du total de médailles par pays
- Affichage d'un graphique pie avec les médailles par pays (utilisation de `chart.js` + plugin `chartjs-plugin-datalabels`)
- Interaction utilisateur : clic sur une part du graphique pour accéder à la page détail du pays correspondant
- Message d’état pour indiquer si les données sont chargées ou en erreur
- Interface simple avec titre, introduction et données clés en haut de la page


---

## 📚 Technologies utilisées

- Angular v16+
- RxJS pour la gestion des données réactives
- Chart.js v4+ et ng2-charts pour les graphiques
- chartjs-plugin-datalabels pour afficher les labels sur les graphiques


---

Merci d’avoir utilisé l'application JO Dashboard !  

---
