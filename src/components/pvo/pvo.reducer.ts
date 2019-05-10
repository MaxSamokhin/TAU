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
        // {
        //     id: "_asdas",
        //     accuracyIndex: '5',
        //     ammunition: '5',
        //     maxTimeService: '8',
        //     minTimeService: '5',
        //     numberMissiles: 'one',
        //     type: 'test1'
        // },
        // {
        //     id: "_qweqwe",
        //     accuracyIndex: '5',
        //     ammunition: '5',
        //     maxTimeService: '6',
        //     minTimeService: '5',
        //     numberMissiles: 'one',
        //     type: 'test2'
        // }
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
