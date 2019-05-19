import {ADD_SVKN} from "./svkn.constant";

const initialState = {
    svkn: [
        {
            airImpactIntensity: "",
            approachTime: "",
            dodgeIndex: "",
            impactCharacteristic: "",
            select: "duration",
            type: ""
        },
        {
            id: "_qweqwe",
            airImpactIntensity: "1",
            approachTime: "7",
            dodgeIndex: "0.95",
            impactCharacteristic: "6",
            select: "count",
            type: "svkn 1"
        }
    ],
};

export default function svknReducer(state = initialState, action: any) {
    switch (action.type) {
        case (ADD_SVKN): {
            return {
                ...state,
                svkn: [...action.payload],
            }
        }

        default:
            return state;
    }
}
