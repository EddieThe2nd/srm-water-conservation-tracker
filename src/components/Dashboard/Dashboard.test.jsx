// src/components/Dashboard.test.jsx
import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

// ✅ Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));


global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('loads and displays data from /mockData.json', async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        users: [
          {
            id: 'user001',
            name: 'Nkosi Family',
            type: 'household',
            region: 'Soweto',
            monthlySummary: { April2025: 320 },
            dailyUsageLitres: [
              { date: '2025-04-01', litres: 320 },
              { date: '2025-04-02', litres: 310 },
            ],
            alerts: [],
          },
        ],
      }),
  });

  render(<Dashboard />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    const nameElements = screen.getAllByText(/nkosi family/i);
    expect(nameElements.length).toBeGreaterThan(0);
    expect(screen.getByText((_, el) => el?.textContent?.includes('320') && el.textContent.includes('litres'))).toBeInTheDocument();

  });
});

test('selecting a user updates dashboard', async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        users: [
          {
            id: 'user001',
            name: 'Alice',
            type: 'business',
            region: 'North',
            monthlySummary: { April2025: 250 },
            dailyUsageLitres: [
              { date: '2025-04-01', litres: 250 },
              { date: '2025-04-02', litres: 240 },
            ],
            alerts: [],
          },
          {
            id: 'user002',
            name: 'Bob',
            type: 'business',
            region: 'South',
            monthlySummary: { April2025: 500 },
            dailyUsageLitres: [
              { date: '2025-04-01', litres: 500 },
              { date: '2025-04-02', litres: 480 },
            ],
            alerts: [],
          },
        ],
      }),
  });

  render(<Dashboard />);
  await waitFor(() => screen.getAllByText(/alice/i));

  userEvent.click(screen.getByTestId('user-item-user002'));

  await waitFor(() => {
    expect(screen.getAllByText(/bob/i).length).toBeGreaterThan(0);
    expect(screen.getByText((_, el) => el?.textContent?.includes('500') && el.textContent.includes('litres'))).toBeInTheDocument();

    expect(screen.getByText(/south/i)).toBeInTheDocument();
  });
});

test('displays alert and tips for high water usage', async () => {
  fetch.mockResolvedValueOnce({
    json: () =>
      Promise.resolve({
        users: [
          {
            id: 'user003',
            name: 'Charlie',
            type: 'household',
            region: 'East',
            monthlySummary: { April2025: 450 },
            dailyUsageLitres: [
              { date: '2025-04-01', litres: 450 },
              { date: '2025-04-02', litres: 460 },
            ],
            alerts: [
              {
                date: '2025-04-01',
                type: 'high_usage',
                message: 'High water usage detected!',
              },
            ],
          },
        ],
      }),
  });

  render(<Dashboard />);
  await waitFor(() => screen.getAllByText(/charlie/i));

  expect(screen.getByText(/high water usage detected/i)).toBeInTheDocument();
  expect(screen.getByText((_, el) => el?.textContent?.toLowerCase().includes('low-flow faucets'))).toBeInTheDocument();

});
