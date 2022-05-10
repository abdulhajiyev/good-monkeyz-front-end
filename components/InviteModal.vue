<template>
    <div class="backdrop" :class="{ active: active }" @click="active = false" >
        <img class="close" :src="closeIcon" @click="active = false">
        <div class="modal" @click.stop>
            <div class="modal-inner">
                <h1>REFERRAL LINK</h1>
                <h2>Use your referral link to gain points and win prizes! Just copy the link below and share it with your friends to rack up points.</h2>
                <div class="invite-link" :class="{ active : copied}">
                    <span>{{ referLink }}</span>
                    <img class="btn btn--copy"  :src="copyIcon" @click="copy()">
                </div>
                <span v-if="copied" class="copied">Link Copied</span>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import closeIcon from "@/assets/img/close.svg";
    import copyIcon from "@/assets/img/copy.svg";

    export default {
        data:  () => {
            return {
                closeIcon,
                copyIcon,
                active: false,
                copied: false,
                ref: '~gm~',
            }
        },
        created() {
            this.$nuxt.$on('invite', async (redirect) => {
                await this.getRefLink()
                this.active = true
            })
            
        },
        computed: {
           ...mapState(['wallet']),
           referLink(){
               return `https://goodmonkeyz.art/i/${this.ref}`
           }
        },
        methods: {
            copy() {
                navigator.clipboard.writeText(this.referLink);
                this.copied = true;
            },
            genId() {
                const x = "abcdefghijklmnopqrstuvwxyz0123456789";
                let res = '';
                for (let i = 0; i < 6; i++){
                    res += x.charAt(Math.floor(Math.random() * x.length));
                }
                return res;
            },

            async setRef(){
                const ref = this.genId()
                const refAddress = this.wallet
                this.ref = ref
                const response = await fetch('/.netlify/functions/add-ref', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        ref,
                        refAddress
                    }) 
                })
                return await response.json();
            },
            async getRef(){
                const refAddress = this.wallet
                const response = await fetch('/.netlify/functions/get-ref', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        refAddress,
                    }) 
                })
                return await response.json();
            },
            async getRefLink(){
                const inviteRef = await this.getRef()
                if(inviteRef.success) {
                    console.log(inviteRef.data)
                    this.ref = inviteRef.data.ref
                } else {
                    await this.setRef();
                }
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
        z-index: 1000;
        display: flex;
        opacity: 0;
        pointer-events: none;
        will-change: opacity;
        transition: opacity 200ms ease-in;
    }

    .active {
        opacity: 1;
        pointer-events: initial;
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
        max-width: 90%;
    }

    .invite-link {
        background: #E4E4E4;
        border-radius: 0.5rem;
        padding: 1rem;
        word-break: break-all;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 300ms;
    }
    .invite-link.active {
        background: #c6f0de;
    }
    .modal-inner {
        max-width: 440px;
    }

    .btn--copy {
        cursor: pointer;
        margin-left: 2rem;
    }
    .copied {
        margin-top: 2rem;
        letter-spacing: 0.1rem;
        text-transform: uppercase;
        font-size: 0.6rem;
    }

</style>