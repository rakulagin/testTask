import React, {useEffect, useState} from 'react';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

const BarChart = () => {

  ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, annotationPlugin, LineElement, Legend, Tooltip, LineController, BarController);

  // Средняя линия (которая прямая). Так как гистограмма ограничена значениями 0...60, я поставил ее посередине
  const middleLine = 30

  // стейты, участвующие в отрисовке оси Х, гистограммы и кривой линии
  const [dates, setDates] = useState([]);
  const [dataBars, setDataBars] = useState([]);
  const [lines, setLines] = useState([]);

  // хелпер, делающий массив из двух чисел для параметров столбца
  const createPairOfNumbers = (min, max) => {
    const arrA = Math.floor(Math.random() * 30) + min;
    const arrB = Math.floor(Math.random() * (max - 30)) + 31;
    return [arrA, arrB];
  }

  //строю координаты по оси Х в формате дд-мм
  const getDates = () => {
    const dateArr = []
    const startDate = new Date('2023-03-02')
    const endDate = new Date('2023-05-02')

    let currentDate = startDate
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toLocaleDateString('ru-RU')
      const [d, m, y] = formattedDate.split('.')
      dateArr.push(`${d}-${m}`)
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dateArr
  }

  //функция, заполняющая массив данных для гистограмм
  const createDataBars = (arr) => {
    const newDataBars = arr.map(() => {
      return createPairOfNumbers(0, 60);
    });
    setDataBars((prev) => [...prev, ...newDataBars]);
  };


  // Делаю массив чисел для графика. Чтобы график получился более плавным, первый элемент равен 250, диапазон 0...500,
  // шаг графика в любую сторону не больше двух
  const  generateRandomArray = (arr) => {

    const result = [250];

    for (let i = 1; i < arr.length; i++) {
      const prevNumber = result[i - 1];
      const randomNumber = Math.floor(Math.random() * 50) - 20;
      const newNumber = prevNumber + randomNumber;

      if (newNumber < 0) {
        result.push(0);
      } else if (newNumber > 400) {
        result.push(400);
      } else {
        result.push(newNumber);
      }
    }

    setLines(result)
  }

  // делаю градиент для столбцов
  const getGradients = (context) => {
    const chart = context.chart
    const {ctx, chartArea} = chart;
    if (!chartArea) {
      return [];
    }

    return dates.map(() => {
      const gradientSegment = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradientSegment.addColorStop(0, 'rgba(71, 48, 60, 0.5)');
      gradientSegment.addColorStop(0.35, 'rgba(102, 54, 65, 0.5)');
      gradientSegment.addColorStop(0.49, 'rgba(206,104,122,0.5)');
      gradientSegment.addColorStop(0.51, 'rgba(111,175,140,0.5)');
      gradientSegment.addColorStop(0.65, 'rgba(53, 89, 80, 0.5)');
      gradientSegment.addColorStop(1, 'rgba(44, 66, 64, 0.5)');
      return gradientSegment;
    });
  };


  const data = {
    labels: dates,
    datasets: [
      {
        type: 'line',
        yAxisID: 'y2',
        label: 'Кривая линия',
        data: lines,
        pointStyle: false,
        borderColor: 'rgb(113,113,45, 0.8)',
        borderWidth: 3,
        fill: false,
        tension: 0.2,
      },

      {
        type: 'bar',
        yAxisID: 'y',
        label: 'столбец',
        data: dataBars,
        backgroundColor: getGradients,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y',
            value: middleLine,
            borderColor: 'rgb(132, 132, 132)',
            borderWidth: 3,
            label: {
              content: 'Горизонтальная линия',
              enabled: true,
            },
          },
        ],
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          color: '#fff',
        },
        border: {
          color: 'rgba(255,255,255,0.1)',
        },
        grid: {
          color: '#171a22'
        }
      },

      y: {
        ticks: {
          callback: (value)=> `$${value}M`,
          color: '#fff',
        },
        border: {
          color: 'rgba(255,255,255,0.1)',
        },
        grid: {
          color: '#171a22'
        }
      },
      y2: {
        position: 'right',
        min: 0,
        max: 500,
        ticks: {
          callback: (value)=> `$${value}K`,
          color: '#fff',
        },
        border: {
          color: 'rgba(255,255,255,0.1)',
        },
        grid: {
          color: '#171a22'
        }
      },
    },
  };

  useEffect(() => {
    const arrOfDates = getDates();
    setDates(arrOfDates)
    createDataBars(arrOfDates);
    generateRandomArray(arrOfDates)
  }, []);

  return (
    <Chart className='bar' type='bar' data={data} options={options}/>
  )
}

export default BarChart