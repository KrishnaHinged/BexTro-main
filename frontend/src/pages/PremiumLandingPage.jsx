import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PremiumLandingPage = ({ currentTheme }) => {
  // Testimonials list
  const reviews = [
    {
      name: "Marcus Vance",
      handle: "@marcusv",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "Bextro completely shifted my focus. Instead of checking notifications, I check my streak. The proof upload system is a game-changer.",
      badge: "60-day streak"
    },
    {
      name: "Sienna Brooks",
      handle: "@siennab",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      quote: "I love that my profile only represents what I actually achieved. It feels like an authentic growth portfolio instead of curated highlight reels.",
      badge: "Level 4 Builder"
    },
    {
      name: "Elena Rostova",
      handle: "@elenar",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The 5-second pause on onboarding is genius. It immediately makes you feel that this space is different, quiet, and action-focused.",
      badge: "Creative track"
    },
    {
      name: "Devon Chen",
      handle: "@devonc",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "Having my challenges structured based on my interests keeps me disciplined. Best system for habit creation I have ever used.",
      badge: "920 XP earned"
    }
  ];

  return (
    <div className="font-sans-clean bg-cream text-charcoal min-h-screen selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden">
      
      {/* 1. Header / Navigation */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between border-b border-cream-dark/40">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-serif-elegant font-bold tracking-tight text-charcoal">
            Bextro<span className="text-indigo-600">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-charcoal/70">
          <a href="#how" className="hover:text-charcoal transition-colors">How it works</a>
          <a href="#features" className="hover:text-charcoal transition-colors">Philosophy</a>
          <a href="#reviews" className="hover:text-charcoal transition-colors">Builders</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/signin" className="text-sm font-semibold hover:text-indigo-600 transition-colors">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm"
          >
            Start Growing
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        {/* Subtle Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-6"
        >
          <i className="fa-solid fa-sparkles text-[10px]"></i>
          <span>Welcome to a quiet space for growth</span>
        </motion.div>

        {/* Serif Headings */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-serif-elegant font-normal text-charcoal leading-[1.1] tracking-tight"
        >
          Don't just talk,<br />
          <span className="relative inline-block font-normal italic">
            take action
            {/* Scribble SVG curve under 'take action' */}
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-400/70" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,7 C30,2 70,2 100,7" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-charcoal/70 max-w-2xl mx-auto mt-8 sm:mt-10 mb-10 sm:mb-12 leading-relaxed"
        >
          Bextro is the progress portfolio of your life. Build streaks, generate custom challenges tailored to your goals, and document your growth with verifiable proof.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto bg-charcoal hover:bg-black text-white font-medium px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg text-base"
          >
            Create Your Account
          </Link>
          <a
            href="#how"
            className="w-full sm:w-auto border border-charcoal/20 hover:border-charcoal hover:bg-charcoal/5 text-charcoal font-semibold px-8 py-3.5 rounded-full transition-all duration-300 text-base"
          >
            See How it Works
          </a>
        </motion.div>
      </section>

      {/* 3. App Showcase (Dark Forest Green Background) */}
      <section className="bg-dark-green text-sand py-20 md:py-28 px-6 relative overflow-hidden">
        {/* Abstract floating circles background */}
        <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-emerald-800/10 blur-[80px]" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-indigo-900/10 blur-[80px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-5 text-left">
            <h2 className="text-3xl sm:text-5xl font-serif-elegant font-normal leading-[1.2] text-white mb-6">
              Track actions,<br />not just intentions.
            </h2>
            <p className="text-sand/80 text-base sm:text-lg mb-8 leading-relaxed">
              Bextro features a clean, focus-first panel that organizes your growth into active daily, weekly, or monthly milestones. Everything is tailored directly to your interest tracks.
            </p>

            {/* Benefit Checkmarks */}
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/30">
                  <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
                </span>
                <span className="text-sand/90 text-sm font-medium">Interests-based smart challenge engine</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/30">
                  <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
                </span>
                <span className="text-sand/90 text-sm font-medium">Verification system prevents fake progress</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/30">
                  <i className="fa-solid fa-check text-[10px] text-emerald-400"></i>
                </span>
                <span className="text-sand/90 text-sm font-medium">100% Privacy — you decide what's public</span>
              </li>
            </ul>
          </div>

          {/* Right Mockup Display */}
          <div className="lg:col-span-7 flex justify-center relative">
            <div className="w-full max-w-[500px] bg-dark-green-card border border-emerald-800/25 rounded-3xl p-6 shadow-2xl relative">
              
              {/* Fake UI Header */}
              <div className="flex items-center justify-between pb-6 border-b border-emerald-800/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-xs">
                    BX
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Daily Challenges</h4>
                    <p className="text-[10px] text-emerald-400/80">3 active today</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Streak: 5 Days
                </div>
              </div>

              {/* Fake UI Challenges List */}
              <div className="space-y-4 pt-6">
                
                {/* Challenge 1 */}
                <div className="p-4 rounded-2xl bg-dark-green/60 border border-emerald-800/15 hover:border-emerald-500/20 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 mb-2 inline-block">
                        Health & Fitness
                      </span>
                      <h5 className="text-sm font-semibold text-white">Run 5 Kilometers outdoors</h5>
                      <p className="text-xs text-sand/60 mt-1">Keep a steady pace. Record your route map as proof.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Submit Proof
                    </button>
                  </div>
                </div>

                {/* Challenge 2 */}
                <div className="p-4 rounded-2xl bg-dark-green/60 border border-emerald-800/15 hover:border-emerald-500/20 transition-all opacity-80">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-400 mb-2 inline-block">
                        Learning
                      </span>
                      <h5 className="text-sm font-semibold text-white">Read 15 pages of your book</h5>
                      <p className="text-xs text-sand/60 mt-1">No distractions. Highlight key takeaways.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Submit Proof
                    </button>
                  </div>
                </div>

                {/* Challenge 3 */}
                <div className="p-4 rounded-2xl bg-dark-green/60 border border-emerald-800/15 hover:border-emerald-500/20 transition-all opacity-60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-400 mb-2 inline-block">
                        Creative
                      </span>
                      <h5 className="text-sm font-semibold text-white">Sketch a minimalist visual concept</h5>
                      <p className="text-xs text-sand/60 mt-1">Submit a photo of your hand-drawn sketch.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium">
                      Submit Proof
                    </button>
                  </div>
                </div>

              </div>

              {/* Floating tags */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-indigo-400/20"
              >
                🚀 +150 XP
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-emerald-500 text-dark-green text-xs font-semibold px-4 py-2 rounded-full shadow-lg border border-emerald-400/20"
              >
                🔥 Streak Restored
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. Value Propositions Section */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-6 border-b border-cream-dark/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Bextro Difference</span>
          <h2 className="text-3xl sm:text-5xl font-serif-elegant font-normal mt-3 text-charcoal">
            3x more consistent than planning.
          </h2>
          <p className="text-charcoal/70 mt-4 font-normal">
            Traditional task apps collect dust because they lack accountability. Bextro structures accountability directly into the design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-cream-card border border-cream-dark/80 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg mb-6">
              <i className="fa-solid fa-eye-slash"></i>
            </div>
            <h3 className="text-xl font-serif-elegant font-semibold mb-3 text-charcoal">Move in Silence</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              No personal updates, no superficial stories. The network only sees what you achieve. Your actions form your reputation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-cream-card border border-cream-dark/80 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg mb-6">
              <i className="fa-solid fa-shield-check"></i>
            </div>
            <h3 className="text-xl font-serif-elegant font-semibold mb-3 text-charcoal">Action-backed Proof</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              You can't mark a challenge completed without uploading verified proof (images, links, or videos). Authenticity is default.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-cream-card border border-cream-dark/80 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-lg mb-6">
              <i className="fa-solid fa-gamepad"></i>
            </div>
            <h3 className="text-xl font-serif-elegant font-semibold mb-3 text-charcoal">Gamified Loops</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              Earn XP, increase your builder level, and maintain your streak. Maintain consistency and unlock performance badges.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section (Dark Charcoal Background) */}
      <section id="how" className="bg-dark-green text-sand py-20 md:py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Step-by-step System</span>
            <h2 className="text-3xl sm:text-5xl font-serif-elegant font-normal mt-3 text-white">
              How Bextro works
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative">
              <div className="text-[64px] font-serif-elegant text-emerald-500/10 font-bold leading-none absolute -top-8 -left-2 select-none">
                01
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2 relative z-10">Account Creation</h3>
              <p className="text-sand/70 text-sm leading-relaxed">
                Sign up and list the specific goals and interests you want to cultivate (health, code, language, art).
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-[64px] font-serif-elegant text-emerald-500/10 font-bold leading-none absolute -top-8 -left-2 select-none">
                02
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2 relative z-10">The Pause Onboarding</h3>
              <p className="text-sand/70 text-sm leading-relaxed">
                Experience our signature welcome flow designed to slow you down and prompt true commitment.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="text-[64px] font-serif-elegant text-emerald-500/10 font-bold leading-none absolute -top-8 -left-2 select-none">
                03
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2 relative z-10">Receive Challenges</h3>
              <p className="text-sand/70 text-sm leading-relaxed">
                Get custom challenges automatically built for you. Choose daily or long-form tracks based on your needs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="text-[64px] font-serif-elegant text-emerald-500/10 font-bold leading-none absolute -top-8 -left-2 select-none">
                04
              </div>
              <h3 className="text-lg font-semibold text-white mt-4 mb-2 relative z-10">Prove & Level Up</h3>
              <p className="text-sand/70 text-sm leading-relaxed">
                Complete the challenge, submit proof, grow your streak, and build your digital progress portfolio.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Testimonials Section ("Love letters to Bextro") */}
      <section id="reviews" className="py-20 md:py-28 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 relative">
          <div className="inline-block p-2.5 rounded-full bg-purple-50 text-indigo-600 text-sm mb-4">
            <i className="fa-solid fa-star"></i>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-elegant font-normal text-charcoal">
            Love letters to Bextro
          </h2>
          <p className="text-charcoal/70 mt-3">
            What builders around the globe are saying about tracking consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="p-6 rounded-3xl bg-cream-card border border-cream-dark/80 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-charcoal/80 text-sm leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-cream-dark/50">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full border border-cream-dark object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-charcoal">{review.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-charcoal/50">{review.handle}</span>
                    <span className="w-1 h-1 rounded-full bg-charcoal/30"></span>
                    <span className="text-[9px] font-bold text-indigo-600">{review.badge}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Bottom Call-To-Action (Background Nature Image Overlay) */}
      <section className="px-6 pb-20">
        <div 
          className="max-w-7xl mx-auto rounded-[32px] overflow-hidden relative min-h-[500px] flex items-center justify-center text-center p-8 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1600&auto=format&fit=crop&q=80')`
          }}
        >
          <div className="max-w-xl relative z-10">
            <h2 className="text-4xl sm:text-6xl font-serif-elegant font-normal text-white leading-tight mb-6">
              Start growing
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md mx-auto">
              Ready to leave the planning phase behind? Take on your first challenge today.
            </p>
            <Link
              to="/signup"
              className="bg-white hover:bg-sand text-charcoal font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-xl inline-block text-base"
            >
              Sign Up and Begin
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Brand Footer */}
      <footer className="max-w-7xl mx-auto px-6 pt-8 pb-16 border-t border-cream-dark/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
          <div className="text-lg font-serif-elegant font-bold text-charcoal">
            Bextro<span className="text-indigo-600">.</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-semibold text-charcoal/50">
            <a href="#how" className="hover:text-charcoal transition-colors">How it works</a>
            <a href="#features" className="hover:text-charcoal transition-colors">Philosophy</a>
            <a href="#reviews" className="hover:text-charcoal transition-colors">Reviews</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-cream-dark/30 pt-8 text-xs text-charcoal/40">
          <p>© {new Date().getFullYear()} Bextro. Move in silence.</p>
          <div className="flex gap-4">
            <span className="hover:text-charcoal cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-charcoal cursor-pointer">Terms of Service</span>
          </div>
        </div>

        {/* Big Bold Footer Branding */}
        <div className="text-[12vw] font-serif-elegant font-bold text-charcoal/[0.03] select-none text-center leading-none mt-12">
          Bextro
        </div>
      </footer>

    </div>
  );
};

export default PremiumLandingPage;
