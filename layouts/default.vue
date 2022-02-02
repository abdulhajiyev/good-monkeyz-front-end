<template>
    <main :style="`backgroundImage: url(${bg})`">
        <img class="logo" :src="union" >
        <img class="bg-overlay" :src="bgOverlay" >
        <span class="wallet">
            <img :src="walletText" >
        </span>
        <img class="twitter" :src="twitter" >
        <Nuxt />
    </main>
</template>


<script>
    import bg from "@/assets/img/bg.jpg"
    import bgOverlay from "@/assets/img/gm-text.svg"
    import union from "@/assets/img/union.svg"
    import walletText from "@/assets/img/wallet.svg"
    import twitter from "@/assets/img/twitter.svg"
    
    export default {
        data:  ()  =>{
            return {
                bg,
                bgOverlay,
                union,
                walletText,
                twitter,
            }
        }
    }
</script>

<style>
    html {
        box-sizing: border-box;
    }
    body {
        margin: 0;
        padding: 0;
    }
    main {
       height: 100%;
       min-height: 100vh;
       width: 100%;
       background-size: cover;
       display: flex;
       justify-content: center;
    }
    .bg-overlay {
        mix-blend-mode: lighten;
        max-width: 100%;
        max-height: 95vh;
        padding-top: 5vh;
    }
    .logo {
        position: absolute;
        top: 3rem;
        left: 3rem;
        transform: translateY(-25%);
    }

    .wallet {
        position: absolute;
        top: 3rem;
        right: 3rem;
        background: #fff;
        padding: 1.1rem;
        border-radius: 1rem;
        transform: translate(1rem, -1.25rem);
    }
    .twitter {
        position: absolute;
        bottom: 2rem;
        width: 3rem;
        left: 50%;
        transform: translateX(-50%);
    }
</style>