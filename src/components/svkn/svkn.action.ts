import {ADD_SVKN} from "./svkn.constant";

const addSvknAction = (data: any) => ({
    type: ADD_SVKN,
    payload: data
});

export function addSvkn(svkn: any) {
    return (dispatch: any) => {
        dispatch(addSvknAction(svkn));
    }
}
