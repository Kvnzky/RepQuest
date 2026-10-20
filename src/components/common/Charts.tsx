import React, { useState } from 'react'

export interface ChartDataPoint {
  date: string // label or short date
  value: number
  secondaryValue?: number
  label?: string
}

interface TrendLineChartProps {
  data: ChartDataPoint[]
  unit: string
  color?: string
  height?: number
  title?: string
  subtitle?: string
  targetValue?: number
  targetLabel?: string
  emptyMessage?: string
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({
  data,
  unit,
  color = '#38bdf8', // sky-400
  height = 180,
  title,
  subtitle,
  targetValue,
  targetLabel,
  emptyMessage = 'No recorded data yet'
}) => {
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center justify-center min-h-[160px]">
        {title && <h3 className="text-sm font-semibold text-slate-300 mb-1">{title}</h3>}
        <p className="text-xs text-slate-500">{emptyMessage}</p>
      </div>
    )
  }

  // Handle single data point
  if (data.length === 1) {
    const single = data[0]
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        {title && (
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
            {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
          </div>
        )}
        <div className="h-[120px] flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-sky-400">
            {single.value} <span className="text-sm font-medium text-slate-400">{unit}</span>
          </span>
          <span className="text-xs text-slate-500 mt-1">Recorded on {single.date} (1 log)</span>
          <span className="text-[11px] text-slate-600 mt-0.5">Log additional entries to render trend graph</span>
        </div>
      </div>
    )
  }

  const values = data.map(d => d.value)
  const minVal = Math.floor(Math.min(...values, targetValue !== undefined ? targetValue : Infinity) * 0.98)
  const maxVal = Math.ceil(Math.max(...values, targetValue !== undefined ? targetValue : -Infinity) * 1.02)
  const valRange = maxVal - minVal || 1

  const paddingLeft = 36
  const paddingRight = 16
  const paddingTop = 18
  const paddingBottom = 26
  const width = 360

  const chartW = width - paddingLeft - paddingRight
  const chartH = height - paddingTop - paddingBottom

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartW
    const y = paddingTop + chartH - ((d.value - minVal) / valRange) * chartH
    return { x, y, data: d }
  })

  const pathData = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
  }, '')

  const areaData = `${pathData} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`

  // Target line Y
  const targetY = targetValue !== undefined ? paddingTop + chartH - ((targetValue - minVal) / valRange) * chartH : null

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
      {title && (
        <div className="flex justify-between items-baseline mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
          {selectedPoint ? (
            <div className="text-right">
              <span className="text-xs font-bold text-sky-400">
                {selectedPoint.value} {unit}
              </span>
              <span className="text-[10px] text-slate-500 block">{selectedPoint.date}</span>
            </div>
          ) : (
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-300">
                Latest: {values[values.length - 1]} {unit}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={width - paddingRight}
            y2={paddingTop}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartH / 2}
            x2={width - paddingRight}
            y2={paddingTop + chartH / 2}
            stroke="#1e293b"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartH}
            x2={width - paddingRight}
            y2={paddingTop + chartH}
            stroke="#1e293b"
          />

          {/* Y Axis labels */}
          <text x={paddingLeft - 6} y={paddingTop + 4} fill="#64748b" fontSize="9" textAnchor="end">
            {maxVal}
          </text>
          <text x={paddingLeft - 6} y={paddingTop + chartH / 2 + 3} fill="#64748b" fontSize="9" textAnchor="end">
            {Math.round((maxVal + minVal) / 2)}
          </text>
          <text x={paddingLeft - 6} y={paddingTop + chartH} fill="#64748b" fontSize="9" textAnchor="end">
            {minVal}
          </text>

          {/* Target line if provided */}
          {targetY !== null && (
            <g>
              <line
                x1={paddingLeft}
                y1={targetY}
                x2={width - paddingRight}
                y2={targetY}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              {targetLabel && (
                <text
                  x={width - paddingRight}
                  y={targetY - 4}
                  fill="#10b981"
                  fontSize="8"
                  textAnchor="end"
                  fontWeight="bold"
                >
                  {targetLabel} ({targetValue} {unit})
                </text>
              )}
            </g>
          )}

          {/* Area fill */}
          <path d={areaData} fill={`url(#gradient-${color.replace('#', '')})`} />

          {/* Line stroke */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isSelected = selectedPoint?.date === p.data.date
            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => setSelectedPoint(p.data)}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 5 : 3.5}
                  fill={isSelected ? '#ffffff' : color}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            )
          })}

          {/* X Axis labels */}
          {points.length > 0 && (
            <>
              <text x={points[0].x} y={height - 6} fill="#64748b" fontSize="9" textAnchor="start">
                {data[0].date}
              </text>
              <text
                x={points[points.length - 1].x}
                y={height - 6}
                fill="#64748b"
                fontSize="9"
                textAnchor="end"
              >
                {data[data.length - 1].date}
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  )
}

interface ConsistencyBarChartProps {
  data: { label: string; value: number; target: number }[]
  unit: string
  title: string
  subtitle?: string
}

export const ConsistencyBarChart: React.FC<ConsistencyBarChartProps> = ({
  data,
  unit,
  title,
  subtitle
}) => {
  const maxVal = Math.max(...data.map(d => Math.max(d.value, d.target)), 10)

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
      <div className="flex justify-between items-baseline mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 items-end h-[100px] pt-4">
        {data.map((item, idx) => {
          const heightPct = Math.min(100, Math.round((item.value / maxVal) * 100))
          const hitTarget = item.value >= item.target && item.target > 0

          return (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[9px] text-slate-400 mb-1 group-hover:text-white transition-colors">
                {item.value > 0 ? `${item.value}` : '0'}
              </span>
              <div className="w-full bg-slate-800 rounded-t-md h-full max-h-[70px] flex items-end overflow-hidden p-0.5">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-sm transition-all duration-500 ${
                    item.value === 0
                      ? 'bg-transparent'
                      : hitTarget
                      ? 'bg-emerald-400'
                      : 'bg-sky-500'
                  }`}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400 mt-1">{item.label}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400" /> Target reached
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sky-500" /> In progress ({unit})
        </span>
      </div>
    </div>
  )
}
