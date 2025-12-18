import React, { useRef, useEffect, memo } from 'react'

const CanvasWheel = memo(({ names, colors, rotation, width = 800, height = 800, centerImage = null, centerImageSize = 'M' }) => {
    const canvasRef = useRef(null)
    const centerImageLoadedRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        // Use optimized context settings for smooth animation
        const ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true, // Better performance for animations
            willReadFrequently: false,
            powerPreference: 'high-performance' // Use dedicated GPU if available
        })
        // Reduce DPR for many entries to improve performance
        const baseDpr = window.devicePixelRatio || 1
        const dpr = names.length > 2000 ? Math.min(baseDpr, 1.5) : baseDpr

        // Throttle resize for better performance with many entries
        let resizeTimeout = null
        const handleResize = () => {
            // Clear previous timeout
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            
            // Reduced throttling for smoother updates
            const throttleDelay = names.length > 5000 ? 100 : names.length > 2000 ? 50 : 0
            
            resizeTimeout = setTimeout(() => {
                const displayWidth = canvas.clientWidth || width
                const displayHeight = canvas.clientHeight || height

                // Set actual size in memory (scaled to account for extra pixel density)
                canvas.width = displayWidth * dpr
                canvas.height = displayHeight * dpr

                // Normalize coordinate system to use css pixels
                ctx.scale(dpr, dpr)
                
                // Enable image smoothing for better quality
                ctx.imageSmoothingEnabled = true
                ctx.imageSmoothingQuality = 'high'
                
                // Performance optimizations for many entries
                if (names.length > 1000) {
                    // Reduce quality slightly for better performance with many entries
                    ctx.imageSmoothingQuality = 'medium'
                }

                const centerX = displayWidth / 2
                const centerY = displayHeight / 2
                // FIXED 20px padding (Matches App.css)
                const radius = Math.min(centerX, centerY) - 20

                drawWheel(centerX, centerY, radius, displayWidth, displayHeight)
            }, throttleDelay)
        }

        const resizeObserver = new ResizeObserver(() => {
            handleResize()
        })
        resizeObserver.observe(canvas)
        
        // Throttle redraws during animation for better performance with many entries
        let lastDrawTime = 0
        const minDrawInterval = names.length > 2000 ? 16 : names.length > 1000 ? 8 : 0 // Throttle to ~60fps or ~120fps
        
        const throttledDraw = () => {
            const now = performance.now()
            if (now - lastDrawTime >= minDrawInterval) {
                const displayWidth = canvas.clientWidth || width
                const displayHeight = canvas.clientHeight || height
                const centerX = displayWidth / 2
                const centerY = displayHeight / 2
                const radius = Math.min(centerX, centerY) - 20
                drawWheel(centerX, centerY, radius, displayWidth, displayHeight)
                lastDrawTime = now
            }
        }
        
        // Initial draw
        throttledDraw()
        
        // Use requestAnimationFrame for smooth updates
        let rafId = null
        const scheduleDraw = () => {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                throttledDraw()
                rafId = null
            })
        }
        
        // Schedule draw when rotation changes (effect runs when rotation changes)
        scheduleDraw()

        // Load center image when it changes
        if (centerImage) {
            // Only load if not already loaded or if URL changed
            if (!centerImageLoadedRef.current || centerImageLoadedRef.current.src !== centerImage) {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => {
                    centerImageLoadedRef.current = img
                    // Force immediate redraw after image loads
                    setTimeout(() => {
                        const displayWidth = canvas.clientWidth || width
                        const displayHeight = canvas.clientHeight || height
                        const centerX = displayWidth / 2
                        const centerY = displayHeight / 2
                        const radius = Math.min(centerX, centerY) - 20
                        drawWheel(centerX, centerY, radius, displayWidth, displayHeight)
                    }, 50)
                }
                img.onerror = (error) => {
                    console.error('Failed to load center image:', centerImage, error)
                    centerImageLoadedRef.current = null
                }
                if (typeof centerImage === 'string') {
                    img.src = centerImage
                }
            }
        } else {
            centerImageLoadedRef.current = null
        }

        // Initial Draw
        handleResize()

        // Helper to draw the wheel (extracted for reuse)
        function drawWheel(centerX, centerY, radius, displayWidth, displayHeight) {
            // Clear canvas
            ctx.clearRect(0, 0, displayWidth, displayHeight)

            const numSegments = names.length
            const sliceAngle = (2 * Math.PI) / numSegments

            // For many entries, use simpler rendering
            const isManyEntries = names.length > 2000
            const isVeryManyEntries = names.length > 5000
            
            // Save context for wheel rotation
            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate((rotation * Math.PI) / 180)
            
            // For very many entries, disable expensive operations
            if (isVeryManyEntries) {
                ctx.imageSmoothingEnabled = false
            }

            // Draw Shadow (behind the wheel) - Skip for many entries for performance
            if (names.length < 2000) {
                ctx.save()
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.shadowBlur = 15
                ctx.shadowOffsetY = 10
                ctx.beginPath()
                ctx.arc(0, 0, radius, 0, 2 * Math.PI)
                ctx.fillStyle = 'rgba(0,0,0,0)'
                ctx.fill()
                ctx.restore()
            }

            // Aggressive performance optimization for many entries (already declared above)
            
            // Performance optimization: Skip text rendering for very small slices
            const minSliceAngleForText = names.length > 500 ? 0.01 : 0.001
            
            // For very many entries (500+), completely hide text for better performance
            const shouldShowText = names.length < 500
            
            // Performance: Skip shadow for many entries
            const shouldDrawShadow = names.length < 1000
            
            // Performance: Skip gradient for many entries (more aggressive for smooth spinning)
            const shouldDrawGradient = names.length < 300
            
            // For very many entries, skip strokes entirely (more aggressive for smooth spinning)
            const shouldDrawStrokes = names.length < 500
            
            // Batch draw segments for better performance
            // For very large lists, skip expensive operations
            names.forEach((name, index) => {
                // 0 degrees in standard canvas is 3 o'clock. 
                // We want index 0 to start at -90 degrees (12 o'clock)
                const startAngle = index * sliceAngle - Math.PI / 2
                const endAngle = startAngle + sliceAngle

                // Draw Segment - optimized path (minimal operations)
                ctx.beginPath()
                ctx.moveTo(0, 0)
                ctx.arc(0, 0, radius, startAngle, endAngle)
                ctx.closePath()

                ctx.fillStyle = colors[index % colors.length]
                ctx.fill()

                // Add "Shine" / Gradient Depth (skip for very large lists to improve performance)
                if (shouldDrawGradient && !isManyEntries) {
                    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
                    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0)')
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)')
                    ctx.fillStyle = gradient
                    ctx.fill()
                }

                // Adjust stroke width based on number of segments for better visibility
                // For many entries, skip strokes entirely for performance
                if (shouldDrawStrokes) {
                    const strokeWidth = names.length > 500 ? 0.5 : 1
                    ctx.lineWidth = strokeWidth
                    ctx.strokeStyle = names.length > 500 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'
                    ctx.stroke()
                }

                // Draw Text only if slice is large enough and we should show text
                if (shouldShowText && sliceAngle >= minSliceAngleForText) {
                    ctx.save()
                    const midAngle = startAngle + sliceAngle / 2
                    ctx.rotate(midAngle)

                    ctx.textAlign = 'right'
                    ctx.textBaseline = 'middle'

                    const bgColor = colors[index % colors.length]
                    if (bgColor === '#efb71d' || bgColor === '#24a643') {
                        ctx.fillStyle = '#000000'
                    } else {
                        ctx.fillStyle = '#FFFFFF'
                    }

                    // Dynamic font sizing
                    const textRadius = radius - 20
                    const arcLength = textRadius * sliceAngle
                    const isMobile = window.innerWidth < 768
                    let computedSize = arcLength / (isMobile ? 4.5 : 6)
                    const minSize = isMobile ? 8 : 10 // Smaller min size for large lists
                    const maxSize = isMobile ? 42 : 40
                    let fontSize = Math.max(minSize, Math.min(maxSize, computedSize))

                    ctx.font = `500 ${fontSize}px "Montserrat", sans-serif`

                    ctx.shadowColor = 'rgba(0,0,0,0.2)'
                    ctx.shadowBlur = 2
                    ctx.shadowOffsetX = 1
                    ctx.shadowOffsetY = 1

                    // Truncate long names for very small slices
                    let displayName = name
                    if (names.length > 500 && name.length > 10) {
                        displayName = name.substring(0, 10) + '...'
                    }

                    ctx.fillText(displayName, radius - 25, 0)
                    ctx.restore()
                }
            })

            // Draw Center Hub and Image INSIDE the rotation context (so image rotates with wheel)
            const isMobile = window.innerWidth < 768
            // Increased hub radius for bigger center circle
            const hubRadius = isMobile ? 35 : 70

            // Draw Center Circle (Hub) - Smaller on Mobile
            ctx.beginPath()
            ctx.arc(0, 0, hubRadius, 0, 2 * Math.PI)
            ctx.fillStyle = 'white'
            ctx.shadowColor = 'rgba(0,0,0,0.2)'
            ctx.shadowBlur = 5
            ctx.fill()
            
            // Draw center image if provided and loaded (INSIDE rotation context so it rotates with wheel)
            if (centerImageLoadedRef.current && 
                centerImageLoadedRef.current.complete && 
                centerImageLoadedRef.current.naturalWidth > 0) {
                try {
                    // Calculate image size based on size setting
                    // Increased image size to match bigger center circle
                    let imageRadius
                    if (centerImageSize === 'S') {
                        imageRadius = hubRadius * 0.7 // Small (increased from 0.6)
                    } else if (centerImageSize === 'L') {
                        imageRadius = hubRadius * 1.3 // Large (increased from 1.2)
                    } else {
                        imageRadius = hubRadius * 1.0 // Medium (increased from 0.9 to fill circle better)
                    }
                    
                    // Draw image in center circle (will rotate with wheel since we're inside rotation context)
                    ctx.save()
                    ctx.beginPath()
                    ctx.arc(0, 0, imageRadius, 0, 2 * Math.PI)
                    ctx.clip()
                    // Draw image centered
                    ctx.drawImage(
                        centerImageLoadedRef.current, 
                        -imageRadius, 
                        -imageRadius, 
                        imageRadius * 2, 
                        imageRadius * 2
                    )
                    ctx.restore()
                } catch (error) {
                    console.error('Error drawing center image:', error)
                }
            }

            ctx.restore()
        }

        return () => {
            resizeObserver.disconnect()
            if (resizeTimeout) {
                clearTimeout(resizeTimeout)
            }
            if (rafId) {
                cancelAnimationFrame(rafId)
            }
        }
    }, [names, colors, rotation, width, height, centerImage, centerImageSize])

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                touchAction: 'none'
            }}
        />
    )
})

CanvasWheel.displayName = 'CanvasWheel'

export default CanvasWheel
