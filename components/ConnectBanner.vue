<template>
    <div class="navbar" :class="{ 'navbar--black': color === 'black' }"> 
        <div class="banner">
            <nuxt-link to="/" class="logo">
                <img v-if="color === 'black'" class="gm-white" :src="logoBlack" >
            <img v-else class="gm-white" :src="gmWhite" >
            </nuxt-link>

            <div v-if="!wallet" class="connect">
                <SparkleBtn class="continue" v-if="!wallet && showConnect" @hit="connectWallet()" text="Connect"/>
            </div>
            <span v-else class="user-area">
                <div class="user">
                <span>{{wallet.substring(0,4)+'..'+wallet.substr(-4)}}</span>
                <img class="avatar" :src="user">
                </div>
            </span>
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
    import opensea from '@/assets/img/opensea-white.svg'
    import gmWhite from "@/assets/img/gm-white.svg"
    

    export default {
        props: ['account', 'color', 'showConnect'],
        data:  () => {
            return {
                logoBlack,
                user,
                twitter,
                discord,
                insta,
                opensea,
                gmWhite,
            }
        },
        computed: mapState(['wallet']),
        methods: {
            connectWallet(){
                this.$nuxt.$emit('connect')
            },
        }
    }
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

    nav {
        display: flex;
        justify-content: center;
        padding-top: 4rem;
        @media (min-width: $s) {
            padding-top: 0;
        }
    }

    nav a,
    nav span {
        color: #fff;
        text-transform: uppercase;
        padding: 0.75rem;
        text-decoration: none;
        font-size: 0.825rem;
        cursor: pointer;
        @media (min-width: $s) {
            padding: 1rem 1.5rem;
        }
    }
    .logo {
    
        display: none;
        @media (min-width: $m) {
            display: block;
            position: relative;
            left: auto;
            top: auto;
            bottom: auto;
            transform: none;
        }
    }
    a.nuxt-link-active {
        color: #fff;
    }
    .navbar--black a,
    .navbar--black span {
        color: #000;   
    }

    .banner {
        position: absolute;
        top: 0;
        left: 0;
        
        display: flex;
        justify-content: center;
        z-index: 1;
        flex-direction: column;
        align-items: center;
        width: 100%;

        @media (min-width: $s) {
            justify-content: space-between;
               flex-direction: row;
        }
        opacity: 0;
        animation: enter-fade 1s ease 1 forwards;
    }
    .banner a {
        text-decoration: none;
    }
    .gm-white {
    max-width: 6rem;
    }

    .connect {
        max-width: 270px;

        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translate(-50%, -50%);

        @media (min-width: $s) {
            top: 3rem;
            max-width: 200px;
        }
        @media (min-width: $m) {
            padding-right: 0;
            transform: translate(0, 0);
            left: auto;
            right: -0.5rem;
            top: -1.5rem;
        }
    }



    .user {
        background: #fff;
        border-radius: 1.25rem;
        padding: 0.25rem 0.25rem 0.25rem 0.75rem;
        display: flex;
        align-items: center;
        font-size: 0.725rem;
        font-family: 'Inconsolata', 'Courier New', Courier, monospace;
        color: #000;
    }
    .user-area {
        position: absolute;
        top: 0;
        right: 0;
        padding-right: 2rem;
        @media (min-width: $m) {
            position: relative;
            padding-right: 0;
        }
        @media (max-width: $m) {
            padding-right: 0;
        }
    }
    .navbar--black .user {
        background: #f1f1f1;
    }

    .avatar {
        height: 2rem;
        width: 2rem;
        margin: 0.1rem 0.2rem 0 0.75rem;
    }

</style>