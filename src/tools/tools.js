import React from 'react'

const getWaitPromise = timeout => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, timeout)
    })
}

export { getWaitPromise }