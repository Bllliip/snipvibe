
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles, Zap, ArrowDownToLine } from "lucide-react"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface PricingTier {
  name: string
  price: {
    monthly: number
    yearly: number
    originalYearly?: number
  }
  description: string
  features: Feature[]
  highlight?: boolean
  badge?: string
  icon: React.ReactNode
}

interface PricingSectionProps {
  tiers: PricingTier[]
  className?: string
}

function PricingSection({ tiers, className }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)

  const buttonStyles = {
    default: cn(
      "h-12 bg-[#1c1528] hover:bg-[#2a1f3d]",
      "text-white",
      "border border-[#3d2e59]",
      "hover:border-[#4d3a69]",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium",
    ),
    highlight: cn(
      "h-12 bg-purple-800 hover:bg-purple-700",
      "text-white",
      "shadow-[0_1px_15px_rgba(168,85,247,0.3)]",
      "hover:shadow-[0_1px_20px_rgba(168,85,247,0.4)]",
      "font-semibold text-base",
    ),
  }

  const badgeStyles = cn(
    "px-4 py-1.5 text-sm font-medium",
    "bg-purple-800",
    "text-white",
    "border-none shadow-lg",
  )

  return (
    <section
      className={cn(
        "relative bg-[#0c0414] text-white",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold text-white">
            Simple, transparent pricing
          </h2>
          <div className="inline-flex items-center p-1.5 bg-[#1c1528]/50 rounded-full border border-[#3d2e59] shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-purple-800 text-white shadow-lg"
                    : "text-gray-400 hover:text-white",
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-gradient-to-b from-[#3d2e59]/30 to-transparent"
                  : "bg-[#1c1528]/50",
                "border",
                tier.highlight
                  ? "border-purple-500/30 shadow-xl"
                  : "border-[#3d2e59] shadow-md",
                "hover:translate-y-0 hover:shadow-lg",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-[#2a1f3d] text-white"
                        : "bg-[#1c1528] text-gray-300",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">
                      {isYearly ? (
                        tier.price.yearly === 0 ? (
                          "Free"
                        ) : (
                          "$" + tier.price.yearly
                        )
                      ) : tier.price.monthly === 0 ? (
                        "Free"
                      ) : (
                        "$" + tier.price.monthly
                      )}
                    </span>
                    {((isYearly && tier.price.yearly !== 0) || (!isYearly && tier.price.monthly !== 0)) && (
                      <span className="text-sm text-gray-400">
                        /{isYearly ? "year" : "month"}
                      </span>
                    )}
                    {isYearly && tier.price.originalYearly && (
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-lg text-gray-400 line-through">
                          ${tier.price.originalYearly}
                        </span>
                        <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                          30% OFF
                        </Badge>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-300">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-purple-400"
                            : "text-gray-600",
                        )}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {feature.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? buttonStyles.highlight
                      : buttonStyles.default,
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tier.highlight ? (
                      <>
                        Buy now
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get started
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }
