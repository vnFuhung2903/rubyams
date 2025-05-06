import React from "react";
import Header from './components/Header';
import Banner from './components/Banner';
import TeacherServices from './components/TeacherServices';
import StudentServices from './components/StudentServices';
import UserManual from './components/UserManual';
import Footer from './components/Footer';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './components/LoginPage';
import TimetablePage from './components/TimetablePage';
import { useAuth } from './components/AuthContext';
import RegisterCoursePage from './components/RegisterCoursePage';
import RegisterClassPage from './components/RegisterClassPage';

function HomePage() {
  return (
    <>
      <Banner />
      <TeacherServices />
      <StudentServices />
      <UserManual />
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <div style={{ fontFamily: 'Poppins, Arial, sans-serif', background: '#f1f1f7', minHeight: '100vh' }}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/timetable"
          element={
            <ProtectedRoute>
              <TimetablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-course"
          element={
            <ProtectedRoute>
              <RegisterCoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-class"
          element={
            <ProtectedRoute>
              <RegisterClassPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
