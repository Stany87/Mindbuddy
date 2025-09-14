"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Wind, Waves, Mountain } from "lucide-react"

interface ZenZoneProps {
  onBack: () => void
}

const breathingExercises = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: 60,
    icon: Wind,
  },
  {
    name: "Box Breathing",
    description: "4 counts each: inhale, hold, exhale, hold",
    duration: 120,
    icon: Sparkles,
  },
  {
    name: "Ocean Breathing",
    description: "Deep, rhythmic breathing like ocean waves",
    duration: 180,
    icon: Waves,
  },
]

// Single guided meditation type; choose posture separately
const guidedMeditations = [
  {
    title: "Mindful Breathing",
    duration: "5 min",
    description: "A calm, steady awareness of the natural breath.",
    icon: Wind,
  },
]

// Meditation postures (asanas)
const meditationAsanas = [
  {
    title: "Shavasana",
    description: "Lie on your back, arms by your sides, palms facing up.",
    icon: Mountain,
    image: "/asanas/shavasana.png",
    instructions: [
      "Lie flat on your back with legs comfortably apart, feet falling outward.",
      "Place arms slightly away from the body, palms facing up.",
      "Gently tuck the chin to lengthen the back of the neck.",
      "Soften the jaw and let the tongue rest naturally.",
      "Close your eyes and allow the whole body to relax with natural breathing.",
    ],
  },
  {
    title: "Vajrasana",
    description: "Kneel and sit back on your heels, spine tall and relaxed.",
    icon: Sparkles,
    image: "/asanas/vajrasana.png",
    instructions: [
      "Kneel on the mat with knees together and feet pointing back.",
      "Sit back on your heels; optionally place a cushion between heels and hips.",
      "Lengthen the spine, relax shoulders, and place hands on thighs.",
      "Keep the gaze soft and breathe steadily through the nose.",
      "If knees or ankles feel strained, use extra padding or switch posture.",
    ],
  },
  {
    title: "Sukhasana",
    description: "Easy cross-legged seat, shoulders soft, hands on thighs.",
    icon: Wind,
    image: "/asanas/sukhasana.png",
    instructions: [
      "Sit cross-legged on a cushion so hips are above knees.",
      "Root sit bones evenly and lengthen the spine upward.",
      "Relax shoulders away from ears; soften the face and jaw.",
      "Rest hands on thighs or in the lap; keep chest open.",
      "If hips or knees are tight, elevate the seat further or support knees.",
    ],
  },
]

// Guided meditation programs with simple step timing (seconds)
const guidedMeditationPrograms: {
  title: string
  totalSeconds: number
  steps: { label: string; seconds: number }[]
}[] = [
  {
    title: "Mindful Breathing",
    totalSeconds: 300,
    steps: [
      { label: "Settle your posture. Notice the natural breath.", seconds: 30 },
      { label: "Feel the breath at the nostrils: cool in, warm out.", seconds: 45 },
      { label: "Count breaths 1 to 5, then begin again, gently.", seconds: 60 },
      { label: "If the mind wanders, kindly return to the breath.", seconds: 60 },
      { label: "Widen awareness to the whole body breathing.", seconds: 60 },
      { label: "Rest in a calm, steady rhythm of breathing.", seconds: 45 },
    ],
  },
]

const affirmations = [
  "I am worthy of love and respect",
  "I choose peace over worry",
  "I am stronger than my challenges",
  "I deserve happiness and joy",
  "I am enough, just as I am",
  "I trust in my ability to overcome",
  "I am grateful for this moment",
  "I choose to be kind to myself",
]

