import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CodeElevate app without crashing', () => {
  render(<App />);
  // The app renders the landing page or redirects to login/problems
  // Just verify the component renders without throwing
  expect(document.body).toBeTruthy();
});
