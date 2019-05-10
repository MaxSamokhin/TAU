const tauTest = (data: any) => ({
    type: 'TOP',
    payload: data
});

export function getResultForTau() {
    return (dispatch: any) => {
        dispatch(tauTest('hi'));
    }
}
