import {ADD_PVO} from "./pvo.constant";

const initialState = {
    pvo: [
        {
            accuracyIndex: '',
            ammunition: '',
            maxTimeService: '',
            minTimeService: '',
            numberMissiles: '',
            type: ''
        },
        {
            id: "_asdas",
            accuracyIndex: '0.85',
            ammunition: '5',
            maxTimeService: '3',
            minTimeService: '2',
            numberMissiles: 'one',
            type: 'chanel pvo 1'
        }
    ],
};

export default function pvoReducer(state = initialState, action: any) {
    switch (action.type) {
        case (ADD_PVO): {
            return {
                ...state,
                pvo: [...action.payload]
            }
        }
        default:
            return state;
    }
}
