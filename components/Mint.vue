<template>
    <div class="mint"> 
        <div v-if="!minted">
            <!-- <button @click="mintWithPass()"> Mint With Pass</button> -->
            <!-- <button @click="mintPublic()"> Mint</button> -->
            <!-- <button @click="mintBooster()"> Mint With Pass</button> -->
            <h1>Thank You For Minting Good Monkeyz</h1>
            <div class="mint-ammount">
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
            
            <SparkleBtn @hit="mint()" :text="`mint ${amount} Good Monkeyz`"/>
            {{signature}}
        </div>
        <div v-else>
            <h1>Welcome To Good Monkeyz</h1>
            <div class="monkeyz">
                <div v-for="monkey in monkeyz" :key="monkey" class="gm-mint">
                    <img class="gm-mint__monkey" :src="monkeyPlaceholder">
                    <h3 class="gm-mint__title"> Good Monkeyz #{{monkey}}</h3>
                </div>
                <img v-if="hasPrizes" class="gm-mint__star" :src="star">
                <div v-if="hasBadgePrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="gmBadge">
                    <h3 class="gm-mint__title"> GM OG Badge</h3>
                </div>
                <div v-if="hasBoosterPrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="booster">
                    <h3 class="gm-mint__title"> Booster Pack</h3>
                </div>
                <div v-if="hasMysteryPrize" class="gm-mint">
                    <img class="gm-mint__monkey" :src="booster">
                    <h3 class="gm-mint__title"> Mystery Box</h3>
                </div>
            </div>
            <h3>YOU MINTED {{amount}} GOOD MONKEYZ</h3>
            <SparkleBtnTwitter />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { ethers } from 'ethers';

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
    
    import SparkleBtnTwitter from '@/components/SparkleBtnTwitter.vue'

    export default {
        data:  () => {
            return {
                price: 0.077,
                amount: 2,
                monkeyPlaceholder: monkey,
                minted: false,
                signature: '',
                star,
                gmBadge,
                booster,
                prizes: [],
                monkeyz: [],
            }
        },
        components: {
            SparkleBtnTwitter,
        },
        computed: {
            ...mapState(['wallet']),
            hasPrizes(){
                return this.prizes.length > 0
            },
            hasBadgePrize () {
                return this.prizes.includes(TOKEN_ID_OG_BADGE);
            },
            hasBoosterPrize () {
                return this.prizes.includes(TOKEN_ID_BOOSTER_PACK);
            },
            hasMysteryPrize () {
                return this.prizes.includes(TOKEN_ID_MYSTERY_BOX);
            },
            // prizeMessage () {
            //     const monkeyz = this.monkeyz.length
            //     ``
            // }
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
                    
                    const result =  await nftTxn.wait();
                    this.txHash = nftTxn.hash

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
                    this.errorMessage = error
                    setTimeout( ()=> {
                        this.errorMessage = '';
                    }, 5500)
                }
            },
            mint() {
                this.minted = true;
                this.prizes = [3]
                this.monkeyz = [55]
            },
            // async mint() {
            //     try {
            //         const provider = this.$provider();
            //         const signer = provider.getSigner();
            //         const connectedContract = new ethers.Contract(MONKEY_CONTRACT, GMPFP.abi, signer);

            //         const PRICE = this.price;
            //         const AMOUNT = this.amount;
            //         const TOTAL = PRICE * AMOUNT;
                    
            //         const overrides = { value: ethers.utils.parseEther( String( TOTAL ) )};
            //         const nftTxn = await connectedContract.mint(AMOUNT, overrides)
                    
            //         const result =  await nftTxn.wait();
            //         this.txHash = nftTxn.hash
  
            //         let tokens;
            //         try {
            //             const e = result.events.filter( x => x.event === 'GMMinted')
            //             console.log(e)
            //             tokens = e.map(x => {
            //                 console.log(x.args.tokenId)
            //                 return ethers.utils.formatUnits(x.args[1], 0); 
            //             });
            //         } catch (error){
            //             console.log(error)
            //         }

            //         if(result.status === 1) {
            //             this.minted = true;
            //             this.prizes = (await this.checkPrize()).prizes
            //             this.monkeyz = tokens
            //         } else {
            //             throw new Error('TX Failed :( ');
            //         }
            //     } catch (error) {
            //         this.errorMessage = error
            //         setTimeout( ()=> {
            //             this.errorMessage = '';
            //         }, 5500)
            //     }
            // },
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
                this.amount++
            },
            minus() {
                this.amount--
            }
        }
    }
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;

  h1 {
    font-size: 1.3rem;
    text-transform: uppercase;
    letter-spacing: 0.25rem;
  }



    .mint-ammount {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
    }

    .mint-ammount__amount {
        font-size: 7rem;
        margin: 0 3rem 1rem;
    }

    .mint-ammount__minus,
    .mint-ammount__plus {
        padding: 2rem;
        margin: 0;
        position: relative;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        height: 5rem;
        width: 5rem;
        transform: translateY(-0.5rem);
        cursor: pointer;
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
}

.gm-mint {
    background: #fff;
    padding: 0.75rem;
    border-radius: 1rem;
    margin: 1rem;
    max-width: 16%;

    //
    opacity: 0;
    animation: enter 1s ease 1 forwards;
}

.gm-mint__star {
    margin: 1.5rem;
}

.gm-mint__monkey {
    flex-basis: 10%;
    max-width: 100%;
    border-radius: 0.25rem;
}

.gm-mint__title {
    color: #000;
    text-align: center;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.01rem;
    font-size: 1rem;
}
</style>