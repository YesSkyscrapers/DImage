//Не забывать обработать сценарий, когда ранее полей нет в стейте, ибо у окончательных пользователей сохраняется стейт при обновлении
const initialState = {
}

const secureReducer = (secure = initialState, action) => {
    switch (action.type) {
        default:
            return secure;
    }
}

export default secureReducer