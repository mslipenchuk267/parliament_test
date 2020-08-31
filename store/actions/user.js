export const SET_INFECTED = 'SET_INFECTED';
export const SET_UNINFECTED = 'SET_UNINFECTED';
export const SET_EXPOSED = 'SET_EXPOSED';

export const setInfected = () => {
    return { type: SET_INFECTED };
};

export const setUninfected = () => {
    return { type: SET_UNINFECTED };
};

export const setExposed = () => {
    return { type: SET_EXPOSED };
};