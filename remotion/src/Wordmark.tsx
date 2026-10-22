import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// The wordmark "ignites": each letter arrives ember-hot and cools to paper,
// the ampersand flickers like a flame, a hearth hairline draws, sparks rise.
const PAPER = '#F3EBDD';
const PAPER_DIM = '#C9BFAE';
const EMBER = '#E85D2F';
const HOT = '#FFB37A';

const fontFaces = `
@font-face { font-family: 'Fraunces'; src: url(${staticFile('fraunces-latin-full-normal.woff2')}) format('woff2'); font-weight: 100 900; font-style: normal; }
@font-face { font-family: 'Fraunces'; src: url(${staticFile('fraunces-latin-full-italic.woff2')}) format('woff2'); font-weight: 100 900; font-style: italic; }
@font-face { font-family: 'Instrument Sans'; src: url(${staticFile('instrument-sans-latin-wght-normal.woff2')}) format('woff2'); font-weight: 400 700; }
`;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const Letter: React.FC<{ ch: string; start: number; italic?: boolean }> = ({ ch, start, italic }) => {
  const frame = useCurrentFrame();
  const t = (from: number, to: number, a: number, b: number) =>
    interpolate(frame, [start + a, start + b], [from, to], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: ease,
    });
  const opacity = t(0, 1, 0, 10);
  const blur = t(10, 0, 0, 16);
  const y = t(18, 0, 0, 18);
  const wght = t(220, 400, 0, 26);
  const opsz = t(72, 144, 0, 26);
  const heat = t(1, 0, 4, 34);

  // The ampersand never fully cools: it is the fire in the name.
  const flicker = italic ? 0.82 + 0.18 * Math.sin(frame * 0.9 + random(`f${frame}`) * 2) : 1;
  const color = italic
    ? interpolateColors(heat, [0, 1], [EMBER, HOT])
    : interpolateColors(heat, [0, 1], [PAPER, HOT]);
  const glow = italic ? 28 * flicker : 36 * heat;

  return (
    <span
      style={{
        display: 'inline-block',
        opacity: opacity * (italic ? flicker : 1),
        filter: `blur(${blur}px)`,
        transform: `translateY(${y}px)`,
        color,
        fontStyle: italic ? 'italic' : 'normal',
        fontVariationSettings: `'wght' ${wght}, 'opsz' ${opsz}, 'SOFT' 0, 'WONK' 0`,
        textShadow: glow > 0.5 ? `0 0 ${glow}px rgba(232,93,47,${0.55 * (italic ? 1 : heat)})` : 'none',
        fontSize: italic ? '0.62em' : '1em',
        margin: italic ? '0 0.3em 0 0.24em' : 0,
        whiteSpace: 'pre',
      }}
    >
      {ch}
    </span>
  );
};

const Sparks: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const sparks = new Array(26).fill(0).map((_, i) => {
    const born = 38 + random(`b${i}`) * 34;
    const life = 22 + random(`l${i}`) * 20;
    const p = (frame - born) / life;
    if (p < 0 || p > 1) return null;
    const x = width * (0.2 + random(`x${i}`) * 0.6) + Math.sin(p * 6 + i) * 10;
    const y = 400 - p * (90 + random(`h${i}`) * 120);
    const size = 2 + random(`s${i}`) * 3;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          background: interpolateColors(p, [0, 0.5, 1], [HOT, EMBER, '#3A1A0C']),
          opacity: 1 - p,
          boxShadow: `0 0 ${size * 4}px ${EMBER}`,
        }}
      />
    );
  });
  return <>{sparks}</>;
};

export const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [34, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const motto = interpolate(frame, [56, 76], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const tracking = interpolate(frame, [56, 90], [0.5, 0.24], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

  const word1 = 'SEEBLICK'.split('');
  const word2 = 'GLUT'.split('');

  return (
    <AbsoluteFill style={{ background: '#000', alignItems: 'center', justifyContent: 'center' }}>
      <style>{fontFaces}</style>
      <div
        style={{
          fontFamily: 'Fraunces',
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'baseline',
          marginTop: -40,
        }}
      >
        {word1.map((c, i) => (
          <Letter key={`a${i}`} ch={c} start={i * 2} />
        ))}
        <Letter ch="&" start={14} italic />
        {word2.map((c, i) => (
          <Letter key={`b${i}`} ch={c} start={18 + i * 2} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 400,
          left: '50%',
          width: 980,
          height: 2,
          marginLeft: -490,
          background: `linear-gradient(90deg, transparent, ${EMBER} 18%, ${HOT} 50%, ${EMBER} 82%, transparent)`,
          transform: `scaleX(${line})`,
          boxShadow: `0 0 18px rgba(232,93,47,${0.6 * line})`,
        }}
      />
      <Sparks />
      <div
        style={{
          position: 'absolute',
          top: 440,
          width: '100%',
          textAlign: 'center',
          fontFamily: 'Instrument Sans',
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: `${tracking}em`,
          color: PAPER_DIM,
          opacity: motto,
          textTransform: 'uppercase',
        }}
      >
        Feuer. See. Sonst nichts.
      </div>
    </AbsoluteFill>
  );
};