// Breathing Animation Component
const BreathingAnimation = React.forwardRef<HTMLDivElement, { isPlaying: boolean; phase: string }>(
  ({ isPlaying, phase }, ref) => {
    const getScale = () => {
      if (!isPlaying) return "scale-100"
      
      switch (phase) {
        case "Inhale...": return "scale-110"
        case "Hold...": return "scale-110"
        case "Exhale...": return "scale-100"
        default: return "scale-100"
      }
    }

    return (
      <div className="flex justify-center items-center my-6">
        <div ref={ref} className={`transition-all duration-1000 ease-in-out ${getScale()}`}>
        <svg
          width="250"
          height="250"
          viewBox="0 -1.5 33 33"
          className="drop-shadow-lg"
        >
          {/* Trachea/Bronchi */}
          <g filter="url(#filter0_ii_103_1663)">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M9.73659 18.9004V15.0258C9.73659 14.4898 9.54711 14.0324 9.16812 13.6534C8.78914 13.2744 8.33168 13.0849 7.79572 13.0849H7.55311C7.35237 13.0849 7.18103 13.0139 7.03909 12.872C6.89714 12.73 6.82617 12.5587 6.82617 12.358C6.82617 12.1572 6.89714 11.9859 7.03909 11.8439C7.18103 11.702 7.35237 11.631 7.55311 11.631H8.77954C9.40569 11.631 10.0159 11.5325 10.6102 11.3354C11.2045 11.1383 11.7527 10.8526 12.2548 10.4784L14.967 8.45705C15.3571 8.16635 15.5521 7.77777 15.5521 7.29132V1.45388C15.5521 1.0524 15.694 0.709718 15.9779 0.425831C16.2618 0.141944 16.6045 0 17.006 0C17.4075 0 17.7501 0.141944 18.034 0.425831C18.3179 0.709718 18.4599 1.0524 18.4599 1.45388V7.29132C18.4599 7.77777 18.6549 8.16635 19.0449 8.45705L21.7572 10.4784C22.2592 10.8526 22.8075 11.1383 23.4017 11.3354C23.996 11.5325 24.6062 11.631 25.2324 11.631H26.4589C26.6595 11.631 26.831 11.702 26.9729 11.8439C27.1148 11.9859 27.1858 12.1572 27.1858 12.358C27.1858 12.5587 27.1148 12.73 26.9729 12.872C26.831 13.0139 26.6595 13.0849 26.4589 13.0849H26.2163C25.6804 13.0849 25.2228 13.2744 24.8438 13.6534C24.4649 14.0324 24.2753 14.4898 24.2753 15.0258V18.9004C24.2753 19.3018 24.1334 19.6445 23.8495 19.9285C23.5657 20.2124 23.223 20.3543 22.8214 20.3543C22.42 20.3543 22.0774 20.2124 21.7934 19.9285C21.5096 19.6445 21.3676 19.3018 21.3676 18.9004V16.7334C21.3676 15.815 21.1616 14.9454 20.7497 14.1247C20.3378 13.3039 19.7637 12.6192 19.0273 12.0704L17.3073 10.7885C17.2021 10.7101 17.1017 10.6294 17.006 10.5462C16.9103 10.6294 16.8098 10.7101 16.7046 10.7885L14.9846 12.0704C14.2483 12.6192 13.6742 13.3039 13.2622 14.1247C12.8503 14.9454 12.6443 15.815 12.6443 16.7334V18.9004C12.6443 19.3018 12.5024 19.6445 12.2185 19.9285C11.9346 20.2124 11.5919 20.3543 11.1905 20.3543C10.789 20.3543 10.4463 20.2124 10.1624 19.9285C9.87853 19.6445 9.73659 19.3018 9.73659 18.9004Z" 
              fill="url(#paint0_linear_103_1663)"
            />
          </g>

          {/* Left Lung */}
          <g filter="url(#filter1_i_103_1663)">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M14.4059 8.30824L15.5109 20.5009C15.7653 23.2096 14.0366 25.7434 11.2399 26.7215L5.05209 28.8946C3.51332 29.435 1.78489 28.737 1.19154 27.3354C1.05937 27.0233 0.991601 26.6915 0.991601 26.357V21.8867C0.991601 16.7224 3.32112 11.785 7.43461 8.2307L9.36579 6.54524C10.5623 5.53473 12.4523 5.57906 13.5874 6.64426C14.0665 7.11193 14.3497 7.6921 14.4059 8.30824Z" 
              fill="url(#paint1_radial_103_1663)"
            />
          </g>

          {/* Right Lung */}
          <g filter="url(#filter2_i_103_1663)">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M18.4803 20.5009L19.5854 8.30824C19.6416 7.6921 19.9247 7.11193 20.4028 6.64426C21.5372 5.57906 23.4263 5.53473 24.6221 6.54524L26.5523 8.2307C30.6636 11.785 32.9919 16.7224 32.9919 21.8867V26.357C32.9919 26.6915 32.9242 27.0233 32.7921 27.3354C32.199 28.737 30.4715 29.435 28.9336 28.8946L22.7491 26.7215C19.9546 25.7434 18.2259 23.2096 18.4803 20.5009Z" 
              fill="url(#paint2_radial_103_1663)"
            />
          </g>

          {/* Filters and Gradients */}
          <defs>
            <filter id="filter0_ii_103_1663" x="6.32617" y="-0.5" width="21.3599" height="21.3542" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="0.5" dy="0.5"/>
              <feGaussianBlur stdDeviation="0.5"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.937255 0 0 0 0 0.815686 0 0 0 1 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_1663"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="-0.5" dy="-0.5"/>
              <feGaussianBlur stdDeviation="0.5"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.980392 0 0 0 0 0.701961 0 0 0 0 0.152941 0 0 0 1 0"/>
              <feBlend mode="normal" in2="effect1_innerShadow_103_1663" result="effect2_innerShadow_103_1663"/>
            </filter>
            <filter id="filter1_i_103_1663" x="0.991699" y="4.81543" width="15.5439" height="24.262" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="1" dy="-1"/>
              <feGaussianBlur stdDeviation="1"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.67451 0 0 0 0 0 0 0 0 0 0 0 0 0 0.301961 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_1663"/>
            </filter>
            <filter id="filter2_i_103_1663" x="18.4556" y="4.81543" width="15.5361" height="24.262" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dx="1" dy="-1"/>
              <feGaussianBlur stdDeviation="1"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0.67451 0 0 0 0 0 0 0 0 0 0 0 0 0 0.301961 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_103_1663"/>
            </filter>
            <linearGradient id="paint0_linear_103_1663" x1="17.006" y1="0" x2="17.006" y2="20.3543" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCE4B1"/>
              <stop offset="1" stopColor="#FFD272"/>
            </linearGradient>
            <radialGradient id="paint1_radial_103_1663" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(6.35758 9.44267) rotate(78.1126) scale(19.8569 12.4106)">
              <stop stopColor="#FFAFAC"/>
              <stop offset="0.999998" stopColor="#F64E4C"/>
            </radialGradient>
            <radialGradient id="paint2_radial_103_1663" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22.7387 10.5987) rotate(87.463) scale(18.293 11.4312)">
              <stop stopColor="#FFAFAC"/>
              <stop offset="0.999998" stopColor="#F64E4C"/>
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
})

