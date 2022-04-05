<template>
    <div class="mint"> 
        <button @click="mintWithPass()"> Mint With Pass</button>
        <button @click="mintPublic()"> Mint</button>
        <button @click="mintBooster()"> Mint With Pass</button>
        <button @click="mintAllow()"> Mint {{amount}}</button>
        <span class="1x">1x</span>
        <span class="2x">2x</span>
        {{signature}}
        <div v-if="minted">
            <img :src="monkeyPlaceholder">
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { ethers } from 'ethers';

    import { 
        MONKEY_CONTRACT,
        MERCH_DROP_CONTRACT
    } from '@/utils/constants';

    import GMSHOPJSON from '@/utils/nftShop.json';
    import GMPFP from '@/utils/GoodMonkeyz.json';


    // import placeholder // - 
    export default {
        data:  () => {
            return {
                price: 0.077,
                amount: 2,
                monkeyPlaceholder: 'img',
                minted: false,
                signature: '',
            }
        },
        computed: mapState(['wallet']),
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
        }
    }
</script>

<style scoped lang="scss">
$s: 660px;
$m: 960px;
$l: 1720px;



</style>