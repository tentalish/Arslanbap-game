import { useState } from 'react'

function App() {
  const [isZoomed, setIsZoomed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-amber-500/10 to-red-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
              🌰
            </div>
            <span className="text-sm font-medium text-amber-300/80 uppercase tracking-wider">Concept Art</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent leading-tight">
            Arslanbob Runner
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-slate-300 max-w-2xl">
            Vertical mobile game concept art — Endless runner adventure set in the walnut forests of Arslanbob, Kyrgyzstan
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Endless Runner</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">Mobile Game</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">9:16 Vertical</span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-sky-500/20 text-sky-300 border border-sky-500/30">Kyrgyzstan</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Art Display */}
          <div className="flex flex-col items-center">
            <div
              className={`relative group cursor-pointer transition-all duration-500 ${isZoomed ? 'scale-105' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-sky-500/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Phone frame */}
              <div className="relative bg-black rounded-[2.5rem] p-3 shadow-2xl shadow-black/50 border border-slate-700/50">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl z-10"></div>
                
                {/* Screen */}
                <div className="relative rounded-[2rem] overflow-hidden" style={{ aspectRatio: '9/16', maxHeight: '80vh' }}>
                  <img
                    src="https://image.qwenlm.ai/generated-images/8ee1953f-3624-4111-a61b-160f08c2c9ac/_result.png"
                    alt="Arslanbob Runner - Vertical Mobile Game Concept Art"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <span className="text-white/80 text-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                      Click to {isZoomed ? 'fit' : 'zoom'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <p className="mt-6 text-sm text-slate-400 text-center max-w-md">
              Click on the image to toggle zoom • Vertical 9:16 format optimized for mobile gameplay
            </p>
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-80 space-y-6">
            {/* Game Info Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-amber-400">🎮</span> Game Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Genre</dt>
                  <dd className="text-white font-medium">Endless Runner</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Format</dt>
                  <dd className="text-white font-medium">9:16 Vertical</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Setting</dt>
                  <dd className="text-white font-medium">Arslanbob, KG</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Platform</dt>
                  <dd className="text-white font-medium">iOS / Android</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Style</dt>
                  <dd className="text-white font-medium">Cartoon / Chibi</dd>
                </div>
              </dl>
            </div>

            {/* Elements Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">🌿</span> Scene Elements
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  '🌳 Walnut Trees',
                  '🏔️ Snow Mountains',
                  '🏠 Yurt',
                  '🌊 Waterfall',
                  '🌉 Bridges',
                  '🐴 Horse',
                  '🌰 Golden Walnuts',
                  '🪵 Log Obstacles',
                  '👾 Purple Creatures',
                  '🏛️ Ornate Arches',
                  '💐 Flowers',
                  '🪨 Rocks',
                ].map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-700/50 text-slate-300 border border-slate-600/30"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Character Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-red-400">👤</span> Hero Character
              </h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  Chibi-style with round head
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  White Kyrgyz kalpak hat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  Red & gold national outfit
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  Small adventurer backpack
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  Running forward animation
                </li>
              </ul>
            </div>

            {/* UI Elements Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-sky-400">📱</span> UI Elements
              </h2>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">⏸</span>
                  Pause button — top left
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">🌰</span>
                  Walnut counter — top right
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">×2</span>
                  Bonus multiplier badge
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Design Notes */}
        <div className="mt-12 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">📝 Design Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <h3 className="text-amber-300 font-medium mb-2">Composition</h3>
              <p>Vertical 9:16 format with perspective "running into the scene" — the path leads the eye from the bottom toward the mountains, creating depth and forward momentum.</p>
            </div>
            <div>
              <h3 className="text-emerald-300 font-medium mb-2">Color Palette</h3>
              <p>Bright saturated greens, warm amber tones for walnuts and sunlight, cool blues for sky and water, with pops of red from the character's outfit creating focal contrast.</p>
            </div>
            <div>
              <h3 className="text-purple-300 font-medium mb-2">Game Feel</h3>
              <p>The art communicates speed, adventure, and charm — collectible walnuts guide the player's eye along the path while obstacles and creatures promise engaging gameplay.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-slate-500">
          <p>Original concept art • Arslanbob Runner • Mobile Game Design</p>
          <p className="mt-1">Inspired by the walnut forests of Arslanbob, Kyrgyzstan 🇰🇬</p>
        </footer>
      </main>
    </div>
  )
}

export default App
