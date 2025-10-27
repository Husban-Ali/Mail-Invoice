
import React from 'react';

function DonutChart({ title, data, type }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const createDonutSegments = () => {
    return data.map((item, idx) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 251.2;
      const segment = (
        <circle
          key={idx}
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={item.strokeColor}
          strokeWidth="20"
          strokeDasharray={`${angle} 251.2`}
          strokeDashoffset={-currentAngle}
        />
      );
      currentAngle += angle;
      return segment;
    });
  };

  const createPieSegments = () => {
    return data.map((item, idx) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = 50 + 45 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 50 + 45 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 50 + 45 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 50 + 45 * Math.sin((Math.PI * endAngle) / 180);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      currentAngle += angle;
      
      return (
        <path
          key={idx}
          d={path}
          fill={item.strokeColor}
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">{title}</h3>
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {type === 'donut' ? createDonutSegments() : createPieSegments()}
          </svg>
        </div>
        <div className="flex-1">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 mb-3">
              <div className={`w-4 h-4 ${item.color} rounded-sm flex-shrink-0`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">{item.type}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DonutChart;
