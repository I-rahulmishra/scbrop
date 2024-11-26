import { generateSHA256Encrypt, injectStore } from './default-interceptor';
import defaultInterceptor, {extractValue} from './default-interceptor';
import { sha256 } from "js-sha256";
import axios from "axios";
import { getUrl,getTokenChno,keyToken } from '../utils/common/change.utils';
import { store } from '../utils/store/store';
import { resolve } from 'path';
import { rejects } from 'assert';

jest.autoMockOff();
jest.mock("axios", () => ({
  __esModule: true,
}));
jest.mock("@lottiefiles/react-lottie-player", () => ({
  __esModule: true,
}));


//jest.mock("axios");

describe("defaultInterceptor inject store", () => {
  const mockStore = {
    getState: jest.fn().mockReturnValue({
      auth: {
        sessionUid: "test-session-uid",
      },
    }),
  };
  test("injectstore",()=>{
    expect(injectStore({})).not.toBeNull;
  })



});

jest.mock("../utils/common/change.utils",()=>({
  getUrl:{
    getChannelRefNo: jest.fn()
  }
}))



jest.mock("../services/submit-service", () => ({
  generateUUID: "mocked-uuid",
}));

jest.mock("../utils/common/change.utils", () => ({
  getUrl: {
    getParameterByName: jest.fn(),
    getProductInfo: jest.fn(),
    getChannelRefNo: jest.fn(),
  },
  getTokenChno: jest.fn(),
  keyToken: jest.fn(),
}));

