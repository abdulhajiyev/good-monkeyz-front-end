<template>
    <div class="navbar">
        <img :src="logoBlack">
        <nav>
            <nuxt-link to="/wen">Wen Monkeyz</nuxt-link>
            <nuxt-link to="/shop">Shop</nuxt-link>
            <nuxt-link to="/early">Early Access</nuxt-link>
            <nuxt-link to="/team">GM Team</nuxt-link>
        </nav>
        <div v-if="account" class="user">
            {{account.substring(0,4)+'..'+account.substr(-4)}}
            <img class="avatar" :src="user">
        </div>
        <span v-else @click="$emit('connect')" class="connect">Connect Wallet</span>
    </div>
</template>

<script>
    import logoBlack from "@/assets/img/gm-black.svg"
    import user from "@/assets/img/user.png"
    
    export default {
        props: ['account'],
        data:  () => {
            return {
                logoBlack,
                user,
            }
        }
    }
</script>

<style scoped>
    .navbar {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 1rem;
        position: absolute;
        top: 0;
        background: #fff;
        z-index: 1;
    }
    .navbar img {
    }
    nav {
        display: flex;
        justify-content: center;
    }
    nav a {
        color: rgba(0,0,0,0.4);
        text-transform: uppercase;
        padding: 1rem 1.5rem;
        text-decoration: none;
        font-size: 0.825rem;
    }
    a.nuxt-link-active {
        color: #000;
    }
    nav img {
        padding: 3rem 1rem;
    }
    .connect {
        color: #fff;
        background: #000;
        padding: 1rem;
        font-size: 0.825rem;
        border-radius: 1rem;
        text-transform: uppercase;
            align-self: center;
    }
    .user {
        display: flex;
        align-items: center;
        font-size: 0.725rem;
        font-family: 'Inconsolata', 'Courier New', Courier, monospace;
    }
    .avatar {
        height: 2rem;
        width: 2rem;
        margin-left: 0.75rem;
    }
</style>