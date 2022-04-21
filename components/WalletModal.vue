<template>
    <div class="backdrop" :class="{ active: active }" @click="active = false" >
        <img class="close" :src="closeIcon" @click="active = false">
        <div class="modal" @click.stop>
            <h1>Select Wallet</h1>
            <h2>To access the merch drop, please connect your wallet.</h2>
            <span class="btn metamask" @click="mmConnect()">Metamask <img :src="mmIcon"></span>
            <span class="btn wallet-connect" @click="walletConnect()">Wallet Connect <img :src="wcIcon"></span>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapActions } from 'vuex'

    import wcIcon from "@/assets/img/wc-icon.svg";
    import mmIcon from "@/assets/img/mm-icon.svg";
    import closeIcon from "@/assets/img/close.svg";

    export default {
        data:  () => {
            return {
                wcIcon,
                mmIcon,
                closeIcon,
                active: false,
                redirect: '/mint/merch'
            }
        },
        created() {
            this.$nuxt.$on('connect', (redirect) => {
                this.redirect = redirect || '/'
                this.active = true
            })
        },
        methods: {
            ...mapMutations(['setWallet']),
            ...mapActions(['setProvider']),
            async mmConnect() {

                try {
                    const { ethereum } = window;

                    if (!ethereum) {
                        window.location = 'https://metamask.app.link/dapp/goodmonkeyz.art';
                    }
                    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
                    // const chainId = await ethereum.request({ method: 'eth_chainId' });

                    if (accounts.length !== 0) {
                        this.login(accounts[0], 'metamask');
                        this.$newMMprovider();
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            async walletConnect() {
                const web3 = this.$newWCprovider();
                console.log(web3)
                if (web3.provider.accounts.length === 0) {
                    await web3.provider.enable()
                }
                this.login(web3.provider.accounts[0], 'wallet-connect' );
            },
            login(WalletAddress, provider){
                this.setWallet(WalletAddress);
                this.setProvider(provider);
                this.active = false
                this.$router.push(this.redirect)
                this.$nuxt.$emit('web3-active');
            }
        }
    }
</script>

<style scoped>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        backdrop-filter: blur(8px);
        background: rgba(0,0,0,0.6);
        z-index: 100;
        display: flex;
        opacity: 0;
        pointer-events: none;
        will-change: opacity;
        transition: opacity 200ms ease-in;
    }

    .active {
        opacity: 1;
        pointer-events: initial;
    }
    .close {
        position: absolute;
        top: 2rem;
        right: 2rem;
        height: 2rem;
        width: 2rem;
        cursor: pointer;
    }
    h1 {
        margin-bottom: 0;
    }
    h2 {
        font-weight: 300;
        font-family: Helvetica, sans-serif;
        color: #555;
        font-size: 0.75rem;
        margin-bottom: 3rem;
    }
    .modal {
        padding: 2rem;
        background: #fff;
        margin: auto;
        border-radius: 1rem;
        text-align: center;
        max-width: 90%;
    }

    .btn {
        margin: 1rem 0;
        display: block;
        padding: 1rem 14rem 1rem 1rem;
        border-radius: 1rem;
        cursor: pointer;
        color: #fff;
        text-align: left;
        font-size: 0.75rem;
        position: relative;
    }
    .btn img {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        height: 2rem;
        width: 2rem;
    }
    .metamask {
        background: linear-gradient(91.63deg, #EF682C -3.26%, #FFF59D 102.88%);
    }
    .wallet-connect {
        white-space: nowrap;
        background: linear-gradient(91.51deg, #AB57FF 0%, #0025F4 100%);
    }
</style>