import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="bg-surface dark:bg-slate-950 min-h-screen pt-16">

      {/* Hero */}
      <section className="relative bg-surface dark:bg-slate-950 overflow-hidden py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-16">
          <div>
            <span className="inline-block bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              Intellectual Rigor • Digital Efficiency
            </span>
            <h1 className="text-5xl font-bold text-primary dark:text-slate-50 mb-6 leading-tight tracking-tight">
              Your University's Intellectual Ecosystem,{' '}
              <span className="text-secondary dark:text-blue-400">AI-Powered.</span>
            </h1>
            <p className="text-lg text-on-surface-variant dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              Access a unified hub for university information, instant administrative support, and seamless campus communication.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/chat">
                <button className="bg-primary-container text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg">
                  <span className="material-symbols-outlined">chat_bubble</span>
                  Start Chatting
                </button>
              </Link>
              <Link to="/register">
                <button className="border border-primary-container text-primary-container dark:border-blue-400 dark:text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-surface-container dark:hover:bg-slate-800 transition-all">
                  Register Now
                </button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-gradient-to-tr from-primary-container to-secondary rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl w-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white">
                      <span className="material-symbols-outlined">smart_toy</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-primary dark:text-blue-400 tracking-widest uppercase">GUU Digital Brain</div>
                      <div className="text-[10px] text-on-surface-variant dark:text-slate-400">Active • Response time: 0.2s</div>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface dark:text-slate-200">
                    "I can help you with course information, campus facilities, enrollment procedures, and more. How can I assist you today?"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary dark:text-slate-50 mb-4">Empowering the Modern Scholar</h2>
            <p className="text-on-surface-variant dark:text-slate-400 max-w-2xl mx-auto">
              Seamlessly bridging the gap between academic tradition and technological advancement.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* AI Assistance */}
            <div className="col-span-12 md:col-span-8 bg-surface-container-low dark:bg-slate-800 p-10 rounded-3xl border border-outline-variant dark:border-slate-700 relative overflow-hidden group">
              <div className="w-12 h-12 bg-primary-container text-white rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="text-2xl font-semibold text-primary dark:text-slate-50 mb-4">24/7 AI Assistance</h3>
              <p className="text-on-surface-variant dark:text-slate-400 max-w-md">
                Never wait for office hours again. Get instant answers to administrative questions, campus policies, and academic information any time of day or night.
              </p>
            </div>

            {/* Notifications */}
            <div className="col-span-12 md:col-span-4 bg-primary-container p-10 rounded-3xl text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Streamlined Notifications</h3>
                <p className="text-sm text-blue-100">
                  Targeted alerts for important announcements delivered directly by department or level.
                </p>
              </div>
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="text-xs opacity-70">Students already on the platform</div>
              </div>
            </div>

            {/* Info Hub */}
            <div className="col-span-12 md:col-span-4 bg-surface-container dark:bg-slate-800 p-8 rounded-3xl border border-outline-variant dark:border-slate-700">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-6 text-white">
                <span className="material-symbols-outlined">hub</span>
              </div>
              <h4 className="text-xl font-semibold text-primary dark:text-slate-50 mb-3">Unified Information Hub</h4>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">
                From campus facilities to academic programs, find everything about GUU in one place.
              </p>
            </div>

            {/* Communication */}
            <div className="col-span-12 md:col-span-4 bg-white dark:bg-slate-800 p-8 rounded-3xl border-l-4 border-l-tertiary-container shadow-sm">
              <div className="w-10 h-10 bg-tertiary-fixed rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-tertiary-fixed-variant">forum</span>
              </div>
              <h4 className="text-xl font-semibold text-primary dark:text-slate-50 mb-3">Admin Communication</h4>
              <p className="text-sm text-on-surface-variant dark:text-slate-400">
                Admins can send targeted notifications to students by department or academic level.
              </p>
            </div>

            {/* Integration */}
            <div className="col-span-12 md:col-span-4 bg-surface dark:bg-slate-800 p-8 rounded-3xl border border-outline-variant dark:border-slate-700 flex items-center gap-6">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-secondary text-3xl">api</span>
              </div>
              <div>
                <h4 className="font-bold text-primary dark:text-slate-50 mb-1">Powered by AI</h4>
                <p className="text-sm text-on-surface-variant dark:text-slate-400">Built on Groq's LLaMA model for fast, intelligent responses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-surface-container-highest dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '24/7', label: 'AI Availability' },
            { value: '9+', label: 'Colleges Covered' },
            { value: '55+', label: 'Programs Listed' },
            { value: '< 1s', label: 'Avg Response Time' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-5xl font-bold text-primary dark:text-slate-50 mb-2">{stat.value}</div>
              <div className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="bg-primary-container rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to upgrade your campus experience?</h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
              Join students and faculty at Gregory University, Uturu who are already leveraging the power of GUU AI Digital Brain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <button className="bg-white text-primary-container px-10 py-4 rounded-xl font-bold hover:bg-surface-container transition-all">
                  Create Account
                </button>
              </Link>
              <Link to="/chat">
                <button className="bg-secondary text-white px-10 py-4 rounded-xl font-bold hover:opacity-90 transition-all">
                  Try the Chatbot
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div>
          <div className="font-bold text-primary dark:text-slate-100">GUU AI Digital Brain</div>
          <p className="text-xs text-slate-500 mt-1">© 2025 GUU AI Digital Brain. All Rights Reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-xs text-slate-500 hover:text-primary dark:hover:text-blue-400 transition-colors" href="https://gregoryuniversityuturu.edu.ng" target="_blank" rel="noreferrer">Official GUU Website</a>
          <a className="text-xs text-slate-500 hover:text-primary dark:hover:text-blue-400 transition-colors" href="#">Contact Support</a>
        </div>
      </footer>

    </div>
  )
}

export default Home