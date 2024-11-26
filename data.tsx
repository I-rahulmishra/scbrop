<Footer
              otherMyinfo={otherMyinfo}
              backHandler={backHandler}
              validateNxt={isRequiredValid}
              journeyType={applicationJourney}
            />

const backHandler = async (formUpdateState: boolean | undefined | null) => {
    dispatch(stagesAction.setLastStageId(stageSelector[0].stageId));
    trackEvents.triggerAdobeEvent("ctaClick", "Back");
    dispatch(stagesAction.resetNewAndOldFields());
    if (valueSelector.backNavigation.formChange !== false) {
      dispatch(
        ValueUpdateAction.getChangeUpdate({
          id: stageSelector[0].stageId!,
          changes: true,
        })
      );
    }
    const stageUpdate = getStageName(
      stageSelector[0].stageId!,
      applicationJourney
    );
    //Adding lov call incase of resume for previous stages, back navigation
    if (resumeSelector) {
      dispatch(
        getLovMissing(
          stageUpdate,
          stageSelector[0].stageInfo.fieldmetadata.data.stages,
          lovSelector
        )
      );
    }
    setFieldsForBackStage(stageUpdate, formUpdateState);
    //setDocBack(formUpdateState !== false ? true : false);
    dispatch(stagesAction.updateLastStageInput(stageSelector[0].stageId));
    dispatch(fieldErrorAction.getFieldError(null));
  };

