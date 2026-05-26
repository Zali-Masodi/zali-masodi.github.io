import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef } from 'react'
import React from 'react'

const projects = [
    {
        title: 'QR Ordering System',
        description: 'Real-time restaurant ordering with QR + SignalR',
        detail:
            'Customers scan a table QR code to browse menus and place orders in real time. Built with SignalR for live kitchen updates, reducing order processing time significantly.',
        tech: ['.NET 8', 'React', 'PostgreSQL'],
        color: 'rgba(59,130,246,0.18)',
        glow: 'rgba(59,130,246,0.35)',
    },
    {
        title: 'AI HR Platform',
        description: 'AI recruitment + automated calling system',
        detail:
            'End-to-end recruitment automation: AI-driven candidate screening, automated phone calls using voice synthesis, and structured interview scoring powered by GPT-4.',
        tech: ['Next.js', '.NET', 'OpenAI'],
        color: 'rgba(168,85,247,0.18)',
        glow: 'rgba(168,85,247,0.35)',
    },
    {
        title: 'Bitcoin Lending',
        description: 'Smart contract lending system on Ethereum',
        detail:
            'Decentralized lending protocol using Solidity smart contracts. Users lock BTC as collateral to borrow stablecoins, with liquidation logic and APY calculations on-chain.',
        tech: ['Solidity', 'Node.js', 'AWS'],
        color: 'rgba(251,191,36,0.18)',
        glow: 'rgba(251,191,36,0.35)',
    },
    {
        title: 'Logistics SaaS',
        description: 'Multi-tenant shipment tracking platform',
        detail:
            'White-label SaaS platform for logistics providers. Multi-tenant architecture with custom domain support, real-time parcel tracking, and branded customer notifications.',
        tech: ['.NET 8', 'React', 'Azure'],
        color: 'rgba(20,184,166,0.18)',
        glow: 'rgba(20,184,166,0.35)',
    },
]

export default function CubeProjects() {
    const [rotation, setRotation] = useState(0)
    const [activeFace, setActiveFace] = useState(0)
    const [expanded, setExpanded] = useState(false)

    const spinning = useRef(false)

    const rotateTo = (dir: 'left' | 'right') => {
        if (spinning.current) return

        spinning.current = true
        setTimeout(() => (spinning.current = false), 800)

        if (dir === 'left') {
            setRotation((r) => r - 90)
            setActiveFace((p) => (p + 1) % 4)
        } else {
            setRotation((r) => r + 90)
            setActiveFace((p) => (p + 3) % 4)
        }
    }

    const active = projects[activeFace]

    return (
        <>
            <style>{`
.cube-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

.cube-scene-v2 {
  perspective: 1400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

  .cube-stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

  /* =========================
     EXPANDED MODE = BIGGER CUBE
     ========================= */

  .cube-hitbox {
    width: 300px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .cube-wrap.expanded .cube-hitbox {
    width: 480px;
    height: 480px;
  }

  .cube-v2 {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* FACES */
  .cube-face-v2 {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 24px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(18px);

    border: 1px solid rgba(255,255,255,0.12);

    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.18),
      0 10px 40px rgba(0,0,0,0.35);

    pointer-events: none;
    overflow: hidden;
  }

  .cube-wrap.expanded .cube-face-v2 {
    width: 480px;
    height: 480px;
    border-radius: 28px;
  }

  .cube-face-v2::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(255,255,255,0.10),
      rgba(255,255,255,0.02),
      transparent
    );
  }

  /* DEPTH MATCHING SIZE */
  .face-v-0 { transform: rotateY(0deg) translateZ(150px); }
  .face-v-1 { transform: rotateY(90deg) translateZ(150px); }
  .face-v-2 { transform: rotateY(180deg) translateZ(150px); }
  .face-v-3 { transform: rotateY(-90deg) translateZ(150px); }

  .cube-wrap.expanded .face-v-0 { transform: rotateY(0deg) translateZ(240px); }
  .cube-wrap.expanded .face-v-1 { transform: rotateY(90deg) translateZ(240px); }
  .cube-wrap.expanded .face-v-2 { transform: rotateY(180deg) translateZ(240px); }
  .cube-wrap.expanded .face-v-3 { transform: rotateY(-90deg) translateZ(240px); }

  .cube-face-v2.is-active {
    box-shadow:
      0 0 55px var(--face-glow),
      0 25px 70px rgba(0,0,0,0.55);
  }

  /* =========================
     TEXT STYLING (IMPROVED)
     ========================= */

  .content {
  padding: 40px 70px; /* ⬅️ increased horizontal padding for arrow space */

  position: relative;
  z-index: 2;

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
  overflow: hidden;
}

  .title {
    font-size: 24px;
    font-weight: 800;
    color: #f8fafc;
    letter-spacing: -0.4px;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 14px;
    opacity: 0.78;
    line-height: 1.5;
    margin-bottom: 16px;
    max-width: 90%;
  }

  .detail {
    font-size: 14px;
    line-height: 1.65;
    opacity: 0.9;
    margin-bottom: 18px;
    max-width: 92%;

    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    max-width: 90%;
  }

  .tag {
    padding: 6px 12px;
    border-radius: 999px;

    font-size: 11.5px;
    font-weight: 500;

    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);

    color: rgba(248,250,252,0.88);
    backdrop-filter: blur(8px);
  }

  /* CONTROLS */
  .controls {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .btn {
    padding: 10px 16px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
    color: white;
    cursor: pointer;
  }

  /* INSIDE BUTTONS */
  .cube-controls-inside {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  transform: translateY(-50%);

  display: flex;
  justify-content: space-between;

  padding: 0 10px; /* tighter so it stays inside cube */
  box-sizing: border-box;

  z-index: 20; /* ensure always above text */

  pointer-events: none;
}

.cube-controls-inside .btn {
  pointer-events: auto;
}
`}</style>

            <div className={`cube-wrap ${expanded ? 'expanded' : ''}`}>

                {/* LEFT ARROW */}
                {!expanded && (
                    <button className="btn" onClick={() => rotateTo('left')}>
                        ‹
                    </button>
                )}




                <div className="cube-scene-v2">
                    <div className="cube-stage">
                        <div
                            className="cube-hitbox"
                            onClick={() => {
                                if (!spinning.current) setExpanded((v) => !v)
                            }}
                        >
                            <div
                                className="cube-v2"
                                style={{ transform: `rotateY(${rotation}deg)` }}
                            >
                                {projects.map((p, i) => (
                                    <div
                                        key={i}
                                        className={`cube-face-v2 face-v-${i} ${i === activeFace ? 'is-active' : ''
                                            }`}
                                        style={
                                            {
                                                '--face-glow': p.glow,
                                                background: `linear-gradient(145deg, ${p.color}, rgba(255,255,255,0.02))`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <div className="content">
                                            <div className="title">{p.title}</div>
                                            <div className="desc">{p.description}</div>

                                            {expanded && (
                                                <>
                                                    <div className="detail">{p.detail}</div>
                                                    <div className="tags">
                                                        {p.tech.map((t) => (
                                                            <span key={t} className="tag">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 🔥 ROTATION BUTTONS INSIDE CUBE WHEN EXPANDED */}
                            {expanded && (
                                <div className="cube-controls-inside">
                                    <button className="btn" onClick={() => rotateTo('left')}>
                                        ‹
                                    </button>
                                    <button className="btn" onClick={() => rotateTo('right')}>
                                        ›
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* RIGHT ARROW */}
                {!expanded && (
                    <button className="btn" onClick={() => rotateTo('right')}>
                        ›
                    </button>
                )}

                
            </div>
        </>
    )
}