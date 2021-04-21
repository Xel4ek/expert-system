import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  data: any = [
    {
      fixed: true,
      x: 300, // myChart.getWidth() / 2,
      y: 300, // myChart.getHeight() / 2,
      symbolSize: 20,
      id: '-1',
    },
  ];
  edges: any = [];
  options = {
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        data: this.data,
        force: {
          // initLayout: 'circular'
          // gravity: 0
          repulsion: 100,
          edgeLength: 5,
        },
        edges: this.edges,
      },
    ],
  };
  merge$?: Observable<any>;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.merge$ = interval(400).pipe(
      map(() => {
        this.data.push({
          id: this.data.length,
        });
        const source = Math.round((this.data.length - 1) * Math.random());
        const target = Math.round((this.data.length - 1) * Math.random());
        if (source !== target) {
          this.edges.push({
            source,
            target,
          });
        }
        return {
          series: [
            {
              roam: true,
              data: this.data,
              edges: this.edges,
            },
          ],
        };
      })
    );
  }
}

// var chartDom = document.getElementById('main');
// var myChart = echarts.init(chartDom);
// var option;
//
// var data = [{
//   fixed: true,
//   x: myChart.getWidth() / 2,
//   y: myChart.getHeight() / 2,
//   symbolSize: 20,
//   id: '-1'
// }];
//
// var edges = [];
//
// option = {
//   series: [{
//     type: 'graph',
//     layout: 'force',
//     animation: false,
//     data: data,
//     force: {
//       // initLayout: 'circular'
//       // gravity: 0
//       repulsion: 100,
//       edgeLength: 5
//     },
//     edges: edges
//   }]
// };
//
// setInterval(function () {
//   data.push({
//     id: data.length
//   });
//   var source = Math.round((data.length - 1) * Math.random());
//   var target = Math.round((data.length - 1) * Math.random());
//   if (source !== target) {
//     edges.push({
//       source: source,
//       target: target
//     });
//   }
//   myChart.setOption({
//     series: [{
//       roam: true,
//       data: data,
//       edges: edges
//     }]
//   });
//
//   // console.log('nodes: ' + data.length);
//   // console.log('links: ' + data.length);
// }, 200);
//
// option && myChart.setOption(option);
