import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TrackedButton, TrackedLink, TrackedForm, ContactButton } from '@/components/TrackingComponents';

// Mock the analytics hooks
jest.mock('@/hooks/useAnalytics', () => ({
  useCTATracking: jest.fn(() => ({
    trackCTAClick: jest.fn(),
    trackEmailClick: jest.fn(),
    trackPhoneClick: jest.fn(),
  })),
  useInteractionTracking: jest.fn(() => ({
    trackClick: jest.fn(),
    trackHover: jest.fn(),
    trackFocus: jest.fn(),
  })),
  useFormTracking: jest.fn(() => ({
    trackFormStart: jest.fn(),
    trackFormComplete: jest.fn(),
    trackFormError: jest.fn(),
  })),
}));

describe('TrackedButton', () => {
  const mockTrackCTAClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    require('@/hooks/useAnalytics').useCTATracking.mockReturnValue({
      trackCTAClick: mockTrackCTAClick,
      trackEmailClick: jest.fn(),
      trackPhoneClick: jest.fn(),
    });
  });

  it('renders button with correct content', () => {
    render(
      <TrackedButton trackingName="test-button">
        Click me
      </TrackedButton>
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <TrackedButton trackingName="test" variant="primary">
        Primary
      </TrackedButton>
    );

    expect(screen.getByRole('button')).toHaveClass('from-primary', 'to-secondary');

    rerender(
      <TrackedButton trackingName="test" variant="secondary">
        Secondary
      </TrackedButton>
    );

    expect(screen.getByRole('button')).toHaveClass('bg-white', 'text-primary');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <TrackedButton trackingName="test" size="sm">
        Small
      </TrackedButton>
    );

    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(
      <TrackedButton trackingName="test" size="lg">
        Large
      </TrackedButton>
    );

    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('tracks click events with correct data', async () => {
    const user = userEvent.setup();
    
    render(
      <TrackedButton 
        trackingName="test-button" 
        trackingValue={10}
        trackingCategory="test"
        variant="primary"
        size="md"
      >
        Track me
      </TrackedButton>
    );

    await user.click(screen.getByRole('button'));

    expect(mockTrackCTAClick).toHaveBeenCalledWith('test-button', 10, {
      category: 'test',
      variant: 'primary',
      size: 'md',
      text: 'Track me',
    });
  });

  it('calls original onClick handler', async () => {
    const user = userEvent.setup();
    const mockOnClick = jest.fn();
    
    render(
      <TrackedButton trackingName="test" onClick={mockOnClick}>
        Click me
      </TrackedButton>
    );

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalled();
  });
});

describe('TrackedLink', () => {
  const mockTrackCTAClick = jest.fn();
  const mockTrackEmailClick = jest.fn();
  const mockTrackPhoneClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('@/hooks/useAnalytics').useCTATracking.mockReturnValue({
      trackCTAClick: mockTrackCTAClick,
      trackEmailClick: mockTrackEmailClick,
      trackPhoneClick: mockTrackPhoneClick,
    });
  });

  it('renders link with correct href', () => {
    render(
      <TrackedLink trackingName="test-link" href="/test">
        Test Link
      </TrackedLink>
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('tracks email links correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TrackedLink trackingName="email-link" href="mailto:test@example.com">
        Email us
      </TrackedLink>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackEmailClick).toHaveBeenCalledWith('test@example.com');
  });

  it('tracks phone links correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TrackedLink trackingName="phone-link" href="tel:+1234567890">
        Call us
      </TrackedLink>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackPhoneClick).toHaveBeenCalledWith('+1234567890');
  });

  it('tracks regular links correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TrackedLink 
        trackingName="regular-link" 
        href="https://example.com"
        trackingValue={5}
      >
        External Link
      </TrackedLink>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackCTAClick).toHaveBeenCalledWith('regular-link', 5, {
      category: 'link',
      href: 'https://example.com',
      text: 'External Link',
      external: true,
    });
  });
});

describe('TrackedForm', () => {
  const mockTrackFormStart = jest.fn();
  const mockTrackFormComplete = jest.fn();
  const mockTrackFormError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('@/hooks/useAnalytics').useFormTracking.mockReturnValue({
      trackFormStart: mockTrackFormStart,
      trackFormComplete: mockTrackFormComplete,
      trackFormError: mockTrackFormError,
    });
  });

  it('renders form with children', () => {
    render(
      <TrackedForm formName="test-form">
        <input type="email" name="email" />
        <button type="submit">Submit</button>
      </TrackedForm>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('tracks form start on focus', async () => {
    const user = userEvent.setup();
    
    render(
      <TrackedForm formName="test-form">
        <input type="email" name="email" />
      </TrackedForm>
    );

    await user.click(screen.getByRole('textbox'));

    expect(mockTrackFormStart).toHaveBeenCalled();
  });

  it('tracks form completion on submit', async () => {
    const user = userEvent.setup();
    const mockOnSubmitSuccess = jest.fn();
    
    render(
      <TrackedForm formName="test-form" onSubmitSuccess={mockOnSubmitSuccess}>
        <input type="email" name="email" defaultValue="test@example.com" />
        <button type="submit">Submit</button>
      </TrackedForm>
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mockTrackFormComplete).toHaveBeenCalledWith({
      fields: ['email'],
      fieldCount: 1,
    });
    expect(mockOnSubmitSuccess).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });
});

describe('ContactButton', () => {
  const mockTrackEmailClick = jest.fn();
  const mockTrackPhoneClick = jest.fn();
  const mockTrackCTAClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require('@/hooks/useAnalytics').useCTATracking.mockReturnValue({
      trackCTAClick: mockTrackCTAClick,
      trackEmailClick: mockTrackEmailClick,
      trackPhoneClick: mockTrackPhoneClick,
    });
  });

  it('renders email contact button correctly', () => {
    render(
      <ContactButton type="email" value="test@example.com">
        Email Us
      </ContactButton>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    expect(link).toHaveTextContent('Email Us');
  });

  it('renders phone contact button correctly', () => {
    render(
      <ContactButton type="phone" value="+1234567890">
        Call Us
      </ContactButton>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'tel:+1234567890');
    expect(link).toHaveTextContent('Call Us');
  });

  it('renders calendar contact button correctly', () => {
    render(
      <ContactButton type="calendar" value="https://calendly.com/test">
        Book Meeting
      </ContactButton>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://calendly.com/test');
    expect(link).toHaveTextContent('Book Meeting');
  });

  it('tracks email clicks correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactButton type="email" value="test@example.com">
        Email Us
      </ContactButton>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackEmailClick).toHaveBeenCalledWith('test@example.com');
  });

  it('tracks phone clicks correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactButton type="phone" value="+1234567890">
        Call Us
      </ContactButton>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackPhoneClick).toHaveBeenCalledWith('+1234567890');
  });

  it('tracks calendar clicks correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <ContactButton type="calendar" value="https://calendly.com/test">
        Book Meeting
      </ContactButton>
    );

    await user.click(screen.getByRole('link'));

    expect(mockTrackCTAClick).toHaveBeenCalledWith('calendar_booking', 20, {
      contact_method: 'calendar',
      value: 'https://calendly.com/test',
    });
  });
});