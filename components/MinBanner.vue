<template>
    <div class="navbar" :class="{ 'navbar--black': color === 'black' }"> 
        <div class="banner">
            <nuxt-link to="/" class="logo">
                <img v-if="color === 'black'" class="gm-white" :src="logoBlack" >
            <img v-else class="gm-white" :src="gmWhite" >
            </nuxt-link>

            <nav v-if="active">
                <nuxt-link :to="{path: '/', hash: 'about'}" >About</nuxt-link> 
                <nuxt-link :to="{path: '/', hash: 'faq'}" >FAQ</nuxt-link> 
                <nuxt-link to="/early">Early Access</nuxt-link>
                <nuxt-link :to="{path: '/', hash: 'team'}" >Team</nuxt-link> 
                <span @click="goToMerch()" >Merch</span>
            </nav>

            <div v-if="!wallet" class="social">
                <a href="https://twitter.com/GoodMonkeyz"><img class="twitter" :src="twitter" ></a>
                <a href="https://www.instagram.com/goodmonkeyz/"><img class="insta" :src="insta" ></a>
                <a href="https://discord.gg/ztNYjaVCjp"><img class="discord" :src="discord"></a>
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

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;


    nav {
        display: flex;
        justify-content: center;
        
        @media (max-width: $s) {
            order: 3;
        }
         

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
    .logo {
        @media (max-width: $s) {
            position: absolute;
            left: 2rem;
            top: 1.5rem;
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
        
        padding: 1.5rem 0;
        display: flex;
        justify-content: center;
        z-index: 1;
        flex-direction: column;
        align-items: center;
        width: 100%;

        @media (min-width: $s) {
            justify-content: space-between;
            padding: 1.5rem;
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

    .social {
        display: flex;
        justify-content: center;
        align-items: center;
        @media (max-width: $s) {
            align-self: flex-end;
            padding: 0.25rem 1.5rem 0 0;
        }
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
    .user-area {
        padding-right: 2rem;
        align-self: flex-end;
        @media (max-width: $s) {
            padding-right: 2rem;
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