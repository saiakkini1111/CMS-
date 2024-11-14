import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Signup from '../pages/signup/Signup';
import { axiosInstance } from '../services/axiosInstance';
import { vi } from 'vitest';

// Mock axios
vi.mock('../services/axiosInstance');

describe('Signup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  test('calls axios and navigates on successful signup', async () => {
    axiosInstance.post.mockResolvedValue({
      data: {},
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ValidP@ssw0rd' } });
    fireEvent.change(screen.getByPlaceholderText('role', { name: /role/i }), { target: { value: 'attendee' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'ValidP@ssw0rd',
        role: 'attendee',
      });
    });
  });

  test('displays error message on signup failure', async () => {
    const errorMessage = 'Signup failed! Please try again.';
    axiosInstance.post.mockRejectedValue({
      response: {
        data: { message: errorMessage },
      },
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ValidP@ssw0rd' } });
    fireEvent.change(screen.getByPlaceholderText('role', { name: /role/i }), { target: { value: 'attendee' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('displays password validation error', async () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByPlaceholderText('role', { name: /role/i }), { target: { value: 'attendee' } });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/Password must contain at least 8 characters, one uppercase, one number, and one special character./i)).toBeInTheDocument();
  });

});
