import React from 'react';
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from 'remotion';

// The menu card is printed: a red double frame draws, each word is stamped in ember with the
// lake-blue plate a few pixels off register before it settles, the butter "&" stamp spins in,
// and the motto is set in italic underneath. Same inks as the page (.olympus/06b).
const CREAM = '#F3E7D3';
const INK = '#241C17';
const EMBER = '#D8452B';
const EMBER_DEEP = '#B23219';
const LAKE = '#2D5D7B';
const BUTTER = '#E9B949';

const fontFaces = `
@font-face { font-family: 'Playfair'; src: url(${staticFile('playfair-display-latin-wght-normal.woff2')}) format('woff2'); font-weight: 400 900; font-style: normal; }
@font-face { font-family: 'Playfair'; src: url(${staticFile('playfair-display-latin-wght-italic.woff2')}) format('woff2'); font-weight: 400 900; font-style: italic; }
@font-face { font-family: 'Bitter'; src: url(${staticFile('bitter-latin-wght-normal.woff2')}) format('woff2'); font-weight: 100 900; }
`;

const out = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** A word pressed onto the card: drops from 1.18× with a hard landing, then the off-register plate settles. */
const Stamp: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [at, at + 6], [1.18, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const opacity = interpolate(f, [at, at + 3], [0, 1], clamp);
  const reg = interpolate(f, [at + 5, at + 20], [9, 0], { ...clamp, easing: out });
  const rot = interpolate(f, [at, at + 6], [-2.5, 0], clamp);
  const word: React.CSSProperties = { position: 'absolute', inset: 0, whiteSpace: 'pre' };
  return (
    <span style={{ position: 'relative', display: 'inline-block', opacity, transform: `scale(${scale}) rotate(${rot}deg)` }}>
      <span style={{ visibility: 'hidden', whiteSpace: 'pre' }}>{text}</span>
      <span style={{ ...word, color: LAKE, opacity: reg > 0.4 ? 0.85 : 0, transform: `translate(${reg}px, ${reg * 0.6}px)` }}>{text}</span>
      <span style={{ ...word, color: EMBER, mixBlendMode: 'multiply' }}>{text}</span>
    </span>
  );
};

const AmpStamp: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [at, at + 7], [1.6, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const opacity = interpolate(f, [at, at + 3], [0, 1], clamp);
  const spin = interpolate(f, [at, at + 90], [-140, 0], { ...clamp, easing: out });
  const ring = 'FEUER · SEE · SONST NICHTS · ';
  return (
    <div
      style={{
        position: 'relative',
        width: 150,
        height: 150,
        margin: '0 30px',
        opacity,
        transform: `scale(${scale}) rotate(${spin}deg)`,
        flex: 'none',
        alignSelf: 'center',
      }}
    >
      <svg viewBox="0 0 200 200" width="150" height="150" style={{ position: 'absolute', inset: 0 }}>
        <circle cx="100" cy="100" r="98" fill={BUTTER} />
        <circle cx="100" cy="100" r="90" fill="none" stroke={INK} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="58" fill="none" stroke={INK} strokeWidth="1.5" />
        <defs>
          <path id="ring" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
        </defs>
        <text fill={INK} style={{ fontFamily: 'Bitter', fontWeight: 700, fontSize: 15, letterSpacing: '0.16em' }}>
          <textPath href="#ring" textLength="462" lengthAdjust="spacing">{ring}</textPath>
        </text>
        <text
          x="100"
          y="128"
          textAnchor="middle"
          fill={EMBER_DEEP}
          style={{ fontFamily: 'Playfair', fontStyle: 'italic', fontWeight: 800, fontSize: 84 }}
        >
          &amp;
        </text>
      </svg>
    </div>
  );
};

export const Wordmark: React.FC = () => {
  const f = useCurrentFrame();
  const frame = interpolate(f, [0, 16], [0, 1], { ...clamp, easing: out });
  const motto = interpolate(f, [34, 50], [0, 1], { ...clamp, easing: out });
  const tracking = interpolate(f, [34, 60], [0.42, 0.22], { ...clamp, easing: out });
  const rule = interpolate(f, [30, 52], [0, 1], { ...clamp, easing: out });
  // 1600 × 560 inside a 24 px margin: the double frame is drawn as two rects by dash offset.
  const W = 1552;
  const H = 512;
  const per = 2 * (W + H);

  return (
    <AbsoluteFill style={{ background: CREAM, alignItems: 'center', justifyContent: 'center' }}>
      <style>{fontFaces}</style>
      <svg width="1600" height="560" style={{ position: 'absolute', inset: 0 }}>
        {[0, 9].map((d) => (
          <rect
            key={d}
            x={24 + d}
            y={24 + d}
            width={W - d * 2}
            height={H - d * 2}
            fill="none"
            stroke={EMBER}
            strokeWidth={d ? 1.5 : 3}
            strokeDasharray={per}
            strokeDashoffset={per * (1 - frame)}
          />
        ))}
      </svg>
      <div
        style={{
          fontFamily: 'Playfair',
          fontWeight: 900,
          fontSize: 140,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          display: 'flex',
          alignItems: 'center',
          marginTop: -56,
        }}
      >
        <Stamp text="SEEBLICK" at={8} />
        <AmpStamp at={18} />
        <Stamp text="GLUT" at={24} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 392,
          left: '50%',
          width: 900,
          marginLeft: -450,
          height: 0,
          borderTop: `1.5px solid ${INK}`,
          transform: `scaleX(${rule})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 414,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Playfair',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: `${tracking * 0.2}em`,
          color: INK,
          opacity: motto,
        }}
      >
        Feuer. See. Sonst nichts.
      </div>
      <div
        style={{
          position: 'absolute',
          top: 476,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Bitter',
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: `${tracking}em`,
          color: EMBER_DEEP,
          opacity: motto,
          textTransform: 'uppercase',
        }}
      >
        Klagenfurt am Wörthersee
      </div>
    </AbsoluteFill>
  );
};
