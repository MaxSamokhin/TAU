const initialState = {
    tau: null,
};

export default function tauBase(state = initialState, action: any) {
    switch (action.type) {
        case 'TOP':
            return {
                ...state,
                tau: {hi: 'hi'},
            };
        default:
            return state;
    }
}
