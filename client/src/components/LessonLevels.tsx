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
import { useData } from '../util/api';
import { useAppSelector } from '../util/redux/hooks';
import { selectUser } from '../util/redux/userSlice';

Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  SubTitle,
  Tooltip,
);

interface ILessonLevelsProps {
  levels: {
    [key: number]: number;
  };
}

function LessonLevels({ levels }: ILessonLevelsProps) {
  let max = 0;
  Object.keys(levels).forEach((level: string) => {
    if (Number(level) > max) {
      max = Number(level);
    }
  });

  const labels = Array.from(Array(max + 1).keys());
  const data = labels.map((level) => Number(levels[level] ?? 0));

  return (
    <Card sx={{ width: '100%', height: '400px' }}>
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Bar
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: true,
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Lesson Level',
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                display: true,
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Students',
                },
                ticks: {
                  display: false,
                },
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
                  title(context: any) {
                    return `Lesson Level: ${context[0].parsed.x}`;
                  },
                  label(context: any) {
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
