import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useData } from '../util/api';

type Section = [string, [boolean[], string, number]];

/* <Grid
      container
      sx={{
        fontSize: {
          xs: '10px',
          sm: '12px',
          md: '14px',
          lg: '16px',
          xl: '18px',
        },
      }}
    >
      {sections.map(([title, [levelsComplete, color, startingNumber]]) => (
        <Grid item container direction="column" xs>
          <Grid
            item
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              backgroundColor: '#E7E6E6',
            }}
          >
            {title}
          </Grid>
          <Grid item container>
            {levelsComplete.map((isLevelComplete, index) => (
              <Grid
                item
                sx={{
                  fontWeight: 'bold',
                  padding: '4px 24px',
                  backgroundColor: isLevelComplete ? color : 'white',
                }}
              >
                {startingNumber + index}
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid> */

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
              {completedLevels.map((isLevelComplete, index) => (
                <div
                  style={{
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
              ))}
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
  const levels = studentResponse?.data.levelsCompleted || Array(62).fill(1);

  const risingReadersLevels: Section[] = [
    ['Rising Readers', [levels.slice(0, 20), '#44608B', 1]],
  ];

  const wordFamilyLevels: Section[] = [
    ['Word Families', [levels.slice(20, 24), '#4AA4A6', 1]],
  ];

  const generalCurriculumLevel1: Section[] = [
    ['Short Vowels', [levels.slice(24, 33), '#B0C642', 1]],
    ['Consonant Blends', [levels.slice(33, 40), '#F8D748', 10]],
    ['Digraphs and Trigraphs', [levels.slice(40, 43), '#E57E4B', 17]],
  ];

  const generalCurriculumLevel2: Section[] = [
    ['Long Vowel Sounds', [levels.slice(43, 47), '#44608B', 20]],
    ['R-Controlled Vowels', [levels.slice(47, 50), '#4AA4A6', 24]],
    ['Vowel Teams', [levels.slice(50, 54), '#B0C642', 27]],
    ['Special Vowels', [levels.slice(54, 61), '#F8D748', 31]],
    ['Silent Consonants', [levels.slice(60), '#E57E4B', 38]],
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '10px',
        padding: 3,
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
