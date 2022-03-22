<template>
    <div class="navbar" :class="{ 'navbar--black': color === 'black' }"> 
        <div class="banner">
        <nuxt-link to="/">
        <img v-if="color === 'black'" class="gm-white" :src="logoBlack" >
            <img v-else class="gm-white" :src="gmWhite" >
        </nuxt-link>

            <nav v-if="active">
                <nuxt-link :to="{path: '/', hash: 'about'}" >About</nuxt-link> 
                <nuxt-link :to="{path: '/', hash: 'faq'}" >FAQ</nuxt-link> 
                <!-- <nuxt-link to="/early">Early Access</nuxt-link> -->
                <nuxt-link :to="{path: '/', hash: 'team'}" >Team</nuxt-link> 
                <span @click="goToMerch()" >Merch</span>
            </nav>

            <div v-if="!wallet" class="social">
                <a href="https://twitter.com/GoodMonkeyz"><img class="twitter" :src="twitter" ></a>
                <a href="https://www.instagram.com/goodmonkeyz/"><img class="insta" :src="insta" ></a>
                <a href="https://discord.gg/ztNYjaVCjp"><img class="discord" :src="discord"></a>
            </div>
            <span v-else >
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
    import gmWhite from "@/assets/img/gm-white.svg"
    

    export default {
        props: ['account', 'active', 'color'],
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
        methods: {
            goToMerch(){
                if(this.wallet){
                    this.$router.push('/merch/redeem');
                } else {
                    this.$nuxt.$emit('connect', '/merch/redeem')
                }
            },
        }
    }
</script>

<style scoped>

    nav {
        display: flex;
        justify-content: center;
    }
    nav a,
    nav span {
        color: #fff;
        text-transform: uppercase;
        padding: 1rem 1.5rem;
        text-decoration: none;
        font-size: 0.825rem;
        cursor: pointer;
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
        height: 1.7rem;
        margin: 0 0.45rem;
        /* cursor: pointer; */
    }
    .discord {
        /* transform: translateY(-0.2rem) ; */
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
    .navbar--black .user {
        background: #f1f1f1;
    }

    .avatar {
        height: 2rem;
        width: 2rem;
        margin: 0.1rem 0.2rem 0 0.75rem;
    }

</style>