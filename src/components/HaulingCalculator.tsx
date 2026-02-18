import { useState, useRef } from "react";
import {
  Calculator,
  Share2,
  RotateCcw,
  Truck,
  Gauge,
  Wind,
  Clock,
  ArrowDownToLine,
  Timer,
  Box,
  ChevronDown,
  Download,
} from "lucide-react";

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
}

const InputField = ({ icon, label, unit, value, onChange }: InputFieldProps) => (
  <div className="flex items-center gap-3 bg-card rounded-2xl px-4 py-3 border border-border active:scale-[0.98] transition-transform">
    <div className="text-primary shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <label className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider block mb-0.5">
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="flex-1 bg-transparent text-foreground text-lg font-semibold outline-none w-full min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-muted-foreground shrink-0">{unit}</span>
      </div>
    </div>
  </div>
);

interface ResultCardProps {
  label: string;
  value: string;
  unit: string;
  highlight?: boolean;
}

const ResultCard = ({ label, value, unit, highlight }: ResultCardProps) => (
  <div
    className={`rounded-2xl p-4 text-center ${
      highlight
        ? "bg-primary/15 border-2 border-primary"
        : "bg-card border border-border"
    }`}
  >
    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1 font-medium">
      {label}
    </p>
    <p
      className={`text-2xl font-bold ${
        highlight ? "text-primary" : "text-foreground"
      }`}
    >
      {value}
    </p>
    <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
  </div>
);

const HaulingCalculator = () => {
  const [distance, setDistance] = useState("");
  const [speedLoaded, setSpeedLoaded] = useState("");
  const [speedEmpty, setSpeedEmpty] = useState("");
  const [loadingTime, setLoadingTime] = useState("");
  const [dumpingTime, setDumpingTime] = useState("");
  const [waktuAntri, setWaktuAntri] = useState("");
  const [vesselCapacity, setVesselCapacity] = useState("");
  const [result, setResult] = useState<{
    cycleTime: number;
    tripsPerHour: number;
    production: number;
  } | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const d = parseFloat(distance);
    const sl = parseFloat(speedLoaded);
    const se = parseFloat(speedEmpty);
    const lt = parseFloat(loadingTime);
    const dt = parseFloat(dumpingTime);
    const wa = parseFloat(waktuAntri);
    const vc = parseFloat(vesselCapacity);

    if ([d, sl, se, lt, dt, wa, vc].some(isNaN) || sl === 0 || se === 0)
      return;

    const timeLoaded = d / ((sl * 1000) / 60);
    const timeEmpty = d / ((se * 1000) / 60);
    const cycleTime = timeLoaded + timeEmpty + lt + dt + wa;
    const tripsPerHour = 60 / cycleTime;
    const production = tripsPerHour * vc;

    setResult({ cycleTime, tripsPerHour, production });

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const reset = () => {
    setDistance("");
    setSpeedLoaded("");
    setSpeedEmpty("");
    setLoadingTime("");
    setDumpingTime("");
    setWaktuAntri("");
    setVesselCapacity("");
    setResult(null);
  };

  const shareResult = () => {
    if (!result) return;
    const text = `⛏️ Hauling Cycle Result\n━━━━━━━━━━━━━━━━━━\n🔄 Cycle Time: ${result.cycleTime.toFixed(1)} min\n🔁 Trips/Hour: ${result.tripsPerHour.toFixed(1)}\n📦 Production: ${result.production.toFixed(1)} BCM/hr\n━━━━━━━━━━━━━━━━━━\nCalculated with Hauling Calc`;
    if (navigator.share) {
      navigator.share({ title: "Hauling Cycle", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const inputFields = [
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Jarak Angkut",
      unit: "meter",
      value: distance,
      setter: setDistance,
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: "Kecepatan Isi",
      unit: "km/h",
      value: speedLoaded,
      setter: setSpeedLoaded,
    },
    {
      icon: <Wind className="w-5 h-5" />,
      label: "Kecepatan Kosong",
      unit: "km/h",
      value: speedEmpty,
      setter: setSpeedEmpty,
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Waktu Muat",
      unit: "menit",
      value: loadingTime,
      setter: setLoadingTime,
    },
    {
      icon: <ArrowDownToLine className="w-5 h-5" />,
      label: "Waktu Dumping",
      unit: "menit",
      value: dumpingTime,
      setter: setDumpingTime,
    },
    {
      icon: <Timer className="w-5 h-5" />,
      label: "Waktu Antri",
      unit: "menit",
      value: waktuAntri,
      setter: setWaktuAntri,
    },
    {
      icon: <Box className="w-5 h-5" />,
      label: "Kapasitas Vessel",
      unit: "BCM",
      value: vesselCapacity,
      setter: setVesselCapacity,
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col w-full max-w-lg mx-auto safe-area-inset">
      {/* Status bar spacer */}
      <div className="h-[env(safe-area-inset-top)]" />

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              Hauling Calc
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wide uppercase">
              Cycle Time Calculator
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground active:scale-90 transition-transform"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-28">
        {inputFields.map((field) => (
          <InputField
            key={field.label}
            icon={field.icon}
            label={field.label}
            unit={field.unit}
            value={field.value}
            onChange={field.setter}
          />
        ))}

        {/* Calculate Button */}
        <button
          onClick={calculate}
          className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl tracking-wide text-sm active:scale-[0.97] transition-transform mt-2 shadow-lg shadow-primary/20"
        >
          HITUNG SIKLUS
        </button>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xs font-bold text-primary tracking-widest uppercase px-1">
              Hasil Perhitungan
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <ResultCard
                label="Cycle Time"
                value={result.cycleTime.toFixed(1)}
                unit="menit"
              />
              <ResultCard
                label="Trip/Jam"
                value={result.tripsPerHour.toFixed(1)}
                unit="trips"
              />
              <ResultCard
                label="Produksi"
                value={result.production.toFixed(0)}
                unit="BCM/jam"
                highlight
              />
            </div>

            {/* Detail breakdown */}
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Detail Waktu
              </p>
              {[
                {
                  l: "Waktu Angkut (isi)",
                  v: `${(parseFloat(distance) / ((parseFloat(speedLoaded) * 1000) / 60)).toFixed(1)} min`,
                },
                {
                  l: "Waktu Angkut (kosong)",
                  v: `${(parseFloat(distance) / ((parseFloat(speedEmpty) * 1000) / 60)).toFixed(1)} min`,
                },
                { l: "Waktu Muat", v: `${loadingTime} min` },
                { l: "Waktu Dumping", v: `${dumpingTime} min` },
                { l: "Waktu Antri", v: `${waktuAntri} min` },
              ].map((item) => (
                <div key={item.l} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.l}</span>
                  <span className="text-foreground font-medium">{item.v}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={shareResult}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-card border border-border text-primary font-semibold text-sm active:scale-[0.97] transition-transform"
            >
              <Share2 className="w-4 h-4" />
              Bagikan Hasil
            </button>
          </div>
        )}
      </main>

      {/* Bottom safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
};

export default HaulingCalculator;
