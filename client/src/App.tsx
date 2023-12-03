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
import StudentDashboardPage from './Teacher/StudentDashboard';
import LessonsPage from './Lessons/LessonsPage';
import AdminBlockPage from './Admin/AdminBlockPage';
import AdminSessionsPage from './Admin/AdminSessionsPage';
import FamilyProgressSnapshotPage from './Family/FamilyProgressSnapshotPage';
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
import TeacherDashboard from './TeacherDashboard';
import OnboardingPage from './Authentication/OnboardingPage';
import StudentResourceDashboard from './Admin/StudentResourceDashboard';
import LessonResourceDashboard from './Admin/LessonResourceDashboard';
import AdminResourcesPage from './Admin/AdminResourcesPage';
import CoachAttendancePage from './Admin/CoachAttendancePage';
import SchoolProfilePage from './SchoolProfile/SchoolProfilePage';
import StudentProfilePage from './Admin/StudentProfilePage';
import AdminEditBlockPage from './Admin/AdminEditBlockPage';
import AdminAddBlockPage from './Admin/AdminAddBlockPage';
import ProfilePage from './Profile/ProfilePage';
import StudentAttendancePage from './Admin/StudentAttendancePage';
import CoachLandingPage from './Coach/CoachLandingPage';
import AdminAttendance from './Admin/AdminAttendance';
import AdminProfiles from './Admin/AdminProfiles';
import AdminCurriculum from './Admin/AdminCurriculum';
import AdminMenu from './Admin/AdminMenu';
import StudentProgress from './StudentProgress/StudentProgress';

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
                    <Route
                      path="/family-progress"
                      element={<FamilyProgressSnapshotPage />}
                    />
                    <Route path="/lessons" element={<LessonsPage />} />
                    <Route
                      path="/coach-landing"
                      element={<CoachLandingPage />}
                    />
                    <Route
                      path="/student-dashboard"
                      element={<StudentDashboardPage />}
                    />
                    <Route path="/home" element={<HomePage />} />
                    <Route
                      path="/onboarding/student"
                      element={<OnboardingPage />}
                    />
                    <Route path="/teacher" element={<TeacherDashboard />} />
                  </Route>
                  {/* Routes accessed only if user is an admin */}
                  <Route element={<AdminRoutesWrapper />}>
                    <Route path="/users" element={<AdminDashboardPage />} />
                    <Route path="/resources">
                      <Route path="student">
                        <Route
                          path=":studentId"
                          element={<StudentResourceDashboard />}
                        />
                        <Route path="" element={<StudentResourceDashboard />} />
                      </Route>
                      <Route path="lesson">
                        <Route
                          path=":lessonId"
                          element={<LessonResourceDashboard />}
                        />
                        <Route path="" element={<LessonResourceDashboard />} />
                      </Route>
                    </Route>
                    <Route
                      path="/admin/sessions"
                      element={<AdminSessionsPage />}
                    />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route
                      path="/school/profiles"
                      element={<SchoolProfilePage />}
                    />
                  </Route>
                  <Route element={<AdminRoutesWrapper />}>
                    <Route path="/admin/profiles" element={<ProfilePage />} />
                    <Route
                      path="/admin/block/:id"
                      element={<AdminBlockPage />}
                    />
                    <Route
                      path="/admin/add-block"
                      element={<AdminAddBlockPage />}
                    />
                    <Route
                      path="/admin/edit-block/:id"
                      element={<AdminEditBlockPage />}
                    />
                    <Route
                      path="/admin/student/profile/:id"
                      element={<StudentProfilePage />}
                    />
                    <Route path="/admin/notes" element={<AdminNotesPage />} />
                    <Route
                      path="/admin/student/profile/:id"
                      element={<StudentProfilePage />}
                    />
                    <Route
                      path="/admin/notes/:studentId"
                      element={<AdminNotesPage />}
                    />
                    <Route
                      element={<AdminResourcesPage />}
                      path="/admin-resources"
                    />
                    <Route
                      path="/admin-student-attendance"
                      element={<StudentAttendancePage />}
                    />
                    <Route
                      path="/admin-coach-attendance"
                      element={<CoachAttendancePage />}
                    />
                    <Route
                      path="/admin-attendance"
                      element={<AdminAttendance />}
                    />
                    <Route path="/admin-profiles" element={<AdminProfiles />} />
                    <Route path="/admin-menu" element={<AdminMenu />} />
                    <Route
                      path="/admin-curriculum"
                      element={<AdminCurriculum />}
                    />
                  </Route>
                  <Route element={<ProtectedRoutesWrapper />}>
                    <Route
                      path="/student-progress/:id"
                      element={<StudentProgress />}
                    />
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
