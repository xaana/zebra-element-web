
import styled from 'styled-components'
interface StyleProps {
  theme: string
}
const BlobsStyle = styled.div<StyleProps>`
  .blob {
    width: 1.2rem;
    height: 1.2rem;
    background: ${props =>
      props.theme === 'dark'
        ? 'rgba(230, 230, 230, 0.85);'
        : 'rgba(130, 134, 142, 0.85);'}
    border-radius: 50%;
    position: absolute;
    left: calc(50% - 1rem);
    top: calc(50% - 1rem);
    box-shadow: 0 0 1rem ${props =>
      props.theme === 'dark'
        ? 'rgba(255, 255, 255, 0.25);'
        : 'rgba(255, 255, 255, 0.25);'}
  }

  .blob-2 {
    -webkit-animation: animate-to-2 1s infinite;
    animation: animate-to-2 1s infinite;
  }

  .blob-3 {
    -webkit-animation: animate-to-3 1s infinite;
    animation: animate-to-3 1s infinite;
  }

  .blob-1 {
    -webkit-animation: animate-to-1 1s infinite;
    animation: animate-to-1 1s infinite;
  }

  .blob-4 {
    -webkit-animation: animate-to-4 1s infinite;
    animation: animate-to-4 1s infinite;
  }

  .blob-0 {
    -webkit-animation: animate-to-0 1s infinite;
    animation: animate-to-0 1s infinite;
  }

  .blob-5 {
    -webkit-animation: animate-to-5 1s infinite;
    animation: animate-to-5 1s infinite;
  }

  @-webkit-keyframes animate-to-2 {
    25%,
    75% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }

  @keyframes animate-to-2 {
    25%,
    75% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @-webkit-keyframes animate-to-3 {
    25%,
    75% {
      transform: translateX(0.75rem) scale(0.75);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @keyframes animate-to-3 {
    25%,
    75% {
      transform: translateX(0.75rem) scale(0.75);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @-webkit-keyframes animate-to-1 {
    25% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    50%,
    75% {
      transform: translateX(-2.5rem) scale(0.6);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @keyframes animate-to-1 {
    25% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    50%,
    75% {
      transform: translateX(-2.5rem) scale(0.6);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @-webkit-keyframes animate-to-4 {
    25% {
      transform: translateX(0.75rem) scale(0.75);
    }
    50%,
    75% {
      transform: translateX(2.5rem) scale(0.6);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @keyframes animate-to-4 {
    25% {
      transform: translateX(0.75rem) scale(0.75);
    }
    50%,
    75% {
      transform: translateX(2.5rem) scale(0.6);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @-webkit-keyframes animate-to-0 {
    25% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    50% {
      transform: translateX(-2.5rem) scale(0.6);
    }
    75% {
      transform: translateX(-3.75rem) scale(0.5);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @keyframes animate-to-0 {
    25% {
      transform: translateX(-0.75rem) scale(0.75);
    }
    50% {
      transform: translateX(-2.5rem) scale(0.6);
    }
    75% {
      transform: translateX(-3.75rem) scale(0.5);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @-webkit-keyframes animate-to-5 {
    25% {
      transform: translateX(0.75rem) scale(0.75);
    }
    50% {
      transform: translateX(2.5rem) scale(0.6);
    }
    75% {
      transform: translateX(3.75rem) scale(0.5);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
  @keyframes animate-to-5 {
    25% {
      transform: translateX(0.75rem) scale(0.75);
    }
    50% {
      transform: translateX(2.5rem) scale(0.6);
    }
    75% {
      transform: translateX(3.75rem) scale(0.5);
    }
    95% {
      transform: translateX(0rem) scale(1);
    }
  }
`
export const LoadingAnimation = () => {
  return (
    <BlobsStyle className="zexa-h-full zexa-w-full" theme={'light'}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            ></feGaussianBlur>
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            ></feColorMatrix>
            <feBlend in="SourceGraphic" in2="goo"></feBlend>
          </filter>
        </defs>
      </svg>
      <div className="blob blob-0"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      <div className="blob blob-4"></div>
      <div className="blob blob-5"></div>
    </BlobsStyle>
  )
}
