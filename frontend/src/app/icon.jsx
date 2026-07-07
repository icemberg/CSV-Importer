import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#16a34a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 22,
          borderRadius: '6px',
          fontWeight: 'bold',
          fontFamily: 'sans-serif'
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}
