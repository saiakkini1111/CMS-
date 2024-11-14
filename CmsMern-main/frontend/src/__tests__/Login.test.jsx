import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';
import { axiosInstance } from '../services/axiosInstance';
import { setUserInfo } from '../services/localStorageInfo';
import Login from '../pages/login/Login';

vi.mock('../services/axiosInstance');
vi.mock('../services/localStorageInfo');

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders login form inputs and submit button', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty inputs', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Password is required.')).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email format', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ValidP@ssw0rd' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is invalid.')).toBeInTheDocument();
    });
  });

  test('shows validation error for weak password', async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'weakpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Password must contain at least 8 characters, one uppercase, one number, and one special character.'
        )
      ).toBeInTheDocument();
    });
  });

  test('calls axios and navigates on successful login', async () => {
    axiosInstance.post.mockResolvedValue({
      data: { role: 'admin', token: 'test-token' }
    });
  
    render(
      <Router>
        <Login />
      </Router>
    );
  
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'ValidP@ssw0rd' } });
    
    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    // Wait for axios call and check if it was made
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'ValidP@ssw0rd'
      });
      expect(setUserInfo).toHaveBeenCalledWith({ role: 'admin', token: 'test-token' });
    });
  });

  test('displays general error message on failed login', async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <Router>
        <Login />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'WrongP@ssw0rd' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
});
