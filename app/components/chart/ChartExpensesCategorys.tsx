"use client"

import React, { useEffect } from "react";
import Chart, { ChartTooltipItem } from "chart.js";

import { formatToCurrencyBRL, parseCurrencyString } from "@/app/utils";
import { Expense } from "@/app/dto/expenseDTO";

interface ICategoryItem {
  category: string,
  value: number
}

const chartCategorys = (data: ICategoryItem[]) => {
  return {
    type: 'doughnut',
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: true,
        text: 'Gasto separados por categoria',
        fontSize: 16,
        fontColor: '#fff',
      },
      legend: {
        display: false,
      },
      tooltips: {
        backgroundColor: "#005B96",
        callbacks: {
          label: function(tooltipItem: ChartTooltipItem) {
            const { index } = tooltipItem;
            if (index !== undefined) {
              return `${data[index].category}: ${formatToCurrencyBRL(data[index].value)}`;
            }
          },
        },
      },
    },
    data: {
      labels: data.map((item) => item.category),
      datasets: [{
        label: '',
        data: data.map((item) => item.value),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 102, 255)',
        ],
        hoverOffset: 6
      }]
    },
  }
};

const groupCategories = (data: Expense[]): ICategoryItem[] => {
  return data.reduce((acc: ICategoryItem[], expense) => {
    const categoryName = expense.category.toLowerCase();
    const value = parseCurrencyString(expense.value);

    const existingCategory = acc.find(item => item.category === categoryName);

    if (existingCategory) {
      existingCategory.value += value;
    } else {
      acc.push({ category: categoryName, value });
    }

    return acc;
  }, []);
};


export const ChartExpensesCategorys = ({ data }: { data: Expense[] }) => {
  useEffect(() => {
    const dataFiltred = data.filter((expense) => parseCurrencyString(expense.value) > 0 && expense.people === "Eu")
    const categorys = groupCategories(dataFiltred)
    const sortedValue = categorys.sort((a, b) => Number(b.value) - Number(a.value));
    const config = chartCategorys(sortedValue)

    const canvas = document.getElementById("pizza-chart") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    window.myDoughnut = new Chart(ctx, config as Chart.ChartConfiguration);
    return () => {
      if (window.myDoughnut) {
        window.myDoughnut.destroy();
      }
    };
  }, [data]);

  return (
    <canvas id="pizza-chart"></canvas>
  );
}