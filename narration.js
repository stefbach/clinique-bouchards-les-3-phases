// Narration script for voiceover, plus a side-panel UI to view/copy it.
// 4-minute target — ~560 words at ~140 wpm.

window.NARRATION = [
  {
    range: '0:00 – 0:13',
    scene: 'Opening · Marseille',
    text: `Welcome to Marseille — a city where Mediterranean light meets centuries of medical excellence. This is where your patient journey begins.`,
  },
  {
    range: '0:13 – 0:32',
    scene: 'Clinique Bouchard',
    text: `At the heart of Marseille stands Clinique Bouchard, a flagship establishment of the ELSAN group — France's leading private hospital network. For decades, our clinic has set the standard for bariatric surgery, combining cutting-edge technology with the highest French medical standards.`,
  },
  {
    range: '0:32 – 1:00',
    scene: 'Surgical Team',
    text: `Your care is led by an internationally recognized surgical team. Doctor Nedelcu, our Lead Bariatric Surgeon, is a world authority in sleeve gastrectomy, with thousands of procedures performed and major publications in the field. At his side, Doctor Manos, co-founder of our program, brings decades of expertise in endoscopic bariatric procedures — offering the most advanced minimally invasive techniques available in Europe.`,
  },
  {
    range: '1:00 – 1:30',
    scene: 'Care Coordination',
    text: `On the ground, your dedicated coordinator Audrey welcomes you at the clinic, organizes every appointment, and stays at your side throughout your stay. Before and after your visit, our remote concierge team — Rain, Stormi, and Summer — manages your file, your travel logistics, your translations, and your communications with our medical staff. You are never alone, never lost, never left waiting.`,
  },
  {
    range: '1:30 – 1:40',
    scene: 'Phase 1 · Title',
    text: `Phase One — the Pre-Operative Bariatric Assessment. A complete three-day hospital stay dedicated entirely to your safety, conducted under the supervision of Doctor Nedelcu.`,
  },
  {
    range: '1:40 – 2:04',
    scene: 'Phase 1 · Day 1',
    text: `Day One — your arrival. We begin with the anesthesia consultation, followed by a cardiology consultation, a complete electrocardiogram, and a full overnight sleep polygraphy performed by our pulmonologist.`,
  },
  {
    range: '2:04 – 2:30',
    scene: 'Phase 1 · Day 2',
    text: `Day Two — the comprehensive multidisciplinary workup. A full blood panel, an upper gastrointestinal contrast study, a spirometry test, a psychological consultation, and a second cardiology consultation including Doppler echocardiography.`,
  },
  {
    range: '2:30 – 2:52',
    scene: 'Phase 1 · Day 3',
    text: `Day Three — the endoscopic examination. An upper digestive fibroscopy performed by our gastroenterologist under general anesthesia, completed by full anatomopathological analyses. Every examination is carried out within the clinic, by a coordinated multidisciplinary team. Nothing is left to chance.`,
  },
  {
    range: '2:52 – 3:04',
    scene: 'Surgery · Title',
    text: `Phase Two — the Surgery itself. The sleeve gastrectomy is performed by Doctor Nedelcu through a minimally invasive laparoscopic approach, in our state-of-the-art surgical theater.`,
  },
  {
    range: '3:04 – 3:22',
    scene: 'Surgery · Detail',
    text: `Your hospital stay is fully monitored — around-the-clock nursing, abdominal physiotherapy from day one, and, depending on your medical profile, intensive or continuous care unit supervision. Your safety is our absolute priority.`,
  },
  {
    range: '3:22 – 3:30',
    scene: 'Phase 3 · Title',
    text: `Phase Three — the Post-Operative Verification. A second three-day stay, three to six months after your surgery, to verify the success of your transformation.`,
  },
  {
    range: '3:30 – 3:55',
    scene: 'Phase 3 · Detail',
    text: `We repeat your full work-up: blood panel, upper GI study, spirometry, psychological follow-up, cardiology, ECG, sleep polygraphy and fibroscopy. We add a physiotherapy consultation and a plastic surgery consultation to plan the next steps of your journey. The result: complete medical certainty — documented, controlled, and shared with your home physician.`,
  },
  {
    range: '3:55 – 4:10',
    scene: 'Closing',
    text: `From Marseille, with the rigor of French medicine and the warmth of Mediterranean hospitality, we accompany you every step of the way. Clinique Bouchard. Excellence. Safety. Care.`,
  },
];

function NarrationPanel() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const fullScript = window.NARRATION.map(n => `[${n.range}] ${n.scene}\n${n.text}`).join('\n\n');

  const copy = () => {
    navigator.clipboard.writeText(fullScript).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <React.Fragment>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: '#0a2b36', color: '#f5efe4',
          border: '1px solid #b88a3e',
          padding: '10px 18px',
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
          cursor: 'pointer', fontWeight: 500,
        }}
      >{open ? 'Close Script' : 'Voiceover Script'}</button>

      {open && (
        <div style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 520, zIndex: 99,
          background: '#faf6ed',
          borderLeft: '1px solid #b88a3e',
          overflowY: 'auto',
          padding: '70px 36px 36px',
          fontFamily: '"Inter", system-ui, sans-serif',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.3em', color: '#b88a3e', textTransform: 'uppercase',
            marginBottom: 14,
          }}>Voiceover Script · English · ~4 min</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontSize: 38,
            color: '#0a2b36', fontWeight: 400, lineHeight: 1.05,
            letterSpacing: '-0.02em', marginBottom: 8, fontStyle: 'italic',
          }}>Patient Journey</div>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontSize: 32,
            color: '#b88a3e', fontWeight: 400, lineHeight: 1.0,
            letterSpacing: '-0.02em', marginBottom: 24,
          }}>at Clinique Bouchard</div>

          <button onClick={copy} style={{
            background: 'transparent', color: '#0a2b36',
            border: '1px solid #0a2b36', padding: '10px 18px',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', fontWeight: 500, marginBottom: 28,
          }}>{copied ? 'Copied ✓' : 'Copy full script'}</button>

          {window.NARRATION.map((n, i) => (
            <div key={i} style={{
              borderTop: '1px solid rgba(184,138,62,0.3)',
              padding: '18px 0',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif', fontSize: 20,
                  color: '#0a2b36', fontWeight: 500, fontStyle: 'italic',
                }}>{n.scene}</div>
                <div style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                  color: '#b88a3e', letterSpacing: '0.1em',
                }}>{n.range}</div>
              </div>
              <div style={{
                marginTop: 10, fontFamily: '"Inter", system-ui, sans-serif',
                fontSize: 14, color: '#13495a', lineHeight: 1.55, fontWeight: 400,
              }}>{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </React.Fragment>
  );
}

Object.assign(window, { NarrationPanel });
