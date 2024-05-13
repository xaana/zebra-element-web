import React from 'react'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
interface AnimationStyleProps {
  duration: number
}
const FadeStyle = styled.div<AnimationStyleProps>`
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
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
}) => {
  return (
    <FadeStyle className={className} duration={duration}>
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
