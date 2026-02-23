import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Across the Seas Stories',
    short_name: 'Seas Stories',
    description: 'Voice-recorded stories that keep families close across distance.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0B2A4A',
    background_color: '#FFFFFF',
  };
}
