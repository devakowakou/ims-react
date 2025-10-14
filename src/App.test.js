import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page for unauthenticated user', () => {
  render(<App />);
  const loginTitle = screen.getByText(/Login/i);
  expect(loginTitle).toBeInTheDocument();
});
