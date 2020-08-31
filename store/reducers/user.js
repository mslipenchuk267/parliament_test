import {
    SET_INFECTED,
    SET_UNINFECTED,
    SET_EXPOSED
} from '../actions/user';

const initialState = {
    userEmail: "",
    accessToken: "",
    refreshToken: "",
    infectionStatus: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_INFECTED:
            return {
                ...state,
                infectionStatus: "Infected"
            };
        case SET_UNINFECTED:
            return {
                ...state,
                infectionStatus: "Uninfected"
            };
        case SET_EXPOSED:
            return {
                ...state,
                infectionStatus: "Exposed"
            };
        default:
            return state;
    }
};
