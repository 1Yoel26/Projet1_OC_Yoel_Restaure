  import { Component, OnInit } from '@angular/core';
  import { ChartData, ChartType } from 'chart.js';
  import { OlympicService } from 'src/app/core/services/olympic.service';
  import { Olympic } from 'src/app/core/models/Olympic';
  import { Chart } from 'chart.js';
  import { Router } from '@angular/router';


  @Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
  })

  export class HomeComponent implements OnInit {

    nombreDeJO: number = 0;
    nombreDePays: number = 0;

    

    ngOnInit(): void {

      
      
    }
     }
