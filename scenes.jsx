// scenes.jsx — All scene components for the Clinique Bouchard patient journey film
// Loaded after animations.jsx — uses Sprite, useSprite, TextSprite, Easing, etc.

const PALETTE = {
  ink:        '#0a2b36',   // deep teal/navy
  inkSoft:    '#13495a',
  cream:      '#f5efe4',
  paper:      '#faf6ed',
  gold:       '#b88a3e',
  goldSoft:   '#d4b06c',
  lineGold:   'rgba(184,138,62,0.32)',
  lineWhite:  'rgba(245,239,228,0.18)',
  warm:       '#c46b3c',
};

const FONT_DISPLAY = '"Cormorant Garamond", "Garamond", "EB Garamond", serif';
const FONT_BODY    = '"Inter", system-ui, sans-serif';
const FONT_MONO    = '"JetBrains Mono", ui-monospace, monospace';

// ─── Helper hooks ─────────────────────────────────────────────────────────

function useEase(eased) {
  // returns eased local time from current sprite
  const { localTime, duration } = useSprite();
  return clamp(localTime / Math.max(0.001, duration), 0, 1);
}

// ─── Decorative ─────────────────────────────────────────────────────────

function FilmGrain() {
  // subtle SVG noise overlay
  return (
    <svg style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.15,
    }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)"/>
    </svg>
  );
}

