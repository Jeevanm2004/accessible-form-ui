import RegistrationForm from './components/RegistrationForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <main className="flex items-center justify-center p-4 min-h-screen">
        <RegistrationForm />
      </main>
      <div className="sr-only">
        <h2>Keyboard Navigation Help</h2>
        <p>Use Tab key to navigate forward through form fields, Shift+Tab to navigate backward. Press Enter or Space to activate buttons. The password visibility toggle buttons can be activated with Enter, Space, or by clicking.</p>
      </div>
    </div>
  );
}

export default App;
