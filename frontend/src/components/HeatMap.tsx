import React from "react";

type HeatMapProps = {
  data: number[][]; // data[day][hour]
  days?: string[];
  hours?: string[];
};

const HeatMap: React.FC<HeatMapProps> = ({
  data,
  days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
  hours = Array.from({ length: 24 }, (_, i) => i.toString()),
}) => {
  const flatData = data.flat();
  const maxUsage = Math.max(...flatData);
  const minUsage = Math.min(...flatData);

  const getColor = (value: number) => {
    const ratio = (value - minUsage) / (maxUsage - minUsage || 1);
    const r = 255;
    const g = Math.floor(255 - ratio * 180);
    const b = Math.floor(255 - ratio * 180);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Energy Usage HeatMap</h3>
      <div className="inline-block">
        {/* Top Row: Empty corner + Hour Labels */}
        <div className="grid grid-cols-[40px_repeat(24,40px)] gap-1 mb-1">
          <div></div>
          {hours.map((hour, i) => (
            <div key={i} className="text-xs text-center">{hour}</div>
          ))}
        </div>

        {/* Day Rows */}
        <div className="grid gap-1">
          {data.map((dayData, dayIndex) => (
            <div key={dayIndex} className="grid grid-cols-[40px_repeat(24,40px)] gap-1">
              {/* Day Label */}
              <div className="text-xs font-medium flex items-center justify-center">
                {days[dayIndex]}
              </div>
              {/* Hour Cells */}
              {dayData.map((value, hourIndex) => (
                <div
                  key={hourIndex}
                  className="w-10 h-10 rounded-sm hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${days[dayIndex]}, ${hours[hourIndex]}h: ${value} kWh`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-muted-foreground mt-2">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default HeatMap;
