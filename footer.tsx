import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Phone } from "./Phone"; // Adjust the path if necessary
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);
const mockProps = {
  data: {
    logical_field_name: "mobile_number_a_1",
    rwb_label_name: "Mobile Number",
    mandatory: "Yes",
    min_length: 8,
    regex: "^[89][0-9]{7}$",
    editable: false,
    length: 8,
  },
  handleCallback: jest.fn(),
};

const renderComponent = (storeState = {}) => {
  const store = mockStore(storeState);
  render(
    <Provider store={store}>
      <Phone {...mockProps} />
    </Provider>
  );
};

describe("Phone Component", () => {
  it("renders the component with initial state", () => {
    renderComponent();
    const label = screen.getByText("Mobile Number");
    expect(label).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: "Mobile Number" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders the country code from LOV data", () => {
    const mockLovData = [
      {
        label: "Country Code",
        value: [{ CODE_DESC: "(+65)" }],
      },
    ];

    const storeState = {
      lov: { lov: mockLovData },
    };
    renderComponent(storeState);

    expect(screen.getByText("(+65)")).toBeInTheDocument();
  });

  it("handles input change and calls handleCallback", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "91234567" } });
    expect(mockProps.handleCallback).toHaveBeenCalledWith(
      mockProps.data,
      "91234567"
    );
  });

  it("displays error for invalid input", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "71234567" } });
    const error = screen.getByText("Please enter a valid Singapore mobile number");
    expect(error).toBeInTheDocument();
  });

  it("displays error for missing mandatory field", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "" } });
    const error = screen.getByText("Mobile Number is required");
    expect(error).toBeInTheDocument();
  });

  it("sets error message for length less than the minimum required", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "912" } });
    const error = screen.getByText("Mobile Number must be at least 8 digits");
    expect(error).toBeInTheDocument();
  });

  it("allows only numeric characters", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.keyPress(input, { key: "a", code: "KeyA", charCode: 97 });
    expect(input.value).toBe("");

    fireEvent.keyPress(input, { key: "9", code: "Digit9", charCode: 57 });
    fireEvent.change(input, { target: { value: "9" } });
    expect(input.value).toBe("9");
  });

  it("does not call handleCallback for invalid input", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "7" } });
    expect(mockProps.handleCallback).not.toHaveBeenCalled();
  });

  it("displays an error for pattern mismatch", () => {
    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.change(input, { target: { value: "12345678" } });
    const error = screen.getByText("Please enter a valid Singapore mobile number");
    expect(error).toBeInTheDocument();
  });

  it("binds onBlur event and updates the field state", () => {
    const mockDispatch = jest.fn();
    jest.mock("react-redux", () => ({
      ...jest.requireActual("react-redux"),
      useDispatch: () => mockDispatch,
    }));

    renderComponent();
    const input = screen.getByRole("textbox", { name: "Mobile Number" });

    fireEvent.blur(input, { target: { value: "91234567" } });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: expect.any(String),
      })
    );
  });
});
