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
