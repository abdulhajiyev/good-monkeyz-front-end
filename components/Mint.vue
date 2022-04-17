<template>
    <div class="mint"> 
        <div v-if="!minted">
            <!-- <button @click="mintWithPass()"> Mint With Pass</button> -->
            <!-- <button @click="mintPublic()"> Mint</button> -->
            <!-- <button @click="mintBooster()"> Mint With Pass</button> -->
            
            <section v-if="!txHash">
                <h1>Thank You For Minting Good Monkeyz</h1>
                <div  class="mint-ammount">
                    <span @click="minus()" class="mint-ammount__minus">
                        <svg class="mint-ammount__symbol" width="56" height="8" viewBox="0 0 56 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M55.4082 8H0.944824V0H55.4082V8Z" fill="white"/>
                        </svg>
                    </span>
                    <h2 class="mint-ammount__amount">{{amount}} GM</h2>
                    <span @click="plus()" class="mint-ammount__plus">
                        <svg class="mint-ammount__symbol" width="56" height="55" viewBox="0 0 56 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M55.0107 31.2995H0.547363V23.2995H55.0107V31.2995Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M23.7791 54.5312L23.7791 0.0677795L31.7791 0.0677799L31.7791 54.5312H23.7791Z" fill="white"/>
                        </svg>
                    </span>
                </div>
                
                <SparkleBtn class="mint-btn" @hit="mint()" :text="`mint ${amount} Good Monkeyz`"/>
            </section>
            <section class="pending" v-else>
                <div class="in-progress">
                    <span class="loader"></span>
                    <img :src="gmBlack" class="logo">
                </div>
                <a target="_blank" :href="`https://etherscan.io/tx/${txHash}`">Minting in Progress</a>
            </section>
            {{signature}}
        </div>
        <div v-else>
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
                    <img class="gm-mint__monkey" :src="booster">
                    <h3 class="gm-mint__title">GM Mystery Box</h3>
                </div>
            </div>
            <h3 v-if="!hasPrizes">YOU MINTED {{amount}} GOOD MONKEYZ</h3>
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
    } from '@/utils/constants';

    import GMSHOPJSON from '@/utils/nftShop.json';
    import GMPFP from '@/utils/GoodMonkeyz.json';

    import monkey from '@/assets/img/placeholder.gif'
    import star from '@/assets/img/star.svg'
    import gmBadge from '@/assets/img/gm-og.gif'
    import booster from '@/assets/img/gm-booster.gif'
    import gmBlack from "@/assets/img/gm-full.svg"

    import SparkleBtnTwitter from '@/components/SparkleBtnTwitter.vue'

    export default {
        data:  () => {
            return {
                price: 0.077,
                amount: 2,
                gmBlack,
                monkeyPlaceholder: monkey,
                minted: false,
                txHash: false,
                signature: '',
                star,
                gmBadge,
                booster,
                prizes: [],
                monkeyz: [],
                twitterURL: `https://twitter.com/share?text=I just minted Good Monkeyz&url=https://goodmonkeyz.art`,
                errorMessage: '',
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
                    return 'WOW! YOU LUCKY! YOU FOUND A BOOSTER BAR + OG BADGE + A MYSTERY BOX!'
                }
                else if (this.hasBadgePrize & this.hasBoosterPrize) {
                    return 'WOW! YOU FOUND A BOOSTER BAR + OG BADGE TOO!'
                }
                else if (this.hasBadgePrize & this.hasMysteryPrize) {
                    return 'WOW! YOU FOUND A MYSTERY BOX + OG BADGE TOO!'
                }
                else if (this.hasBoosterPrize & this.hasMysteryPrize) {
                    return 'WOW! YOU FOUND A BOOSTER BAR + A MYSTERY BOX TOO!'
                }
                else if(this.hasBadgePrize){
                    return 'WOW! YOU FOUND AN OG BADGE TOO!'
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
            async mintAllow() {
                try {
                    const provider = this.$provider();
                    const signer = provider.getSigner();
                    const connectedContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

                    const SIGNATURE = this.signature;
                    const PRICE = this.price;
                    const AMOUNT = this.amount;
                    const TOTAL = PRICE * AMOUNT;
                    
                    const overrides = { value: ethers.utils.parseEther( String( TOTAL ) )};
                    const nftTxn = await connectedContract.mintAllow(AMOUNT, SIGNATURE ,overrides)
                    
                    this.txHash = nftTxn.hash
                    const result =  await nftTxn.wait();

                    console.log(result)
                
                    if(result.status === 1) {
                        this.minted = true;
                    } else {
                        throw new Error('TX Failed :( ');
                    }
                } catch (error) {
                    this.errorMessage = error
                    setTimeout( ()=> {
                        this.errorMessage = '';
                    }, 5500)
                }
            },
            async mintWithPass(){
                try {
                    const provider = this.$provider();
                    const signer = provider.getSigner();
                    const monkeyContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);
                    const merchContract = new ethers.Contract(MERCH_DROP_CONTRACT, GMSHOPJSON.abi, signer);
                    
                    console.log(MONKEY_CONTRACT)
                    const approved = await merchContract.isApprovedForAll(this.wallet, MONKEY_CONTRACT);
                    console.log(approved);

                    if (!approved) {
                        const approval = await merchContract.setApprovalForAll(MONKEY_CONTRACT, true);
                        approval.wait()
                        console.log(approval)
                    }
                    
                    const tx = await monkeyContract.mintWithPass()
                    const result = await tx.wait();
                
                    if(result.status === 1) {
                        console.log('mint', result)
                        this.minted = true;
                    } else {
                        console.log('fail', result)
                        throw new Error('TX Failed :( ');
                    }
                } catch (error) {
                    this.errorMessage = this.formatError(error)
                    setTimeout( ()=> {
                        this.errorMessage = '';
                    }, 5500)
                }
            },
            // mint() {
            //     this.txHash = 'abc'
            //     setTimeout( () => {
            //         this.minted = true;
            //         this.fireConfetti()
            //         this.monkeyz = [54,55]
                    
            //         setTimeout( () => {
            //             this.prizes = [3,2,4]    
            //         }, 3000)
            //     }, 5000)
            // },
            async mint() {
                try {
                    const provider = this.$provider();
                    const signer = provider.getSigner();
                    const connectedContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

                    const PRICE = this.price;
                    const AMOUNT = this.amount;
                    const TOTAL = PRICE * AMOUNT;
                    
                    const overrides = { value: ethers.utils.parseEther( String( TOTAL ) )};
                    const nftTxn = await connectedContract.mint(AMOUNT, overrides)
                    console.log(nftTxn)
                    this.txHash = nftTxn.hash
                    const result =  await nftTxn.wait();
  
                    const tokens = result.events
                        .filter( result => result.event === 'GMMinted')
                        .map(event => ethers.utils.formatUnits(event.args[1], 0));

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
                    // console.log(error)
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
            plus() {
                if(this.amount === 1){
                    this.amount++
                }
                
            },
            minus() {
                if(this.amount === 2){
                    this.amount--
                }
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

    .minting {
        position: relative;
    }
    h1 {
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.25rem;

        //
        opacity: 0;
        animation: enter-up-scale 1s ease 1 forwards;
    }

    h2 {
        margin-top: 3rem;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
        opacity: 0;
        animation: enter-up-scale 1s 500ms 1 forwards ease ;
    }
    h3 {
        font-size: .9rem;
        letter-spacing: 0.35rem;
        //
        opacity: 0;
        animation: enter-up-scale 1s 1s 1 forwards ease ;
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

    .mint-ammount {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;

        user-select: none;
        //
        opacity: 0;
        animation: enter-up-scale 1s 350ms 1 forwards ease ;
    }

    .mint-ammount__amount {
        font-size: 3rem;
        margin: 3rem 1rem 4rem;
        user-select: none;
        line-height: 1;
        @media (min-width: $s) {
            font-size: 6rem;
            margin: 3rem 1rem 4rem;
        }
        @media (min-width: $m) {
            font-size: 7rem;
            margin: 3rem 4rem 4rem;
        }
        @media (min-width: $l) {
            font-size: 9rem;
            margin: 3rem 4rem 4rem;
        }
    }

    .mint-ammount__minus,
    .mint-ammount__plus {
        padding: 2rem;
        margin: 0 0.5rem;
        position: relative;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        height: 2rem;
        width: 2rem;
        transform: translateY(-0.5rem);
        cursor: pointer;

        @media (min-width: $s) {
            margin: 0 2rem;
            height: 5rem;
            width: 5rem;
        }

        @media (min-width: $m) {
            margin: 0;
        }
    }   
    .mint-ammount__symbol {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        line-height: 0;
        max-width: 55%;
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
        // max-width: 23%;
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
    @media (min-width: $m) {
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