import { useEffect, useState } from "react"





export default function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== "undefined" && window.matchMedia) {
            return window.matchMedia(query).matches
        }
        return false
    })

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return

        const mediaQueryList = window.matchMedia(query)
        const listener = (event: MediaQueryListEvent) => setMatches(event.matches)

        mediaQueryList.addEventListener("change", listener)
        setMatches(mediaQueryList.matches)

        return () => {
            mediaQueryList.removeEventListener("change", listener)
        }
    }, [query])

    return matches
};