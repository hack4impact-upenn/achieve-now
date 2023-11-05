import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import theme from './assets/theme';
import { store, persistor } from './util/redux/store';
import NotFoundPage from './NotFound/NotFoundPage';
import HomePage from './Home/HomePage';
import AdminDashboardPage from './AdminDashboard/AdminDashboardPage';
import LessonsPage from './Lessons/LessonsPage';
import AdminSessionsPage from './Admin/AdminSessionsPage';
import FamilyProgressSnapshotPage from './Family/FamilyProgressSnapshotPage';
import AdminLessonsPage from './Admin/AdminLessonsPage';
import AdminNotesPage from './Admin/AdminNotesPage';
import {
  UnauthenticatedRoutesWrapper,
  ProtectedRoutesWrapper,
  DynamicRedirect,
  AdminRoutesWrapper,
} from './util/routes';
import VerifyAccountPage from './Authentication/VerifyAccountPage';
import RegisterPage from './Authentication/RegisterPage';
import LoginPage from './Authentication/LoginPage';
import EmailResetPasswordPage from './Authentication/EmailResetPasswordPage';
import ResetPasswordPage from './Authentication/ResetPasswordPage';
import AlertPopup from './components/AlertPopup';
import InviteRegisterPage from './Authentication/InviteRegisterPage';
import TeacherDashboard from './TeacherDashboard';
import OnboardingPage from './Authentication/OnboardingPage';
import StudentResourceDashboard from './Admin/StudentResourceDashboard';
import LessonResourceDashboard from './Admin/LessonResourceDashboard';
import CoachAttendancePage from './Admin/CoachAttendancePage';
import StudentAttendancePage from './Admin/StudentAttendancePage';
import CoachLandingPage from './Coach/CoachLandingPage';
import LessonLevels from './components/LessonLevels';

``;

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <CssBaseline>
                <AlertPopup />
                <Routes>
                  <Route path="/lessons/:studentID" element={<LessonsPage />} />

                  {/* Routes accessed only if user is not authenticated */}
                  <Route element={<UnauthenticatedRoutesWrapper />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/verify-account/:token"
                      element={<VerifyAccountPage />}
                    />
                    <Route
                      path="/email-reset"
                      element={<EmailResetPasswordPage />}
                    />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPasswordPage />}
                    />
                  </Route>
                  <Route
                    path="/invite/:token"
                    element={<InviteRegisterPage />}
                  />
                  {/* Routes accessed only if user is authenticated */}
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route
                      path="/onboarding/student"
                      element={<OnboardingPage />}
                    />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route path="/users" element={<AdminDashboardPage />} />
                    <Route
                      path="/resources/student/:studentId"
                      element={<StudentResourceDashboard />}
                    />
                    <Route
                      path="/resources/lesson/:lessonId"
                      element={<LessonResourceDashboard />}
                    />
                    <Route
                      path="/admin-sessions"
                      element={<AdminSessionsPage />}
                    />
                    <Route
                      path="/admin-lessons"
                      element={<AdminLessonsPage />}
                    />
                    <Route path="/admin-notes" element={<AdminNotesPage />} />
                    <Route
                      path="/admin-student-attendance"
                      element={<StudentAttendancePage />}
                    />
                    <Route
                      path="/admin-coach-attendance"
                      element={<CoachAttendancePage />}
                    />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route
                      path="/lessons/:studentID"
                      element={<LessonsPage />}
                    />
                    <Route
                      path="/progress"
                      element={<FamilyProgressSnapshotPage />}
                    />
                    <Route
                      path="/coach-landing/:id"
                      element={<CoachLandingPage />}
                    />
                    <Route
                      path="/teacher-dashboard/:id"
                      element={<LessonLevels />}
                    />
                  </Route>
                  {/* Route which redirects to a different page depending on if the user is an authenticated or not by utilizing the DynamicRedirect component */}
                  <Route
                    path="/"
                    element={
                      <DynamicRedirect unAuthPath="/login" authPath="/home" />
                    }
                  />
                  {/* Route which is accessed if no other route is matched */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </CssBaseline>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
