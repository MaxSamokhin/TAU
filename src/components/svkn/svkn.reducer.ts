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
            airImpactIntensity: "10",
            approachTime: "20",
            dodgeIndex: "1.4",
            impactCharacteristic: "110",
            select: "count",
            type: "svkn 2"
        },
        {
            id: "_qwqeqwe",
            airImpactIntensity: "10",
            approachTime: "20",
            dodgeIndex: "1.4",
            impactCharacteristic: "110",
            select: "count",
            type: "svkn 1"
        },
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
