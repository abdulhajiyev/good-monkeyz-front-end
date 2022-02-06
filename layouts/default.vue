<template>
 <!-- :style="`backgroundImage: url(${bg})`" -->
    <main>
        <img class="logo" :src="union" >
        
        <span class="wallet">
            <img :src="walletText" >
        </span>
        <div class="fade"></div>
        <Nuxt />
    </main>
</template>


<script>
    import bg from "@/assets/img/bg.jpg"
    import union from "@/assets/img/union.svg"
    import walletText from "@/assets/img/wallet.svg"
    
    export default {
        data:  ()  =>{
            return {
                bg,
                union,
                walletText,
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
       background: black;
    }

    .logo {
        position: absolute;
        top: 5rem;
        left: 2.5rem;
        transform: translateY(-25%);
    }

    .wallet {
        position: absolute;
        top: 5rem;
        right: 3rem;
        background: #fff;
        padding: 1.1rem;
        border-radius: 1rem;
        transform: translate(1rem, -1.25rem);
    }

    .fade {
        z-index: 1;
        position: absolute;
        top: 0;
        left:0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, rgba(255,0,255,1) 0%, rgba(0,255,255,1) 100%);
        filter: hue-rotate(0deg);
        animation: fade 6s alternate infinite;
        mix-blend-mode: multiply;
        opacity: 0.25;
    }

    @keyframes fade {
        from {
            filter: hue-rotate(0deg) brightness(70%);
            }
        to {
            filter: hue-rotate(360deg)  brightness(130%);
            }
    }

</style>