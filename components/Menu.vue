<template>
    <nav>
        <img :src="mWeb">
        <img :src="mShop">
        <img :src="mEarly">
        <img :src="mTeam">
    </nav>
</template>

<script>
    import mEarly from "@/assets/img/menu-early.svg"
    import mShop from "@/assets/img/menu-shop.svg"
    import mTeam from "@/assets/img/menu-team.svg"
    import mWeb from "@/assets/img/menu-wen.svg"
    
    export default {
        data:  () => {
            return {
                mEarly,
                mShop,
                mTeam,
                mWeb
            }
        }
    }
</script>

<style>

    nav {
        position: absolute;
        display: flex;
        width: 100%;
        justify-content: center;
        top: 2rem;
        left: 0;
    }
    nav img {
        padding: 3rem 1rem;
    }

</style>