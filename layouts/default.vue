<template>
    <main>
        <Nuxt />
        <WalletModal/>
    </main>
</template>

<script>
    import { mapMutations } from 'vuex'
    import WalletModal from '@/components/WalletModal.vue';

    export default {
        components: {
            WalletModal,
        },
        data: () => {
            return {}
        },
        created() {
            this.checkWallet();
        },
        methods: {
            ...mapMutations(['setWallet']),
            async checkWallet() {
                try {
                    const { ethereum } = window;
                    if (!ethereum) {
                        return;
                    }

                    const accounts = await ethereum.request({ method: "eth_accounts" });
                    if (accounts.length !== 0) {
                        this.setWallet(accounts[0]);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
        }
    }
</script>

<style>


</style>