'use client';
import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEarlyAccess } from './EarlyAccessContext';

/* ─── shared styles ──────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  color: 'white',
  fontFamily: 'var(--font-body), sans-serif',
  fontSize: 14,
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: 'rgba(255,255,255,0.45)',
  fontSize: 11,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  fontFamily: 'var(--font-mono, ui-monospace), monospace',
  marginBottom: 6,
};

/* ─── animation variants ─────────────────────────────────────────── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.05 } },
} as const;

const panelVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 280, damping: 26, delay: 0.05 },
  },
  exit: {
    opacity: 0, y: 20, scale: 0.97,
    transition: { duration: 0.18, ease: 'easeIn' as const },
  },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 340, damping: 28 },
  },
};

const successContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const successItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
};

/* ─── sub-components ─────────────────────────────────────────────── */
function AnimatedCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.05 }}
      style={{
        width: 64, height: 64,
        borderRadius: '50%',
        background: 'rgba(var(--brand-rgb),0.12)',
        border: '2px solid var(--brand)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <motion.path
          d="M6 14l6 6 10-12"
          stroke="var(--brand)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}

function Spinner() {
  return (
    <motion.svg
      width="18" height="18" viewBox="0 0 18 18" fill="none"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
    >
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path
        d="M9 2 A7 7 0 0 1 16 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

/* ─── main modal ─────────────────────────────────────────────────── */
type Status = 'idle' | 'loading' | 'success' | 'error';

export default function EarlyAccessModal() {
  const { isOpen, close } = useEarlyAccess();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [useCase, setUseCase] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const errorControls = useAnimation();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  function reset() {
    setName(''); setEmail(''); setCompany(''); setUseCase('');
    setStatus('idle'); setErrorMsg('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, company, use_case: useCase }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong.');
        errorControls.start({
          x: [0, -8, 8, -6, 6, -3, 3, 0],
          transition: { duration: 0.45 },
        });
        return;
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
      errorControls.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.45 },
      });
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* Glowing border wrapper */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              position: 'relative',
              borderRadius: 18,
              padding: 1,
              background:
                'conic-gradient(from var(--angle, 0deg), transparent 60%, rgba(var(--brand-rgb),0.7) 75%, rgba(var(--brand-rgb),0.9) 80%, rgba(var(--brand-rgb),0.7) 85%, transparent 100%)',
              width: '100%',
              maxWidth: 490,
            }}
          >
            {/* CSS animation for the rotating border angle */}
            <style>{`
              @property --angle {
                syntax: '<angle>';
                initial-value: 0deg;
                inherits: false;
              }
              @keyframes border-spin {
                to { --angle: 360deg; }
              }
              .ea-border-spin {
                animation: border-spin 3s linear infinite;
              }
            `}</style>
            <div className="ea-border-spin" style={{ position: 'absolute', inset: 0, borderRadius: 18, background: 'inherit', zIndex: 0 }} />

            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(160deg, #111114 0%, #0a0a0d 100%)',
                borderRadius: 16,
                padding: '40px 36px 36px',
                width: '100%',
              }}
            >
              {/* Close */}
              <motion.button
                onClick={close}
                aria-label="Close"
                whileHover={{ scale: 1.15, color: '#fff' }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  fontSize: 18,
                  lineHeight: 1,
                  padding: 4,
                }}
              >
                ✕
              </motion.button>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    variants={successContainerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ textAlign: 'center', padding: '16px 0 8px' }}
                  >
                    <AnimatedCheckmark />

                    <motion.h3
                      variants={successItemVariants}
                      style={{
                        color: 'white',
                        fontFamily: 'var(--font-heading), sans-serif',
                        fontSize: 24,
                        fontWeight: 600,
                        margin: '0 0 12px',
                      }}
                    >
                      You&apos;re on the list.
                    </motion.h3>

                    <motion.p
                      variants={successItemVariants}
                      style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: 14,
                        lineHeight: 1.65,
                        margin: '0 0 28px',
                      }}
                    >
                      We&apos;ll reach out soon with early access details. Keep your agents in check until then.
                    </motion.p>

                    <motion.button
                      variants={successItemVariants}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { reset(); close(); }}
                      style={{
                        background: 'var(--brand)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 28px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* Header */}
                    <motion.p
                      variants={itemVariants}
                      style={{
                        color: 'var(--brand)',
                        fontFamily: 'var(--font-mono, ui-monospace), monospace',
                        fontSize: 11,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        margin: '0 0 10px',
                      }}
                    >
                      Early Access
                    </motion.p>

                    <motion.h3
                      variants={itemVariants}
                      style={{
                        color: 'white',
                        fontFamily: 'var(--font-heading), sans-serif',
                        fontSize: 26,
                        fontWeight: 600,
                        lineHeight: 1.2,
                        margin: '0 0 8px',
                      }}
                    >
                      Secure your agents first.
                    </motion.h3>

                    <motion.p
                      variants={itemVariants}
                      style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: 13,
                        lineHeight: 1.6,
                        margin: '0 0 26px',
                      }}
                    >
                      Join the waitlist and get first access to AgentPatrol when we launch.
                    </motion.p>

                    {/* Divider */}
                    <motion.div
                      variants={itemVariants}
                      style={{
                        height: 1,
                        background: 'linear-gradient(90deg, rgba(var(--brand-rgb),0.4), transparent)',
                        marginBottom: 24,
                      }}
                    />

                    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {[
                        {
                          label: 'Name *',
                          el: (
                            <input
                              style={inputStyle}
                              type="text"
                              placeholder="Jane Smith"
                              value={name}
                              onChange={e => setName(e.target.value)}
                              required
                              disabled={status === 'loading'}
                              onFocus={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'var(--brand)';
                                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(var(--brand-rgb),0.15)';
                              }}
                              onBlur={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                              }}
                            />
                          ),
                        },
                        {
                          label: 'Work Email *',
                          el: (
                            <input
                              style={inputStyle}
                              type="email"
                              placeholder="jane@company.com"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              required
                              disabled={status === 'loading'}
                              onFocus={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'var(--brand)';
                                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(var(--brand-rgb),0.15)';
                              }}
                              onBlur={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                              }}
                            />
                          ),
                        },
                        {
                          label: 'Company',
                          el: (
                            <input
                              style={inputStyle}
                              type="text"
                              placeholder="Acme Corp"
                              value={company}
                              onChange={e => setCompany(e.target.value)}
                              disabled={status === 'loading'}
                              onFocus={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'var(--brand)';
                                (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(var(--brand-rgb),0.15)';
                              }}
                              onBlur={e => {
                                (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)';
                                (e.target as HTMLInputElement).style.boxShadow = 'none';
                              }}
                            />
                          ),
                        },
                        {
                          label: 'How are you using AI agents?',
                          el: (
                            <textarea
                              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
                              placeholder="e.g. autonomous coding agents, customer support bots..."
                              value={useCase}
                              onChange={e => setUseCase(e.target.value)}
                              disabled={status === 'loading'}
                              onFocus={e => {
                                (e.target as HTMLTextAreaElement).style.borderColor = 'var(--brand)';
                                (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(var(--brand-rgb),0.15)';
                              }}
                              onBlur={e => {
                                (e.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.12)';
                                (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                              }}
                            />
                          ),
                        },
                      ].map(({ label, el }) => (
                        <motion.div key={label} variants={itemVariants}>
                          <label style={labelStyle}>{label}</label>
                          {el}
                        </motion.div>
                      ))}

                      <AnimatePresence>
                        {errorMsg && (
                          <motion.p
                            key="error"
                            animate={errorControls}
                            initial={{ opacity: 0, y: -6 }}
                            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
                            style={{
                              color: '#ff6b6b',
                              fontSize: 13,
                              margin: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                            }}
                          >
                            <span>⚠</span> {errorMsg}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      <motion.button
                        variants={itemVariants}
                        whileHover={status !== 'loading' ? { scale: 1.02 } : {}}
                        whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
                        type="submit"
                        disabled={status === 'loading'}
                        style={{
                          background: status === 'loading'
                            ? 'rgba(var(--brand-rgb),0.45)'
                            : 'var(--brand)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 8,
                          padding: '13px 24px',
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          transition: 'background 0.25s',
                          marginTop: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 4,
                        }}
                      >
                        {status === 'loading' ? (
                          <>
                            <Spinner />
                            Submitting…
                          </>
                        ) : (
                          'Request Early Access →'
                        )}
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
