<template>
  <section class="bar-chart">
    <canvas class="bar-chart-canvas" />
  </section>
</template>

<script>
import Chart from 'chart.js/auto';

const chartTheme = Object.freeze({
  surface: '#1a1b1f',
  border: '#374151',
  text: '#d9e3ea',
  muted: '#cbd5e1',
});

const DEFAULT = {
  type: 'bar',
  data: {},
  options: {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: chartTheme.surface,
        borderColor: chartTheme.border,
        borderWidth: 1,
        titleColor: chartTheme.text,
        bodyColor: chartTheme.text,
        bodyFont: {
          size: 15,
        },
        bodySpacing: 10,
        padding: 10,
      },
    },
    scales: {
      x: {
        border: {
          color: chartTheme.border,
        },
        grid: {
          color: chartTheme.border,
        },
        ticks: {
          color: chartTheme.muted,
        },
      },
      y: {
        border: {
          color: chartTheme.border,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: chartTheme.muted,
        },
      },
    },
  },
};

export default {
  name: 'BarChart',

  props: {
    data: { type: Object, default: () => { } },
  },

  mounted() {
    const ctx = this.$el.querySelector('.bar-chart-canvas');
    this.chart = new Chart(ctx, { ...DEFAULT, data: this.$props.data });
  },
};
</script>
