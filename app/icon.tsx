import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#111827',
          borderRadius: '50%',
          color: '#F9FAFB',
          display: 'flex',
          fontSize: 16,
          fontWeight: 600,
          height: '100%',
          justifyContent: 'center',
          letterSpacing: 1,
          width: '100%',
        }}
      >
        SOS
      </div>
    ),
  );
}
