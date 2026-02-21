import LicenseGenerator from './LicenseGenerator'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            License Manager
          </h1>
        </div>
      </header>

      <main className="w-full max-w-2xl mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <LicenseGenerator />
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-8 text-center text-gray-400">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          &copy; 2026 Admin Dashboard &bull; Secure Generation
        </p>
      </footer>
    </div>
  )
}

export default App
