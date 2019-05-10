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
        }
        // {
        //     id: "_asdas",
        //     airImpactIntensity: "12",
        //     approachTime: "12",
        //     dodgeIndex: "12",
        //     impactCharacteristic: "23",
        //     select: "duration",
        //     type: "тип2"
        // },
        // {
        //     id: "_qweqwe",
        //     airImpactIntensity: "12",
        //     approachTime: "12",
        //     dodgeIndex: "12",
        //     impactCharacteristic: "23",
        //     select: "duration",
        //     type: "тип1"
        // },
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
