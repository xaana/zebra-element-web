import { useEffect } from 'react'

import styled from 'styled-components'
interface StyleProps {
  dark: boolean
}
const Style = styled.div<StyleProps>`
  .Loader {
    --loader-size: 75px;
    --text-color: #cecece; /* Fill data-text */
    --color-one: #2979ff;
    --color-two: #ff1744;
    --color-three: #ffff8d;
    --color-four: #b2ff59;
    --color-one: ${({ dark }) => (dark ? '#2979ff' : '#91A3BA')};
    --color-two: ${({ dark }) => (dark ? '#ff1744' : '#B18A97')};
    --color-three: ${({ dark }) => (dark ? '#ffff8d' : '#B5B58E')};
    --color-four: ${({ dark }) => (dark ? '#b2ff59' : '#9BA491')};
    --light-size: 2px;
    position: relative;
    width: 75px;
    width: var(--loader-size, 75px);
    overflow: visible;
    margin: 25px;
    border-radius: 50%;
    // box-shadow:
    //   inset 0 0 8px rgba(255, 255, 255, 0.4),
    //   0 0 25px rgba(255, 255, 255, 0.8);
    box-shadow: ${({ dark }) =>
      dark
        ? 'inset 0 0 20px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.8);'
        : 'inset 0 0 20px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 0, 0, 0.5);'};
  }

  .Loader {
    /* Keep ratio on resize*/
  }

  .Loader::after {
    content: attr(data-text);
    color: #cecece;
    color: var(--text-color, #cecece);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: calc(70% + 0.1vw);
    text-transform: uppercase;
    letter-spacing: 5px;
  }

  .Loader::before {
    content: '';
    float: left;
    padding-top: 100%;
  }

  .Loader__Circle {
    display: block;
    position: absolute;
    border-radius: 50%;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    opacity: ${({ dark }) => (dark ? '0.8;' : '1;')}
    // opacity: 0.8;
    // mix-blend-mode: screen;
    mix-blend-mode: ${({ dark }) => (dark ? 'screen;' : 'overlay;')}
    filter: brightness(120%);
    -webkit-animation-name: SpinAround;
    animation-name: SpinAround;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
  }

  .Loader__Circle:nth-of-type(1) {
    box-shadow:
      inset 1px 0 0 1px #2979ff,
      3px 0 0 3px #2979ff;
    box-shadow:
      inset 1px 0 0 1px var(--color-one, #2979ff),
      var(--light-size, 4px) 0 0 var(--light-size, 4px)
        var(--color-one, #2979ff);
    animation-direction: reverse;
    transform-origin: 49.6% 49.8%;
  }

  .Loader__Circle:nth-of-type(2) {
    box-shadow:
      inset 1px 0 0 1px #ff1744,
      3px 0px 0 3px #ff1744;
    box-shadow:
      inset 1px 0 0 1px var(--color-two, #ff1744),
      var(--light-size, 4px) 0px 0 var(--light-size, 4px)
        var(--color-two, #ff1744);
    transform-origin: 49.5% 49.8%;
  }

  .Loader__Circle:nth-of-type(3) {
    box-shadow:
      inset 1px 0 0 1px #ffff8d,
      0 3px 0 3px #ffff8d;
    box-shadow:
      inset 1px 0 0 1px var(--color-three, #ffff8d),
      0 var(--light-size, 4px) 0 var(--light-size, 4px)
        var(--color-three, #ffff8d);
    transform-origin: 49.8% 49.8%;
  }

  .Loader__Circle:nth-of-type(4) {
    box-shadow:
      inset 1px 0 0 1px #b2ff59,
      0 3px 0 3px #b2ff59;
    box-shadow:
      inset 1px 0 0 1px var(--color-four, #b2ff59),
      0 var(--light-size, 4px) 0 var(--light-size, 4px)
        var(--color-four, #b2ff59);
    transform-origin: 49.7% 49.7%;
  }

  @-webkit-keyframes SpinAround {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(-360deg);
    }
  }

  @keyframes SpinAround {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(-360deg);
    }
  }
`

