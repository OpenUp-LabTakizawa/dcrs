"use client"

import { type ReactNode, createContext, useContext, useState } from "react"

interface NavigationBlockerContextType {
  isBlocked: boolean
  setIsBlocked: (isBlocked: boolean) => void
}

const NavigationBlockerContext = createContext<NavigationBlockerContextType>({
  isBlocked: false,
  setIsBlocked: () => {
    return
  },
})

export function NavigationBlockerProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isBlocked, setIsBlocked] = useState<boolean>(false)

  return (
    <NavigationBlockerContext.Provider value={{ isBlocked, setIsBlocked }}>
      {children}
    </NavigationBlockerContext.Provider>
  )
}

export function useNavigationBlocker() {
  return useContext(NavigationBlockerContext)
}
