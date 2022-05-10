<template>
    <main>
        <Nuxt />
        <WalletModal/>
        <InviteModal/>
    </main>
</template>

<script>
    import { mapMutations } from 'vuex'
    import WalletModal from '@/components/WalletModal.vue';
    import InviteModal from '@/components/InviteModal.vue';

    export default {
        components: {
            WalletModal,
            InviteModal
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
                const WC = JSON.parse(localStorage.getItem('walletconnect'));
                
                if (WC && WC.connected) {
                    console.info('connected to WEB3 via wallet-connect')
                    const web3 = this.$newWCprovider();
                    if (web3.provider.accounts.length === 0) {
                        await web3.provider.enable()
                    }   
                    this.setWallet(web3.provider.accounts[0]);
                    this.$nuxt.$emit('web3-active');
                    return;
                }

                try {
                    const { ethereum } = window;

                    if (!ethereum) {
                        return;
                    }

                    const accounts = await ethereum.request({ method: "eth_accounts" });
                    if (accounts.length !== 0) {
                        console.info('connected to WEB3 via metamask')
                        this.setWallet(accounts[0]);
                        this.$newMMprovider();
                        this.$nuxt.$emit('web3-active');
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