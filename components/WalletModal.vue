<template>
    <div class="backdrop" :class="{ active: active }">
        <img class="close" :src="closeIcon" @click="$emit('close-modal')">
        <div class="modal">
            <h1>Select Wallet</h1>
            <h2>To access the merch drop, please connect your wallet.</h2>
            <span class="btn metamask" @click="$emit('connect', 'metamask')">Metamask <img :src="mmIcon"></span>
            <span class="btn wallet-connect" @click="$emit('connect', 'wallet-connect')">Wallet Connect <img :src="wcIcon"></span>
        </div>
    </div>
</template>

<script>
    import wcIcon from "@/assets/img/wc-icon.svg";
    import mmIcon from "@/assets/img/mm-icon.svg";
    import closeIcon from "@/assets/img/close.svg";

    export default {
        props: ['active'],
        data:  () => {
            return {
                wcIcon,
                mmIcon,
                closeIcon,
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
        z-index: 2;
        display: flex;
        opacity: 0;
        pointer-events: none;
        will-change: opacity;
    }

    .active {
        opacity: 1;
        pointer-events: initial;
        transition: opacity 200ms ease-in;
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
        background: linear-gradient(91.51deg, #AB57FF 0%, #0025F4 100%);
    }
</style>