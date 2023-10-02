import React, {useState, useEffect} from 'react';
import {Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController,} from 'chart.js';
import {Chart} from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

const BarChart = () => {

  ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, annotationPlugin, LineElement, Legend, Tooltip, LineController, BarController);

  // предположим, такие данные мы получаем с "бекенда"
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const dataFromServer = [[3, 12], [-2, 10], [-8, 20], [6, 15], [1, 18], [-8, 15], [-1, 8]]
  const middleLine = 6

  // стейты, участвующие в отрисовке гистограммы
  const [topData, setTopData] = useState([]);
  const [bottomData, setBottomData] = useState([]);

  //функция принимает на вход данные с "бекенда": массив с парами чисел и горизонтальную линию - аннотацию,
  // итерируется по нему, запуская вложенную функцию разделения этого массива на два аналогичных, которые потом
  // будут использованы в отрисовке диаграммы
  const getTwoArrays = (data, media) => {
    data.map(el => {
      splitOneArray(el,media)
    })
  }

  // функция принимает на вход массив из 2х чисел и значение горизонтальной линии (аннотации)
  // дальше по условию проверяю как расположен блок гистограммы относительно аннотации и раскидываю по двум массивам
  // пар чисел, для того чтобы в дальнейшем окрашивать их в разные цвета
  const splitOneArray = (arr, media) => {
    const [a, b] = arr
    const emptyArr=[0,0]
    if (b < media) {
      setTopData((prev) => [...prev,emptyArr])
      setBottomData((prev) => [...prev,arr])
    } else if (a > media) {
      setTopData((prev) => [...prev,arr])
      setBottomData((prev) => [...prev,emptyArr])
    } else {
      setTopData((prev) => [...prev,[media,b]])
      setBottomData((prev) => [...prev,[a,media]])
    }
  }

const data = {
  labels,
  datasets: [
    {
      type: 'line',
      label: 'Кривая линия',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgb(255, 99, 132)',
      borderWidth: 2,
      fill: false,
      data: [13, -3, -7, -3, 10, 8, 0],
    },
    {
      type: 'bar',
      label: 'Столбец',
      data: topData,
      backgroundColor: 'rgb(75, 192, 192)',
      borderWidth: 2,
    },
    {
      type: 'bar',
      label: 'Столбец',
      data: bottomData,
      backgroundColor: 'purple',
      borderWidth: 2,
    },
  ],
};

const options = {
  plugins: {
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
    },
    y: {
      min: -20,
      max: 30,
    },
  },
};

useEffect(()=>{
  getTwoArrays(dataFromServer,middleLine)
},[])

return (
  <Chart className='bar' type='bar' data={data} options={options}/>
)
}

export default BarChart