export const Spinner = ({
  inactive,
  theme
}: {
  inactive: boolean
  theme: string
}) => {
  // function randomBetween(min: number, max: number) {
  //   return Math.random() * (max - min) + min
  // }

  // function updateAnimation() {
  //   // let elem = document.querySelectorAll('.test_elem')
  //   // const htmlElem = elem[0] as HTMLElement
  //   // gsap.to(htmlElem, {
  //   //   duration: 0.25, // Duration of the transition to the new speed
  //   //   ease: 'linear',
  //   //   height: 100 * randomBetween(1, 3) // New height of the element
  //   // })

  //   // Define ranges for speed and displacement
  //   const speedMin = 2 // Minimum speed factor
  //   const speedMax = 2 // Maximum speed factor
  //   const displacementMin = 1 // Minimum displacement factor
  //   const displacementMax = 1 // Maximum displacement factor

  //   // Get all loader circles
  //   const circles = document.querySelectorAll('.Loader__Circle')

  //   // const speedFactor = randomBetween(speedMin, speedMax)
  //   const speedFactor = 2
  //   // const speedFactor = Math.round((Math.random() * 0.5 + 1.5) * 100) / 100
  //   const displacementFactor = randomBetween(displacementMin, displacementMax)
  //   // Animate each circle with new values
  //   circles.forEach((circle: Element, index: number) => {
  //     // Ensure circle is treated as an HTMLElement
  //     const htmlCircle = circle as HTMLElement
  //     // Select random values within the ranges
  //     const originX = 49.5 + index * 0.1 // Original values, adjust as necessary
  //     const originY = 49.5 + index * 0.1
  //     const newOrigin = `${originX * displacementFactor}% ${
  //       originY * displacementFactor
  //     }%`

  //     // Animate the speed
  //     gsap.to(htmlCircle, {
  //       duration: 0.25, // Duration of the transition to the new speed
  //       ease: 'linear',
  //       animationDuration: speedFactor + 's'
  //     })

  //     // Animate the displacement
  //     gsap.to(htmlCircle, {
  //       duration: 0.25, // Duration of the transition to the new displacement
  //       ease: 'linear',
  //       transformOrigin: newOrigin,
  //       onComplete: () => {
  //         //   console.log('Animation complete')
  //         //   console.log(htmlCircle.style.transformOrigin)
  //       }
  //     })
  //   })
  // }

  // //   Update animation every second with smooth transitions
  // setInterval(updateAnimation, 5000)

  function updateSpeed(speed: number) {
    // Get all loader circles
    const circles = document.querySelectorAll('.Loader__Circle')
    circles.forEach((circle: Element) => {
      // Ensure circle is treated as an HTMLElement
      const htmlCircle = circle as HTMLElement
      htmlCircle.style.animationDuration = speed + 's'
    })
  }

  useEffect(() => {
    updateSpeed(inactive ? 3 : 0.5)
  }, [inactive])

  return (
    <>
      <Style
        dark={theme === 'dark'}
        className="zexa-bg-transparent zexa-flex zexa-items-center zexa-justify-center zexa-overflow-hidden"
      >
        <div className="Loader" data-text="">
          <span className="Loader__Circle"></span>
          <span className="Loader__Circle"></span>
          <span className="Loader__Circle"></span>
          <span className="Loader__Circle"></span>
        </div>
      </Style>
    </>
  )
}
// import { useEffect } from 'react'

