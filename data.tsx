import React from "react";
import { shallow } from "enzyme";
import { useSelector } from "react-redux";
import Footer from "./footer";
import { CONSTANTS } from "../../../utils/common/constants";
import { getUrl } from "../../../utils/common/change.utils";
import { authenticateType } from '../../../utils/common/change.utils';

// Mock the useSelector hook from redux
jest.mock("react-redux", () => ({
useSelector: jest.fn(),
}));

// Mock the getUrl function
jest.mock("../../../utils/common/change.utils", () => ({
getUrl: {
getUrlEndPoint: jest.fn(),
},
}));

// Mock the dependencies
jest.mock('../../utils/common/change.utils', () => ({
    authenticateType: jest.fn(()=>"manual"),
    getUrl: jest.fn(),
  }));

describe("Footer Component", () => {
const backHandlerMock = jest.fn();

    jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
    }));

beforeEach(() => {
// Reset the mock functions before each test
(useSelector as jest.Mock).mockClear();
(getUrl.getUrlEndPoint as jest.Mock).mockClear();
backHandlerMock.mockClear();
});

it("renders correctly when back button is enabled", () => {
// Mock the selector to return a stage
(useSelector as jest.Mock).mockReturnValue([{ stageId: "someStage", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" />);

// Check if Back button is rendered
expect(wrapper.find(".back").length).toBe(1);
expect(wrapper.find(".continue").text()).toBe("Continue");
});

it("renders correctly when back button is not enabled", () => {
// Mock the selector to return a stage where back button should be disabled
(useSelector as jest.Mock).mockReturnValue([{ stageId: CONSTANTS.STAGE_NAMES.SSF_1, stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" />);

// Check if Back button is not rendered
expect(wrapper.find(".back").length).toBe(0);
});

it("disables the back button when journeyType is NTC and conditions are met", () => {
// Mock the selector to return a stage with conditions for NTC journeyType
(useSelector as jest.Mock).mockReturnValue([{ stageId: CONSTANTS.STAGE_NAMES.BD_3, stageInfo: { products: [{ product_category: "CC" }] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" />);

// Back button should not be rendered
expect(wrapper.find(".back").length).toBe(0);
});

it("calls backHandler when back button is clicked", () => {
(useSelector as jest.Mock).mockReturnValue([{ stageId: "someStage", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" />);
wrapper.find(".back").simulate("click");

// Check if backHandler was called
expect(backHandlerMock).toHaveBeenCalled();
});

it("shows the spinner when ctaSpinner is true", () => {
(useSelector as jest.Mock).mockReturnValue([{ stageId: "someStage", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("acknowledge"); // This sets ctaSpinner to true

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" />);

// Check if the spinner is rendered
expect(wrapper.find(".circle-spinner").length).toBe(1);
});

it("displays 'Agree and Submit' text when stageId is 'rp' or uploadJourney is true", () => {
(useSelector as jest.Mock).mockReturnValue([{ stageId: "rp", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" uploadJourney={true} />);

// Check if the button text is 'Agree and Submit'
expect(wrapper.find(".continue").text()).toBe("Agree and Submit");
});

it("displays 'Continue' text when ctaSpinner is false and conditions are not met", () => {
(useSelector as jest.Mock).mockReturnValue([{ stageId: "someStage", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} journeyType="NTC" uploadJourney={false} />);

// Check if the button text is 'Continue'
expect(wrapper.find(".continue").text()).toBe("Continue");
});

it("correctly toggles the back button based on otherMyinfo prop", () => {
// Mock selector to simulate stage
(useSelector as jest.Mock).mockReturnValue([{ stageId: "someStage", stageInfo: { products: [{}] } }]);
(getUrl.getUrlEndPoint as jest.Mock).mockReturnValue("someUrl");

const wrapper = shallow(<Footer backHandler={backHandlerMock} otherMyinfo={false} journeyType="NTC" />);

// Check if Back button is visible when otherMyinfo is false
expect(wrapper.find(".back").length).toBe(1);

wrapper.setProps({ otherMyinfo: true });

// Check if Back button is not visible when otherMyinfo is true
expect(wrapper.find(".back").length).toBe(0);
});
});
