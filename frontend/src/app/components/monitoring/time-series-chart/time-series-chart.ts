import { Component, Input, OnChanges, SimpleChanges, signal } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { CommonModule } from '@angular/common';

export interface ChartDataPoint {
  timestamp: Date | string | number;
  value: number;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: 'line' | 'bar';
  showArea?: boolean;
}

@Component({
  selector: 'app-time-series-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './time-series-chart.html',
  styleUrls: ['./time-series-chart.css'],
})
export class TimeSeriesChart implements OnChanges {
  @Input() series: ChartSeries[] = [];
  @Input() height: string = '300px';
  @Input() unit: string = '';
  @Input() title?: string;
  @Input() showLegend: boolean = true;
  @Input() theme: 'light' | 'dark' = 'light';

  chartOption = signal<EChartsOption>({});

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series'] || changes['theme'] || changes['title'] || changes['unit']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const isDark = this.theme === 'dark';

    const option: EChartsOption = {
      backgroundColor: 'transparent',
      title: this.title
        ? {
            text: this.title,
            textStyle: {
              color: isDark ? '#f3f4f6' : '#111827',
              fontSize: 16,
              fontWeight: 'normal',
            },
          }
        : undefined,
      tooltip: {
        trigger: 'axis',
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        textStyle: {
          color: isDark ? '#f3f4f6' : '#111827',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: isDark ? '#374151' : '#6b7280',
          },
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) params = [params];

          let result = `<div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValueLabel}</div>`;

          params.forEach((param: any) => {
            result += `
              <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color};"></span>
                <span style="flex: 1;">${param.seriesName}:</span>
                <span style="font-weight: 600;">${param.value} ${this.unit}</span>
              </div>
            `;
          });

          return result;
        },
      },
      legend: this.showLegend
        ? {
            data: this.series.map((s) => s.name),
            textStyle: {
              color: isDark ? '#d1d5db' : '#4b5563',
            },
            bottom: 0,
          }
        : undefined,
      grid: {
        left: '3%',
        right: '4%',
        bottom: this.showLegend ? '12%' : '3%',
        top: this.title ? '15%' : '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: [0, 0],
        axisLine: {
          lineStyle: {
            color: isDark ? '#4b5563' : '#d1d5db',
          },
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
          formatter: (value: number) => {
            const date = new Date(value);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark ? '#374151' : '#f3f4f6',
            type: 'dashed',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: this.unit ? `(${this.unit})` : '',
        nameTextStyle: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
        axisLine: {
          lineStyle: {
            color: isDark ? '#4b5563' : '#d1d5db',
          },
        },
        axisLabel: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#374151' : '#f3f4f6',
            type: 'dashed',
          },
        },
      },
      series: this.series.map((s) => ({
        name: s.name,
        type: s.type || 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: s.color,
        },
        lineStyle: {
          width: 2,
          color: s.color,
        },
        areaStyle: s.showArea
          ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: s.color ? `${s.color}40` : 'rgba(59, 130, 246, 0.25)' },
                  { offset: 1, color: s.color ? `${s.color}00` : 'rgba(59, 130, 246, 0)' },
                ],
              },
            }
          : undefined,
        data: s.data.map((d) => [new Date(d.timestamp).getTime(), d.value]),
      })),
    };

    this.chartOption.set(option);
  }
}
