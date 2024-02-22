import React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
interface AnimationStyleProps {
  duration: number
  direction: string
}
const FadeStyle = styled.div<AnimationStyleProps>`
  .fade-enter {
    opacity: 0;
    transform: ${props => props.direction}(-100%);
  }
  .fade-enter-active {
    opacity: 1;
    transform: ${props => props.direction}(0%);
  }
  .fade-exit {
    opacity: 1;
    transform: ${props => props.direction}(0%);
  }
  .fade-exit-active {
    opacity: 0;
    transform: ${props => props.direction}(100%);
  }
  .fade-enter-active,
  .fade-exit-active {
    transition:
      opacity ${props => props.duration}ms,
      transform ${props => props.duration}ms;
  }
`

type TransitionProps = {
  switcher: any
  children: React.ReactNode
  nodeRef: React.RefObject<HTMLDivElement>
  mode?: 'out-in' | 'in-out'
  direction?: 'X' | 'Y'
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
  direction = 'Y'
}) => {
  return (
    <FadeStyle
      className={className}
      direction={'translate' + direction}
      duration={duration}
    >
      <SwitchTransition mode={mode}>
        <CSSTransition
          key={String(switchProp)}
          nodeRef={nodeRef}
          addEndListener={done => {
            nodeRef.current?.addEventListener('transitionend', done, false)
          }}
          classNames="fade"
        >
          {children}
        </CSSTransition>
      </SwitchTransition>
    </FadeStyle>
  )
}
