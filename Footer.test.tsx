import React from "react";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import { CONSTANTS } from "../../../utils/common/constants";

// Mock useSelector
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock getUrl
jest.mock("../../../utils/common/change.utils", () => ({
  getUrl: {
    getUrlEndPoint: jest.fn(),
  },
}));

const mockProps = {
  backHandler: jest.fn(),
  validateNxt: "validate-class",
  journeyType: "NTC",
  uploadJourney: false,
  otherMyinfo: false,
};

describe("Footer Component", () => {
  let wrapper: any;

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((callback) =>
      callback({
        stages: {
          stages: [
            {
              stageId: "BD_3",
              stageInfo: {
                products: [{ product_category: "CC", product_type: "280" }],
              },
            },
          ],
        },
      })
    );
    wrapper = shallow(<Footer {...mockProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Footer component", () => {
    expect(wrapper.exists(".footer")).toBe(true);
  });

  it("should display the back button when backBtn state is true", () => {
    wrapper.find("div.back").simulate("click");
    expect(mockProps.backHandler).toHaveBeenCalled();
  });

  it("should not display the back button when backBtn state is false", () => {
    wrapper.setState({ backBtn: false });
    expect(wrapper.find(".back").exists()).toBe(false);
  });

  it("should display the 'Agree and Submit' button when ctaSpinner is true and conditions match", () => {
    wrapper.setState({ ctaSpinner: true });
    expect(wrapper.find("button").text()).toContain("Agree and Submit");
  });

  it("should display the 'Continue' button when conditions do not match", () => {
    wrapper.setState({ ctaSpinner: false });
    expect(wrapper.find("button").text()).toContain("Continue");
  });

  it("should handle ctaSpinner state change based on the urlEndpoint", () => {
    const { getUrl } = require("../../../utils/common/change.utils");
    getUrl.getUrlEndPoint.mockReturnValue("acknowledge");
    wrapper.instance().componentDidMount();
    expect(wrapper.state("ctaSpinner")).toBe(true);
  });

  it("should set backBtn state to false for specific conditions in the stageSelector", () => {
    wrapper.setState({
      backBtn: true,
      stageSelector: [
        {
          stageId: CONSTANTS.STAGE_NAMES.BD_3,
          stageInfo: {
            products: [{ product_category: "CC", product_type: "280" }],
          },
        },
      ],
    });
    expect(wrapper.state("backBtn")).toBe(false);
  });

  it("should call backHandler when the back button is clicked", () => {
    wrapper.setState({ backBtn: true });
    wrapper.find(".back").simulate("click");
    expect(mockProps.backHandler).toHaveBeenCalled();
  });

  it("should apply the correct class for the continue button based on props.validateNxt", () => {
    expect(wrapper.find("button").hasClass("validate-class")).toBe(true);
  });
});
