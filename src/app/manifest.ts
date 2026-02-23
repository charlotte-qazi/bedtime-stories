import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Across the Seas Stories',
    short_name: 'Seas Stories',
    description:
      'Bedtime stories that keep families close, no matter the distance. Voice-recorded tales from the people who love your little ones most.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#172554',
    background_color: '#f8fafc',
    icons: [
      {
        src: '/images/icon-512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  };
}
