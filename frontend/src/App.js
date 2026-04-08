import {Routes, Route, BrowserRouter, Navigate} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import ParticipantsPage from "./pages/ParticipantsPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
 
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsPage />
            </ProtectedRoute>
          }
        />
 
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          }
        />
 
        <Route
          path="/participants"
          element={
            <ProtectedRoute>
                <ParticipantsPage />
            </ProtectedRoute>
          }
        />
 
        {/* Toute URL inconnue redirige vers l'accueil */}
        <Route path="*" element={<Navigate to="/" />} />
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
