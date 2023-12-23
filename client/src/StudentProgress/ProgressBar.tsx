import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useData } from '../util/api';

type Section = [string, [boolean[], string, number]];

interface SectionProps {
  sections: Section[];
}

function Section({ sections }: SectionProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        fontSize: '14px',
      }}
    >
      <div
        style={{
          borderWidth: '2px 0px 2px 2px',
          borderColor: 'black',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {sections.map(([title, [completedLevels, color, startingNumber]]) => (
          <div
            key={title}
            style={{
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                borderWidth: '0px 2px 2px 0px',
                borderColor: 'black',
                borderStyle: 'solid',
                backgroundColor: '#E7E6E6',
              }}
            >
              {title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {completedLevels.map(
                (isLevelComplete: boolean, index: number) => (
                  <div
                    style={{
                      width: '100%',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      borderWidth: '0px 2px 0px 0px',
                      borderColor: 'black',
                      borderStyle: 'solid',
                      padding: '4px 28px',
                      backgroundColor: isLevelComplete ? color : 'white',
                    }}
                  >
                    {startingNumber + index}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RisingReadersComponent({
  studentId,
}: {
  studentId: string;
}) {
  const studentResponse = useData(`student/student/${studentId}`);
  const lessonsData = studentResponse?.data.lessonsCompleted || [''];

  type ParsedLessons = {
    RR: boolean[];
    WF: boolean[];
    GC: boolean[];
  };

  // Function to parse the lessons and categorize them
  const categorizeLessons = (lessons: string[]): ParsedLessons => {
    const parsed: ParsedLessons = {
      RR: Array(20).fill(false),
      WF: Array(4).fill(false),
      GC: Array(38).fill(false),
    };

    lessons.forEach((lessonString) => {
      const [type, lessonNum] = lessonString.split(' Lesson ');
      const index = parseInt(lessonNum, 10) - 1;

      // Type guard to ensure the type key is valid
      if (type === 'RR' || type === 'WF' || type === 'GC') {
        if (index >= 0 && index < parsed[type].length) {
          parsed[type][index] = true;
        }
      }
    });

    return parsed;
  };

  const { RR, WF, GC } = categorizeLessons(lessonsData);

  const risingReadersLevels: Section[] = [
    ['Rising Readers', [RR, '#44608B', 1]],
  ];

  const wordFamilyLevels: Section[] = [['Word Families', [WF, '#4AA4A6', 1]]];

  const generalCurriculumLevel1: Section[] = [
    ['Short Vowels', [GC.slice(0, 9), '#B0C642', 1]],
    ['Consonant Blends', [GC.slice(9, 16), '#F8D748', 10]],
    ['Digraphs and Trigraphs', [GC.slice(16, 19), '#E57E4B', 17]],
  ];

  const generalCurriculumLevel2: Section[] = [
    ['Long Vowel Sounds', [GC.slice(19, 23), '#44608B', 20]],
    ['R-Controlled Vowels', [GC.slice(23, 26), '#4AA4A6', 24]],
    ['Vowel Teams', [GC.slice(26, 30), '#B0C642', 27]],
    ['Special Vowels', [GC.slice(30, 37), '#F8D748', 31]],
    ['Silent Consonants', [GC.slice(37), '#E57E4B', 38]],
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        padding: 3,
        overflow: 'auto',
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={700}>
          Progress Bars
        </Typography>
        <Section sections={risingReadersLevels} />
        <Section sections={wordFamilyLevels} />
        <Section sections={generalCurriculumLevel1} />
        <Section sections={generalCurriculumLevel2} />
      </Stack>
    </Box>
  );
}
