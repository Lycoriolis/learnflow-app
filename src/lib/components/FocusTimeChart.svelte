<!-- learnflow-app/src/lib/components/FocusTimeChart.svelte -->
<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { Chart, registerables } from 'chart.js';
  import type { FocusSession } from '$lib/stores/pipStores.js';
  import 'chartjs-adapter-date-fns'; // Import the date adapter
  import { enUS } from 'date-fns/locale';

  Chart.register(...registerables);

  export let sessions: FocusSession[] = [];
  export let timeUnit: 'day' | 'week' | 'month' = 'day'; // For x-axis scale

  let canvasElement: HTMLCanvasElement;
  let chartInstance: Chart | null = null;

  // Function to process data and update chart
  function updateChart() {
    if (!chartInstance || !canvasElement) return;

    // Aggregate data by the selected time unit
    const aggregatedData: { [key: string]: number } = {};
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
    chartInstance.data.datasets[0].data = dataPoints;

    // Adjust x-axis time unit
    const xScale = chartInstance.options.scales?.x as import('chart.js').TimeScaleOptions | undefined;

    if (xScale?.time) {
      xScale.time.unit = timeUnit;
      
      // Ensure displayFormats object exists before assigning to its properties
      if (!xScale.time.displayFormats) {
        xScale.time.displayFormats = {};
      }

      if (timeUnit === 'day') {
        xScale.time.tooltipFormat = 'MMM d, yyyy';
        xScale.time.displayFormats.day = 'MMM d';
      } else if (timeUnit === 'week') {
        xScale.time.tooltipFormat = '\'Week of\' MMM d, yyyy';
        xScale.time.displayFormats.week = 'MMM d';
      } else { // month
        xScale.time.tooltipFormat = 'MMM yyyy';
        xScale.time.displayFormats.month = 'MMM yyyy';
      }
    }

    chartInstance.update();
  }

  onMount(() => {
    chartInstance = new Chart(canvasElement, {
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
                 unit: timeUnit, // Set initial unit
                 // tooltipFormat: 'll', // Example: moment.js format, adjust for date-fns if needed
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
                 // Use source: 'auto' or 'labels' based on aggregation
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
    });

    updateChart(); // Initial chart render

    return () => {
      chartInstance?.destroy(); // Cleanup chart instance
    };
  });

  // Update chart when props change
  afterUpdate(() => {
      if (chartInstance) {
         updateChart();
      }
  });

</script>

<div class="chart-container" style="position: relative; height:300px;">
  <canvas bind:this={canvasElement}></canvas>
</div>