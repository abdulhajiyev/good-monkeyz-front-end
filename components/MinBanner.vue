<template>
    <div class="navbar">
        <div class="banner">
         <img class="gm-white" :src="gmWhite" >
         
            <div v-if="!wallet" class="social">
                <a href="https://twitter.com/GoodMonkeyz"><img class="twitter" :src="twitter" ></a>
                <a href="https://www.instagram.com/goodmonkeyz/"><img class="insta" :src="insta" ></a>
                <a href="https://discord.gg/Q6eu62S5sP"><img class="discord" :src="discord"></a>
            </div>
            <nuxt-link v-else to="/dashboard">
                <div class="user">
                <span>{{wallet.substring(0,4)+'..'+wallet.substr(-4)}}</span>
                <img class="avatar" :src="user">
                </div>
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    import logoBlack from "@/assets/img/gm-black.svg"
    import user from "@/assets/img/user.png"

    import twitter from "@/assets/img/twitter.svg"
    import discord from "@/assets/img/discord.svg"
    import insta from "@/assets/img/insta.svg"
    import gmWhite from "@/assets/img/gm-white.svg"

    export default {
        props: ['account'],
        data:  () => {
            return {
                logoBlack,
                user,
                twitter,
                discord,
                insta,
                gmWhite,
            }
        },
        computed: mapState(['wallet']),
    }
</script>

<style scoped>
    .banner {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        z-index: 1;
    }
    .banner a {
        text-decoration: none;
    }
    .gm-white {
    max-width: 6rem;
    }

    .social {
    display: flex;
    justify-content: center;
    align-items: center;
    }


    .twitter,
    .discord,
    .insta {
        width: 3rem;
        margin: 0 0.25rem;
        /* cursor: pointer; */
    }
    .discord {
        transform: translateY(-0.2rem) ;
        padding: 0.25rem;
    }

    .user {
        background: #fff;
        border-radius: 1.25rem;
        padding: 0.25rem 0.25rem 0.25rem 0.75rem;
        display: flex;
        align-items: center;
        font-size: 0.725rem;
        font-family: 'Inconsolata', 'Courier New', Courier, monospace;
    }

    .avatar {
        height: 2rem;
        width: 2rem;
        margin: 0.1rem 0.2rem 0 0.75rem;
    }
</style>