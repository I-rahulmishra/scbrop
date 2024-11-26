import React from "react";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import Footer from "./Footer";
import { CONSTANTS } from "../../../utils/common/constants";
import { getUrl } from "../../../utils/common/change.utils";

// Mock useSelector and getUrl
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

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

  const mockStageSelector = [
    {
      stageId: CONSTANTS.STAGE_NAMES.BD_3,
      stageInfo: {
        products: [{ product_category: "CC", product_type: "280" }],
      },
    },
  ];

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((callback) =>
      callback({
        stages: {
          stages: mockStageSelector,
        },
      })
    );
    (getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("acknowledge");
    wrapper = shallow(<Footer {...mockProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Footer component", () => {
    expect(wrapper.exists(".footer")).toBe(true);
  });

  describe("Back button behavior", () => {
    it("should display the back button when backBtn state is true", () => {
      wrapper.setState({ backBtn: true });
      expect(wrapper.find(".back").exists()).toBe(true);
    });

    it("should not display the back button when backBtn state is false", () => {
      wrapper.setState({ backBtn: false });
      expect(wrapper.find(".back").exists()).toBe(false);
    });

    it("should call backHandler when the back button is clicked", () => {
      wrapper.setState({ backBtn: true });
      wrapper.find(".back").simulate("click");
      expect(mockProps.backHandler).toHaveBeenCalled();
    });

    it("should set backBtn to false for specific journeyType and stage conditions", () => {
      const customStages = [
        {
          stageId: CONSTANTS.STAGE_NAMES.LD_1,
          stageInfo: {
            products: [{ product_type: "280" }],
          },
        },
      ];
      (useSelector as jest.Mock).mockReturnValue({ stages: { stages: customStages } });
      wrapper = shallow(<Footer {...mockProps} />);
      expect(wrapper.state("backBtn")).toBe(false);
    });
  });

  describe("CTA Spinner behavior", () => {
    it("should set ctaSpinner to true when urlEndPoint matches 'acknowledge' or 'preserve'", () => {
      (getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("acknowledge");
      wrapper = shallow(<Footer {...mockProps} />);
      expect(wrapper.state("ctaSpinner")).toBe(true);
    });

    it("should set ctaSpinner to false for other urlEndPoint values", () => {
      (getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("otherEndpoint");
      wrapper = shallow(<Footer {...mockProps} />);
      expect(wrapper.state("ctaSpinner")).toBe(false);
    });
  });

  describe("Continue button behavior", () => {
    it("should display 'Agree and Submit' when ctaSpinner is true or uploadJourney is true", () => {
      wrapper.setState({ ctaSpinner: true });
      expect(wrapper.find("button").text()).toContain("Agree and Submit");

      wrapper.setProps({ uploadJourney: true });
      wrapper.setState({ ctaSpinner: false });
      expect(wrapper.find("button").text()).toContain("Agree and Submit");
    });

    it("should display 'Continue' for other conditions", () => {
      wrapper.setState({ ctaSpinner: false });
      expect(wrapper.find("button").text()).toContain("Continue");
    });

    it("should apply the correct class for the continue button based on props.validateNxt", () => {
      expect(wrapper.find("button").hasClass("validate-class")).toBe(true);
    });
  });

  describe("Other Props Handling", () => {
    it("should handle otherMyinfo prop to determine backBtn state", () => {
      wrapper.setProps({ otherMyinfo: true });
      expect(wrapper.state("backBtn")).toBe(true);

      wrapper.setProps({ otherMyinfo: false });
      expect(wrapper.state("backBtn")).toBe(false);
    });
  });

  describe("Stage Selector", () => {
    it("should set backBtn to false if the first stageId matches specific constants", () => {
      const customStages = [
        { stageId: CONSTANTS.STAGE_NAMES.SSF_1, stageInfo: { products: [] } },
      ];
      (useSelector as jest.Mock).mockReturnValue({ stages: { stages: customStages } });
      wrapper = shallow(<Footer {...mockProps} />);
      expect(wrapper.state("backBtn")).toBe(false);
    });

    it("should set backBtn to true if conditions do not match for stageSelector", () => {
      const customStages = [
        { stageId: "OTHER_STAGE", stageInfo: { products: [] } },
      ];
      (useSelector as jest.Mock).mockReturnValue({ stages: { stages: customStages } });
      wrapper = shallow(<Footer {...mockProps} />);
      expect(wrapper.state("backBtn")).toBe(true);
    });
  });
});
