import { createContext, useContext as reactUseContext } from 'react'

const ctx = createContext(null)

const { Provider, Consumer } = ctx

let useContext
if (typeof reactUseContext === 'function') {
  useContext = reactUseContext(ctx)
} else {
  useContext = () => {
    throw new Error(
      'Error: @matthamlin/react-transition-group was loaded with a version of React that does not support the `useContext` hook. Make sure you are using a valid version of react when using the useContext hook.',
    )
  }
}

export { Provider, Consumer, useContext, ctx as Context }