// import styled from 'styled-components'
// interface StyleProps {
//   dark: boolean
// }
// const Style = styled.div<StyleProps>`
//   .Loader {
//     --loader-size: 100px;
//     --text-color: #cecece; /* Fill data-text */
//     --color-one: #2979ff;
//     --color-two: #ff1744;
//     --color-three: #ffff8d;
//     --color-four: #b2ff59;
//     --light-size: 2px;
//     position: relative;
//     width: 100px;
//     width: var(--loader-size, 100px);
//     overflow: visible;
//     margin: 25px;
//     border-radius: 50%;
//     // box-shadow:
//     //   inset 0 0 8px rgba(255, 255, 255, 0.4),
//     //   0 0 25px rgba(255, 255, 255, 0.8);
//     box-shadow: ${({ dark }) =>
//       dark
//         ? 'inset 0 0 8px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.8);'
//         : 'inset 0 0 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);'};
//   }

//   .Loader {
//     /* Keep ratio on resize*/
//   }

//   .Loader::after {
//     content: attr(data-text);
//     color: #cecece;
//     color: var(--text-color, #cecece);
//     position: absolute;
//     left: 50%;
//     top: 50%;
//     transform: translate(-50%, -50%);
//     font-size: calc(70% + 0.1vw);
//     text-transform: uppercase;
//     letter-spacing: 5px;
//   }

//   .Loader::before {
//     content: '';
//     float: left;
//     padding-top: 100%;
//   }

//   .Loader__Circle {
//     display: block;
//     position: absolute;
//     border-radius: 50%;
//     top: 0px;
//     right: 0px;
//     bottom: 0px;
//     left: 0px;
//     opacity: ${({ dark }) => (dark ? '0.8;' : '1;')}
//     // opacity: 0.8;
//     // mix-blend-mode: screen;
//     mix-blend-mode: ${({ dark }) => (dark ? 'screen;' : 'overlay;')}
//     filter: brightness(120%);
//     -webkit-animation-name: SpinAround;
//     animation-name: SpinAround;
//     -webkit-animation-iteration-count: infinite;
//     animation-iteration-count: infinite;
//     -webkit-animation-duration: 0.5s;
//     animation-duration: 0.5s;
//     -webkit-animation-fill-mode: both;
//     animation-fill-mode: both;
//     -webkit-animation-timing-function: linear;
//     animation-timing-function: linear;
//   }

//   .Loader__Circle:nth-of-type(1) {
//     box-shadow:
//       inset 1px 0 0 1px #2979ff,
//       3px 0 0 3px #2979ff;
//     box-shadow:
//       inset 1px 0 0 1px var(--color-one, #2979ff),
//       var(--light-size, 4px) 0 0 var(--light-size, 4px)
//         var(--color-one, #2979ff);
//     animation-direction: reverse;
//     transform-origin: 49.6% 49.8%;
//   }

//   .Loader__Circle:nth-of-type(2) {
//     box-shadow:
//       inset 1px 0 0 1px #ff1744,
//       3px 0px 0 3px #ff1744;
//     box-shadow:
//       inset 1px 0 0 1px var(--color-two, #ff1744),
//       var(--light-size, 4px) 0px 0 var(--light-size, 4px)
//         var(--color-two, #ff1744);
//     transform-origin: 49.5% 49.8%;
//   }

//   .Loader__Circle:nth-of-type(3) {
//     box-shadow:
//       inset 1px 0 0 1px #ffff8d,
//       0 3px 0 3px #ffff8d;
//     box-shadow:
//       inset 1px 0 0 1px var(--color-three, #ffff8d),
//       0 var(--light-size, 4px) 0 var(--light-size, 4px)
//         var(--color-three, #ffff8d);
//     transform-origin: 49.8% 49.8%;
//   }

//   .Loader__Circle:nth-of-type(4) {
//     box-shadow:
//       inset 1px 0 0 1px #b2ff59,
//       0 3px 0 3px #b2ff59;
//     box-shadow:
//       inset 1px 0 0 1px var(--color-four, #b2ff59),
//       0 var(--light-size, 4px) 0 var(--light-size, 4px)
//         var(--color-four, #b2ff59);
//     transform-origin: 49.7% 49.7%;
//   }

