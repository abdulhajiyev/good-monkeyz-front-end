<template>
    <div class="grad-btn" @click="$emit('hit')">
        <div class="content">
            <span class="title">{{text}}</span>
        </div>
            <svg :width="w" :height="h" viewBox="0 0 330 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clip">
                        <path d="M0.5 31.637C0.5 22.5911 0.5 18.0682 2.58699 13.7709C4.34908 10.1426 7.93171 6.42037 11.49 4.5209C15.7043 2.2712 19.9833 2.10755 28.5413 1.78023C51.6997 0.89451 92.9286 0 165 0C237.071 0 278.3 0.89451 301.459 1.78023C310.017 2.10755 314.296 2.2712 318.51 4.5209C322.068 6.42037 325.651 10.1426 327.413 13.7709C329.5 18.0682 329.5 22.5911 329.5 31.637V68.363C329.5 77.4089 329.5 81.9318 327.413 86.2291C325.651 89.8574 322.068 93.5796 318.51 95.4791C314.296 97.7288 310.017 97.8925 301.459 98.2198C278.3 99.1055 237.071 100 165 100C92.9286 100 51.6996 99.1055 28.5413 98.2198C19.9833 97.8925 15.7043 97.7288 11.49 95.4791C7.93171 93.5796 4.34908 89.8574 2.58699 86.2291C0.5 81.9318 0.5 77.4089 0.5 68.363V31.637Z" />  
                    </clipPath>
                        
                    <linearGradient id="grad" x1="272.219" y1="-44.1651" x2="-5.84238" y2="200.598" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FC9D79" stop-opacity="0.85"/>
                        <stop offset="0.140625" stop-color="#D91EA4" stop-opacity="0.85"/>
                        <stop offset="0.255208" stop-color="#A31FC5" stop-opacity="0.85"/>
                        <stop offset="0.395833" stop-color="#7651C4" stop-opacity="0.85"/>
                        <stop offset="0.786458" stop-color="#2CDAB0" stop-opacity="0.85"/>
                        <stop offset="1" stop-color="#FFF6B4" stop-opacity="0.85"/>
                    </linearGradient>
                    <filter id="blurMin">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
                    </filter>

                    <filter id="blurMax">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
                    </filter>

                </defs>
                <g id="my-graphic" clip-path="url(#clip)">
                    <rect class="white" x="0" y="0" height="200px" width="400px" fill="#fff" filter="url('#blurMin')" />
                    <rect class="bg" x="0" y="0px" height="700px" width="700px" fill="url('#grad')" filter="url('#blurMax')"/>
                </g>
            </svg>
    </div>
</template>

<script>
    import twitterImg from "@/assets/img/twitter-black.svg"
    export default {
        props: ['text', 'twitter'],
        data() {
            return {
                twitterImg,
            }
        },
        computed: {
            w(){
                return this.twitter ? '290px' :'240px';
            },
            h(){
                return this.twitter ? '100px' :'100px';
            }
        },
    }
</script>

<style scoped>
    .grad-btn {
        position: relative;
        cursor: pointer;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    svg {
        max-width: 90%;
        z-index: 1;
        position: relative;
        cursor: pointer;
    }
    .white {
        z-index: 0;
    }
    .bg {
        z-index: 100;
        /* filter: blur(44px); */
        animation: move 2.7s ease-in-out forwards infinite alternate;
    }

    .content {
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        text-transform: uppercase;
    }
    .title {
      display: inline-block;
      color: black;
      transform: translateY(-2px);
      font-size: 0.87rem;
      white-space: nowrap;
    }

    .twitter {
      position: relative;
      height: 1.25rem;
      display: inline-block;
      margin-right: 0.5rem;
    }


    @keyframes move {
        from {
            transform: translate(50px,-800px);
        }
        to {
            transform: translate(-250px,150px);
        }
    }


</style>