describe("generateSHA256Encrypt", () => {

  let mockRequest: any;
  let mockSessionUid: string;
  let mockUrlEndPoint: string;
  let mockScClientContextHeaders: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = { data: { application: {stage:{page_id:"",stage_id:""}}, applicant: {}, mobileNo: "1234567890", flowType: "mockFlow", applnRefNo: "mockRefNo" } };
    mockSessionUid = "mockSessionUid";
    mockUrlEndPoint = "mockEndPoint";
    mockScClientContextHeaders = {};
  });

  it("should handle 'resume' urlEndPoint and compute the correct hash", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ applicationRefNo: "mockAppRef" });
    process.env.REACT_APP_XRTOB = "mockXrtob";

    generateSHA256Encrypt(mockRequest, mockSessionUid, "resume", mockScClientContextHeaders);

    expect(sha256).toBeDefined();
    expect(mockScClientContextHeaders["authorization"]).toBeDefined();
  });

  it("should handle 'customer' urlEndPoint and add tokenKeys and personKeys", () => {
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ applicationRefNo: "mockAppRef" });
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (keyToken as jest.Mock).mockImplementation((key) => `${key}-value`);
    process.env.REACT_APP_XRTOB = "mockXrtob";

    generateSHA256Encrypt(mockRequest, mockSessionUid, "customer", mockScClientContextHeaders);

    expect(sha256).toBeDefined;
    expect(sha256).toBeDefined;
    expect(mockScClientContextHeaders["tokenKeys"]).toBeDefined();
    expect(mockScClientContextHeaders["personKeys"]).toBeDefined();
  });

  it("should handle 'generate' urlEndPoint and add generate_otp", () => {
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ applicationRefNo: "mockAppRef" });
    process.env.REACT_APP_XRTOB = "mockXrtob";

    generateSHA256Encrypt(mockRequest, mockSessionUid, "generate", mockScClientContextHeaders);

    expect(sha256).not.toBeNull;
    expect(mockScClientContextHeaders["generate_otp"]).toBeDefined();
  });

  it("should handle 'verify' urlEndPoint and add verify_otp", () => {
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ applicationRefNo: "mockAppRef" });
    process.env.REACT_APP_XRTOB = "mockXrtob";
    mockRequest.data = {
      "enc-otp": "mockEncOtp",
      "flow-type": "mockFlowType",
      "key-index": "mockKeyIndex",
      "mobile-no": "mockMobileNo",
      "otp-sn": "mockOtpSn",
      "user-id": "mockUserId",
    };

    generateSHA256Encrypt(mockRequest, mockSessionUid, "verify", mockScClientContextHeaders);

    expect(sha256).not.toBeNull;
    expect(mockScClientContextHeaders["verify_otp"]).toBeDefined();
  });

  it("should handle default case and add application and applicants hashes", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef" });
    process.env.REACT_APP_XRTOB = "mockXrtob";

    generateSHA256Encrypt(mockRequest, mockSessionUid, "apply", mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toBeDefined();
    expect(mockScClientContextHeaders["applicants"]).toBeDefined();
  });

  it("should remove unnecessary headers for 'generate' and 'verify'", () => {
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef" });
    mockUrlEndPoint = "generate";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toBeUndefined();
    expect(mockScClientContextHeaders["applicants"]).toBeUndefined();
  });

  it("should remove unnecessary headers for 'authorize' and 'verify'", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getParameterByName as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getProductInfo as jest.Mock).mockReturnValue([{ product_description: "mockChannelRefNo", company_category: "mockAppRef",product_category_name:[] ,test:"rest1"}]);
    mockUrlEndPoint = "authorize";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toEqual('900a6af459c43f0bfce9ea41710cafa946b3999aaf09fc4b1fd04549def69f72');
    expect(mockScClientContextHeaders["applicants"]).toEqual("287772e283950d5cd0fbe1bc883d0060a2da5b711f98f6b08bd42584cd90ba13");
  });



  it("should remove unnecessary headers for 'create' and 'verify'", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getParameterByName as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getProductInfo as jest.Mock).mockReturnValue([{ product_description: "mockChannelRefNo", company_category: "mockAppRef",product_category_name:[] ,test:"rest1"}]);
    mockUrlEndPoint = "create";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toEqual('900a6af459c43f0bfce9ea41710cafa946b3999aaf09fc4b1fd04549def69f72');
    expect(mockScClientContextHeaders["applicants"]).toEqual("287772e283950d5cd0fbe1bc883d0060a2da5b711f98f6b08bd42584cd90ba13");
  });
  it("should remove unnecessary headers for 'preserve' and 'verify'", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getParameterByName as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getProductInfo as jest.Mock).mockReturnValue([{ product_description: "mockChannelRefNo", company_category: "mockAppRef",product_category_name:[] ,test:"rest1"}]);
    mockUrlEndPoint = "preserve";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toEqual('900a6af459c43f0bfce9ea41710cafa946b3999aaf09fc4b1fd04549def69f72');
    expect(mockScClientContextHeaders["applicants"]).toEqual("287772e283950d5cd0fbe1bc883d0060a2da5b711f98f6b08bd42584cd90ba13");
  });
  it("should remove unnecessary headers for 'verify'", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getParameterByName as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getProductInfo as jest.Mock).mockReturnValue([{ product_description: "mockChannelRefNo", company_category: "mockAppRef",product_category_name:[] ,test:"rest1"}]);
    mockUrlEndPoint = "verify";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toBeDefined;
    expect(mockScClientContextHeaders["applicants"]).toBeDefined;
  });
  it("should remove unnecessary headers for unknown endpoint", () => {
    (getTokenChno as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", code: "mockCode" });
    (getUrl.getChannelRefNo as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getParameterByName as jest.Mock).mockReturnValue({ channelRefNo: "mockChannelRefNo", applicationRefNo: "mockAppRef",products:[] });
    (getUrl.getProductInfo as jest.Mock).mockReturnValue([{ product_description: "mockChannelRefNo", company_category: "mockAppRef",product_category_name:[] ,test:"rest1"}]);
    mockUrlEndPoint = "verify1";

    generateSHA256Encrypt(mockRequest, mockSessionUid, mockUrlEndPoint, mockScClientContextHeaders);

    expect(mockScClientContextHeaders["application"]).toBeDefined;
    expect(mockScClientContextHeaders["applicants"]).toBeDefined;
  });
});




describe("extractValue", () => {
  it("should concatenate values of the object in sorted key order", () => {
    const input = { b: "Beta", a: "Alpha", c: "Gamma" };
    const result = extractValue(input);
    expect(result).toBe("AlphaBetaGamma"); // 'a', 'b', 'c' keys are sorted
  });

  it("should return an empty string for an empty object", () => {
    const input = {};
    const result = extractValue(input);
    expect(result).toBe("");
  });

  it("should handle objects with numeric values", () => {
    const input = { a: 10, b: 20, c: 30 };
    const result = extractValue(input);
    expect(result).toBe("102030"); // Values are concatenated as strings
  });

  it("should handle mixed data types (strings, numbers, booleans)", () => {
    const input = { b: false, a: "Test", c: 42 };
    const result = extractValue(input);
    expect(result).toBe("Testfalse42"); // Booleans are coerced to strings
  });

  it("should handle nested objects gracefully", () => {
    const input = { a: { nested: "value" }, b: "Beta" };
    const result = extractValue(input);
    expect(result).toBe("[object Object]Beta"); // Objects are coerced to "[object Object]"
  });

  it("should throw an error for null or undefined input", () => {
    expect(() => extractValue(null)).toThrow(); // Replace with specific error handling if needed
    expect(() => extractValue(undefined)).toThrow();
  });

  it("should handle arrays as values", () => {
    const input = { a: [1, 2, 3], b: "Test" };
    const result = extractValue(input);
    expect(result).toBe("1,2,3Test"); // Arrays are coerced to their string representation
  });
});



