import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer Component", () => {
  it("should render the 'Continue' button", () => {
    const props = {
      otherMyinfo: false,
      backHandler: jest.fn(),
      validateNxt: "valid",
      journeyType: "NTC",
      uploadJourney: false,
    };

    render(<Footer {...props} />);

    const button = screen.getByText(/Continue/i); // Look for the "Continue" button
    expect(button).toBeInTheDocument(); // Check that the button is present in the DOM
  });
});
