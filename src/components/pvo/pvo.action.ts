import {ADD_PVO} from "./pvo.constant";

const addPvoAction = (data: any) => ({
    type: ADD_PVO,
    payload: data
});

export function addPvo(pvo: any) {
    return (dispatch: any) => {
        dispatch(addPvoAction(pvo));
    }
}
