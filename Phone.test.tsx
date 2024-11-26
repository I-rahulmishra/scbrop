import React from "react";
import { shallow } from "enzyme";
import { useSelector, useDispatch } from "react-redux";
import Phone from "./Phone";

// Mock the necessary hooks and functions
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../../services/validation-service", () => ({
  allowOnlyCharacter: jest.fn(),
}));

jest.mock("../../../utils/common/change.utils", () => ({
  fieldError: jest.fn(),
  fieldIdAppend: jest.fn(() => "fieldId"),
  getUrl: {
    getUpdatedStage: jest.fn(() => ({
      updatedStageInputs: [],
    })),
  },
  isFieldUpdate: jest.fn(),
  isFieldValueUpdate: jest.fn(),
}));

jest.mock("../../../assets/_json/error.json", () => ({
  patterns: "Invalid pattern",
  emity: "Field cannot be empty",
  sgMobile: "Invalid Singapore mobile number",
  minLength: "Minimum length is",
}));

describe("Phone Component", () => {
  let dispatchMock: jest.Mock;
  
  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(dispatchMock);
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "98765432",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    expect(wrapper.find(".phone").length).toBe(1);
    expect(wrapper.find("input").props().value).toBe("98765432");
  });

  it("calls phoneValidation when input changes", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "98765432",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    const input = wrapper.find("input");
    input.simulate("change", { target: { value: "12345678" } });

    expect(wrapper.state("defaultValue")).toBe("12345678");
    expect(props.handleCallback).toHaveBeenCalledWith(props.data, "12345678");
  });

  it("displays error when field is empty and mandatory", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    wrapper.find("input").simulate("change", { target: { value: "" } });

    expect(wrapper.state("error")).toBe("Field cannot be empty Mobile Number");
  });

  it("displays error for invalid Singapore mobile number", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "12345678",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    wrapper.find("input").simulate("change", { target: { value: "12345678" } });

    expect(wrapper.state("error")).toBe("Invalid Singapore mobile number");
  });

  it("dispatches correct actions on valid input change", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "98765432",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    wrapper.find("input").simulate("change", { target: { value: "12345678" } });

    expect(dispatchMock).toHaveBeenCalled();
  });

  it("displays LOV data correctly", () => {
    const props = {
      data: {
        logical_field_name: "mobile_number",
        rwb_label_name: "Mobile Number",
        mandatory: "Yes",
        min_length: 8,
        regex: /^[0-9]+$/,
        editable: false,
      },
      handleCallback: jest.fn(),
    };

    (useSelector as jest.Mock).mockReturnValueOnce({
      lov: [
        { CODE_DESC: "SG (+65)" },
        { CODE_DESC: "MY (+60)" },
      ],
      stages: {
        stages: [
          {
            stageInfo: {
              applicants: {
                mobile_number_a_1: "98765432",
              },
            },
          },
        ],
      },
      fielderror: {
        error: "",
      },
    });

    const wrapper = shallow(<Phone {...props} />);
    expect(wrapper.find(".phone__flag").length).toBe(2);
  });
});