function Vignette({ intensity = 0.55 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,${intensity}) 100%)`,
    }}/>
  );
}

function GoldRule({ x, y, width, delay = 0, color = PALETTE.gold }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp((localTime - delay) / 0.8, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: width * t, height: 1,
      background: color,
      transformOrigin: 'left',
    }}/>
  );
}

// Animated number counter
function CountUp({ to, x, y, size = 80, color = PALETTE.gold, suffix = '', delay = 0, dur = 1.2 }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp((localTime - delay) / dur, 0, 1));
  const val = Math.floor(to * t);
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      fontFamily: FONT_DISPLAY, fontSize: size, color,
      fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
    }}>{val}{suffix}</div>
  );
}

// Ken-burns background image filling full frame
function KenBurnsBG({ src, scaleFrom = 1.0, scaleTo = 1.12, panX = 0, panY = 0, tint = 'rgba(10,43,54,0.42)' }) {
  const { progress } = useSprite();
  const t = Easing.easeInOutSine(progress);
  const scale = scaleFrom + (scaleTo - scaleFrom) * t;
  const tx = panX * t;
  const ty = panY * t;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: -40,
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        willChange: 'transform',
      }}/>
      <div style={{ position: 'absolute', inset: 0, background: tint }}/>
    </div>
  );
}

// Caption strip at bottom — subtitle for narration
function Caption({ text, sub = null }) {
  const { localTime, duration } = useSprite();
  const entry = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));
  const exitStart = duration - 0.5;
  const exit = localTime > exitStart ? Easing.easeInCubic(clamp((localTime - exitStart) / 0.5, 0, 1)) : 0;
  const opacity = entry * (1 - exit);
  return (
    <div style={{
      position: 'absolute', left: 120, right: 120, bottom: 70,
      opacity, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 26, color: PALETTE.paper,
        fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.005em',
        textShadow: '0 2px 12px rgba(0,0,0,0.6)',
        textWrap: 'pretty',
      }}>{text}</div>
      {sub && (
        <div style={{
          marginTop: 8, fontFamily: FONT_MONO, fontSize: 13,
          color: PALETTE.goldSoft, letterSpacing: '0.22em', textTransform: 'uppercase',
        }}>{sub}</div>
      )}
    </div>
  );
}

// Chapter marker — top-left timeline label
function ChapterTag({ phase, label }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: 80, top: 60,
      display: 'flex', alignItems: 'center', gap: 18,
      opacity: t, transform: `translateX(${(1-t)*-10}px)`,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.3em',
        color: PALETTE.goldSoft, textTransform: 'uppercase',
      }}>{phase}</div>
      <div style={{ width: 28, height: 1, background: PALETTE.gold, opacity: 0.5 }}/>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 13, color: PALETTE.paper,
        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 1 — Marseille opening (0 → 12)
// ───────────────────────────────────────────────────────────────────────

function Scene1_Opening() {
  return (
    <Sprite start={0.00} end={13.26}>
      <KenBurnsBG src="assets/marseille.jpg" scaleFrom={1.05} scaleTo={1.18} panY={-20} tint="rgba(10,43,54,0.5)" />
      <Vignette intensity={0.45} />

      <Sprite start={1.32} end={13.75}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 380,
          textAlign: 'center',
        }}>
          <FadeIn delay={0} dur={1.4}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.42em',
              color: PALETTE.goldSoft, textTransform: 'uppercase',
              marginBottom: 28,
            }}>Marseille · France</div>
          </FadeIn>
          <FadeIn delay={0.8} dur={1.8}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 124, color: PALETTE.paper,
              fontWeight: 300, letterSpacing: '-0.02em', lineHeight: 1.0,
              fontStyle: 'italic',
            }}>Your Patient Journey</div>
          </FadeIn>
          <FadeIn delay={1.8} dur={1.4}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 80, color: PALETTE.gold,
              fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.05, marginTop: 6,
            }}>at Clinique Bouchard</div>
          </FadeIn>
          <FadeIn delay={3.0} dur={1.2}>
            <div style={{
              width: 80, height: 1, background: PALETTE.gold, margin: '40px auto',
            }}/>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 18, color: PALETTE.cream,
              letterSpacing: '0.32em', textTransform: 'uppercase', fontWeight: 300,
            }}>Excellence · Safety · Care</div>
          </FadeIn>
        </div>
      </Sprite>

    </Sprite>
  );
}

function FadeIn({ children, delay = 0, dur = 1, y = 12 }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp((localTime - delay) / dur, 0, 1));
  return (
    <div style={{
      opacity: t, transform: `translateY(${(1 - t) * y}px)`,
      willChange: 'transform, opacity',
    }}>{children}</div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 2 — Clinique Bouchard (13 → 32)
// ───────────────────────────────────────────────────────────────────────

function Scene2_Clinique() {
  return (
    <Sprite start={13.26} end={40.37}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.paper }}/>

      {/* Left: clinic photo with slow ken burns */}
      <Sprite start={14.41} end={40.37}>
        <div style={{
          position: 'absolute', left: 60, top: 80, width: 880, height: 920,
          overflow: 'hidden', borderRadius: 2,
          boxShadow: '0 30px 80px rgba(10,43,54,0.25)',
        }}>
          <KenBurnsBG src="assets/clinique-bouchard.jpg" scaleFrom={1.0} scaleTo={1.08} tint="transparent" />
        </div>
      </Sprite>

      {/* Right: editorial type block */}
      <div style={{ position: 'absolute', left: 1020, top: 180, right: 100 }}>
        <Sprite start={14.74} end={40.37}>
          <FadeIn delay={0} dur={1.0}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 13, letterSpacing: '0.4em',
              color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 32,
            }}>Established Medical Excellence</div>
          </FadeIn>
          <FadeIn delay={0.4} dur={1.4}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 96, color: PALETTE.ink,
              fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.95,
            }}>Clinique<br/><em style={{ fontWeight: 300 }}>Bouchard</em></div>
          </FadeIn>
          <FadeIn delay={1.2} dur={1.0}>
            <div style={{
              marginTop: 24, fontFamily: FONT_BODY, fontSize: 18,
              color: PALETTE.inkSoft, letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>An ELSAN group hospital</div>
          </FadeIn>
          <FadeIn delay={1.8} dur={1.0}>
            <div style={{
              width: 80, height: 1, background: PALETTE.gold, margin: '40px 0',
            }}/>
          </FadeIn>
          <FadeIn delay={2.2} dur={1.2}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 38, color: PALETTE.ink,
              fontWeight: 400, lineHeight: 1.25, fontStyle: 'italic',
              marginBottom: 28,
            }}>A flagship of French private healthcare, dedicated to bariatric surgery.</div>
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={3.0} dur={1.0}>
            <div style={{ display: 'flex', gap: 60, marginTop: 40 }}>
              <Stat number={<CountUp to={140} x={0} y={0} size={68} color={PALETTE.gold} suffix="+" delay={3.2} dur={1.0}/>} label="Hospitals in the ELSAN network" />
            </div>
          </FadeIn>
          <FadeIn delay={3.6} dur={1.0}>
            <div style={{ display: 'flex', gap: 60, marginTop: 28 }}>
              <StatStatic number="77" suffix="" label="Rue du Docteur Escat, 13006 Marseille" />
            </div>
          </FadeIn>
          <FadeIn delay={4.2} dur={1.0}>
            <div style={{ display: 'flex', gap: 60, marginTop: 28 }}>
              <StatStatic number="3" suffix="" label="Phases of fully coordinated care" />
            </div>
          </FadeIn>
        </Sprite>
      </div>

    </Sprite>
  );
}

function Stat({ number, label }) {
  return (
    <div style={{ position: 'relative', minWidth: 200, height: 96 }}>
      <div style={{ position: 'absolute', inset: 0 }}>{number}</div>
      <div style={{
        position: 'absolute', left: 0, top: 78, width: 380,
        fontFamily: FONT_BODY, fontSize: 14, color: PALETTE.inkSoft,
        letterSpacing: '0.06em', lineHeight: 1.3,
      }}>{label}</div>
    </div>
  );
}

function StatStatic({ number, suffix = '', label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 56, color: PALETTE.gold,
        fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
        minWidth: 80,
      }}>{number}{suffix}</div>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.inkSoft,
        lineHeight: 1.35, maxWidth: 460,
      }}>{label}</div>
    </div>
  );
}

function CaptionLight({ text, color }) {
  const { localTime, duration } = useSprite();
  const entry = Easing.easeOutCubic(clamp(localTime / 0.6, 0, 1));
  const exitStart = duration - 0.5;
  const exit = localTime > exitStart ? Easing.easeInCubic(clamp((localTime - exitStart) / 0.5, 0, 1)) : 0;
  const opacity = entry * (1 - exit);
  return (
    <div style={{
      position: 'absolute', left: 120, right: 120, bottom: 60,
      opacity, textAlign: 'center',
      fontFamily: FONT_BODY, fontSize: 22, color: color || PALETTE.ink,
      fontWeight: 400, lineHeight: 1.4, letterSpacing: '0.005em',
      textWrap: 'pretty',
    }}>{text}</div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 3 — Medical Leadership (32 → 60)
// ───────────────────────────────────────────────────────────────────────

function Scene3_Surgeons() {
  return (
    <Sprite start={40.37} end={73.51}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.ink }}/>
      {/* subtle texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 30% 40%, rgba(184,138,62,0.08), transparent 60%)',
      }}/>

      <ChapterTag phase="Phase · 01" label="Your Surgical Team" />

      {/* Heading */}
      <Sprite start={35.42} end={73.51}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center' }}>
          <FadeIn delay={0} dur={1.0}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 72, color: PALETTE.paper,
              fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em',
            }}>An internationally recognized team</div>
          </FadeIn>
        </div>
      </Sprite>

      {/* Two surgeon cards */}
      <Sprite start={36.74} end={51.70}>
        <SurgeonCard
          src="assets/nedelcu.png"
          name="Dr. Nedelcu"
          role="Lead Bariatric Surgeon"
          credentials={[
            'Thousands of sleeve gastrectomies performed',
            'Internationally published author',
            'Specialist in revisional bariatric surgery',
          ]}
          x={180}
        />
      </Sprite>

      <Sprite start={50.60} end={73.51}>
        <SurgeonCard
          src="assets/manos.png"
          name="Dr. Manos"
          role="Co-founder · Endoscopic Bariatrics"
          credentials={[
            'Co-founder of the bariatric program',
            'Expert in endoscopic procedures',
            'Minimally invasive techniques specialist',
          ]}
          x={180}
        />
      </Sprite>

    </Sprite>
  );
}

function SurgeonCard({ src, name, role, credentials, x }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 280, width: 1560 }}>
      <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start' }}>
        {/* photo */}
        <FadeIn delay={0} dur={1.0} y={20}>
          <div style={{
            width: 420, height: 520, overflow: 'hidden',
            borderRadius: 2,
            background: PALETTE.cream,
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            border: `1px solid ${PALETTE.lineGold}`,
          }}>
            <img src={src} alt={name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'contrast(1.02) saturate(0.95)',
            }}/>
          </div>
        </FadeIn>

        {/* text */}
        <div style={{ flex: 1, paddingTop: 30 }}>
          <FadeIn delay={0.3} dur={0.9}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 13, letterSpacing: '0.32em',
              color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 24,
            }}>{role}</div>
          </FadeIn>
          <FadeIn delay={0.5} dur={1.2}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 132, color: PALETTE.paper,
              fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em',
            }}>{name}</div>
          </FadeIn>
          <FadeIn delay={1.0} dur={0.6}>
            <div style={{ width: 60, height: 1, background: PALETTE.gold, margin: '36px 0 32px' }}/>
          </FadeIn>
          {credentials.map((c, i) => (
            <FadeIn key={i} delay={1.32 + i * 0.25} dur={0.7} y={8}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 14,
              }}>
                <div style={{
                  fontFamily: FONT_MONO, fontSize: 12, color: PALETTE.goldSoft,
                  letterSpacing: '0.16em', width: 28,
                }}>0{i+1}</div>
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 22, color: PALETTE.cream,
                  lineHeight: 1.35, fontWeight: 300, maxWidth: 540,
                }}>{c}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 4 — Coordination Team (60 → 90)
// ───────────────────────────────────────────────────────────────────────

function Scene4_Coordination() {
  return (
    <Sprite start={73.51} end={107.85}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.paper }}/>

      <ChapterTagDark phase="Phase · 02" label="Always at your side" />

      <Sprite start={66.22} end={107.85}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center' }}>
          <FadeIn delay={0} dur={1.0}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 72, color: PALETTE.ink,
              fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em',
            }}>Your dedicated care coordinators</div>
          </FadeIn>
          <FadeIn delay={0.6} dur={1.0}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 18, color: PALETTE.inkSoft,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginTop: 16, fontWeight: 400,
            }}>On-site at the clinic · Remote concierge service</div>
          </FadeIn>
        </div>
      </Sprite>

      {/* On-site coordinator — Audrey, featured larger */}
      <Sprite start={67.65} end={107.85}>
        <div style={{ position: 'absolute', left: 180, top: 320, width: 480 }}>
          <FadeIn delay={0} dur={1.0} y={20}>
            <div style={{
              width: 480, height: 580, overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(10,43,54,0.2)',
              border: `1px solid ${PALETTE.lineGold}`,
            }}>
              <img src="assets/audrey.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            </div>
          </FadeIn>
          <FadeIn delay={0.4} dur={0.8}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.32em',
              color: PALETTE.gold, textTransform: 'uppercase', marginTop: 28, marginBottom: 10,
            }}>On-site Coordinator · Marseille</div>
          </FadeIn>
          <FadeIn delay={0.6} dur={1.0}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 76, color: PALETTE.ink,
              fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
            }}>Audrey</div>
          </FadeIn>
          <FadeIn delay={1.0} dur={0.8}>
            <div style={{
              marginTop: 16, fontFamily: FONT_BODY, fontSize: 18,
              color: PALETTE.inkSoft, lineHeight: 1.5, fontWeight: 300,
              maxWidth: 460,
            }}>Welcomes you at Clinique Bouchard. Orchestrates every appointment, every translation, every step of your stay.</div>
          </FadeIn>
        </div>
      </Sprite>

      {/* Right column — Remote concierge trio */}
      <Sprite start={70.40} end={107.85}>
        <div style={{ position: 'absolute', left: 800, top: 290, right: 100 }}>
          <FadeIn delay={0} dur={0.8}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.32em',
              color: PALETTE.gold, textTransform: 'uppercase', marginBottom: 18,
            }}>Remote Concierge Team</div>
          </FadeIn>
          <FadeIn delay={0.2} dur={1.0}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 56, color: PALETTE.ink,
              fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em',
              fontStyle: 'italic', marginBottom: 8,
            }}>Before, during &amp; after —</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 56, color: PALETTE.gold,
              fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em',
              marginBottom: 36,
            }}>we manage everything.</div>
          </FadeIn>

          <div style={{ display: 'flex', gap: 26, marginTop: 40 }}>
            {[
              { src: 'assets/rain.png',   name: 'Rain',   delay: 0.6 },
              { src: 'assets/stormi.png', name: 'Stormi', delay: 0.9 },
              { src: 'assets/summer.png', name: 'Summer', delay: 1.2 },
            ].map(p => (
              <FadeIn key={p.name} delay={p.delay} dur={0.9} y={16}>
                <div style={{ width: 280 }}>
                  <div style={{
                    width: 280, height: 340, overflow: 'hidden',
                    boxShadow: '0 20px 50px rgba(10,43,54,0.18)',
                    border: `1px solid ${PALETTE.lineGold}`,
                  }}>
                    <img src={p.src} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  </div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontSize: 40, color: PALETTE.ink,
                    fontWeight: 400, lineHeight: 1, marginTop: 18,
                    letterSpacing: '-0.01em',
                  }}>{p.name}</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 13, color: PALETTE.inkSoft,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    marginTop: 8, fontWeight: 400,
                  }}>Concierge</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={1.8} dur={1.0}>
            <div style={{
              marginTop: 38, fontFamily: FONT_BODY, fontSize: 18,
              color: PALETTE.inkSoft, lineHeight: 1.55, fontWeight: 300,
              maxWidth: 880,
            }}>Travel, logistics, translations, document management, and direct communication with your medical team — handled around the clock.</div>
          </FadeIn>
        </div>
      </Sprite>

    </Sprite>
  );
}

function ChapterTagDark({ phase, label }) {
  const { localTime } = useSprite();
  const t = Easing.easeOutCubic(clamp(localTime / 0.7, 0, 1));
  return (
    <div style={{
      position: 'absolute', left: 80, top: 60,
      display: 'flex', alignItems: 'center', gap: 18,
      opacity: t, transform: `translateX(${(1-t)*-10}px)`,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.3em',
        color: PALETTE.gold, textTransform: 'uppercase',
      }}>{phase}</div>
      <div style={{ width: 28, height: 1, background: PALETTE.gold, opacity: 0.5 }}/>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 13, color: PALETTE.ink,
        letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 5 — Phase 1: Pre-Op Bariatric Assessment (90 → 172)
// ───────────────────────────────────────────────────────────────────────

const PREOP_DAYS = [
  {
    day: 'DAY ONE',
    title: 'Arrival & Initial Evaluations',
    exams: [
      { name: 'Anesthesia consultation', who: 'Anesthesiologist', code: 'APC' },
      { name: 'Cardiology consultation', who: 'Cardiologist', code: 'CS' },
      { name: 'Electrocardiogram (ECG)', who: 'Cardiologist', code: 'DEQP 003' },
      { name: 'Sleep polygraphy — overnight', who: 'Pulmonologist', code: 'GLQP 007' },
    ],
  },
  {
    day: 'DAY TWO',
    title: 'Complete Multidisciplinary Workup',
    exams: [
      { name: 'Complete blood panel', who: 'Laboratory', code: 'B636' },
      { name: 'Upper GI contrast study (TOGD)', who: 'Radiology', code: 'HEQH 002' },
      { name: 'Spirometry — pulmonary function', who: 'Pulmonologist', code: 'GLQP 012' },
      { name: 'Psychological consultation', who: 'Psychologist', code: 'ALQP 003' },
      { name: 'Cardiology + Doppler echocardiography', who: 'Cardiologist', code: 'DZQM 006' },
    ],
  },
  {
    day: 'DAY THREE',
    title: 'Endoscopic Examination',
    exams: [
      { name: 'Upper GI fibroscopy', who: 'Gastroenterologist', code: 'HEQE 002' },
      { name: 'General anesthesia', who: 'Anesthesiologist', code: 'ZZLP 025' },
      { name: 'Anatomopathological analyses', who: 'Pathology Lab', code: 'ZZQX 077' },
    ],
  },
];

function Scene5_Phase1() {
  return (
    <Sprite start={107.85} end={180.75}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.paper }}/>

      {/* Phase intro card (90 → 100) */}
      <Sprite start={107.85} end={124.12}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FadeIn delay={0.1} dur={0.9}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.4em',
                color: PALETTE.gold, textTransform: 'uppercase',
              }}>Phase One · 3 days</div>
            </FadeIn>
            <FadeIn delay={0.7} dur={1.2}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 144, color: PALETTE.ink,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
                marginTop: 24, fontStyle: 'italic',
              }}>Pre-Operative</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 144, color: PALETTE.gold,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              }}>Assessment</div>
            </FadeIn>
            <FadeIn delay={2.0} dur={1.0}>
              <div style={{ width: 100, height: 1, background: PALETTE.gold, margin: '50px auto 30px' }}/>
              <div style={{
                fontFamily: FONT_BODY, fontSize: 22, color: PALETTE.inkSoft,
                fontWeight: 300, maxWidth: 900, margin: '0 auto', lineHeight: 1.45,
              }}>A complete 3-day hospital stay dedicated entirely to your safety, under the supervision of Dr. Nedelcu.</div>
            </FadeIn>
          </div>
        </div>
      </Sprite>

      {/* Day 1 — 100.5 → 124 */}
      <DayPanel start={124.12} end={142.19} day={PREOP_DAYS[0]} dayNum="01" />

      {/* Day 2 — 124 → 150 */}
      <DayPanel start={142.19} end={160.27} day={PREOP_DAYS[1]} dayNum="02" />

      {/* Day 3 — 150 → 172 */}
      <DayPanel start={160.27} end={180.75} day={PREOP_DAYS[2]} dayNum="03" />
    </Sprite>
  );
}

function DayPanel({ start, end, day, dayNum }) {
  return (
    <Sprite start={start} end={end}>
      <ChapterTagDark phase={`Phase 01 · Pre-Op`} label={day.day} />

      {/* Day header — left side */}
      <Sprite start={start + 0.1} end={end}>
        <div style={{ position: 'absolute', left: 100, top: 200, width: 620 }}>
          <FadeIn delay={0} dur={0.7}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 340, color: PALETTE.gold,
              fontWeight: 300, lineHeight: 0.85, letterSpacing: '-0.04em',
              opacity: 0.18,
            }}>{dayNum}</div>
          </FadeIn>
          <FadeIn delay={0.3} dur={1.0}>
            <div style={{
              fontFamily: FONT_MONO, fontSize: 13, letterSpacing: '0.35em',
              color: PALETTE.gold, textTransform: 'uppercase',
              marginTop: -250, marginLeft: 30,
            }}>{day.day}</div>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 62, color: PALETTE.ink,
              fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em',
              fontStyle: 'italic', marginTop: 18, marginLeft: 30,
              maxWidth: 520,
            }}>{day.title}</div>
            <div style={{ marginLeft: 30, marginTop: 32, width: 60, height: 1, background: PALETTE.gold }}/>
            <div style={{
              marginLeft: 30, marginTop: 24, fontFamily: FONT_BODY, fontSize: 18,
              color: PALETTE.inkSoft, lineHeight: 1.5, fontWeight: 300, maxWidth: 480,
            }}>Each examination is performed within the clinic by a coordinated multidisciplinary team. Nothing is left to chance.</div>
          </FadeIn>
        </div>
      </Sprite>

      {/* Exam list — right side */}
      <div style={{ position: 'absolute', right: 100, top: 220, width: 920 }}>
        {day.exams.map((exam, i) => (
          <ExamRow key={i} exam={exam} index={i} delay={start + 0.6 + i * 0.45} duration={end - start - 0.6 - i * 0.45} />
        ))}
      </div>
    </Sprite>
  );
}

function ExamRow({ exam, index, delay, duration }) {
  const time = useTime();
  const localT = time - delay;
  if (localT < 0) return null;
  const enter = Easing.easeOutCubic(clamp(localT / 0.7, 0, 1));

  return (
    <div style={{
      opacity: enter,
      transform: `translateY(${(1-enter)*16}px)`,
      borderTop: `1px solid ${PALETTE.lineGold}`,
      padding: '22px 0',
      display: 'flex', alignItems: 'baseline', gap: 32,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 14, color: PALETTE.gold,
        letterSpacing: '0.18em', width: 56, flexShrink: 0,
      }}>{String(index+1).padStart(2,'0')}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 36, color: PALETTE.ink,
          fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em',
        }}>{exam.name}</div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 15, color: PALETTE.inkSoft,
          marginTop: 6, letterSpacing: '0.06em',
        }}>{exam.who}</div>
      </div>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 12, color: PALETTE.inkSoft,
        opacity: 0.55, letterSpacing: '0.1em',
        width: 100, textAlign: 'right',
      }}>{exam.code}</div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 6 — The Surgery (172 → 202)
// ───────────────────────────────────────────────────────────────────────

function Scene6_Surgery() {
  return (
    <Sprite start={180.75} end={215.69}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.ink }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 70% 50%, rgba(184,138,62,0.12), transparent 65%)',
      }}/>

      <ChapterTag phase="Phase · 03" label="The Procedure" />

      {/* Phase intro */}
      <Sprite start={189.31} end={196.42}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FadeIn delay={0} dur={0.9}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.4em',
                color: PALETTE.goldSoft, textTransform: 'uppercase',
              }}>Phase Two · The Procedure</div>
            </FadeIn>
            <FadeIn delay={0.6} dur={1.2}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 156, color: PALETTE.paper,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
                marginTop: 24, fontStyle: 'italic',
              }}>Sleeve</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 156, color: PALETTE.gold,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              }}>Gastrectomy</div>
            </FadeIn>
            <FadeIn delay={1.8} dur={1.0}>
              <div style={{ width: 100, height: 1, background: PALETTE.gold, margin: '50px auto 30px' }}/>
              <div style={{
                fontFamily: FONT_BODY, fontSize: 22, color: PALETTE.cream,
                fontWeight: 300, maxWidth: 900, margin: '0 auto', lineHeight: 1.45,
              }}>Performed by Dr. Nedelcu through minimally invasive laparoscopy in our state-of-the-art surgical theater.</div>
            </FadeIn>
          </div>
        </div>
      </Sprite>

      {/* Surgical details — 184 → 202 */}
      <Sprite start={196.42} end={215.69}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center' }}>
          <FadeIn delay={0} dur={0.8}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 56, color: PALETTE.paper,
              fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em',
            }}>What happens during your stay</div>
          </FadeIn>
        </div>

        <div style={{ position: 'absolute', left: 200, right: 200, top: 320 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
            {[
              { num: '01', title: 'Pre-op briefing', text: 'Final consultation with Dr. Nedelcu and the anesthesia team the night before.' },
              { num: '02', title: 'Laparoscopic surgery', text: 'A minimally invasive sleeve gastrectomy performed by Dr. Nedelcu.' },
              { num: '03', title: 'Continuous monitoring', text: 'Around-the-clock nursing, optional ICU/PICU supervision depending on profile.' },
              { num: '04', title: 'Early rehabilitation', text: 'Abdominal physiotherapy from day one, supervised blood work and recovery.' },
            ].map((step, i) => (
              <FadeIn key={i} delay={0.44 + i * 0.25} dur={0.9} y={20}>
                <div style={{
                  border: `1px solid ${PALETTE.lineGold}`,
                  padding: '32px 28px', height: 360,
                  display: 'flex', flexDirection: 'column', gap: 18,
                  background: 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontSize: 80, color: PALETTE.gold,
                    fontWeight: 300, lineHeight: 1, letterSpacing: '-0.02em',
                  }}>{step.num}</div>
                  <div style={{
                    fontFamily: FONT_DISPLAY, fontSize: 30, color: PALETTE.paper,
                    fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em',
                    fontStyle: 'italic',
                  }}>{step.title}</div>
                  <div style={{
                    fontFamily: FONT_BODY, fontSize: 16, color: PALETTE.cream,
                    lineHeight: 1.5, fontWeight: 300, opacity: 0.85,
                  }}>{step.text}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={2.4} dur={1.0}>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 130, textAlign: 'center',
            fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 32,
            color: PALETTE.goldSoft, fontWeight: 300, letterSpacing: '-0.01em',
          }}>“Your safety is our absolute priority.”</div>
        </FadeIn>
      </Sprite>
    </Sprite>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 7 — Phase 3: Post-Operative Assessment (202 → 235)
// ───────────────────────────────────────────────────────────────────────

const POSTOP_EXAMS = [
  { name: 'Anesthesia consultation',           who: 'Anesthesiologist',  code: 'APC' },
  { name: 'Sleep polygraphy — overnight',      who: 'Pulmonologist',     code: 'GLQP 007' },
  { name: 'Complete blood panel',              who: 'Laboratory',         code: 'B636' },
  { name: 'Upper GI contrast study (TOGD)',    who: 'Radiology',          code: 'HEQH 002' },
  { name: 'Spirometry — pulmonary function',   who: 'Pulmonologist',     code: 'GLQP 012' },
  { name: 'Psychological follow-up',           who: 'Psychologist',       code: 'ALQP 003' },
  { name: 'Cardiology + ECG',                  who: 'Cardiologist',      code: 'CS · DEQP' },
  { name: 'Physiotherapy consultation',        who: 'Physiotherapist',   code: 'AMK 10.7' },
  { name: 'Plastic surgery consultation',      who: 'Plastic Surgeon',   code: 'CS+MCS' },
  { name: 'Upper GI fibroscopy + anesthesia',  who: 'Gastroenterologist',code: 'HEQE 002' },
];

function Scene7_Phase3() {
  return (
    <Sprite start={215.69} end={257.87}>
      <div style={{ position: 'absolute', inset: 0, background: PALETTE.paper }}/>

      <ChapterTagDark phase="Phase · 04" label="Post-Op Verification" />

      {/* Phase intro 202 → 210 */}
      <Sprite start={215.69} end={230.76}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <FadeIn delay={0} dur={0.8}>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.4em',
                color: PALETTE.gold, textTransform: 'uppercase',
              }}>Phase Three · 3 days · 3-6 months later</div>
            </FadeIn>
            <FadeIn delay={0.5} dur={1.2}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 132, color: PALETTE.ink,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
                marginTop: 24, fontStyle: 'italic',
              }}>Post-Operative</div>
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 132, color: PALETTE.gold,
                fontWeight: 400, lineHeight: 1, letterSpacing: '-0.02em',
              }}>Verification</div>
            </FadeIn>
            <FadeIn delay={1.8} dur={1.0}>
              <div style={{ width: 100, height: 1, background: PALETTE.gold, margin: '40px auto 26px' }}/>
              <div style={{
                fontFamily: FONT_BODY, fontSize: 22, color: PALETTE.inkSoft,
                fontWeight: 300, maxWidth: 920, margin: '0 auto', lineHeight: 1.45,
              }}>A second 3-day stay to verify the success of your transformation and document complete medical certainty.</div>
            </FadeIn>
          </div>
        </div>
      </Sprite>

      {/* Exam grid 210 → 235 */}
      <Sprite start={230.76} end={257.87}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center' }}>
          <FadeIn delay={0} dur={0.8}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 60, color: PALETTE.ink,
              fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.01em',
            }}>The full post-operative protocol</div>
          </FadeIn>
          <FadeIn delay={0.5} dur={0.8}>
            <div style={{
              fontFamily: FONT_BODY, fontSize: 17, color: PALETTE.inkSoft,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              marginTop: 14, fontWeight: 400,
            }}>10 examinations · 3 days · 1 clinic</div>
          </FadeIn>
        </div>

        <div style={{ position: 'absolute', left: 140, right: 140, top: 320 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 80, rowGap: 0 }}>
            {POSTOP_EXAMS.map((exam, i) => (
              <PostOpRow key={i} exam={exam} i={i} delay={230.76 + 0.9 + (i * 0.18)} />
            ))}
          </div>
        </div>

        <FadeIn delay={4.5} dur={1.0}>
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 80, textAlign: 'center',
            fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 28,
            color: PALETTE.inkSoft, fontWeight: 300, letterSpacing: '-0.01em',
          }}>Documented · controlled · shared with your home physician.</div>
        </FadeIn>
      </Sprite>
    </Sprite>
  );
}

function PostOpRow({ exam, i, delay }) {
  const time = useTime();
  const localT = time - delay;
  if (localT < 0) return <div style={{ height: 62, opacity: 0 }}/>;
  const enter = Easing.easeOutCubic(clamp(localT / 0.6, 0, 1));
  return (
    <div style={{
      opacity: enter,
      transform: `translateY(${(1-enter)*10}px)`,
      borderTop: `1px solid ${PALETTE.lineGold}`,
      padding: '16px 0',
      display: 'flex', alignItems: 'baseline', gap: 20,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 13, color: PALETTE.gold,
        letterSpacing: '0.16em', width: 40, flexShrink: 0,
      }}>{String(i+1).padStart(2,'0')}</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 26, color: PALETTE.ink,
          fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em',
        }}>{exam.name}</div>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 13, color: PALETTE.inkSoft,
          marginTop: 3, letterSpacing: '0.06em',
        }}>{exam.who}</div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// SCENE 8 — Closing (235 → 250)
// ───────────────────────────────────────────────────────────────────────

function Scene8_Closing() {
  return (
    <Sprite start={257.87} end={274.76}>
      <KenBurnsBG src="assets/marseille.jpg" scaleFrom={1.18} scaleTo={1.0} panY={20} tint="rgba(10,43,54,0.7)" />
      <Vignette intensity={0.55} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <FadeIn delay={0.3} dur={1.4}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 96, color: PALETTE.paper,
              fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', lineHeight: 1.1,
              maxWidth: 1400,
            }}>The rigor of French medicine.<br/>The warmth of Mediterranean care.</div>
          </FadeIn>
          <FadeIn delay={2.2} dur={1.0}>
            <div style={{ width: 100, height: 1, background: PALETTE.gold, margin: '60px auto 40px' }}/>
          </FadeIn>
          <FadeIn delay={2.6} dur={1.2}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontSize: 96, color: PALETTE.gold,
              fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1,
            }}>Clinique Bouchard</div>
          </FadeIn>
          <FadeIn delay={3.6} dur={1.0}>
            <div style={{
              marginTop: 36, fontFamily: FONT_BODY, fontSize: 18, color: PALETTE.cream,
              letterSpacing: '0.42em', textTransform: 'uppercase', fontWeight: 300,
            }}>Excellence · Safety · Care</div>
          </FadeIn>
        </div>
      </div>
    </Sprite>
  );
}

// ─── Master film ────────────────────────────────────────────────────────

// Subtitle track — synced to narration timestamps, displayed continuously
const SUBTITLES = [
  { s: 0.50,    e: 13.26,  text: "Welcome to Marseille — a city where Mediterranean light meets centuries of medical excellence. This is where your patient journey begins." },
  { s: 13.26,   e: 40.37,  text: "At the heart of Marseille stands Clinique Bouchard, a flagship establishment of the ELSAN group — France's leading private hospital network. For decades, our clinic has set the standard for bariatric surgery, combining cutting-edge technology with the highest French medical standards." },
  { s: 40.37,   e: 73.51,  text: "Your care is led by an internationally recognized surgical team. Doctor Nedelcu, our Lead Bariatric Surgeon, is a world authority in sleeve gastrectomy. At his side, Doctor Manos, co-founder of our program, brings decades of expertise in endoscopic bariatric procedures — offering the most advanced minimally invasive techniques available in Europe." },
  { s: 73.51,   e: 107.85, text: "On the ground, your dedicated coordinator Audrey welcomes you at the clinic and stays at your side throughout your stay. Before and after your visit, our remote concierge team — Rain, Stormi, and Summer — manages your file, your travel, your translations, and your communications. You are never alone, never lost, never left waiting." },
  { s: 107.85,  e: 124.12, text: "Phase One — the Pre-Operative Bariatric Assessment. A complete three-day hospital stay dedicated entirely to your safety, conducted under the supervision of Doctor Nedelcu." },
  { s: 124.12,  e: 142.19, text: "Day One — your arrival. We begin with the anesthesia consultation, followed by a cardiology consultation, a complete electrocardiogram, and a full overnight sleep polygraphy performed by our pulmonologist." },
  { s: 142.19,  e: 160.27, text: "Day Two — the comprehensive multidisciplinary workup. A full blood panel, an upper gastrointestinal contrast study, a spirometry test, a psychological consultation, and a second cardiology consultation including Doppler echocardiography." },
  { s: 160.27,  e: 180.75, text: "Day Three — the endoscopic examination. An upper digestive fibroscopy performed by our gastroenterologist under general anesthesia, completed by full anatomopathological analyses. Every examination is carried out within the clinic. Nothing is left to chance." },
  { s: 180.75,  e: 196.42, text: "Phase Two — the Surgery itself. The sleeve gastrectomy is performed by Doctor Nedelcu through a minimally invasive laparoscopic approach, in our state-of-the-art surgical theater." },
  { s: 196.42,  e: 215.69, text: "Your hospital stay is fully monitored — around-the-clock nursing, abdominal physiotherapy from day one, and, depending on your medical profile, intensive or continuous care unit supervision. Your safety is our absolute priority." },
  { s: 215.69,  e: 230.76, text: "Phase Three — the Post-Operative Verification. A second three-day stay, three to six months after your surgery, to verify the success of your transformation." },
  { s: 230.76,  e: 257.87, text: "We repeat your full work-up: blood panel, upper GI study, spirometry, psychological follow-up, cardiology, ECG, sleep polygraphy and fibroscopy. We add a physiotherapy consultation and a plastic surgery consultation. The result: complete medical certainty — documented, controlled, and shared with your home physician." },
  { s: 257.87,  e: 274.76, text: "From Marseille, with the rigor of French medicine and the warmth of Mediterranean hospitality, we accompany you every step of the way. Clinique Bouchard. Excellence. Safety. Care." },
];

function SubtitleTrack() {
  // Use the live audio currentTime — that's the real voice clock.
  const stageTime = useTime();
  const time = window.__audioCurrentTime > 0 ? window.__audioCurrentTime : stageTime;
  // Lead by 80ms so text appears just slightly before the narrator says it,
  // never after.
  const lookAhead = 0.08;
  const t = time + lookAhead;
  const current = SUBTITLES.find(s => t >= s.s && t < s.e);
  if (!current) return null;

  const localT = t - current.s;
  const dur = current.e - current.s;
  // Whole-line fade in (fast) and fade out near the end.
  const fadeIn = Easing.easeOutCubic(clamp(localT / 0.25, 0, 1));
  const fadeOut = localT > dur - 0.3 ? Easing.easeInCubic(clamp((localT - (dur - 0.3)) / 0.3, 0, 1)) : 0;
  const opacity = fadeIn * (1 - fadeOut);

  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 56,
      transform: 'translateX(-50%)',
      maxWidth: 1500, width: 'calc(100% - 240px)',
      zIndex: 50, pointerEvents: 'none',
      opacity, textAlign: 'center',
    }}>
      <div style={{
        display: 'inline-block',
        padding: '8px 24px',
      }}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 30, color: '#f5efe4',
          fontWeight: 400, lineHeight: 1.42, letterSpacing: '0.005em',
          textWrap: 'pretty',
          textShadow: '0 2px 12px rgba(0,0,0,0.85), 0 0 28px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.9)',
        }}>{current.text}</div>
      </div>
    </div>
  );
}

// Audio track — drives the master clock. Audio is the source of truth so
// everything follows the voice. Includes a click-to-start overlay if browser
// blocks autoplay.
window.__audioCurrentTime = 0;
function AudioTrack({ src, offset = 0 }) {
  const { time, playing, setTime, setPlaying } = useTimeline();
  const audioRef = React.useRef(null);
  const [needsUnlock, setNeedsUnlock] = React.useState(false);
  const [, force] = React.useReducer(x => x + 1, 0);

  // Try to play/pause audio when Stage state changes
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      const p = a.play();
      if (p && p.catch) {
        p.catch(() => setNeedsUnlock(true));
      }
    } else {
      a.pause();
    }
  }, [playing]);

  // Seek audio when user scrubs Stage timeline
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const target = Math.max(0, time - offset);
    if (Math.abs(a.currentTime - target) > 0.5) {
      try { a.currentTime = target; } catch {}
    }
  }, [time, offset]);

  // Master loop: audio.currentTime drives Stage time so visuals follow voice.
  // Only override when audio is actually playing (avoid stomping when paused).
  React.useEffect(() => {
    let raf;
    const tick = () => {
      const a = audioRef.current;
      if (a) {
        const t = a.currentTime + offset;
        window.__audioCurrentTime = t;
        if (!a.paused && playing) {
          setTime(t);
        }
        force();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [offset, playing, setTime]);

  const unlock = () => {
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => {
      setNeedsUnlock(false);
      setPlaying(true);
    }).catch(() => {});
  };

  return (
    <React.Fragment>
      <audio ref={audioRef} src={src} preload="auto" style={{ display: 'none' }} />
      {needsUnlock && (
        <div onClick={unlock} style={{
          position: 'absolute', inset: 0, zIndex: 200,
          background: 'rgba(8,22,28,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <div style={{ textAlign: 'center', color: '#f5efe4' }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              border: '2px solid #b88a3e', margin: '0 auto 28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 0, height: 0, marginLeft: 12,
                borderLeft: '36px solid #b88a3e',
                borderTop: '24px solid transparent',
                borderBottom: '24px solid transparent',
              }}/>
            </div>
            <div style={{
              fontFamily: '"Cormorant Garamond", serif', fontSize: 48,
              fontStyle: 'italic', fontWeight: 300, letterSpacing: '-0.01em',
            }}>Click to begin</div>
            <div style={{
              marginTop: 14, fontFamily: '"Inter", sans-serif', fontSize: 13,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: '#d4b06c',
            }}>with sound</div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

function Film() {
  // Timestamp HUD updates data-screen-label for comment context
  const time = useTime();
  React.useEffect(() => {
    const el = document.querySelector('[data-screen-label]');
    if (el) {
      const mm = Math.floor(time / 60);
      const ss = Math.floor(time % 60);
      el.setAttribute('data-screen-label', `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`);
    }
  }, [Math.floor(time)]);

  return (
    <React.Fragment>
      <Scene1_Opening />
      <Scene2_Clinique />
      <Scene3_Surgeons />
      <Scene4_Coordination />
      <Scene5_Phase1 />
      <Scene6_Surgery />
      <Scene7_Phase3 />
      <Scene8_Closing />
      <SubtitleTrack />
      <AudioTrack src="assets/narration.mp3" offset={1.0} />
    </React.Fragment>
  );
}

Object.assign(window, { Film, PALETTE });
