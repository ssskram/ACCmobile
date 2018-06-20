import { Reducer } from 'redux';

export interface MessageState {
    messages: string
}

interface SuccessMessageAction { type: 'FORM_SUCCESS' }
interface SurveyMessageAction { type: 'SURVEY_SUBMITTED' }
interface ClearMessageAction { type: 'CLEAR' }

type KnownAction = SuccessMessageAction | ClearMessageAction | SurveyMessageAction;

export const actionCreators = {
    success: () => <SuccessMessageAction>{ type: 'FORM_SUCCESS' },
    surveySubmitted: () => <SurveyMessageAction>{ type: 'SURVEY_SUBMITTED' },
    clear: () => <ClearMessageAction>{ type: 'CLEAR' },
};

export const reducer: Reducer<MessageState> = (state: MessageState, action: KnownAction) => {
    switch (action.type) {
        case 'FORM_SUCCESS':
            return { messages: "Success! We'll be seeing you soon." };
        case 'SURVEY_SUBMITTED':
            return { messages: "Thanks again!" };
        case 'CLEAR':
            return { messages: "" }
        default:
            const exhaustiveCheck: never = action;
    }
    return state || { messages: "Welcome to the new site!<br/><a href='/Survey'>Let us know what you think</a>" }
};
