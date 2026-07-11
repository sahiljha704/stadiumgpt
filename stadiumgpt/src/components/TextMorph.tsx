"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useId } from "react"

export default function TextMorph({ words = "Navigate,Better", color = "#DE5499", font = {} }: any) {
    const { scrollY } = useScroll()
    const wordList = words.split(',').map((w: string) => w.trim())
    
    const word1 = wordList[0] || "Navigate"
    const word2 = wordList[1] || "Better"

    const opacity1 = useTransform(scrollY, [0, 200], [1, 0])
    const blur1 = useTransform(scrollY, [0, 200], ["blur(0px)", "blur(20px)"])
    const scale1 = useTransform(scrollY, [0, 200], [1, 0.8])
    
    const opacity2 = useTransform(scrollY, [0, 200], [0, 1])
    const blur2 = useTransform(scrollY, [0, 200], ["blur(20px)", "blur(0px)"])
    const scale2 = useTransform(scrollY, [0, 200], [1.2, 1])

    const rawId = useId()
    const filterId = `goo-${rawId.replace(/[:]/g, "")}`

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", userSelect: "none" }}>
            <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden>
                <defs>
                    <filter id={filterId}>
                        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -9" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <div style={{ position: "relative", filter: `url(#${filterId})`, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <motion.div style={{ position: 'absolute', opacity: opacity1, filter: blur1, scale: scale1, color, ...font }}>{word1}</motion.div>
                <motion.div style={{ position: 'absolute', opacity: opacity2, filter: blur2, scale: scale2, color, ...font }}>{word2}</motion.div>
            </div>
        </div>
    )
}

