<template>
    <div > 
        <div class="mint" v-if="!minted">
            <section class="mint__pass-modal" v-if="!txHash">
                
                <h1>You Have A Mint Pass!</h1>
                <div class="mint__pass-img" >
                    <img class="" :src="pass">
                    <span v-if="!approved" @click="aprovePass()" class="btn" >Approve Pass</span>
                    <img @click="$emit('hide')" class="close" :src="closeIcon" >
                </div>   
                <SparkleBtn class="mint-btn" :class="{ 'not-approved': approved === false }" @hit="mintWithPass()" :text="`mint With Pass`"/>
            </section>
            <section class="pending" v-else>
                <div class="in-progress">
                    <span class="loader"></span>
                    <img :src="gmBlack" class="logo">
                </div>
                <a target="_blank" :href="`https://etherscan.io/tx/${txHash}`">Minting in Progress</a>
            </section>
        </div>
        <div class="minted" v-else>
            <h2>Welcome To Good Monkeyz</h2>
            <div class="monkeyz">
                <div v-for="monkey in monkeyz" :key="monkey" class="gm-mint">
                    <img class="gm-mint__monkey" :src="monkeyPlaceholder">
                    <h3 class="gm-mint__title"> Good Monkeyz #{{monkey}}</h3>
                </div>
                <div v-if="hasPrizes" class="gm-mint__star">
                    <img :src="star">
                </div>
                <div v-if="hasBadgePrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="gmBadge">
                    <h3 class="gm-mint__title"> GM OG Badge</h3>
                </div>
                <div v-if="hasBoosterPrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="booster">
                    <h3 class="gm-mint__title">GM Boost Bar</h3>
                </div>
                <div v-if="hasMysteryPrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="box">
                    <h3 class="gm-mint__title">GM Mystery Box</h3>
                </div>
            </div>
            <h3 v-if="!hasPrizes">YOU MINTED A GOOD MONKEYZ</h3>
            <h3 v-else>{{prizeString}}</h3>
            <div class="share">
                <SparkleBtnTwitter @hit="openTweet()" />
            </div>
        </div>
        <transition name="fade">
            <div v-show="errorMessage" class="error">
                <span>{{errorMessage}}</span>
            </div>
        </transition>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { ethers } from 'ethers';
    import JSConfetti from 'js-confetti'

    import { 
        MONKEY_CONTRACT,
        MERCH_DROP_CONTRACT,
        TOKEN_ID_BOOSTER_PACK,
        TOKEN_ID_OG_BADGE,
        TOKEN_ID_MYSTERY_BOX,
        NETWORK_NAME,
        ALCHEMY_API,
        CHAIN_ID
    } from '@/utils/constants';

    import GMSHOPJSON from '@/utils/nftShop.json';
    import GMPFP from '@/utils/GoodMonkeyz.json';

    import monkey from '@/assets/img/placeholder.gif'
    import pass from '@/assets/img/mint-pass.gif'
    import star from '@/assets/img/star.svg'
    import gmBadge from '@/assets/img/gm-og.gif'
    import booster from '@/assets/img/gm-booster.gif'
    import box from '@/assets/img/mystery-item.gif'
    import gmBlack from "@/assets/img/gm-full.svg"
    import closeIcon from "@/assets/img/close.svg";

    import SparkleBtnTwitter from '@/components/SparkleBtnTwitter.vue'

    export default {
        data:  () => {
            return {
                gmBlack,
                monkeyPlaceholder: monkey,
                closeIcon,
                minted: false,
                txHash: false,
                star,
                gmBadge,
                pass,
                booster,
                box,
                prizes: [],
                monkeyz: [],
                twitterURL: `https://twitter.com/share?text=I just minted @GoodMonkeyz&url=https://goodmonkeyz.art&hashtags=goodmonkeyz`,
                errorMessage: '',
                approved: false,
            }
        },
        components: {
            SparkleBtnTwitter,
        },
        computed: {
            ...mapState(['wallet']),
            hasPrizes(){
                if (!this.prizes) return false
                return this.prizes.length > 0
            },
            hasBadgePrize () {
                if (!this.prizes) return false
                return this.prizes.includes(TOKEN_ID_OG_BADGE);
            },
            hasBoosterPrize () {
                if (!this.prizes) return false
                return this.prizes.includes(TOKEN_ID_BOOSTER_PACK);
            },
            hasMysteryPrize () {
                if (!this.prizes) return false
                return this.prizes.includes(TOKEN_ID_MYSTERY_BOX);
            },
            prizeString () {
                if (this.hasBadgePrize & this.hasBoosterPrize & this.hasMysteryPrize) {
                    return 'WOW! YOU LUCKY! YOU FOUND A BOOSTER BAR + GOOD COLLECTIVE BADGE + A MYSTERY BOX!'
                }
                else if (this.hasBadgePrize & this.hasBoosterPrize) {
                    return 'WOW! YOU FOUND A BOOSTER BAR + GOOD COLLECTIVE BADGE TOO!'
                }
                else if (this.hasBadgePrize & this.hasMysteryPrize) {
                    return 'WOW! YOU FOUND A MYSTERY BOX + GOOD COLLECTIVE BADGE TOO!'
                }
                else if (this.hasBoosterPrize & this.hasMysteryPrize) {
                    return 'WOW! YOU FOUND A BOOSTER BAR + A MYSTERY BOX TOO!'
                }
                else if(this.hasBadgePrize){
                    return 'WOW! YOU FOUND AN GOOD COLLECTIVE BADGE TOO!'
                }
                else if (this.hasBoosterPrize) {
                    return 'WOW! YOU FOUND A BOOSTER BAR TOO!'
                }
                else if (this.hasMysteryPrize) {
                    return 'WOW! YOU FOUND A MYSTERY BOX TOO!'
                }
                return 'WOW! YOU FOUND SOMETHING EXTRA TOO!'
            }
        },
        created() {
            this.checkByAddress(this.wallet);

            this.checkForPassApproval();
        },
        methods: {
            async checkByAddress(address){
                console.log('CHECK', address)
                const res = await (await fetch(`/.netlify/functions/get-allow-list-single?address=${this.wallet}`)).json()
                console.log(res)
                if ( res != null ) {
                    this.signature = res.signature
                }
            },
            async checkForPassApproval(){
                const provider = new ethers.providers.AlchemyProvider(NETWORK_NAME, ALCHEMY_API);;
                const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, provider);
                this.approved = await merchContract.isApprovedForAll(this.wallet, MONKEY_CONTRACT);
            },
            async aprovePass(){
                try {
                    const provider = this.$provider();
                    const signer = provider.getSigner();
                    const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
                    
                    const approval = await merchContract.setApprovalForAll(MONKEY_CONTRACT, true);
                    await approval.wait()
                    this.approved = true;
                } catch (error) {
                    this.errorMessage = this.formatError(error)
                    setTimeout( ()=> {
                        this.errorMessage = '';
                    }, 5500)
                }
            },
            async mintWithPass(){
                try {
                    const provider = this.$provider();
                    const signer = provider.getSigner();
                    const { chainId } = await provider.getNetwork()

                    if (chainId !== CHAIN_ID) {
                        throw new Error('WRONG NETWORK - Select ETH MAINNET');
                    }

                    const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);
                    const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
                    
                    if (!this.approved) {
                        // const overrides = {gasPrice: ethers.utils.parseUnits('60', 'gwei')};
                        const approval = await merchContract.setApprovalForAll(MONKEY_CONTRACT, true);
                        approval.wait()
                        console.log(approval)
                        this.approved = true;
                    }
                    
                    const overrides = {gasLimit: 150000};
                    const nftTxn = await monkeyContract.mintWithPass(overrides)

                    console.log(nftTxn)
                    this.txHash = nftTxn.hash
                    const result =  await nftTxn.wait();
  
                    const gmMinted = (result.events.filter( result => result.event === 'GMMinted'))[0]
                    const id = parseInt(ethers.utils.formatUnits(gmMinted.args[1],0))
                    const amount = parseInt(ethers.utils.formatUnits(gmMinted.args[2],0))
                    const tokens = []

                    for(let i=0; i < amount; i++) {
                        tokens.push(id+i)
                    }

                    if(result.status === 1) {
                        this.minted = true;
                        this.monkeyz = tokens
                        this.fireConfetti()
                        const won = await this.checkPrize()
                        this.prizes = won ? won.prizes : []
                    } else {
                        throw new Error('TX Failed :( ');
                    }

                } catch (error) {
                    this.txHash = ''
                    this.errorMessage = this.formatError(error)
                    setTimeout( ()=> {
                        this.errorMessage = '';
                    }, 5500)
                }
            },
            async checkPrize(){
                const response = await fetch('/.netlify/functions/allow-prize', {
                    method: 'POST', 
                    cache: 'no-cache',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        txHash: this.txHash,
                    })
                });
                const json = await response.json()
                return json
            },

            openTweet(){
                window.open(this.twitterURL, "_blank");
            },
            fireConfetti(){
            const jsConfetti = new JSConfetti()
                jsConfetti.addConfetti({
                confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
                confettiRadius: 8,
                });
                setTimeout( ()=> {
                jsConfetti.addConfetti({
                    confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
                    confettiRadius: 8,
                });
                }, 700)
                setTimeout( ()=> {
                jsConfetti.addConfetti({
                    confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
                    confettiRadius: 8,
                });
                }, 1400)

                setTimeout( ()=> {
                jsConfetti.addConfetti({
                    confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
                    confettiRadius: 8,
                });
                }, 2000)

                setTimeout( ()=> {
                jsConfetti.addConfetti({
                    confettiColors: ['#FC9D79', '#D91EA4', '#A31FC5', '#7651C3', '#2CDAB0', '#FFF6B4'],
                    confettiRadius: 8,
                });
                }, 2400)
            },
            formatError(error){
                console.log(error.message);
                console.log(error.message.includes('insufficient'));
                if (error.message.includes('exceeds') ){
                    return `No Mint Pass Found`
                }
                if (error.message) {
                    return `${error.message.substring(0, 50)}...`
                }
            },
        }
    }
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

    .close {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        height: 2.5rem;
        width: 2.5rem;
        cursor: pointer;
        transform: translate(-50%, 50%);
        background: rgb(255, 255, 255, 0.1);
        border-radius: 50% !important;

        opacity: 0;
        animation: enter-up-scale 1s 500ms 1 forwards ease ;
        z-index: 1000;
    }

    .mint {
        width: 100%;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    .minted {
        // background: #000;
        width: 100%;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }

    .mint__pass-modal {
        // background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        min-height: 100%;

    }
    .mint__pass-img {
        background: #fff;
        padding: 1rem;
        max-width: 70%;
        border-radius: 1rem;
        margin-bottom: 1rem;
        @media (min-width: $s) {
            max-width: 40%;
        }
        @media (min-width: $m) {
            max-width: 320px;
        }
        img {
            border-radius: 1rem;
            max-width: 100%;
        }
        opacity: 0;
        animation: enter-up-scale 1s 500ms 1 forwards ease ;
    }
    .not-approved {
        cursor: disabled !important;
        display: none;
    }
    .mint-btn {
        transition: opacity 300ms;
    }

    .btn {
        color: #fff;
        background: #000;
        text-align: center;
        padding: 0.5rem 0.25rem;
        width: 100%;
        display: inline-block;
        border-radius: 0.75rem;
        margin-top: 0.5rem;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.15rem;
        cursor: pointer;
        transition: opacity 300ms;
    }

    .minting {
        position: relative;
    }
    h1 {
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.25rem;
        color: #fff;

        //
        opacity: 0;
        animation: enter-up-scale 1s 500ms 1 forwards ease ;
    }

    h2 {
        margin-top: 3rem;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
        opacity: 0;
        animation: enter-up-scale 1s 700ms 1 forwards ease ;
    }
    h3 {
        font-size: .9rem;
        letter-spacing: 0.35rem;
        //
        opacity: 0;
        animation: enter-up-scale 1.2s 1s 1 forwards ease ;
    }

    @media (min-width: $s) {
        h1 {
            font-size: 1.3rem;
        }
        h2 {
            font-size: 2rem;
        }
        h3 { 
            font-size: .9rem;
        }
    }
    @media (min-width: $m) {
        h1 {
            font-size: 2rem;
        }
        h2 {
            font-size: 3rem;
        }
        h3 { 
            font-size: .9rem;
        }
    }
    @media (min-width: $l) {
        h1 {
            font-size: 3rem;
        }
    }




.monkeyz {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    @media (min-width: $s) {
        flex-wrap: no-wrap;
    }
}

.mint-btn {
    //
    opacity: 0;
    animation: enter-up-scale 1s 700ms 1 forwards ease ;
}

.gm-mint {
    background: rgba(255,255,255,0.7);
    padding: 0.75rem;
    border-radius: 1rem;
    margin: 1rem;
    max-width: 37%;
    opacity: 0;
    animation: enter-up-scale 1s 0ms 1 forwards ease ;

    @media (min-width: $s) {
        max-width: 20%;
    }

    @media (min-width: $m) {
        max-width: 16%;
        margin: 0.5rem;
    }
}

.gm-mint__star {
    flex-basis: 100%;
    //
    opacity: 0;
    animation: enter-up-scale 1s 0ms 1 forwards ease ;
    @media (min-width: $s) {
        display: none;
    }
    @media (min-width: $m) {
        display: block;
        flex-basis: 12%;
        max-width: 10%;
    }

}
.gm-mint__star img {
    width: 50px;
    @media (min-width: $s) {
        width: auto;
        max-width: 70px;
    }
    @media (min-width: $m) {
        width: 50px;
    }
        
}

.gm-mint__monkey {
    flex-basis: 10%;
    max-width: 100%;
    border-radius: 0.25rem;
    
    opacity: 0;
    animation: enter-up-scale 1s 50ms 1 forwards ease ;
}

.gm-mint__title {
    color: #000;
    text-align: center;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.01rem;
    font-size: 0.6rem;
    @media (min-width: $s) {
        font-size: 0.75rem;
    }
}

.share {
    opacity: 0;
    animation: enter-up-scale 1s 2s 1 forwards ease ;
}


  .pending a {
      display: block;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-top: 2rem;
    text-decoration: none;
      letter-spacing: 0.3rem;
      color: #fff;

      opacity: 0;
      animation: enter-up-scale 1s 700ms 1 forwards ease ;
  }

  .in-progress {
    position: relative;
    display: inline-block;
    margin: 2rem;
      opacity: 0;
    animation: enter-up-scale 1s 300ms 1 forwards ease ;
  }

  .in-progress img {
    position: absolute;
    top: 3px;
    left: 2px;
    width: 5.1rem;
  }

  .loader {
    display: block;
    font-size: 10px;
    text-indent: -9999em;
    width: 5.3rem;
    height: 5.3rem;
    border-radius: 50%;
    background: linear-gradient(222.44deg, #FC9D79 16.01%, #D91EA4 26.09%, #A31FC5 34.3%, #7651C4 44.37%, #2CDAB0 72.36%, #FFF6B4 87.66%);
    position: relative;
    animation: load 1.4s infinite linear;
    transform: translateZ(0);
  }

  .loader:before {
    width: 30%;
    height: 30%;
    // background: #ffffff;
    filter: blur(27px); 
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  .loader:after {
    background: radial-gradient(#2cdab06b, black);
    width: 65%;
    height: 65%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

@keyframes load {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

 .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .error {
    padding: 1.2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    background: linear-gradient(222.44deg, #fc7979 16.01%, #D91EA4 36.09%, #A31FC5 64.3%, #c45151 84.37%);
    max-width: 80%;
    border-radius: 0.3rem;
    font-size: 0.75rem;
  }
</style>