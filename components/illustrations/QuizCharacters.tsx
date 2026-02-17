"use client";

export default function QuizCharacters() {
  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Background decorative elements */}
        <g className="animate-float-slow">
          <circle cx="150" cy="100" r="40" fill="#E6D8C3" opacity="0.3" />
          <circle cx="650" cy="120" r="30" fill="#5E826B" opacity="0.2" />
          <circle cx="700" cy="400" r="35" fill="#C1A88B" opacity="0.25" />
        </g>

        {/* Laptop/Screen */}
        <g className="laptop">
          {/* Laptop base */}
          <rect x="150" y="450" width="500" height="20" rx="5" fill="#2D3748" />
          <rect x="100" y="470" width="600" height="10" rx="5" fill="#1A202C" />
          
          {/* Laptop screen */}
          <rect x="180" y="200" width="440" height="260" rx="8" fill="#1A202C" />
          <rect x="195" y="215" width="410" height="230" rx="4" fill="#FFFFFF" />
          
          {/* Browser chrome */}
          <rect x="195" y="215" width="410" height="30" fill="#5E826B" rx="4" />
          <circle cx="210" cy="230" r="4" fill="#FF5F56" />
          <circle cx="225" cy="230" r="4" fill="#FFBD2E" />
          <circle cx="240" cy="230" r="4" fill="#27C93F" />
          
          {/* Quiz interface */}
          <g className="quiz-interface">
            {/* Header */}
            <rect x="210" y="260" width="380" height="25" fill="#E6D8C3" rx="3" />
            <text x="220" y="277" fontSize="14" fill="#3D352E" fontWeight="600">
              Quiz: JavaScript Fundamentals
            </text>
            
            {/* Question */}
            <rect x="210" y="295" width="380" height="60" fill="#FAF9F6" rx="3" />
            <text x="220" y="315" fontSize="12" fill="#3D352E">
              What is a closure in JavaScript?
            </text>
            
            {/* Answer options */}
            <g className="animate-pulse-subtle">
              <rect x="210" y="365" width="180" height="30" fill="#5E826B" rx="4" opacity="0.8" />
              <text x="220" y="385" fontSize="11" fill="#FFFFFF">A) A function inside another</text>
            </g>
            
            <rect x="210" y="405" width="180" height="30" fill="#E6D8C3" rx="4" />
            <text x="220" y="425" fontSize="11" fill="#3D352E">B) A loop structure</text>
          </g>
        </g>

        {/* Left Character - Female */}
        <g className="character-left animate-float">
          {/* Body */}
          <ellipse cx="120" cy="420" rx="35" ry="15" fill="#1A202C" opacity="0.1" />
          <rect x="95" y="360" width="50" height="60" rx="25" fill="#FFD4A3" />
          
          {/* Legs */}
          <rect x="100" y="410" width="15" height="40" fill="#8B4513" rx="7" />
          <rect x="115" y="410" width="15" height="40" fill="#8B4513" rx="7" />
          
          {/* Shoes */}
          <ellipse cx="107" cy="450" rx="10" ry="5" fill="#2D3748" />
          <ellipse cx="122" cy="450" rx="10" ry="5" fill="#2D3748" />
          
          {/* Shirt */}
          <rect x="90" y="350" width="60" height="50" rx="10" fill="#FFB84D" />
          
          {/* Arms */}
          <rect x="75" y="360" width="12" height="45" rx="6" fill="#FFD4A3" />
          <rect x="143" y="360" width="12" height="45" rx="6" fill="#FFD4A3" />
          
          {/* Laptop on lap */}
          <rect x="85" y="390" width="70" height="8" rx="2" fill="#5E826B" />
          <rect x="80" y="382" width="80" height="10" rx="2" fill="#2D3748" />
          
          {/* Head */}
          <circle cx="120" cy="330" r="25" fill="#FFD4A3" />
          
          {/* Hair */}
          <path d="M 95 330 Q 95 305 120 305 Q 145 305 145 330 Z" fill="#2D3748" />
          
          {/* Face */}
          <circle cx="113" cy="328" r="2" fill="#2D3748" />
          <circle cx="127" cy="328" r="2" fill="#2D3748" />
          <path d="M 113 338 Q 120 342 127 338" stroke="#2D3748" strokeWidth="1.5" fill="none" />
        </g>

        {/* Right Character - Male */}
        <g className="character-right animate-float-delayed">
          {/* Body */}
          <ellipse cx="680" cy="420" rx="35" ry="15" fill="#1A202C" opacity="0.1" />
          <rect x="655" y="360" width="50" height="60" rx="25" fill="#FFD4A3" />
          
          {/* Legs */}
          <rect x="660" y="410" width="15" height="40" fill="#2C5282" rx="7" />
          <rect x="675" y="410" width="15" height="40" fill="#2C5282" rx="7" />
          
          {/* Shoes */}
          <ellipse cx="667" cy="450" rx="10" ry="5" fill="#1A202C" />
          <ellipse cx="682" cy="450" rx="10" ry="5" fill="#1A202C" />
          
          {/* Shirt */}
          <rect x="650" y="350" width="60" height="50" rx="10" fill="#5E826B" />
          
          {/* Arms */}
          <rect x="635" y="360" width="12" height="45" rx="6" fill="#FFD4A3" />
          <rect x="703" y="360" width="12" height="45" rx="6" fill="#FFD4A3" />
          
          {/* Holding tablet/phone */}
          <rect x="700" y="370" width="40" height="55" rx="4" fill="#2D3748" />
          <rect x="705" y="375" width="30" height="45" rx="2" fill="#5E826B" opacity="0.3" />
          
          {/* Head */}
          <circle cx="680" cy="330" r="25" fill="#FFD4A3" />
          
          {/* Hair */}
          <path d="M 655 325 Q 655 305 680 305 Q 705 305 705 325" fill="#1A202C" />
          
          {/* Face */}
          <circle cx="673" cy="328" r="2" fill="#2D3748" />
          <circle cx="687" cy="328" r="2" fill="#2D3748" />
          <path d="M 673 338 Q 680 342 687 338" stroke="#2D3748" strokeWidth="1.5" fill="none" />
        </g>

        {/* Floating icons */}
        <g className="floating-icons">
          {/* Checkmark */}
          <g className="animate-bounce-slow" style={{ transformOrigin: '250px 150px' }}>
            <circle cx="250" cy="150" r="20" fill="#27C93F" opacity="0.8" />
            <path d="M 242 150 L 248 156 L 258 144" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
          
          {/* Trophy */}
          <g className="animate-bounce-delayed" style={{ transformOrigin: '550px 180px' }}>
            <path d="M 540 175 L 545 165 L 555 165 L 560 175 L 555 185 L 545 185 Z" fill="#FFD700" />
            <rect x="547" y="185" width="6" height="8" fill="#FFD700" />
            <rect x="543" y="193" width="14" height="3" fill="#FFD700" />
          </g>
          
          {/* Star */}
          <g className="animate-spin-slow" style={{ transformOrigin: '600px 320px' }}>
            <path d="M 600 310 L 603 318 L 611 318 L 605 323 L 607 331 L 600 326 L 593 331 L 595 323 L 589 318 L 597 318 Z" fill="#FFB84D" />
          </g>
        </g>
      </svg>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes bounce-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite 0.5s;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-bounce-delayed {
          animation: bounce-delayed 2.5s ease-in-out infinite 0.3s;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
