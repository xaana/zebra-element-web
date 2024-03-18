import React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
interface AnimationStyleProps {
  duration: number
  direction: string
  entertransform: string
  exittransform: string
}
const FadeStyle = styled.div<AnimationStyleProps>`
  .fade-enter {
    opacity: 0;
    transform: ${(props) => props.entertransform};
  }
  .fade-enter-active {
    opacity: 1;
    transform: ${(props) => props.direction}(0%);
  }
  .fade-exit {
    opacity: 1;
    transform: ${(props) => props.direction}(0%);
  }
  .fade-exit-active {
    opacity: 0;
    transform: ${(props) => props.exittransform};
  }
  .fade-enter-active,
  .fade-exit-active {
    transition:
      opacity ${(props) => props.duration}ms,
      transform ${(props) => props.duration}ms;
  }
`

type TransitionProps = {
  switcher: any
  children: React.ReactNode
  nodeRef: React.RefObject<HTMLDivElement>
  mode?: 'out-in' | 'in-out'
  direction?: 'X' | 'Y'
  reverse?: boolean
  duration?: number
  className?: string
}

export const SwitchFadeTransition: React.FC<TransitionProps> = ({
  switcher: switchProp,
  duration = 300,
  children,
  nodeRef,
  className = '',
  mode = 'out-in',
  direction = 'Y',
  reverse = false,
}) => {
  return (
    <FadeStyle
      className={className}
      direction={'translate' + direction}
      duration={duration}
      entertransform={`translate${direction}(${reverse ? '-' : ''}100%)`}
      exittransform={`translate${direction}(${reverse ? '' : '-'}100%)`}
    >
      <SwitchTransition mode={mode}>
        <CSSTransition
          key={String(switchProp)}
          nodeRef={nodeRef}
          addEndListener={(done) => {
            nodeRef.current?.addEventListener('transitionend', done, false)
          }}
          timeout={duration}
          classNames='fade'
        >
          {children}
        </CSSTransition>
      </SwitchTransition>
    </FadeStyle>
  )
}
