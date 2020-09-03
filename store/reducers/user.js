import {
    SET_INFECTED,
    SET_UNINFECTED,
    SET_EXPOSED,
    ADD_SCANNED_DEVICE,
    CLEAR_SCANNED_DEVICES
} from '../actions/user';

const initialState = {
    userEmail: "",
    accessToken: "",
    refreshToken: "",
    infectionStatus: "",
    scannedDevices: []
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
        case ADD_SCANNED_DEVICE:
            const currentScannedDevices = state.scannedDevices;
            const alreadyScannedIndex = state.scannedDevices.findIndex(device => device.id === action.device.id)
            //console.log(currentScannedDevices[alreadyScannedIndex].id + " " + action.device.id)
			if (alreadyScannedIndex >= 0) { // splice out event to unsave
				return state;
			} else {
                return {
                    ...state,
                    scannedDevices: currentScannedDevices.concat(action.device)
                }
            }
        case CLEAR_SCANNED_DEVICES:
            return {
                ...state,
                scannedDevices: []
            }
        default:
            return state;
    }
};
