<template>
    <div class="grad-note">
        <div class="content">
            <span class="error">{{text}}</span>
        </div>
            <svg width="320" height="120" viewBox="0 0 330 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id="clip">
                        <path d="M0.5 31.637C0.5 22.5911 0.5 18.0682 2.58699 13.7709C4.34908 10.1426 7.93171 6.42037 11.49 4.5209C15.7043 2.2712 19.9833 2.10755 28.5413 1.78023C51.6997 0.89451 92.9286 0 165 0C237.071 0 278.3 0.89451 301.459 1.78023C310.017 2.10755 314.296 2.2712 318.51 4.5209C322.068 6.42037 325.651 10.1426 327.413 13.7709C329.5 18.0682 329.5 22.5911 329.5 31.637V68.363C329.5 77.4089 329.5 81.9318 327.413 86.2291C325.651 89.8574 322.068 93.5796 318.51 95.4791C314.296 97.7288 310.017 97.8925 301.459 98.2198C278.3 99.1055 237.071 100 165 100C92.9286 100 51.6996 99.1055 28.5413 98.2198C19.9833 97.8925 15.7043 97.7288 11.49 95.4791C7.93171 93.5796 4.34908 89.8574 2.58699 86.2291C0.5 81.9318 0.5 77.4089 0.5 68.363V31.637Z" />  
                    </clipPath>
                    <linearGradient id="grad" x1="272.219" y1="-44.1651" x2="-5.84238" y2="200.598" gradientUnits="userSpaceOnUse">
                        <stop offset="0.140625" stop-color="rgba(252,221,121)" stop-opacity="0.6"/>
                        <stop offset="0.455208" stop-color="rgba(197,125,31)" stop-opacity="0.8"/>
                        <stop offset="0.795833" stop-color="rgba(196,81,106)" stop-opacity="0.7"/>
                    </linearGradient>
                </defs>
                <g id="my-graphic" clip-path="url(#clip)">
                    <rect class="bg" x="-100px" y="-100px" height="250px" width="700px" fill="url('#grad')"/>
                </g>
            </svg>
    </div>
</template>

<script>
    export default {
        props: ['text']
    }
</script>

<style scoped>
    .grad-note {
        position: relative;
    }
    svg {
        max-width: 85%;
        z-index: 1;
        position: relative;
    }
    .bg {
        animation: move 3.3s ease-in-out forwards infinite alternate;
    }

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-transform: uppercase;
        
    }
    .screen-name {
      display: inline-block;
    }
    .error {
      max-width: 75%;
      font-size: 0.8rem;
      display: inline-block;
    }
    @media (max-width: 400px){
        .error {
            max-width: 100%;
            font-size: 0.7rem;
        }
    }

    @keyframes move {
        from {
            transform: translate(0,0);
        }
        to {
            transform: translate(50px,-50px);
        }
    }


</style>