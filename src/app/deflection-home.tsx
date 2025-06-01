"use client"

import { animate } from "motion"
import { splitText } from "motion-plus"
import { useEffect, useRef } from "react"

export default function DeflectionHome() {
    const containerRef = useRef<HTMLDivElement>(null)

    // Helper to interpolate between two colors
    function lerpColor(a: number[], b: number[], t: number) {
        return a.map((v, i) => Math.round(v + (b[i] - v) * t))
    }
    // Convert rgb array to hex string
    function rgbToHex([r, g, b]: number[]) {
        return `#${[r, g, b].map(x => x.toString(16).padStart(2, "0")).join("")}`
    }

    useEffect(() => {
        document.fonts.ready.then(() => {
            if (!containerRef.current) return

            const { chars } = splitText(
                containerRef.current.querySelector(".cantilever")!
            )
            containerRef.current.style.visibility = "visible"

            // Assign each char a color along a blue-cyan gradient (initial, but will animate)
            const startColor = [37, 99, 235]   // rgb(37,99,235) Tailwind blue-600
            const endColor = [6, 182, 212]     // rgb(6,182,212) Tailwind cyan-400
            const total = chars.length

            chars.forEach((char, i) => {
                const t = total === 1 ? 0 : i / (total - 1)
                const rgb = lerpColor(startColor, endColor, t)
                char.style.color = rgbToHex(rgb)
            })

            // Animate each character's y position to simulate a cantilevered beam deflection curve
            const deflectionCurve = (i: number, progress: number) => {
                const t = i / (total - 1)
                return 20 * Math.pow(t, 3) * progress
            }

            // Color helpers for animation
            const darkBlue = [37, 99, 235] // Tailwind blue-600
            const yellow = [253, 224, 71]  // Tailwind yellow-400
            const red = [239, 68, 68]      // Tailwind red-500

            let frame = 0
            let running = true

            function animateFrame() {
                if (!running) return
                const progress = 0.5 + 0.5 * Math.sin(frame / 60)

                chars.forEach((char, i) => {
                    // Use perspective and will-change for better rendering, especially on the right side
                    const y = deflectionCurve(i, progress)
                    char.style.transform = `perspective(100px) translate3d(0, ${y}px, 0)`
                    char.style.willChange = 'transform'

                    // Gradient: blue (left) -> yellow (right)
                    const t = total === 1 ? 0 : i / (total - 1)
                    const gradientColor = lerpColor(darkBlue, yellow, t)
                    // Fade from blue to gradientColor as progress goes from 0 to 1
                    const fade = Math.min(Math.max(progress, 0), 1)
                    const rgb = lerpColor(darkBlue, gradientColor, fade)
                    char.style.color = rgbToHex(rgb)
                })
                frame++
                requestAnimationFrame(animateFrame)
            }
            animateFrame()

            return () => { running = false }
        })
    }, [])

    return (
        <div
            className="flex justify-center items-center w-full bg-white"
            ref={containerRef}
        >
            <h1 className="p-6 text-5xl md:text-6xl font-extrabold tracking-tight m-0">
                <span
                    className="cantilever oswald-700"
                    style={{ display: "inline-block", transform: "scaleY(1.2)" }}
                >
                    BEAM CALCULATOR
                </span>
            </h1>
        </div>
    )
}
