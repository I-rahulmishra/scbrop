import React, { useState, useRef } from "react";
import "./model.scss";
import { KeyWithAnyModel } from "../../../utils/model/common-model";
import modelInfo from "../../../assets/_json/model.json";
import Pdf from "../pdf/pdf";
import { CONSTANTS } from "../../../utils/common/constants";
import { getUrl } from "../../../utils/common/change.utils";
import trackEvents from "../../../services/track-events";


const Model = (props: KeyWithAnyModel) => {
  const modelsData: KeyWithAnyModel = modelInfo;
  const modelData = modelsData.find((model: any) => model.name === props.name);
  const ref = useRef<HTMLDivElement>(null);
  const [showbutton, setShowButton] = useState(false)
  const language = getUrl.getLanguageInfo("lang")
  const application_reference = getUrl.getChannelRefNo()?.channelRefNo
  console.log(modelData)
  const handlebuttonClick = (index: number) => {
    if (index === 0 && !props.callBackMethod) {
      window.location.href = `${process.env.REACT_APP_HOME_PAGE_URL}`;
    } else if (props.handlebuttonClick) {
      props.handlebuttonClick();
    }
  }

  const scrollbtm = (e: React.MouseEvent<any>) => {
    e.preventDefault()
    ref.current?.scrollIntoView({ behavior: 'smooth', block: "end", inline: "nearest" })
    ref.current?.scroll(0, ref.current?.scrollTop + 250)
    if (ref.current?.scrollTop === 0) {
      setShowButton(true);
    } else {
      setShowButton(false)
    }
  }

  const mouseScrollbtm = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    const boxScrollHeight = e.currentTarget.scrollHeight * 4 / 5;
    if (currentScrollTop >= boxScrollHeight) {
      setShowButton(true);
    } else {
      setShowButton(false)
    }
  }
  const downloadPDF = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    trackEvents.triggerAdobeEvent("ctaClick", "Download PDF");
    event.preventDefault()
    fetch(props?.data?.target ? props?.data?.target.title : props?.data?.title).then(response => {
      response.blob().then(blob => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = props?.data?.target ? props?.data?.target.innerText : props?.data.slot;
        alink.click();
      })
    })
  }
  const closepdf = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (props?.data?.target) {
      props.data.target.checked = false;
      props?.closepdf(false, props?.data);
      event.stopPropagation();
    } else {
      props?.closepdf(false, props?.data);
      event.stopPropagation();
    }

  }
  const agreePDF = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (props?.data.target) {
      props.data.target.checked = true;
      props.agreePDF(false, props?.data);
      event.stopPropagation();
    } else {
      props.agreePDF(false, props?.data);
      event.stopPropagation();
    }

  }

  const closeSuccessPopup = () => {
    window.location.href = `${process.env.REACT_APP_HOME_PAGE_URL}`;
  }

  return (
    <>
      {(modelData && props.name !== 'saveSuccess') && (
        <div className="popup">
          <div className="popup-container1">
            <div className="waring-icon">
              <svg
                width="51"
                height="50"
                viewBox="0 0 51 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M25.5 43.75C35.8553 43.75 44.25 35.3553 44.25 25C44.25 14.6447 35.8553 6.25 25.5 6.25C15.1447 6.25 6.75 14.6447 6.75 25C6.75 35.3553 15.1447 43.75 25.5 43.75Z"
                  stroke="#2772C7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25.5 15.625V26.5625"
                  stroke="#2772C7"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25.5 35.9375C26.7944 35.9375 27.8438 34.8882 27.8438 33.5938C27.8438 32.2993 26.7944 31.25 25.5 31.25C24.2056 31.25 23.1562 32.2993 23.1562 33.5938C23.1562 34.8882 24.2056 35.9375 25.5 35.9375Z"
                  fill="#2772C7"
                />
              </svg>
            </div>
            <div className="popup-info">
              {modelData.header_content && (
                <div className="popup-info__head">
                  {language === CONSTANTS.LANG_EN ? modelData.header_content : language === CONSTANTS.LANG_CN ? modelData.header_content_CN : modelData.header_content_HK}
                </div>
              )}

              <div className="popup-info__desc">
                {(language === CONSTANTS.LANG_EN ? modelData.body_content : language === CONSTANTS.LANG_CN ? modelData.body_content_CN : modelData.body_content_HK).map(
                  (content: string, index: number) => {
                    return <p key={`${content}${index}`}>{content}</p>;
                  }
                )}
                {(modelData.name=== "idleTimeOut" && props.name === 'idleTimeOut') &&
                  <p 
                    role="button"
                    data-testid="btn-click"
                    className="btn"
                    onClick={()=>props.closePopup()}
                  >
                    {modelData.buttons[0]}
                  </p>
                }
                {props.name === 'empty_check' ?
                  <>
                    <p className="btn" onClick={() => props.handlebuttonClick()}>{language === CONSTANTS.LANG_EN ?
                     modelData.buttons[0] : language === CONSTANTS.LANG_CN ? modelData.buttons_CN[0] : modelData.buttons_HK[0]}</p>
                    <p className="btn" onClick={() => props.handleChooseClick()}>{language === CONSTANTS.LANG_EN ?
                     modelData.buttons[1] : language === CONSTANTS.LANG_CN ? modelData.buttons_CN[1] : modelData.buttons_HK[1]}</p>
                  </>
                  : <>{(modelData.buttons && props.name !== 'idleTimeOut') &&
                    (language === CONSTANTS.LANG_EN ? modelData.buttons : language === CONSTANTS.LANG_CN ? modelData.buttons_CN : modelData.buttons_HK).map((button: string, index: number) => {
                      return (
                        <p 
                         role="button"
                         data-testid="btn-click"
                          className="btn"
                          onClick={() => handlebuttonClick(index)}
                          key={`${button}${index}`}
                        >
                          {button}
                        </p>
                      );
                    })}</>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {(modelData && props.name === 'saveSuccess') && (
        <div className="popup">
          <div className="popup-container1 saveSuccessPopup">
            <div className="popup-thankYouIcon"></div>
            <div className="popup-info saveSuccessPopupInfo">
              {modelData.header_content && (
                <div className="popup-info__head saveSuccessPopupHead">
                  {language === CONSTANTS.LANG_EN ? modelData.header_content : language === CONSTANTS.LANG_CN ? modelData.header_content_CN : modelData.header_content_HK}
                </div>
              )}

              <button type="button" data-testid="successClose-btn" className="close successClose" onClick={closeSuccessPopup}>
                {/* <span aria-hidden="true">&times;</span> */}
              </button>

              <div className="popup-info__desc">
                {modelData.body_content_1 &&
                  <p >{language === CONSTANTS.LANG_EN ? modelData.body_content_1 : language === CONSTANTS.LANG_CN ? modelData.body_content_1_CN : modelData.body_content_1_HK}</p>
                }
                {modelData.body_content_2 &&
                  <p className="body_content_2">{language === CONSTANTS.LANG_EN ? modelData.body_content_2 : language === CONSTANTS.LANG_CN ? modelData.body_content_2_CN : modelData.body_content_2_HK} {application_reference}</p>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {(modelData === '' || modelData === undefined) && (
        props.name && props.name === 'info_tooltips' ?
          <div className="popup">
            <div className="popup-container1 info__tooltips">
              <div className="popup-info">
                <div className="popup-info__desc__top">
                  <div className="popup-info__desc">
                    {props.body_content &&
                      <p >{props.body_content}</p>
                    }
                  </div>
                </div>
                <div className="popup-info__footer">
                  {props.btnTxt && <p
                    className="btn info_tooltip_btn"
                    onClick={() => props.closePopup()}
                  >
                    {props.btnTxt}
                  </p>
                  }
                </div>
              </div>
            </div>
          </div>
          :
          <div className="popup-declare">
            <div className="popup-container1-declare">
              <div className="popup-info-declare">
                {(props?.data?.target ? props?.data?.target?.name : props?.data?.textContent) && (
                  <div className="popup-info__head-declare">
                    <h5>{props.stageId !== 'rp' && props?.data?.target ? props.data.target.name : props?.data?.textContent}</h5>
                    <button data-testid="close-btn" type="button" className="close pdfClose" onClick={(e) => closepdf(e)}>
                      {/* <span aria-hidden="true">&times;</span> */}
                    </button>
                  </div>
                )}
                <div className="popup-info__desc declaration_popup-info__desc" onScroll={(e) => mouseScrollbtm(e)} id="pdfViewer" ref={ref}>
                  <Pdf fileName={props?.data?.target ? props?.data?.target?.title : props?.data?.title} />
                </div>
                <div className="popup-info__footer-declare">
                  <div className="pdf-accept confirm-btn">
                    <button role="button" data-testid="pdf-download-btn1" onClick={(e) => downloadPDF(e)} id="pdf-download-btn1">{language === CONSTANTS.LANG_EN ? 'Download PDF' : language === CONSTANTS.LANG_CN ? 'PDF下载' : 'PDF下載'}</button>
                  </div>
                  {!showbutton &&
                    <div className="pdf-scroll" id="scrollbutton">
                      <button data-testid="pdf-scroll-btn1" id="pdf-scroll-btn1" onClick={(e) => scrollbtm(e)}>{language === CONSTANTS.LANG_EN ? 'Scroll' : language === CONSTANTS.LANG_CN ? '继续往下滑' : '繼續往下滑'}</button>
                    </div>
                  }
                  {showbutton &&
                    <div className="pdf-accept confirm-btn" id="navigationBtn">
                      <button id="adreencnt" onClick={(e) => agreePDF(e)}>{language === CONSTANTS.LANG_EN ? 'Agree' : language === CONSTANTS.LANG_CN ? '同意' : '同意'}</button>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
      )}
    </>
  );

};

export default Model;