// Add display name for debugging
BreathingAnimation.displayName = "BreathingAnimation"

export default function ZenZone({ onBack }: ZenZoneProps) {
  const [activeExercise, setActiveExercise] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [breathElapsed, setBreathElapsed] = useState(0)
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [activeMeditation, setActiveMeditation] = useState<number | null>(null)
  const [isMeditationPlaying, setIsMeditationPlaying] = useState(false)
  const [meditationTimeLeft, setMeditationTimeLeft] = useState(0)
  const [meditationStepIndex, setMeditationStepIndex] = useState(0)
  const [selectedAsana, setSelectedAsana] = useState<string | null>(null)
  const [selectedAsanaImage, setSelectedAsanaImage] = useState<string | null>(null)
  const [selectedAsanaInstructions, setSelectedAsanaInstructions] = useState<string[] | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsPlaying(false)
            return 0
          }
          return time - 1
        })
        setBreathElapsed((e) => e + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, timeLeft])

  // Timer for guided meditation session
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMeditationPlaying && meditationTimeLeft > 0 && activeMeditation !== null) {
      interval = setInterval(() => {
        setMeditationTimeLeft((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isMeditationPlaying, meditationTimeLeft, activeMeditation])

  const startExercise = (index: number) => {
    setActiveExercise(index)
    setTimeLeft(breathingExercises[index].duration)
    setBreathElapsed(0)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetExercise = () => {
    if (activeExercise !== null) {
      setTimeLeft(breathingExercises[activeExercise].duration)
      setBreathElapsed(0)
      setIsPlaying(false)
    }
  }

  const startAgain = () => {
    if (activeExercise !== null) {
      setTimeLeft(60) // Reset to 1:00 specifically for 4-7-8 breathing
      setBreathElapsed(0)
      setIsPlaying(true)
    }
  }

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Compute current breathing phase for the selected exercise
  const getBreathingPhase = (): "Inhale..." | "Hold..." | "Exhale..." => {
    if (activeExercise === 0) {
      // 4-7-8: 4 inhale, 7 hold, 8 exhale (total 19)
      const t = breathElapsed % 19
      if (t < 4) return "Inhale..."
      if (t < 11) return "Hold..."
      return "Exhale..."
    }
    if (activeExercise === 1) {
      // Box: 4 inhale, 4 hold, 4 exhale, 4 hold (total 16)
      const t = breathElapsed % 16
      if (t < 4) return "Inhale..."
      if (t < 8) return "Hold..."
      if (t < 12) return "Exhale..."
      return "Hold..."
    }
    if (activeExercise === 2) {
      // Ocean: 6 inhale, 4 hold, 10 exhale (total 20)
      const t = breathElapsed % 20
      if (t < 6) return "Inhale..."
      if (t < 10) return "Hold..."
      return "Exhale..."
    }
    return "Inhale..."
  }

  // Guided meditation controls
  const startMeditation = (index: number) => {
    setActiveMeditation(index)
    const program = guidedMeditationPrograms[index]
    const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
    const totalSeconds = program.totalSeconds || total
    setMeditationTimeLeft(totalSeconds)
    setMeditationStepIndex(0)
    setIsMeditationPlaying(true)
  }

  const toggleMeditationPlayPause = () => {
    setIsMeditationPlaying((p) => !p)
  }

  const resetMeditation = () => {
    if (activeMeditation !== null) {
      const program = guidedMeditationPrograms[activeMeditation]
      const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
      const totalSeconds = program.totalSeconds || total
      setMeditationTimeLeft(totalSeconds)
      setMeditationStepIndex(0)
      setIsMeditationPlaying(false)
    }
  }

  const endMeditation = () => {
    setIsMeditationPlaying(false)
    setActiveMeditation(null)
    setMeditationTimeLeft(0)
    setMeditationStepIndex(0)
  }

  // Compute current step based on remaining time
  const currentMeditationStep = (() => {
    if (activeMeditation === null) return null
    const program = guidedMeditationPrograms[activeMeditation]
    const total = program.steps.reduce((acc, s) => acc + s.seconds, 0)
    const elapsed = (program.totalSeconds || total) - meditationTimeLeft
    let acc = 0
    for (let i = 0; i < program.steps.length; i++) {
      acc += program.steps[i].seconds
      if (elapsed < acc) {
        if (meditationStepIndex !== i) setMeditationStepIndex(i)
        return program.steps[i]
      }
    }
    return program.steps[program.steps.length - 1]
  })()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-border p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" className="glass-strong" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Zen Zone</h1>
              <p className="text-sm text-muted-foreground">Find your inner peace</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto space-y-6 hide-scrollbar overflow-y-auto">
        {/* Daily Affirmation */}
        <Card className="glass-strong p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-xl font-semibold mb-4">Daily Affirmation</h3>
          <p className="text-lg leading-relaxed mb-4">"{affirmations[currentAffirmation]}"</p>
          <Button variant="outline" className="glass border-primary/50 bg-transparent" onClick={nextAffirmation}>
            New Affirmation
          </Button>
        </Card>

        {/* Breathing Exercises */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Breathing Exercises
          </h3>

          {activeExercise !== null && (
            <Card className="glass mb-6 p-6 text-center bg-gradient-to-r from-primary/10 to-secondary/10">
              <h4 className="text-lg font-semibold mb-2">{breathingExercises[activeExercise].name}</h4>
              <p className="text-muted-foreground mb-4">{breathingExercises[activeExercise].description}</p>
              
              {/* Breathing Animation */}
              <BreathingAnimation 
                isPlaying={isPlaying} 
                phase={getBreathingPhase()}
              />
              
              <div className="text-4xl font-mono mb-2 text-primary font-bold">{formatTime(timeLeft)}</div>
              <div className="text-lg font-semibold mb-4 text-secondary">{getBreathingPhase()}</div>
              <div className="flex justify-center gap-3">
                <Button onClick={togglePlayPause} className="bg-primary hover:bg-primary/90">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? "Pause" : "Start"}</span>
                </Button>
                <Button variant="outline" onClick={resetExercise} className="glass bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">Reset</span>
                </Button>
                {activeExercise === 0 && timeLeft === 0 && (
                  <Button onClick={startAgain} className="bg-secondary hover:bg-secondary/90">
                    <Play className="h-4 w-4" />
                    <span className="ml-2">Start Again (1:00)</span>
                  </Button>
                )}
              </div>
              {isPlaying && (
                <div className="mt-4 p-3 glass rounded-lg">
                  <p className="text-sm text-muted-foreground">{getBreathingPhase()}</p>
                </div>
              )}
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {breathingExercises.map((exercise, index) => {
              const IconComponent = exercise.icon
              return (
                <Card
                  key={index}
                  className={`glass cursor-pointer transition-all duration-200 p-4 ${
                    activeExercise === index ? "border-primary/50 bg-primary/10" : "hover:glass-strong"
                  }`}
                  onClick={() => startExercise(index)}
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                      <p className="text-xs text-primary mt-1">{exercise.duration}s</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Guided Meditations */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Mountain className="h-5 w-5 text-secondary" />
            Guided Meditation
          </h3>
          {activeMeditation !== null && (
            <Card className="glass mb-6 p-6 bg-gradient-to-r from-secondary/10 to-primary/10">
              <h4 className="text-lg font-semibold mb-1">{guidedMeditationPrograms[activeMeditation].title}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedAsana ? `${selectedAsana} • ${guidedMeditations[0].description}` : guidedMeditations[0].description}
              </p>
              {selectedAsanaImage && (
                <div className="w-full max-w-xl mx-auto mb-4 glass-strong rounded-lg p-2">
                  <div className="w-full h-48 md:h-56 lg:h-64 bg-black/10 rounded-md flex items-center justify-center overflow-hidden">
                    <img
                      src={selectedAsanaImage}
                      alt={selectedAsana || "Selected asana"}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
              {selectedAsanaInstructions && selectedAsanaInstructions.length > 0 && (
                <div className="w-full max-w-xl mx-auto mb-4 glass p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">How to practice {selectedAsana}</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedAsanaInstructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="text-4xl font-mono mb-2 text-secondary font-bold">{formatTime(meditationTimeLeft)}</div>
              <div className="text-base mb-4">
                {currentMeditationStep ? currentMeditationStep.label : "Getting settled..."}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={toggleMeditationPlayPause} className="bg-secondary hover:bg-secondary/90">
                  {isMeditationPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isMeditationPlaying ? "Pause" : "Start"}</span>
                </Button>
                <Button variant="outline" onClick={resetMeditation} className="glass bg-transparent">
                  <RotateCcw className="h-4 w-4" />
                  <span className="ml-2">Reset</span>
                </Button>
                <Button variant="outline" onClick={endMeditation} className="glass bg-transparent">
                  End Session
                </Button>
              </div>
            </Card>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {meditationAsanas.map((asana, index) => {
              const IconComponent = asana.icon
              return (
                <Card
                  key={index}
                  className={`glass cursor-pointer transition-all duration-200 p-4 ${
                    selectedAsana === asana.title ? "border-secondary/50 bg-secondary/10" : "hover:glass-strong"
                  }`}
                  onClick={() => {
                    setSelectedAsana(asana.title)
                    setSelectedAsanaImage(asana.image)
                    setSelectedAsanaInstructions((asana as any).instructions || null)
                    if (activeMeditation === null) startMeditation(0)
                  }}
                >
                  <div className="text-center space-y-3">
                    <div className="w-full h-36 md:h-40 glass-strong rounded-lg overflow-hidden bg-black/10 flex items-center justify-center">
                      <img
                        src={asana.image}
                        alt={asana.title}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                    <div className="w-12 h-12 mx-auto rounded-full glass flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{asana.title}</h4>
                      <p className="text-sm text-muted-foreground">{asana.description}</p>
                      <p className="text-xs text-secondary mt-1">{guidedMeditations[0].duration}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Quick Calm Tips */}
        <Card className="glass-strong p-6">
          <h3 className="text-xl font-semibold mb-4">Quick Calm Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Take 5 deep breaths, counting each one</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Name 5 things you can see around you</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Gently stretch your neck and shoulders</p>
            </div>
            <div className="p-3 glass rounded-lg">
              <p className="text-sm">Drink a glass of water mindfully</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
