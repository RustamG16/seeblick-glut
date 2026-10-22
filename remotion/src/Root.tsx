import React from 'react';
import { Composition } from 'remotion';
import { Wordmark } from './Wordmark';

export const Root: React.FC = () => (
  <Composition id="Wordmark" component={Wordmark} durationInFrames={96} fps={30} width={1600} height={560} />
);
