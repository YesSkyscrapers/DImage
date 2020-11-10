const storage = {};

const addEventListener = (event, callback) => {
    if (storage[event]) {
        storage[event].push(callback)
    } else {
        storage[event] = [callback];
    }
}

const removeEventListener = (event, callback) => {
    if (storage[event] && storage[event].length > 0) {
        storage[event] = storage[event].filter(callbackInStorage => callbackInStorage != callback);
    }
}

const callEvent = (event, params) => {
    if (storage[event]) {
        storage[event].forEach(callback => {
            callback(params)
        })
    } else {
        console.log('event not registered')
    }
}

const getEventListenersCount = (event) => {
    return storage[event] ? storage[event].length : 0;
}

export default { addEventListener, removeEventListener, callEvent, getEventListenersCount }