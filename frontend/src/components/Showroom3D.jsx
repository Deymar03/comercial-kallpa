import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { User, Sparkles, Box, Play, Sliders, Volume2 } from 'lucide-react';

// MODELOS 3D CON ESCALA REAL CORREGIDA (TOYO DESDE EL PECHO HASTA EL PISO)
function SceneContent({ type }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group>
      {/* 1. SILUETA DE LA PERSONA (1,70 m) - Ubicada a la izquierda */}
      <group position={[-0.9, -0.2, 0]}>
        {/* Cuerpo / Tronco */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.16, 1.0, 16]} />
          <meshStandardMaterial color="#6c757d" roughness={0.6} />
        </mesh>
        {/* Cabeza */}
        <mesh position={[0, 0.75, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#adb5bd" roughness={0.6} />
        </mesh>
        {/* Piernas */}
        <mesh position={[-0.09, -0.75, 0]}>
          <cylinderGeometry args={[0.07, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#495057" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, -0.75, 0]}>
          <cylinderGeometry args={[0.07, 0.05, 0.7, 12]} />
          <meshStandardMaterial color="#495057" roughness={0.6} />
        </mesh>
      </group>

      {/* 2. INSTRUMENTOS A SU ESCALA REAL (Ubicados a la derecha) */}
      <group ref={groupRef} position={[0.6, -0.2, 0]}>
        
        {/* ZAMPOÑA MALTA (~45 cm -> Altura del pecho) */}
        {type === 'zampona' && (
          <group scale={[0.35, 0.35, 0.35]} position={[0, 0.1, 0]}>
            {Array.from({ length: 11 }).map((_, i) => (
              <mesh key={`f1-${i}`} position={[(i - 5) * 0.08, (11 - i) * 0.05, -0.12]}>
                <cylinderGeometry args={[0.032, 0.032, 1.2 + i * 0.07, 12]} />
                <meshStandardMaterial color="#e9d8a6" roughness={0.3} />
              </mesh>
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <mesh key={`f2-${i}`} position={[(i - 4.5) * 0.08, (10 - i) * 0.05, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 1.3 + i * 0.07, 12]} />
                <meshStandardMaterial color="#ee9b00" roughness={0.3} />
              </mesh>
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <mesh key={`f3-${i}`} position={[(i - 4) * 0.08, (9 - i) * 0.05, 0.12]}>
                <cylinderGeometry args={[0.038, 0.038, 1.4 + i * 0.07, 12]} />
                <meshStandardMaterial color="#ca6702" roughness={0.3} />
              </mesh>
            ))}
          </group>
        )}

        {/* TOYO ANDINO GIGANTE (~1.40 m -> Desde el pecho hasta el piso, superando la proporción) */}
        {type === 'toyo' && (
          <group scale={[0.5, 0.5, 0.4]} position={[0, -0., 0]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={`toyo1-${i}`} position={[(i - 3.5) * 0.14, (8 - i) * 0.08, -0.1]}>
                <cylinderGeometry args={[0.07, 0.07, 2.4 + i * 0.15, 16]} />
                <meshStandardMaterial color="#94d2bd" roughness={0.4} />
              </mesh>
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <mesh key={`toyo2-${i}`} position={[(i - 3) * 0.14, (7 - i) * 0.08, 0.1]}>
                <cylinderGeometry args={[0.075, 0.075, 2.6 + i * 0.15, 16]} />
                <meshStandardMaterial color="#0a9396" roughness={0.4} />
              </mesh>
            ))}
          </group>
        )}

        {/* QUENA Y QUENACHO (40 cm y 52 cm) */}
        {(type === 'quena' || type === 'quenacho') && (
          <group scale={type === 'quenacho' ? [0.42, 0.42, 0.42] : [0.35, 0.35, 0.35]} rotation={[0, 0, Math.PI / 12]} position={[0, 0.2, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[type === 'quenacho' ? 0.065 : 0.05, type === 'quenacho' ? 0.055 : 0.042, type === 'quenacho' ? 2.4 : 1.9, 32]} />
              <meshStandardMaterial color={type === 'quenacho' ? "#b56576" : "#e0a96d"} roughness={0.25} />
            </mesh>
            <mesh position={[0, type === 'quenacho' ? 1.2 : 0.95, 0]}>
              <boxGeometry args={[0.04, 0.08, 0.04]} />
              <meshStandardMaterial color="#4a2e2b" roughness={0.8} />
            </mesh>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={`hole-${i}`} position={[0, 0.4 - i * 0.18, type === 'quenacho' ? 0.06 : 0.048]}>
                <cylinderGeometry args={[0.013, 0.013, 0.03, 16]} />
                <meshStandardMaterial color="#2b1810" />
              </mesh>
            ))}
          </group>
        )}

        {/* TARKA (~35 cm) */}
        {type === 'tarka' && (
          <group scale={[0.32, 0.32, 0.32]} position={[0, 0.25, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.32, 1.8, 0.32]} />
              <meshStandardMaterial color="#9d0208" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <boxGeometry args={[0.28, 0.1, 0.28]} />
              <meshStandardMaterial color="#370617" roughness={0.6} />
            </mesh>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={`tarka-hole-${i}`} position={[0, 0.3 - i * 0.15, 0.17]}>
                <cylinderGeometry args={[0.015, 0.015, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
                <meshStandardMaterial color="#1f0909" />
              </mesh>
            ))}
          </group>
        )}

      </group>
    </group>
  );
}

