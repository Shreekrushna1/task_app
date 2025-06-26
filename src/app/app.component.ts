import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import ApexCharts from 'apexcharts'
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  colors: any;
  dataLabels: ApexDataLabels | any;
  plotOptions: ApexPlotOptions | any;
  responsive: ApexResponsive[] | any;
  xaxis: ApexXAxis | any;
  legend: ApexLegend | any;
  fill: ApexFill | any;
};
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgApexchartsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppComponent implements OnInit {
  title = 'task_app';
  @ViewChild("chart")
  chart: ChartComponent = new ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart_semi")
  chart_semi: ChartComponent = new ChartComponent;
  public chartSemiOptions: Partial<ChartOptions>;

  totalCount: Number = 0;
  columns: any[] = []
  gridData: any[] = []
  isLoading = true;

  selectedClientName: string = '';
  isPopupOpen: boolean = false;
popupType: 'edit' | 'delete' = 'edit';
clickedData:any;
  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [
        {
          name: "PRODUCT A",
          data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22, 43]
        },
        {
          name: "PRODUCT B",
          data: [13, 23, 20, 8, 13, 27, 44, 55, 41, 67, 22, 43]
        },
        {
          name: "PRODUCT C",
          data: [11, 17, 15, 15, 21, 14, 44, 55, 41, 67, 22, 43]
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019'
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false
        }
      },
      xaxis: {
        type: "category",
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      },
      legend: {
        show: false
      },
      fill: {
        opacity: 1,
        opacityFromSeries: [1, 0.75, 0.5],
      }
    };

    const maxValue = 400;
    const currentValue = 260;
    this.chartSemiOptions = {
      series: [(currentValue / maxValue) * 100],
      chart: {
        type: "radialBar",
        height: 350,
        width: 450,
        offsetY: -20
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: "22px",
              formatter: function () {
                return `${currentValue}`;
              }
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        }
      },
    };

  }

  ngOnInit(): void {
    this.http.get('https://01.fy25ey01.64mb.io/').subscribe({
      next: (res: any) => {
        this.totalCount = res.grid_data.length
        this.columns = res.grid_columns;
        this.gridData = res.grid_data;
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    })
  }

  toggleAll(event: any) {
    const isChecked = event.target.checked;
    this.gridData.forEach(item => {
      item.selected = isChecked;
    });
  }

  isAllSelected() {
    return this.gridData.every(item => item.selected);
  }

  onEdit(item: any) {
    this.popupType = 'edit';
    this.selectedClientName = item.name.first_name + ' ' + item.name.last_name;
    this.isPopupOpen = true;
    this.clickedData = item;
  }
   onDelete(item: any) {
    this.popupType = 'delete';
    this.clickedData = item;
    this.selectedClientName = item.name.first_name + ' ' + item.name.last_name;
    this.isPopupOpen = true;
  }

  confirmDelete() {
    this.gridData = this.gridData.filter(item => item !== this.clickedData);
    this.closePopup();
  }

  closePopup() {
    this.isPopupOpen = false;
  }



}
