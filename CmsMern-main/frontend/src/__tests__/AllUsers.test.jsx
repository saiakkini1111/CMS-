import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AllUsers from '../pages/users/AllUsers'; // Adjust the path as necessary
import { axiosInstance } from '../services/axiosInstance';
import { vi } from 'vitest';

// Mock axiosInstance and its methods
vi.mock('../services/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('AllUsers Component', () => {
  const usersData = [
    { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'attendee' },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'organizer' },
  ];

  beforeEach(() => {
    // Mock the GET request to return users
    axiosInstance.get.mockResolvedValue({ data: usersData });
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear any previous mock calls
  });

  test('filters users by role', async () => {
    render(<AllUsers />);

    // Wait for users to be displayed
    await waitFor(() => screen.getByText('Manage Users'));

    // Filter by role "attendee"
    fireEvent.change(screen.getByLabelText(/filter by role/i), { target: { value: 'attendee' } });

    // Check that only attendees are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  test('deletes a user', async () => {
    axiosInstance.delete.mockResolvedValueOnce({});
    render(<AllUsers />);

    await waitFor(() => screen.getByText('Manage Users'));

    const deleteIcon = await screen.findByTestId('1'); // Ensure this corresponds to the user's ID
    fireEvent.click(deleteIcon);

    // Verify that the user has been removed from the document
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('handles errors during user fetching', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Error fetching users'));
    render(<AllUsers />);

    await waitFor(() => {
      expect(screen.getByText('Manage Users')).toBeInTheDocument();
    });

    // Assert that an error message is displayed
    expect(await screen.findByText('Could not fetch users. Please try again.')).toBeInTheDocument();
  });

  test('handles errors during user deletion', async () => {
    axiosInstance.delete.mockRejectedValueOnce(new Error('Could not delete user. Please try again.'));
    render(<AllUsers />);

    await waitFor(() => screen.getByText('Manage Users'));

    // Click the delete button for John Doe
    const deleteIcon = await screen.findByTestId('1'); // Ensure this corresponds to the user's ID
    fireEvent.click(deleteIcon);

    // Assert that an error message is displayed
    expect(await screen.findByText('Could not delete user. Please try again.')).toBeInTheDocument();
  });
});
