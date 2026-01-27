"use client";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]">
      
      {/* 1. BLUEPRINT GRID SYSTEM */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #808080 1px, transparent 1px),
            linear-gradient(to bottom, #808080 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 90%)'
        }}
      />

      {/* 2. NEON GREEN GLOW (Top Right) */}
      <div 
        className="absolute top-[-15%] right-[-10%] w-[80vw] h-[80vw] rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #afff00 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />

      {/* 3. STUDIO BLUE GLOW (Bottom Left) */}
      <div 
        className="absolute bottom-[-20%] left-[-15%] w-[90vw] h-[90vw] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)',
          filter: 'blur(130px)',
        }}
      />

      {/* 4. HORIZONTAL SCANLINES (CRT Style) */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))',
          backgroundSize: '100% 4px, 3px 100%',
        }}
      />

      {/* 5. VIGNETTE OVERLAY (Focus center) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.4)_100%)]" />

      

    </div>
  );
}