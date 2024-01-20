import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useData } from './api';

interface IDynamicElementProps {
  unAuthPath: string;
  adminPath: string;
  teacherPath: string;
  coachPath: string;
  familyPath: string;
}

/**
 * A wrapper component whose children routes which can only be navigated to if the user is not authenticated.
 */
function UnauthenticatedRoutesWrapper() {
  const data = useData('auth/authstatus');
  if (data === null) return null;
  return !data.error ? <Navigate to="/" /> : <Outlet />;
}

/**
 * A wrapper component whose children routes which can only be navigated to if the user is  authenticated.
 */
function ProtectedRoutesWrapper() {
  const data = useData('auth/authstatus');
  if (data === null) return null;
  return !data.error ? <Outlet /> : <Navigate to="/" />;
}
/**
 * A wrapper component whose children routes which can only be navigated to if the user is an admin.
 */
function AdminRoutesWrapper() {
  const data = useData('admin/adminstatus');
  if (data === null) return null;
  return !data.error ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper whose children routes can only be navigated to if the user is a coach
 */
function CoachRoutesWrapper() {
  const data = useData('coach/coachstatus');
  if (data === null) return null;
  return !data.error ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper whose children routes can only be navigated to if the user is a student
 */
function StudentRoutesWrapper() {
  const data = useData('student/studentstatus');
  if (data === null) return null;
  return !data.error ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper whose children routes can only be navigated to if the user is a teacher
 */
function TeacherRoutesWrapper() {
  const data = useData('teacher/teacherstatus');
  if (data === null) return null;
  return !data.error ? <Outlet /> : <Navigate to="/" />;
}

/**
 * A wrapper which navigates to a different route depending on if the user is authenticated or not.
 * @param unAuthPath - The path to navigate to if the user is not authenticated. It should be of the form "/path".
 * @param authPath - The path to navigate to if the user is  authenticated. It should be of the form "/path".
 */
function DynamicRedirect({
  unAuthPath,
  adminPath,
  teacherPath,
  coachPath,
  familyPath,
}: IDynamicElementProps) {
  const data = useData('auth/role');
  if (data === null) return null;
  if (data.error) {
    return <Navigate to={unAuthPath} />;
  }
  if (data.data === 'admin') {
    return <Navigate to={adminPath} />;
  }
  if (data.data === 'teacher') {
    return <Navigate to={teacherPath} />;
  }
  if (data.data === 'coach') {
    return <Navigate to={coachPath} />;
  }
  if (data.data === 'parent') {
    return <Navigate to={familyPath} />;
  }
  return <Navigate to="/*" />;
}

export {
  UnauthenticatedRoutesWrapper,
  ProtectedRoutesWrapper,
  AdminRoutesWrapper,
  DynamicRedirect,
  CoachRoutesWrapper,
  StudentRoutesWrapper,
  TeacherRoutesWrapper,
};
