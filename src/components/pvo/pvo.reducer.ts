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
            accuracyIndex: '1.1',
            ammunition: '4',
            maxTimeService: '5',
            minTimeService: '1',
            numberMissiles: 'two',
            type: 'chanel pvo 1'
        },
        {
            id: "_asqwedas",
            accuracyIndex: '1.5',
            ammunition: '4',
            maxTimeService: '7',
            minTimeService: '5',
            numberMissiles: 'one',
            type: 'chanel pvo 2'
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
