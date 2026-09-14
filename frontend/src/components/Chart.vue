<template>
  <section class="chart">
    <canvas class="chart-canvas" />
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

const DEFAULT_DONUT = {
  type: 'doughnut',
  data: {},
  options: {
    responsive: true,
    cutout: '70%',
    maintainAspectRatio: false,
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
        callbacks: {
          label: (item) => {
            const data = item.chart.data.datasets[item.datasetIndex];
            const total = data.data.reduce((acc, val) => acc + val, 0);
            const val = data.data[item.dataIndex];
            const percentage = ((val / total) * 100).toFixed(2);
            return `${val} (${percentage}%)`;
          },
        },
      },
    },
  },
};

const DEFAULT_LINE = {
  type: 'line',
  data: {},
  options: {
    responsive: true,
    lineTension: 0.5,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      axis: 'index',
    },
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
        displayColors: true,
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
          display: false,
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
          precision: 0,
        },
      },
    },
  },
};

const DEFAULT_BAR = {
  type: 'bar',
  data: {},
  options: {
    responsive: true,
    indexAxis: 'y',
    barThickness: 40,
    maintainAspectRatio: false,
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
          display: false,
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
  name: 'Chart',

  props: {
    data: { type: Object, default: () => { } },
    type: { type: String, default: 'line' },
    onClick: { type: Function, default: () => { } },
  },

  mounted() {
    const ctx = this.$el.querySelector('.chart-canvas');

    let def = {};
    switch (this.$props.type) {
      case 'donut':
        def = DEFAULT_DONUT;
        break;
      case 'bar':
        def = DEFAULT_BAR;
        break;
      default:
        def = DEFAULT_LINE;
        break;
    }

    const conf = { ...def, data: this.$props.data };
    if (this.$props.onClick) {
      conf.options.onClick = this.$props.onClick;
    }
    this.chart = new Chart(ctx, conf);
  },
};
</script>
