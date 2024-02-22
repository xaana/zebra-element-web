import React from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components'
interface AnimationStyleProps {
  duration: number
}
const FadeStyle = styled.div<AnimationStyleProps>`
  .fade-enter {
    opacity: 0;
    transform: scale(0.9);
  }
  .fade-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition:
      opacity ${props => props.duration}ms,
      transform ${props => props.duration}ms;
  }
  .fade-exit {
    opacity: 1;
  }
  .fade-exit-active {
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity ${props => props.duration}ms,
      transform ${props => props.duration}ms;
  }
`
type TransitionProps = {
  in: boolean
  duration?: number
  children: React.ReactNode
  nodeRef: React.RefObject<HTMLDivElement>
  className?: string
}

export const FadeTransition: React.FC<TransitionProps> = ({
  in: inProp,
  duration = 300,
  children,
  nodeRef,
  className = ''
}) => {
  return (
    <FadeStyle className={className} duration={duration}>
      <CSSTransition
        in={inProp}
        nodeRef={nodeRef}
        timeout={duration}
        classNames="fade"
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </FadeStyle>
  )
}
