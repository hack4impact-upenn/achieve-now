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
import AdminSessionsPage from './Admin/AdminSessionsPage';
import FamilyLessonsPage from './Family/FamilyLessonsPage';
import FamilyProgressSnapshotPage from './Family/FamilyProgressSnapshotPage';
import AdminLessonsPage from './Admin/AdminLessonsPage';
import AdminNotesPage from './Admin/AdminNotesPage';
import CoachProfilePage from './Admin/CoachProfilePage';
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
import Header from './components/PageHeader';
import TeacherDashboard from './TeacherDashboard';
import OnboardingPage from './Authentication/OnboardingPage';
import ResourceDashboard from './ResourceDashboard';
import StudentAttendancePage from './Admin/StudentAttendancePage';
import CoachAttendancePage from './Admin/CoachAttendancePage';
import CoachLandingPage from './Coach/CoachLandingPage';

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
                  {/* Routes accessed only if user is not authenticated */}
                  <Route element={<UnauthenticatedRoutesWrapper />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/resource" element={<ResourceDashboard />} />
                    <Route
                      path="/resource/:id"
                      element={<ResourceDashboard />}
                    />
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
                  <Route path="/header" element={<Header />} />
                  {/* Routes accessed only if user is authenticated */}
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route
                      path="/onboarding/student"
                      element={<OnboardingPage />}
                    />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route path="/users" element={<AdminDashboardPage />} />
                  </Route>{' '}
                  <Route element={<AdminRoutesWrapper />}>
                    <Route
                      path="/admin-sessions"
                      element={<AdminSessionsPage />}
                    />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route path="/lessons" element={<FamilyLessonsPage />} />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route
                      path="/progress"
                      element={<FamilyProgressSnapshotPage />}
                    />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route
                      path="/admin-lessons"
                      element={<AdminLessonsPage />}
                    />
                    <Route path="/admin-notes" element={<AdminNotesPage />} />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route
                      path="/admin-student-attendance"
                      element={<StudentAttendancePage />}
                    />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route
                      path="/admin-coach-attendance"
                      element={<CoachAttendancePage />}
                    />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route
                      path="/coach-landing/:id"
                      element={<CoachLandingPage />}
                    />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route
                      path="/admin/coach/profile/:id"
                      element={<CoachProfilePage />}
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