//   @-webkit-keyframes SpinAround {
//     0% {
//       transform: rotate(0);
//     }

//     100% {
//       transform: rotate(-360deg);
//     }
//   }

//   @keyframes SpinAround {
//     0% {
//       transform: rotate(0);
//     }

//     100% {
//       transform: rotate(-360deg);
//     }
//   }
// `

// export const Spinner = ({
//   inactive,
//   theme
// }: {
//   inactive: boolean
//   theme: string
// }) => {
//   // function randomBetween(min: number, max: number) {
//   //   return Math.random() * (max - min) + min
//   // }

//   // function updateAnimation() {
//   //   // let elem = document.querySelectorAll('.test_elem')
//   //   // const htmlElem = elem[0] as HTMLElement
//   //   // gsap.to(htmlElem, {
//   //   //   duration: 0.25, // Duration of the transition to the new speed
//   //   //   ease: 'linear',
//   //   //   height: 100 * randomBetween(1, 3) // New height of the element
//   //   // })

//   //   // Define ranges for speed and displacement
//   //   const speedMin = 2 // Minimum speed factor
//   //   const speedMax = 2 // Maximum speed factor
//   //   const displacementMin = 1 // Minimum displacement factor
//   //   const displacementMax = 1 // Maximum displacement factor

//   //   // Get all loader circles
//   //   const circles = document.querySelectorAll('.Loader__Circle')

//   //   // const speedFactor = randomBetween(speedMin, speedMax)
//   //   const speedFactor = 2
//   //   // const speedFactor = Math.round((Math.random() * 0.5 + 1.5) * 100) / 100
//   //   const displacementFactor = randomBetween(displacementMin, displacementMax)
//   //   // Animate each circle with new values
//   //   circles.forEach((circle: Element, index: number) => {
//   //     // Ensure circle is treated as an HTMLElement
//   //     const htmlCircle = circle as HTMLElement
//   //     // Select random values within the ranges
//   //     const originX = 49.5 + index * 0.1 // Original values, adjust as necessary
//   //     const originY = 49.5 + index * 0.1
//   //     const newOrigin = `${originX * displacementFactor}% ${
//   //       originY * displacementFactor
//   //     }%`

//   //     // Animate the speed
//   //     gsap.to(htmlCircle, {
//   //       duration: 0.25, // Duration of the transition to the new speed
//   //       ease: 'linear',
//   //       animationDuration: speedFactor + 's'
//   //     })

//   //     // Animate the displacement
//   //     gsap.to(htmlCircle, {
//   //       duration: 0.25, // Duration of the transition to the new displacement
//   //       ease: 'linear',
//   //       transformOrigin: newOrigin,
//   //       onComplete: () => {
//   //         //   console.log('Animation complete')
//   //         //   console.log(htmlCircle.style.transformOrigin)
//   //       }
//   //     })
//   //   })
//   // }

//   // //   Update animation every second with smooth transitions
//   // setInterval(updateAnimation, 5000)

//   function updateSpeed(speed: number) {
//     // Get all loader circles
//     const circles = document.querySelectorAll('.Loader__Circle')
//     circles.forEach((circle: Element) => {
//       // Ensure circle is treated as an HTMLElement
//       const htmlCircle = circle as HTMLElement
//       htmlCircle.style.animationDuration = speed + 's'
//     })
//   }

//   useEffect(() => {
//     updateSpeed(inactive ? 3 : 0.5)
//   }, [inactive])

//   return (
//     <>
//       <Style
//         dark={theme === 'dark'}
//         className="zexa-bg-transparent zexa-flex zexa-items-center zexa-justify-center zexa-overflow-hidden"
//       >
//         <div className="Loader" data-text="">
//           <span className="Loader__Circle"></span>
//           <span className="Loader__Circle"></span>
//           <span className="Loader__Circle"></span>
//           <span className="Loader__Circle"></span>
//         </div>
//       </Style>
//     </>
//   )
// }
