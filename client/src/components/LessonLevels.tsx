import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Title,
  SubTitle,
  Tooltip,
} from 'chart.js';
import { Card, CardActionArea, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
);

function LessonLevels() {
  const { id } = useParams();

  const [labels, setLabels] = useState<number[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://localhost:4000/api/teacher/lesson-levels/${id}`,
      );

      let max = 0;
      Object.keys(res.data).forEach((level: string) => {
        if (Number(level) > max) {
          max = Number(level);
        }
      });

      const l = Array.from(Array(max + 1).keys());
      setLabels(l);
      const d = l.map((level) => Number(res.data[level] ?? 0));
      setData(d);
    };

    fetchData();
  }, [id]);

  return (
    <Card sx={{ width: '400px', height: '400px' }}>
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Bar
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false,
                beginAtZero: true,
              },
              y: {
                display: false,
                beginAtZero: true,
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Lesson Levels',
              },
              subtitle: {
                display: true,
                text: 'The distribution of students across lesson levels',
                padding: {
                  bottom: 10,
                },
              },
              tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                callbacks: {
                  label(context) {
                    let label = context.dataset.label || '';

                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.y !== null) {
                      label += context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: 'Number of Students',
                data,
                backgroundColor: 'rgba(64,224,208,255)',
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  );
}

export default LessonLevels;
