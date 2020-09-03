export const SET_INFECTED = 'SET_INFECTED';
export const SET_UNINFECTED = 'SET_UNINFECTED';
export const SET_EXPOSED = 'SET_EXPOSED';
export const ADD_SCANNED_DEVICE = 'ADD_SCANNED_DEVICE';
export const CLEAR_SCANNED_DEVICES = 'CLEAR_SCANNED_DEVICES';

export const setInfected = () => {
    return { type: SET_INFECTED };
};

export const setUninfected = () => {
    return { type: SET_UNINFECTED };
};

export const setExposed = () => {
    return { type: SET_EXPOSED };
};

export const addScannedDevice = (device) => {
    return {type: ADD_SCANNED_DEVICE, device: device}
};

export const clearScannedDevices = () => {
    return { type: CLEAR_SCANNED_DEVICES };
}