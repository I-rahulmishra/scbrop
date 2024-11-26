import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer'; // Adjust the import as per your project structure

// Mock dependencies and functions
const mockDispatch = jest.fn();
const mockTrackEvents = { triggerAdobeEvent: jest.fn() };

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));
jest.mock('../path/to/trackEvents', () => mockTrackEvents);

// Mock props
const mockBackHandler = jest.fn();
const mockOtherMyinfo = { key: 'value' };
const mockIsRequiredValid = true;
const mockApplicationJourney = 'journey-type';

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  test('renders Footer component with all props', () => {
    render(
      <Footer
        otherMyinfo={mockOtherMyinfo}
        backHandler={mockBackHandler}
        validateNxt={mockIsRequiredValid}
        journeyType={mockApplicationJourney}
      />
    );

    // Assertions for rendering
    expect(screen.getByTestId('footer')).toBeInTheDocument(); // Ensure footer renders
    expect(screen.getByText(/some-footer-text/i)).toBeInTheDocument(); // Replace with actual text/content
  });

  test('calls backHandler on back button click', () => {
    render(
      <Footer
        otherMyinfo={mockOtherMyinfo}
        backHandler={mockBackHandler}
        validateNxt={mockIsRequiredValid}
        journeyType={mockApplicationJourney}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i }); // Adjust 'back' if the button has different text
    fireEvent.click(backButton);

    expect(mockBackHandler).toHaveBeenCalledTimes(1); // Ensure backHandler is called
  });

  test('displays validateNxt status correctly', () => {
    render(
      <Footer
        otherMyinfo={mockOtherMyinfo}
        backHandler={mockBackHandler}
        validateNxt={mockIsRequiredValid}
        journeyType={mockApplicationJourney}
      />
    );

    if (mockIsRequiredValid) {
      expect(screen.getByText(/valid/i)).toBeInTheDocument(); // Replace with actual text/content
    } else {
      expect(screen.queryByText(/valid/i)).not.toBeInTheDocument();
    }
  });

  test('renders dynamic content based on journeyType', () => {
    render(
      <Footer
        otherMyinfo={mockOtherMyinfo}
        backHandler={mockBackHandler}
        validateNxt={mockIsRequiredValid}
        journeyType="specific-journey"
      />
    );

    expect(screen.getByText(/specific-journey-text/i)).toBeInTheDocument(); // Replace with actual dynamic text/content
  });

  test('dispatches actions correctly within backHandler', async () => {
    await mockBackHandler(true);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'stagesAction.setLastStageId',
      })
    );

    expect(mockTrackEvents.triggerAdobeEvent).toHaveBeenCalledWith(
      'ctaClick',
      'Back'
    );

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ValueUpdateAction.getChangeUpdate',
      })
    );
  });
});
