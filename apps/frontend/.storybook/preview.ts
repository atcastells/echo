import type { Preview } from '@storybook/react-vite';

// Import global styles including Tailwind CSS
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#0f172a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;