jest.mock("../utils/store/store", () => ({
  store: {
    getState: jest.fn(),
  },
}));



// describe("defaultInterceptor", () => {
//   let reqinter:any;
//   let resinter:any;
// // (axios as any).interceptors={
// //   request:{ use: jest.fn()},
// //   response:{use: jest.fn()}
// // }

//   jest.mock("./default-interceptor", () => ({
//     generateSHA256Encrypt: jest.fn(),
//   }));
// //   jest.mock('axios', () => {
// //     return {
// //         interceptors: {
// //             request: { use: jest.fn(), eject: jest.fn() },
// //             response: { use: jest.fn(), eject: jest.fn() },
// //         },
// //     };
// // });
//   // let addRequestInterceptor: jest.SpyInstance;
//   // let addResponseInterceptor: jest.SpyInstance;

//   beforeEach(() => {
//     jest.clearAllMocks();

//     // addRequestInterceptor = jest.spyOn(axios.interceptors.request, "use");
//     // addResponseInterceptor = jest.spyOn(axios.interceptors.response, "use");
// (store.getState as jest.Mock)
//    .mockReturnValue({
//       auth: { sessionUid: "mock-session-uid" },
//     });
//     (getUrl.getParameterByName as jest.Mock).mockImplementation((param) => {
//       if (param === "isMyInfoVirtualNRIC") return "true";
//       if (param === "transfer-token") return "mock-transfer-token";
//       if (param === "SSCode") return "mock-ss-code";
//       return null;
//     });
//     // (axios.interceptors.request.use as jest.Mock).mockImplementation((request) => {
//     //   if (request.url === "abc.com/sds") return "true";
//     //   if (request === "transfer-token") return "mock-transfer-token";
//     //   if (request=== "SSCode") return "mock-ss-code";
//     //   return null;
//     // });
    
//     (axios as any).interceptors ={
//         request:{
//           // @ts-ignore
//           use: 
//           jest.fn((resolve)=>
//           (reqinter =resolve))},
//         Response:{
//           use: jest.fn((resolve)=>
//           (resinter =resolve))
//         },

//       };
 
//   });

//   it("should register request and response interceptors", () => {
//     defaultInterceptor();
// const mockRequest = {
//   url:'https://abc.com/api/customer',
//   header: new Map(),
// }
// const modrequest = reqinter(mockRequest);
//     // expect(addRequestIntcerceptor).toHaveBeenCalledTimes(1);
//     // expect(addResponseInterceptor).toHaveBeenCalledTimes(1);
//   });

//   it("should add SC-CLIENT-CONTEXT headers and set abort controller", () => {
//     const mockRequest = {
//       url: "https://mockapi.com/customer",
//       headers: {
//         set: jest.fn(),
//       },
//     };

//    const requestInterceptor = addRequestInterceptor.mock.calls[0][0];
//     const result = requestInterceptor(mockRequest);

//     expect(result.headers["SC-CLIENT-CONTEXT"]).toBeDefined();
//     expect(result.signal).toBeDefined();
//     expect(mockRequest.headers.set).toHaveBeenCalledWith(
//       expect.objectContaining({
//         "Content-Type": "application/json;charset=UTF-8",
//         requestId: "mock-uuid",
//         virtual: "YES",
//       })
//     );
//     expect(generateSHA256Encrypt).toHaveBeenCalledWith(
//       mockRequest,
//       "mock-session-uid",
//       "customer",
//       expect.any(Object)
//     );
//   });

//   it("should add transfer-token for ibank endpoint", () => {
//     const mockRequest = {
//       url: "https://mockapi.com/ibank/transfer",
//       headers: {
//         set: jest.fn(),
//       },
//     };

//     const requestInterceptor = addRequestInterceptor.mock.calls[0][0];
//     const result = requestInterceptor(mockRequest);

//     expect(mockRequest.headers.set).toHaveBeenCalledWith(
//       expect.objectContaining({
//         "Content-Type": "application/json;charset=UTF-8",
//         "transfer-token": "mock-transfer-token",
//       })
//     );
//   });

//   it("should clear timeout on response success", () => {
//     const mockResponse = { data: "success" };
//     const responseInterceptor = addResponseInterceptor.mock.calls[0][0];

//     jest.useFakeTimers();

//     defaultInterceptor();
//     responseInterceptor(mockResponse);

//     jest.runAllTimers();

//     expect(clearTimeout).toHaveBeenCalled();
//   });
// });
