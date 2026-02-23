import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#172554',
          borderRadius: '6px',
        }}
      >
        {/* Sailboat */}
        <svg
          width="20"
          height="22"
          viewBox="0 0 20 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Star */}
          <path d="M10 0l1 3.1h3.2l-2.6 1.9 1 3.1L10 6.2 7.4 8.1l1-3.1L5.8 3.1H9L10 0z" fill="#EAB308" />
          {/* Sail */}
          <path d="M10 5v11L4 16z" fill="white" />
          <path d="M10 7v9l5-2z" fill="#E2E8F0" />
          {/* Hull */}
          <path d="M3 17h14l-2 3H5z" fill="white" />
          {/* Waves */}
          <path d="M0 21c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0" stroke="#2DD4BF" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
