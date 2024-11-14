import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import EventList from '../pages/events/EventList';
import { axiosInstance } from '../services/axiosInstance';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { isOrganizer, isOrganizerOrAdmin } from '../services/localStorageInfo';

vi.mock('../services/axiosInstance');
vi.mock('../services/localStorageInfo');

describe('EventList Component', () => {
  const eventsData = [
    { _id: '1', name: 'Concert', date: '2024-11-01', description: 'A great concert', venue: 'Main Hall' },
    { _id: '2', name: 'Workshop', date: '2024-11-05', description: 'Informative workshop', venue: 'Room 101' },
  ];

  beforeEach(() => {
    // Mock user role
    isOrganizer.mockReturnValue(true);
    isOrganizerOrAdmin.mockReturnValue(true);
    // Mock axios GET request
    axiosInstance.get.mockResolvedValue({ data: eventsData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays loading indicator while fetching events', async () => {
    render(
      <MemoryRouter>
        <EventList />
      </MemoryRouter>
    );

    // Assert loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('handles error when fetching events', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Error fetching events'));

    await act(async () => {
      render(
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Could not fetch events. Please try again.')).toBeInTheDocument();
    });
  });

  test('filters events based on search query', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <EventList />
        </MemoryRouter>
      );
    });

    // Search for "Workshop"
    const searchInput = screen.getByPlaceholderText('Search events by title...');
    fireEvent.change(searchInput, { target: { value: 'Workshop' } });

    await waitFor(() => {
      expect(screen.getByText('Workshop')).toBeInTheDocument();
      expect(screen.queryByText('Concert')).not.toBeInTheDocument();
    });
  });
});