export default function Showroom3D() {
  const [selectedType, setSelectedType] = useState('zampona');
  const [selectedTuning, setSelectedTuning] = useState('Mi Mayor (E)');
  const [isPlaying, setIsPlaying] = useState(false);

  const instrumentsData = {
    zampona: {
      name: "Zampoña Profesional Malta (3 Filas - 30 Tubos)",
      category: "Zampoñas",
      height: "45 cm de altura",
      scale: "Proporción real (45 cm frente a persona de 1,70 m): Tamaño cómodo y estándar que llega a la altura del pecho.",
      tunings: [
        { name: "Mi Mayor (E)", freq: 329.63 },
        { name: "La Menor (Am)", freq: 220.00 },
        { name: "Sol Mayor (G)", freq: 392.00 }
      ],
      youtubeUrl: "https://youtu.be/OUXQeaRUoQ8?si=a610EDm1GDIwX95w"
    },
    toyo: {
      name: "Toyo Andino Gigante - 2 Filas (15 Tubos)",
      category: "Zampoñas Bajos",
      height: "1.40 metros",
      scale: "Proporción real (1,40 m frente a persona de 1,70 m): Instrumento imponente que abarca exactamente desde el pecho hasta el piso.",
      tunings: [
        { name: "Mi Graves (E2)", freq: 82.41 },
        { name: "Re Bajos (D2)", freq: 73.42 }
      ],
      youtubeUrl: "https://youtu.be/F58SJHVI0ZA?si=z19P076NSXIWwjxW&t=7"
    },
    quena: {
      name: "Quena Profesional de Jacarandá (6+1 Orificios)",
      category: "Quenas",
      height: "40 cm estándar",
      scale: "Proporción real (40 cm frente a persona de 1,70 m): Longitud adecuada para una ejecución cómoda y ergonómica.",
      tunings: [
        { name: "Sol Mayor (G)", freq: 392.00 },
        { name: "La Menor (Am)", freq: 440.00 },
        { name: "Do Mayor (C)", freq: 261.63 }
      ],
      youtubeUrl: "https://youtu.be/no0Ls6cS_4U?si=B33HbUJUQ0OPJjaz"
    },
    quenacho: {
      name: "Quenacho Profesional de Bambú Grueso",
      category: "Quenachos",
      height: "52 cm de longitud",
      scale: "Proporción real (52 cm frente a persona de 1,70 m): Ligeramente más largo y ancho, diseñado para registros graves.",
      tunings: [
        { name: "Re Mayor (D)", freq: 293.66 },
        { name: "Mi Menor (Em)", freq: 164.81 }
      ],
      youtubeUrl: "https://youtube.com/shorts/8Wc9iBpYImM?si=7ce0P-lELgwK-lES"
    },
    tarka: {
      name: "Tarka Tradicional - Madera Mara (6 Orificios)",
      category: "Tarkas",
      height: "35 cm",
      scale: "Proporción real (35 cm frente a persona de 1,70 m): Aerófono compacto y robusto de empuñadura directa.",
      tunings: [
        { name: "Afinación Anata (Festiva)", freq: 493.88 },
        { name: "Afinación Jallupacha", freq: 466.16 }
      ],
      youtubeUrl: "https://youtu.be/Zf5muMnhPeY?si=3tOoQGmI1w45gLXK&t=31"
    }
  };

  const currentInst = instrumentsData[selectedType];
  const activeTuningObj = currentInst.tunings.find(t => t.name === selectedTuning) || currentInst.tunings[0];

  const playTone = (frequency, tuningName) => {
    setSelectedTuning(tuningName);
    setIsPlaying(true);
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      setTimeout(() => setIsPlaying(false), 1200);
    } catch (e) {
      console.error("Error al reproducir audio:", e);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-amber-100 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-500" /> Sala de Exposición 3D y Simulador de Afinación
        </h2>
        <p className="text-amber-200/70 mt-2">
          Modelos 3D anatómicos con la proporción real del Toyo (desde el pecho hasta el piso) frente a una persona de 1,70 m.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5 mb-8">
        {Object.keys(instrumentsData).map((key) => (
          <button
            key={key}
            onClick={() => {
              setSelectedType(key);
              setSelectedTuning(instrumentsData[key].tunings[0].name);
            }}
            className={`px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition cursor-pointer ${
              selectedType === key
                ? 'bg-amber-700 text-white shadow-lg border border-amber-500'
                : 'bg-stone-900/80 text-stone-300 border border-stone-800 hover:bg-stone-800'
            }`}
          >
            {instrumentsData[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch bg-stone-900/70 border border-amber-900/40 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        
        {/* VISOR 3D */}
        <div className="flex flex-col justify-between bg-stone-950/90 border border-amber-950 rounded-xl p-4 relative overflow-hidden h-[420px]">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/30 z-10">
            <span className="text-amber-300 text-xs font-bold px-3 py-1 bg-amber-900/40 rounded-full border border-amber-800/50 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-amber-400" /> Escala Real: Toyo (Pecho a Piso) vs Persona
            </span>
            <span className="text-amber-200/80 text-xs font-semibold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-500" /> Rotar 360°
            </span>
          </div>

          <div className="absolute inset-0 pt-12">
            <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
              <ambientLight intensity={1.5} />
              <pointLight position={[10, 10, 10]} intensity={2.0} />
              <directionalLight position={[-5, 5, 5]} intensity={1.5} />
              <SceneContent type={selectedType} />
              <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </div>

          <div className="bg-stone-900/90 backdrop-blur-md p-3 rounded-lg border border-amber-900/40 text-xs text-amber-200/90 z-10">
            <strong className="text-amber-400 block mb-0.5">Proporción antropométrica real:</strong>
            {currentInst.scale}
          </div>
        </div>

        {/* PANEL DE AFINACIONES Y YOUTUBE */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <span className="text-xs text-amber-500 uppercase tracking-wider font-bold">
              {currentInst.category}
            </span>
            <h3 className="text-2xl font-bold text-amber-100 mt-1">{currentInst.name}</h3>
            <p className="text-sm text-stone-300 mt-1">Altura física: <strong className="text-amber-400">{currentInst.height}</strong></p>
          </div>

          <div className="bg-stone-950/90 border border-amber-950 p-4 rounded-xl space-y-3">
            <label className="text-sm font-bold text-amber-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" /> Escoja la afinación y pruebe el sonido:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentInst.tunings.map((t) => (
                <button
                  key={t.name}
                  onClick={() => playTone(t.freq, t.name)}
                  className={`py-2 px-2 text-xs rounded-xl font-medium border transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    selectedTuning === t.name
                      ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-700 hover:bg-stone-800'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  {t.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 pt-1 text-center">
              Afinación activa: <strong className="text-amber-400">{selectedTuning}</strong> {isPlaying ? '(Sonando...)' : ''}
            </p>
          </div>

          <div>
            <a
              href={currentInst.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-amber-700 hover:bg-amber-600 shadow-lg shadow-amber-900/30 flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current text-amber-200" />
              Ver Ejemplo Real en YouTube
            </a>
            <p className="text-center text-[11px] text-stone-500 mt-2">
              Abre una pestaña externa con el vídeo configurado en el código.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}