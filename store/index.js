

export const state = () => ({
    wallet: '',
    provider: '',
})

export const getters = {
    getWallet(state) {
        return state.wallet;
    },
    getProvider(state) {
        return state.provider;
    }
}

// actions - 
export const actions = {
}
// mutations -
export const mutations = {
    setWallet(state, wallet) {
        state.wallet = wallet;
    },
    setProvider(state, provider) {
        state.provider = provider;
    }
}