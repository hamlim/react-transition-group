import PropTypes from 'prop-types'
import React from 'react'
import TransitionGroup from './TransitionGroup'

const propTypes = {
  in: PropTypes.bool.isRequired,
  children(props, propName) {
    if (React.Children.count(props[propName]) !== 2)
      return new Error(
        `"${propName}" must be exactly two transition components.`,
      )

    return null
  },
}

/**
 * The `<ReplaceTransition>` component is a specialized `Transition` component
 * that animates between two children.
 *
 * ```jsx
 * <ReplaceTransition in>
 *   <Fade><div>I appear first</div></Fade>
 *   <Fade><div>I replace the above</div></Fade>
 * </ReplaceTransition>
 * ```
 */
class ReplaceTransition extends React.Component {
  constructor(...args) {
    super(...args)
    this.setRef = this.setRef.bind(this)
  }
  handleEnter = (...args) => this.handleLifecycle('onEnter', 0, args)
  handleEntering = (...args) => this.handleLifecycle('onEntering', 0, args)
  handleEntered = (...args) => this.handleLifecycle('onEntered', 0, args)

  handleExit = (...args) => this.handleLifecycle('onExit', 1, args)
  handleExiting = (...args) => this.handleLifecycle('onExiting', 1, args)
  handleExited = (...args) => this.handleLifecycle('onExited', 1, args)

  handleLifecycle(handler, idx, originalArgs) {
    const { children } = this.props
    const child = React.Children.toArray(children)[idx]

    if (child.props[handler]) child.props[handler](...originalArgs)
    if (this.props[handler]) this.props[handler](this.refNode)
  }

  setRef(ref) {
    this.refNode = ref
  }

  render() {
    const { children, in: inProp, ...props } = this.props
    const [first, second] = React.Children.toArray(children)

    delete props.onEnter
    delete props.onEntering
    delete props.onEntered
    delete props.onExit
    delete props.onExiting
    delete props.onExited

    return (
      <TransitionGroup {...props}>
        {inProp
          ? React.cloneElement(first, {
              key: 'first',
              onEnter: this.handleEnter,
              onEntering: this.handleEntering,
              onEntered: this.handleEntered,
              setRef: this.setRef,
            })
          : React.cloneElement(second, {
              key: 'second',
              onEnter: this.handleExit,
              onEntering: this.handleExiting,
              onEntered: this.handleExited,
              setRef: this.setRef,
            })}
      </TransitionGroup>
    )
  }
}

ReplaceTransition.propTypes = propTypes

export default ReplaceTransition
