import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: '36px',
        }}
      >
        <svg
          width="110"
          height="120"
          viewBox="0 0 110 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Star */}
          <path d="M55 0l5.5 17h17.6l-14.3 10.4 5.5 17L55 34l-14.3 10.4 5.5-17L32 17h17.6z" fill="#EAB308" />
          {/* Left sail */}
          <path d="M55 28v60L22 88z" fill="white" />
          {/* Right sail */}
          <path d="M55 38v50l27-12z" fill="#E2E8F0" />
          {/* Hull */}
          <path d="M16 93h78l-11 16H27z" fill="white" />
          {/* Waves */}
          <path d="M0 115c11-8 22-8 33 0s22 8 33 0 22-8 33 0 22 8 33 0" stroke="#2DD4BF" strokeWidth="6" fill="none" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
