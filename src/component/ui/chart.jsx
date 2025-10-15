import * as React from "react"
import * as Recharts from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: { CSS_VARIABLE, CSS_VARIABLE_LIGHT, CSS_VARIABLE_DARK } }
const THEMES = {
  light: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    card: "0 0% 100%",
    cardForeground: "240 10% 3.9%",
    popover: "0 0% 100%",
    popoverForeground: "240 10% 3.9%",
    primary: "240 5.9% 10%",
    primaryForeground: "0 0% 98%",
    secondary: "240 4.8% 95.9%",
    secondaryForeground: "240 5.9% 10%",
    muted: "240 4.8% 95.9%",
    mutedForeground: "240 3.8% 46.1%",
    accent: "240 4.8% 95.9%",
    accentForeground: "240 5.9% 10%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "0 0% 98%",
    border: "240 5.9% 90%",
    input: "240 5.9% 90%",
    ring: "240 5.9% 10%",
  },
  dark: {
    background: "240 10% 3.9%",
    foreground: "0 0% 98%",
    card: "240 10% 3.9%",
    cardForeground: "0 0% 98%",
    popover: "240 10% 3.9%",
    popoverForeground: "0 0% 98%",
    primary: "0 0% 98%",
    primaryForeground: "240 5.9% 10%",
    secondary: "240 3.7% 15.9%",
    secondaryForeground: "0 0% 98%",
    muted: "240 3.7% 15.9%",
    mutedForeground: "240 5% 64.9%",
    accent: "240 3.7% 15.9%",
    accentForeground: "0 0% 98%",
    destructive: "0 62.8% 30.6%",
    destructiveForeground: "0 0% 98%",
    border: "240 3.7% 15.9%",
    input: "240 3.7% 15.9%",
    ring: "0 0% 98%",
  },
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const chartContainerRef = React.useRef(null)
    const [activeChart, setActiveChart] = React.useState(
      config ? Object.keys(config)[0] : undefined
    )

    const chartConfig = React.useMemo(() => {
      const newConfig = config
        ? Object.entries(config).reduce(
            (prev, [key, value]) => {
              const newColor = value.color

              if (newColor) {
                if (typeof newColor === "string" && newColor.match(/^var\(--/)) {
                  // Don't modify it.
                  prev[key] = { ...value, color: newColor }
                  return prev
                }
                // Otherwise, compute the color from the theme.
                prev[key] = {
                  ...value,
                  color: `hsl(var(--chart-${key}))`,
                }
              } else {
                prev[key] = value
              }

              return prev
            },
            {}
          )
        : {}

      return newConfig
    }, [config])

    React.useEffect(() => {
      const container = chartContainerRef.current
      if (!container) return

      const newColors = Object.entries(chartConfig).reduce(
        (prev, [key, value]) => {
          if (value.color && value.color.startsWith("hsl")) {
            // hsl(var(--chart-1))
            const color = value.color.match(/hsl\(var\(--(.*)\)\)/)
            if (color) {
              prev.push([color[1], value.theme, `chart-${key}`])
            }
          }
          return prev
        },
        []
      )

      // Set the CSS variables for the chart colors.
      // These are used by the recharts components.
      newColors.forEach(([variableName, theme, FallbackVariableName]) => {
        if (theme) {
          Object.entries(theme).forEach(([key, value]) => {
            container.style.setProperty(`--${variableName}-${key}`, value)
          })
          return
        }

        // Has a fallback variable, so we just need to set it.
        container.style.setProperty(`--${variableName}`, `var(--${FallbackVariableName})`)
      })
    }, [chartConfig])

    return (
      <ChartContext.Provider
        value={{
          chartContainerRef,
          chartConfig,
          activeChart,
          setActiveChart,
        }}
      >
        <div
          ref={chartContainerRef}
          className={cn(
            "flex aspect-video justify-center text-xs",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "Chart"

const ChartLegendContext = React.createContext(null)

function useChartLegend() {
  const context = React.useContext(ChartLegendContext)

  if (!context) {
    throw new Error("useChartLegend must be used within a <ChartLegend />")
  }

  return context
}

const ChartLegend = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { chartConfig } = useChart()
    const [legendConfig, setLegendConfig] = React.useState(chartConfig)

    React.useEffect(() => {
      setLegendConfig(chartConfig)
    }, [chartConfig])

    return (
      <ChartLegendContext.Provider value={{ legendConfig, setLegendConfig }}>
        <div ref={ref} className={cn("flex gap-2", className)} {...props} />
      </ChartLegendContext.Provider>
    )
  }
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendItem = React.forwardRef(
  ({ className, children, name, ...props }, ref) => {
    const { legendConfig, setLegendConfig } = useChartLegend()

    const { setActiveChart, activeChart } = useChart()
    const isSelected = activeChart === name
    const color = legendConfig[name].color

    return (
      <button
        ref={ref}
        data-selected={isSelected}
        onClick={() => {
          setActiveChart(name)
          setLegendConfig((prev) => ({
            ...prev,
            [name]: {
              ...prev[name],
              color: isSelected ? prev[name].color : color,
            },
          }))
        }}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-left text-muted-foreground transition-colors hover:bg-muted/80 data-[selected=true]:bg-muted/80 data-[selected=true]:text-foreground",
          className
        )}
        {...props}
      >
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
          style={{ backgroundColor: color }}
        />
        {children || legendConfig[name]?.label}
      </button>
    )
  }
)
ChartLegendItem.displayName = "ChartLegendItem"

const ChartTooltipContext = React.createContext(null)

function useChartTooltip() {
  const context = React.useContext(ChartTooltipContext)

  if (!context) {
    throw new Error("useChartTooltip must be used within a <ChartTooltip />")
  }

  return context
}

const ChartTooltip = Recharts.Tooltip

const ChartTooltipContent = React.forwardRef(
  (
    {
      className,
      label,
      labelClassName,
      labelFormatter,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      name,
      payload,
      active,
    },
    ref
  ) => {
    const { chartConfig, activeChart } = useChart()
    const tooltipLabel = label || payload?.[0]?.payload?.x

    if (!active || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${item.dataKey}`
    const itemConfig = chartConfig[key]

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!hideLabel && tooltipLabel && (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter ? labelFormatter(tooltipLabel) : tooltipLabel}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, i) => {
            const key = `${item.dataKey}`
            const itemConfig = chartConfig[key]
            const indicatorColor = itemConfig?.color

            return (
              <div
                key={item.key || i}
                className={cn("flex w-full items-center justify-between gap-2")}
              >
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    <div
                      className={cn(
                        "h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                        {
                          "border-0": indicator === "dot",
                          "border": indicator === "line",
                          "rounded-none": indicator === "dashed",
                        }
                      )}
                      style={{
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor,
                      }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

// We need to add this to support multiple charts in a single view.
const ChartStyle = ({ id, config }) => {
  const css = React.useMemo(() => {
    // Example: ".chart-ID-1 { --color: hsl(var(--primary)); }"
    const newCss = Object.entries(config)
      .map(([key, value]) => {
        const color = value.color
        if (!color) return null

        return `
.chart-${id} .recharts-line-dot circle[r="4"] {
  stroke: ${color};
  fill: ${color};
}
.chart-${id} .recharts-line-curve {
  stroke: ${color};
}
.chart-${id} .recharts-area-area {
  fill: ${color};
  opacity: 0.2;
}
.chart-${id} .recharts-bar-rectangle {
  fill: ${color};
}
.chart-${id} .recharts-radial-bar-background-sector {
  fill: hsl(var(--muted));
}
.chart-${id} .recharts-radial-bar-bar-sector {
  fill: ${color};
}
.chart-${id} .recharts-pie-sector {
  fill: ${color};
}
.chart-${id} .recharts-sector {
  fill: ${color};
}
        `
      })
      .filter(Boolean)
      .join("\n")

    return newCss
  }, [config, id])

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

export {
  THEMES,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
}
