import {combineReducers} from 'redux';
import tauBase from "./pages/tau-main/tau-main.reducer";
import svknReducer from "./components/svkn/svkn.reducer";
import pvoReducer from "./components/pvo/pvo.reducer";

export default combineReducers({
    tauBase,
    svknReducer,
    pvoReducer
});
