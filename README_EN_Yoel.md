
# 🏅 Olympic Games Dashboard - Angular Application

An Angular application that presents data about the Olympic Games, with dynamic visualizations using `ng2-charts` and `chart.js`.

---

## 📋 Description

This application allows you to:

- Display the list of countries participating in the Olympic Games  
- Visualize the total number of medals won by each country via a pie chart  
- Show detailed participation information for each country on a dedicated page  
- Easily navigate between countries through the interactive chart  
- Track the total number of Olympic Games and the number of participating countries  
- Provide a simple, modern, and responsive interface  

---

## 🗂️ Main Structure

- `src/app/core/models/Olympic.ts`: Data model for the Olympics  
- `src/app/core/services/olympic.service.ts`: Service to load data from a JSON file  
- `src/app/...`: The folder containing each Angular component of the application, with a `.ts`, `.html`, and `.scss` file  
- `src/assets/mock/olympic.json`: Mock data of the Olympic Games  

---

## 🚀 Installation and Launch

```bash
git clone <https://github.com/1Yoel26/Projet1_OC_Yoel_Restaure>
cd Your_Path/Projet1_OC_Yoel_Restaure
npm install
ng serve
```

Then open [http://localhost:4200](http://localhost:4200) in your browser.

---

## ⚙️ Key Features

- Data loading via an Angular service with Observable  
- Dynamic calculation of the number of Olympic Games, countries, and total medals per country  
- Display of a pie chart with medals per country (using `chart.js` + the `chartjs-plugin-datalabels` plugin)  
- User interaction: click on a pie slice to access the detail page of the corresponding country  
- Status message to indicate if data is loaded or if there is an error  
- Simple interface with title, introduction, and key data at the top of the page  

---

## 📚 Technologies Used

- Angular v16+  
- RxJS for reactive data management  
- Chart.js v4+ and ng2-charts for charts  
- chartjs-plugin-datalabels to display labels on charts  

---

Thank you for using the Olympic Games Dashboard application!  
