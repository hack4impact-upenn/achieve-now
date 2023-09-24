import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';
import Toolbar from '@mui/material/Toolbar';
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';
// eslint-disable-next-line
import { Masonry } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useData } from './util/api';
/*
import TotalChapters from './components/nationalIndicators/NationalTotalChaptersComponent';
import TotalCoaches from './components/nationalIndicators/NationalTotalCoachesComponent';
import TotalParticipants from './components/nationalIndicators/NationalTotalParticipantsComponent';
import LineComponent from './components/nationalIndicators/NationalLineComponent';
import MainPieComponent from './components/nationalIndicators/NationalPieComponent';
import MainCoachesWidget from './components/nationalIndicators/NationalCoachesComponent';
import ActiveCitiesWidget from './components/nationalIndicators/NationalActiveCitiesComponent';
import MainParticipantsWidget from './components/nationalIndicators/NationalParticipantsComponent';
*/
import StudentCard from './components/buttons/StudentCard';

const ScrollableBox = styled(Box)({
  overflowY: 'auto',
  maxHeight: '100%',
});

// eslint-disable-next-line
function createStudentCard(student: any) {
  const id = student.user_id;
  const user = useData(`users/${id}`);
  if (user) {
    const info = user.data;
    const name = `${info.firstName} ${info.lastName}`;
    const lesson = student.lesson_level;
    return <StudentCard studentName={name} lesson={lesson} />;
  }
}

// eslint-disable-next-line
function createData(data: any) {
  const sortedData = data.slice().sort((a: any, b: any) => {
    // Sort by isAccredited (true values first)
    // if (a.isAccredited && !b.isAccredited) {
    //   return -1; // a comes first
    // }
    // if (!a.isAccredited && b.isAccredited) {
    //   return 1; // b comes first
    // }

    // Sort alphabetically by cityName
    // if (a.cityName < b.cityName) {
    //   return -1; // a comes first
    // }
    // if (a.cityName > b.cityName) {
    //   return 1; // b comes first
    // }

    return 0; // same order
  });

  return sortedData.map(createStudentCard);
}

function SplitGrid() {
  const id = 111;
  const students = useData(`users/teacher/${id}`);
  const studentData = students?.data ?? [];
  // const maleData = useData(`cities/indicator/male_coaches`);
  // const femaleData = useData(`cities/indicator/female_coaches`);
  // const maleParticpants = useData(`cities/indicator/male_participants`);
  // const femaleParticpants = useData(`cities/indicator/female_participants`);
  // const revenueData = useData('cities/indicatoryearly/revenue');
  // const expensesData = useData('cities/indicatoryearly/expenses');
  // const asianMain = useData('cities/indicator/asian');
  // const hispanicMain = useData('cities/indicator/hispanic_or_latino');
  // const blackMain = useData('cities/indicator/black_or_african_american');
  // const whiteMain = useData('cities/indicator/white');
  // const nativeMain = useData('cities/indicator/american_indian_alaskan_native');
  // const hawaiiamMain = useData(
  //   'cities/indicator/native_hawaiian_pacific_islander',
  // );
  // const twoMain = useData('cities/indicator/two_or_more');

  return (
    <Box display="flex" flexDirection="column" width="100%" height="100vh">
      <Toolbar />

      <Box display="flex" flexGrow={1}>
        <Paper
          sx={{
            width: '30%',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
            bgcolor: 'white',
            p: 2,
          }}
          elevation={0}
          square
        >
          <h2>Cities</h2>
          {createData(studentData)}
        </Paper>

        <Paper
          sx={{
            width: '70%',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 64px)', // Subtract the Toolbar height (default is 64px)
            bgcolor: '#EDEDED',
            p: 2,
            paddingX: 4,
          }}
          elevation={0}
          square
        >
          <h2>National Statistics</h2>
          <Grid item xs={8}>
            {/* <Masonry columns={3} spacing={4} sx={{ width: 'auto' }}>
              <TotalChapters data1={cities} />
              <TotalCoaches maleData1={maleData} femaleData1={femaleData} />
              <TotalParticipants
                maleParticpants1={maleParticpants}
                femaleParticpants1={femaleParticpants}
              />
              <LineComponent variant="revenue" data1={revenueData} />
              <LineComponent variant="expenses" data1={expensesData} />
              <MainPieComponent
                asianMain1={asianMain}
                hispanicMain1={hispanicMain}
                blackMain1={blackMain}
                whiteMain1={whiteMain}
                nativeMain1={nativeMain}
                hawaiiamMain1={hawaiiamMain}
                twoMain1={twoMain}
              />
              <MainCoachesWidget
                maleData1={maleData}
                femaleData1={femaleData}
              />
              <ActiveCitiesWidget cities1={cities} />
              <MainParticipantsWidget
                maleParticpants1={maleParticpants}
                femaleParticpants1={femaleParticpants}
              />
            </Masonry> */}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}

export default SplitGrid;
