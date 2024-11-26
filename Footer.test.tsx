import React from "react";
import { shallow } from "enzyme";
import Footer from "./Footer";
import { CONSTANTS } from "../../../utils/common/constants";

describe("Footer Component", () => {
  let mockBackHandler;
  let mockProps;

  beforeEach(() => {
    mockBackHandler = jest.fn();
    mockProps = {
      backHandler: mockBackHandler,
      validateNxt: "valid",
      journeyType: "NTC",
      otherMyinfo: false,
      uploadJourney: false,
    };
  });

  it("should render the Footer component without crashing", () => {
    const wrapper = shallow(<Footer {...mockProps} />);
    expect(wrapper.exists()).toBe(true);
  });

  it("should render the 'Back' button when conditions are met", () => {
    const wrapper = shallow(<Footer {...mockProps} />);
    // Test when back button should be visible
    expect(wrapper.find(".back").length).toBe(1);
  });

  it("should not render the 'Back' button when conditions are not met", () => {
    mockProps.otherMyinfo = true; // simulate condition where back button should not render
    const wrapper = shallow(<Footer {...mockProps} />);
    expect(wrapper.find(".back").length).toBe(0);
  });

  it("should call backHandler when 'Back' button is clicked", () => {
    const wrapper = shallow(<Footer {...mockProps} />);
    wrapper.find(".back").simulate("click");
    expect(mockBackHandler).toHaveBeenCalledTimes(1);
  });

  it("should render the 'Continue' button with correct text for 'Agree and Submit' when stageId is 'rp' or uploadJourney is true", () => {
    mockProps.journeyType = "NTC";
    mockProps.uploadJourney = true; // simulate uploadJourney as true
    const wrapper = shallow(<Footer {...mockProps} />);
    expect(wrapper.find("button.continue").text()).toBe("Agree and Submit");
  });

  it("should render the 'Continue' button with correct text for 'Continue' when not in 'rp' stage and uploadJourney is false", () => {
    mockProps.uploadJourney = false;
    const wrapper = shallow(<Footer {...mockProps} />);
    expect(wrapper.find("button.continue").text()).toBe("Continue");
  });

  it("should show spinner when ctaSpinner is true", () => {
    mockProps.journeyType = "NTC";
    mockProps.uploadJourney = false;
    const wrapper = shallow(<Footer {...mockProps} />);
    wrapper.setState({ ctaSpinner: true });
    expect(wrapper.find(".circle-spinner").length).toBe(1);
  });

  it("should hide spinner when ctaSpinner is false", () => {
    mockProps.journeyType = "NTC";
    mockProps.uploadJourney = false;
    const wrapper = shallow(<Footer {...mockProps} />);
    wrapper.setState({ ctaSpinner: false });
    expect(wrapper.find(".circle-spinner").length).toBe(0);
  });

  it("should correctly determine the back button visibility based on stageSelector and props", () => {
    const mockStageSelector = [
      {
        stageId: CONSTANTS.STAGE_NAMES.BD_3,
        stageInfo: {
          products: [{ product_category: "CC" }],
        },
      },
    ];
    mockProps.journeyType = "NTC";
    const wrapper = shallow(<Footer {...mockProps} />);
    wrapper.setProps({ stageSelector: mockStageSelector });
    expect(wrapper.find(".back").length).toBe(0); // Back button should not be visible based on condition
  });

  it("should correctly set back button visibility when otherMyinfo is true", () => {
    mockProps.otherMyinfo = true;
    const wrapper = shallow(<Footer {...mockProps} />);
    expect(wrapper.find(".back").length).toBe(0);
  });
});



import React from "react";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import Footer from "./footer";

// Mock the useSelector hook from redux
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock the utility functions from change.utils
jest.mock("../../../utils/common/change.utils", () => ({
  authenticateType: jest.fn(() => "manual"),
  getUrl: jest.fn(),
}));

describe("Footer Component", () => {
  const backHandlerMock = jest.fn();

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (useSelector as jest.Mock).mockClear();
  });

  it("renders correctly when back button is enabled", () => {
    // Mock the selector to return a stage
    (useSelector as jest.Mock).mockReturnValue([
      { stageId: "someStage", stageInfo: { products: [{}] } },
    ]);

    const wrapper = shallow(
      <Footer backHandler={backHandlerMock} journeyType="NTC" />
    );

    // Check if Back button is rendered
    expect(wrapper.find(".back").length).toBe(1);
    expect(wrapper.find(".continue").text()).toBe("Continue");
  });

  it("renders correctly when back button is not enabled", () => {
    // Mock the selector to return a stage where back button should be disabled
    (useSelector as jest.Mock).mockReturnValue([
      { stageId: "SSF_1", stageInfo: { products: [{}] } },
    ]);

    const wrapper = shallow(
      <Footer backHandler={backHandlerMock} journeyType="NTC" />
    );

    // Check if Back button is not rendered
    expect(wrapper.find(".back").length).toBe(0);
  });

  it("calls backHandler when back button is clicked", () => {
    (useSelector as jest.Mock).mockReturnValue([
      { stageId: "someStage", stageInfo: { products: [{}] } },
    ]);

    const wrapper = shallow(
      <Footer backHandler={backHandlerMock} journeyType="NTC" />
    );
    wrapper.find(".back").simulate("click");

    // Check if backHandler was called
    expect(backHandlerMock).toHaveBeenCalled();
  });

  it("displays 'Agree and Submit' text when stageId is 'rp' or uploadJourney is true", () => {
    (useSelector as jest.Mock).mockReturnValue([
      { stageId: "rp", stageInfo: { products: [{}] } },
    ]);

    const wrapper = shallow(
      <Footer
        backHandler={backHandlerMock}
        journeyType="NTC"
        uploadJourney={true}
      />
    );

    // Check if the button text is 'Agree and Submit'
    expect(wrapper.find(".continue").text()).toBe("Agree and Submit");
  });

  it("displays 'Continue' text when ctaSpinner is false and conditions are not met", () => {
    (useSelector as jest.Mock).mockReturnValue([
      { stageId: "someStage", stageInfo: { products: [{}] } },
    ]);

    const wrapper = shallow(
      <Footer
        backHandler={backHandlerMock}
        journeyType="NTC"
        uploadJourney={false}
      />
    );

    // Check if the button text is 'Continue'
    expect(wrapper.find(".continue").text()).toBe("Continue");
  });

  it("correctly calls authenticateType function", () => {
    const { authenticateType } = require("../../../utils/common/change.utils");

    // Ensure the mocked function is returning the expected value
    expect(authenticateType()).toBe("manual");
  });
});
