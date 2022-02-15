<template>
 <!-- :style="`backgroundImage: url(${bg})`" -->
    <main>
        <Nuxt />
    </main>
</template>


<script>
    import bg from "@/assets/img/bg.jpg"
    import union from "@/assets/img/union.svg"
    
    export default {
        data:  ()  =>{
            return {
                bg,
                union,
            }
        }
    }
</script>

<style>


</style>