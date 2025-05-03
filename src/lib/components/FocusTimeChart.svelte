<!-- learnflow-app/src/lib/components/FocusTimeChart.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { ChartConfiguration, ChartTypeRegistry, TimeScaleOptions } from 'chart.js';
  import type { FocusSession } from '$lib/stores/pipStores';
  import 'chartjs-adapter-date-fns';
  import { enUS } from 'date-fns/locale';
  import { browser } from '$app/environment';

  // Only register Chart.js components in the browser
  if (browser) {
    Chart.register(...registerables);
  }

  export let sessions: FocusSession[] = [];
  export let timeUnit: 'day' | 'week' | 'month' = 'day'; // For x-axis scale

  let canvasElement: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  // Function to process data and update chart
  function updateChart() {
    if (!browser || !chartInstance || !canvasElement) return;

    // Aggregate data by the selected time unit
    const aggregatedData: Record<string, number> = {};
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay()); // Sunday start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      let key = '';

      if (timeUnit === 'day') {
        // Aggregate by day (e.g., only show last 7 days)
        const dayDiff = Math.floor((startOfDay.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if(dayDiff >= 0 && dayDiff < 7) { // Show last 7 days including today
          key = sessionDate.toISOString().split('T')[0];
        }
      } else if (timeUnit === 'week') {
        // Aggregate by week (e.g., show last 4 weeks)
        const weekDiff = Math.floor((startOfWeek.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
        if(weekDiff >= 0 && weekDiff < 4) { // Show last 4 weeks including this week
          const weekStartDate = new Date(sessionDate);
          weekStartDate.setDate(sessionDate.getDate() - sessionDate.getDay());
          key = weekStartDate.toISOString().split('T')[0]; // Key by Sunday of the week
        }
      } else if (timeUnit === 'month') {
        // Aggregate by month (e.g., show last 6 months)
        const monthDiff = (startOfMonth.getFullYear() - sessionDate.getFullYear()) * 12 + (startOfMonth.getMonth() - sessionDate.getMonth());
        if(monthDiff >= 0 && monthDiff < 6) { // Show last 6 months including this month
          key = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}`; // Key by YYYY-MM
        }
      }
      
      if (key) { // Only include if within the desired range
        if (!aggregatedData[key]) {
          aggregatedData[key] = 0;
        }
        aggregatedData[key] += session.duration / 60; // Add duration in minutes
      }
    });
    
    // Sort keys (dates/months) and prepare labels/data for chart
    const sortedKeys = Object.keys(aggregatedData).sort();
    const labels = sortedKeys; 
    const dataPoints = sortedKeys.map(key => aggregatedData[key]);

    // Update chart data
    chartInstance.data.labels = labels;
    if (chartInstance.data.datasets && chartInstance.data.datasets[0]) {
      chartInstance.data.datasets[0].data = dataPoints;
    }

    // Type-safe update of scales configuration
    const scales = chartInstance.options?.scales;
    if (scales && 'x' in scales) {
      const xScale = scales.x;
      
      // Fixed: Properly access TimeScale options with correct typing
      if (xScale && xScale.type === 'time') {
        // Create a properly typed time options object
        const timeOptions: TimeScaleOptions = {
          unit: timeUnit,
          tooltipFormat: '',
          displayFormats: {}
        };
        
        // Set formatting based on time unit
        if (timeUnit === 'day') {
          timeOptions.tooltipFormat = 'MMM d, yyyy';
          timeOptions.displayFormats = { day: 'MMM d' };
        } else if (timeUnit === 'week') {
          timeOptions.tooltipFormat = "'Week of' MMM d, yyyy";
          timeOptions.displayFormats = { week: 'MMM d' };
        } else { // month
          timeOptions.tooltipFormat = 'MMM yyyy';
          timeOptions.displayFormats = { month: 'MMM yyyy' };
        }
        
        // Apply the properly typed time options
        xScale.time = timeOptions;
      }
    }

    chartInstance.update();
  }

  function createChart() {
    if (!browser || !canvasElement) return;
    
    // Configuration with proper TypeScript typing
    const config: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = {
      type: 'bar',
      data: {
        labels: [], // Initial empty labels
        datasets: [{
          label: 'Focus Time (Minutes)',
          data: [], // Initial empty data
          backgroundColor: 'rgba(79, 70, 229, 0.6)', // Indigo-600 with opacity
          borderColor: 'rgba(79, 70, 229, 1)', // Indigo-600
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Minutes'
            },
            grid: {
              color: 'rgba(200, 200, 200, 0.1)' // Lighter grid lines
            }
          },
          x: {
            type: 'time',
            time: {
              unit: timeUnit,
              tooltipFormat: timeUnit === 'day' ? 'MMM d, yyyy' : 
                             timeUnit === 'week' ? "'Week of' MMM d, yyyy" : 
                             'MMM yyyy',
              displayFormats: {
                day: 'MMM d',
                week: 'MMM d',
                month: 'MMM yyyy'
              }
            },
            adapters: {
              date: { locale: enUS } // Set date-fns locale
            },
            grid: {
              display: false // Hide x-axis grid lines
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              source: 'auto' 
            }
          }
        },
        plugins: {
          legend: {
            display: false // Hide legend if only one dataset
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14 },
            bodyFont: { size: 12 },
            padding: 10,
          }
        }
      }
    };
    
    // Create the chart instance
    chartInstance = new Chart(canvasElement, config);

    // Initial chart render
    updateChart();
  }

  onMount(() => {
    if (browser) {
      createChart();
    }
  });

  // Cleanup chartInstance on component destruction
  onDestroy(() => {
    if (browser && chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  });

  // Update chart when props change
  $: if (browser && chartInstance && sessions) {
    updateChart();
  }

  // Watch for timeUnit changes to update chart
  $: if (browser && chartInstance && timeUnit) {
    updateChart();
  }
</script>

<div class="chart-container" style="position: relative; height:300px;">
  {#if browser}
    <canvas bind:this={canvasElement}></canvas>
  {:else}
    <div class="h-full flex items-center justify-center text-gray-400">
      <p>Chart loading...</p>
    </div>
  {/if}
</div>