import { useState } from "react";
import { Calculator, Share2 } from "lucide-react";

const HaulingCalculator = () => {
  const [distance, setDistance] = useState("");
  const [speedLoaded, setSpeedLoaded] = useState("");
  const [speedEmpty, setSpeedEmpty] = useState("");
  const [loadingTime, setLoadingTime] = useState("");
  const [dumpingTime, setDumpingTime] = useState("");
  const [waktuAntri, setWaktuAntri] = useState("");
  const [vesselCapacity, setVesselCapacity] = useState("");
  const [result, setResult] = useState<{ cycleTime: number; tripsPerHour: number; production: number } | null>(null);

  const calculate = () => {
    const d = parseFloat(distance);
    const sl = parseFloat(speedLoaded);
    const se = parseFloat(speedEmpty);
    const lt = parseFloat(loadingTime);
    const dt = parseFloat(dumpingTime);
    const wa = parseFloat(waktuAntri);
    const vc = parseFloat(vesselCapacity);

    if ([d, sl, se, lt, dt, wa, vc].some(isNaN) || sl === 0 || se === 0) return;

    const timeLoaded = (d / (sl * 1000 / 60));
    const timeEmpty = (d / (se * 1000 / 60));
    const cycleTime = timeLoaded + timeEmpty + lt + dt + wa;
    const tripsPerHour = 60 / cycleTime;
    const production = tripsPerHour * vc;

    setResult({ cycleTime, tripsPerHour, production });
  };

  const shareResult = () => {
    if (!result) return;
    const text = `Hauling Cycle Result:\nCycle Time: ${result.cycleTime.toFixed(1)} min\nTrips/Hour: ${result.tripsPerHour.toFixed(1)}\nProduction: ${result.production.toFixed(1)} BCM/hr`;
    if (navigator.share) {
      navigator.share({ title: "Hauling Cycle", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const inputFields = [
    { label: "Distance (m)", value: distance, setter: setDistance },
    { label: "Speed Loaded (km/h)", value: speedLoaded, setter: setSpeedLoaded },
    { label: "Speed Empty (km/h)", value: speedEmpty, setter: setSpeedEmpty },
    { label: "Loading Time (min)", value: loadingTime, setter: setLoadingTime },
    { label: "Dumping Time (min)", value: dumpingTime, setter: setDumpingTime },
    { label: "Waktu Antri (min)", value: waktuAntri, setter: setWaktuAntri },
    { label: "Vessel Capacity (BCM)", value: vesselCapacity, setter: setVesselCapacity },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <Calculator className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold tracking-wide text-foreground">HAULING CYCLE</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {inputFields.map((field) => (
          <div key={field.label} className="bg-card rounded-lg border border-border">
            <input
              type="number"
              placeholder={field.label}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="w-full bg-transparent px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none text-sm"
            />
          </div>
        ))}

        <button
          onClick={calculate}
          className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-lg tracking-widest text-sm hover:opacity-90 transition-opacity mt-2"
        >
          CALCULATE
        </button>

        {result && (
          <div className="bg-card rounded-lg border border-border p-4 space-y-3 mt-4">
            <h2 className="text-xs font-bold text-primary tracking-wider">RESULT</h2>
            <div className="space-y-2">
              {[
                { label: "Cycle Time", value: `${result.cycleTime.toFixed(1)} min` },
                { label: "Trips/Hour", value: result.tripsPerHour.toFixed(1) },
                { label: "Production", value: `${result.production.toFixed(1)} BCM/hr` },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-semibold text-foreground">{r.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-primary text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
              SHARE RESULT
            </button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

const navItems = [
  { icon: "🏠", label: "Home" },
  { icon: "🗺️", label: "Map" },
  { icon: "🧮", label: "Calc", active: true },
  { icon: "📊", label: "Prod" },
  { icon: "⚙️", label: "Settings" },
];

const BottomNav = () => (
  <div className="flex items-center justify-around border-t border-border py-2 bg-card">
    {navItems.map((item) => (
      <button
        key={item.label}
        className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
          item.active ? "text-primary font-semibold" : "text-muted-foreground"
        }`}
      >
        <span className="text-lg">{item.icon}</span>
        {item.label}
      </button>
    ))}
  </div>
);

export default HaulingCalculator;
