'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Award } from 'lucide-react';

interface Three3DGamesProps {
  engineId: 'WAVE_DASH' | 'CYBER_DRIFT' | 'CUBE_STACK' | 'TUNNEL_RUNNER';
  gameTitle: string;
}

export default function Three3DGames({ engineId, gameTitle }: Three3DGamesProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Store game variables ref to avoid closure state bugs
  const gameStateRef = useRef<{
    score: number;
    isGameOver: boolean;
    isStarted: boolean;
    playerX: number;
    playerY: number;
    speed: number;
    keys: { [key: string]: boolean };
  }>({
    score: 0,
    isGameOver: false,
    isStarted: false,
    playerX: 0,
    playerY: 0,
    speed: 0.8,
    keys: {},
  });

  const startGame = () => {
    setIsStarted(true);
    setIsGameOver(false);
    setScore(0);
    gameStateRef.current.score = 0;
    gameStateRef.current.isGameOver = false;
    gameStateRef.current.isStarted = true;
    gameStateRef.current.playerX = 0;
    gameStateRef.current.playerY = 0;
    gameStateRef.current.speed = 0.8;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Standard Three.js setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x84cc16, 2, 50);
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // Game Specific Entities
    let animationFrameId: number;
    let cleanupEngine = () => {};

    // -------------------------------------------------------------
    // ENGINE 1: WAVE DASH 3D (Geometry Spike Tunnel Runner)
    // -------------------------------------------------------------
    if (engineId === 'WAVE_DASH') {
      // Create Player Arrow Ship
      const shipGroup = new THREE.Group();
      const shipGeo = new THREE.ConeGeometry(0.6, 2, 4);
      const shipMat = new THREE.MeshStandardMaterial({
        color: 0x84cc16,
        emissive: 0x65a30d,
        roughness: 0.2,
        metalness: 0.8,
      });
      const shipMesh = new THREE.Mesh(shipGeo, shipMat);
      shipMesh.rotation.x = Math.PI / 2;
      shipGroup.add(shipMesh);

      // Trail Glow
      const glowGeo = new THREE.SphereGeometry(0.4, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.set(0, -1, 0);
      shipGroup.add(glowMesh);

      shipGroup.position.set(0, 0, 0);
      scene.add(shipGroup);

      // Grid Floor & Ceiling Spikes
      const gridHelper = new THREE.GridHelper(100, 40, 0x38bdf8, 0x1e293b);
      gridHelper.position.y = -2;
      scene.add(gridHelper);

      // Obstacle Cubes & Spikes Pool
      const obstacles: THREE.Mesh[] = [];
      const obsGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
      const obsMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b });

      for (let i = 0; i < 15; i++) {
        const obs = new THREE.Mesh(obsGeo, obsMat);
        obs.position.set((Math.random() - 0.5) * 8, -1.2, -30 - i * 8);
        scene.add(obs);
        obstacles.push(obs);
      }

      // Input Handlers
      const handleKeyDown = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = true;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = false;
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      // Render Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (gameStateRef.current.isStarted && !gameStateRef.current.isGameOver) {
          // Update player position
          const state = gameStateRef.current;
          if (state.keys['arrowleft'] || state.keys['a']) state.playerX -= 0.18;
          if (state.keys['arrowright'] || state.keys['d']) state.playerX += 0.18;
          if (state.keys['arrowup'] || state.keys['w']) state.playerY += 0.12;
          if (state.keys['arrowdown'] || state.keys['s']) state.playerY -= 0.12;

          // Clamp
          state.playerX = Math.max(-4.5, Math.min(4.5, state.playerX));
          state.playerY = Math.max(-1.5, Math.min(4, state.playerY));

          shipGroup.position.x = state.playerX;
          shipGroup.position.y = state.playerY;
          shipGroup.rotation.z = -state.playerX * 0.1;
          shipGroup.rotation.y = state.playerX * 0.05;

          // Score Increment
          state.score += 1;
          setScore(Math.floor(state.score / 5));

          // Move Grid
          gridHelper.position.z += 0.4;
          if (gridHelper.position.z > 5) gridHelper.position.z = 0;

          // Move Obstacles
          obstacles.forEach((obs) => {
            obs.position.z += 0.5 + state.score * 0.0001;
            obs.rotation.x += 0.02;
            obs.rotation.y += 0.03;

            // Check collision with ship
            const dist = shipGroup.position.distanceTo(obs.position);
            if (dist < 1.2) {
              state.isGameOver = true;
              setIsGameOver(true);
              setHighScore((prev) => Math.max(prev, Math.floor(state.score / 5)));
            }

            // Respawn obstacle
            if (obs.position.z > 10) {
              obs.position.z = -100;
              obs.position.x = (Math.random() - 0.5) * 9;
              obs.position.y = -1.2 + Math.random() * 4;
            }
          });
        }

        renderer.render(scene, camera);
      };

      animate();

      cleanupEngine = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // -------------------------------------------------------------
    // ENGINE 2: CYBER DRIFT 3D (3D Car Drifting)
    // -------------------------------------------------------------
    else if (engineId === 'CYBER_DRIFT') {
      camera.position.set(0, 5, 12);
      camera.lookAt(0, 0, 0);

      // Car Mesh
      const carGroup = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.9, roughness: 0.1 });
      const carBody = new THREE.Mesh(new THREE.BoxGeometry(2, 0.8, 3.5), bodyMat);
      carBody.position.y = 0.5;
      carGroup.add(carBody);

      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.6, 1.8),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
      );
      roof.position.set(0, 1.1, -0.2);
      carGroup.add(roof);

      scene.add(carGroup);

      // Race Track Grid
      const trackGrid = new THREE.GridHelper(120, 60, 0x84cc16, 0x334155);
      scene.add(trackGrid);

      // Cone Obstacles
      const cones: THREE.Mesh[] = [];
      const coneGeo = new THREE.ConeGeometry(0.8, 1.6, 12);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xc2410c });

      for (let i = 0; i < 12; i++) {
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set((Math.random() - 0.5) * 16, 0.8, -40 - i * 12);
        scene.add(cone);
        cones.push(cone);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = true;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = false;
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      let carAngle = 0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (gameStateRef.current.isStarted && !gameStateRef.current.isGameOver) {
          const state = gameStateRef.current;
          if (state.keys['arrowleft'] || state.keys['a']) {
            carAngle += 0.04;
            state.playerX -= 0.15;
          }
          if (state.keys['arrowright'] || state.keys['d']) {
            carAngle -= 0.04;
            state.playerX += 0.15;
          }

          state.playerX = Math.max(-8, Math.min(8, state.playerX));
          carGroup.position.x = state.playerX;
          carGroup.rotation.y = carAngle;
          carAngle *= 0.92; // smooth drift decay

          state.score += 1;
          setScore(Math.floor(state.score / 4));

          cones.forEach((c) => {
            c.position.z += 0.6;
            if (c.position.z > 12) {
              c.position.z = -100;
              c.position.x = (Math.random() - 0.5) * 16;
            }

            if (carGroup.position.distanceTo(c.position) < 1.8) {
              state.isGameOver = true;
              setIsGameOver(true);
              setHighScore((prev) => Math.max(prev, Math.floor(state.score / 4)));
            }
          });
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupEngine = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // -------------------------------------------------------------
    // ENGINE 3: CUBE STACKER 3D (Timing Tower)
    // -------------------------------------------------------------
    else if (engineId === 'CUBE_STACK') {
      camera.position.set(6, 12, 12);
      camera.lookAt(0, 3, 0);

      const stackGroup = new THREE.Group();
      scene.add(stackGroup);

      // Base Block
      const baseBlock = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      baseBlock.position.set(0, 0.5, 0);
      stackGroup.add(baseBlock);

      let currentHeight = 1.5;
      let movingBlock: THREE.Mesh | null = null;
      let moveDir = 1;

      const spawnBlock = () => {
        const color = new THREE.Color().setHSL((currentHeight * 0.05) % 1, 0.8, 0.5);
        movingBlock = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1, 4),
          new THREE.MeshStandardMaterial({ color, roughness: 0.3 })
        );
        movingBlock.position.set(-6, currentHeight, 0);
        stackGroup.add(movingBlock);
      };

      spawnBlock();

      const handlePointer = () => {
        if (!gameStateRef.current.isStarted || gameStateRef.current.isGameOver) return;
        if (!movingBlock) return;

        // Place block
        const dist = Math.abs(movingBlock.position.x);
        if (dist > 3.8) {
          gameStateRef.current.isGameOver = true;
          setIsGameOver(true);
        } else {
          gameStateRef.current.score += 10;
          setScore(gameStateRef.current.score);
          currentHeight += 1;
          camera.position.y += 1;
          camera.lookAt(0, currentHeight, 0);
          spawnBlock();
        }
      };

      window.addEventListener('pointerdown', handlePointer);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (gameStateRef.current.isStarted && !gameStateRef.current.isGameOver && movingBlock) {
          movingBlock.position.x += 0.1 * moveDir;
          if (movingBlock.position.x > 6) moveDir = -1;
          if (movingBlock.position.x < -6) moveDir = 1;
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupEngine = () => {
        window.removeEventListener('pointerdown', handlePointer);
      };
    }

    // -------------------------------------------------------------
    // ENGINE 4: TUNNEL RUNNER 3D (FPS Tunnel Dodge)
    // -------------------------------------------------------------
    else {
      camera.position.set(0, 0, 5);

      const tunnelGroup = new THREE.Group();
      const rings: THREE.LineSegments[] = [];

      for (let i = 0; i < 40; i++) {
        const ringGeo = new THREE.CircleGeometry(4, 16);
        const edges = new THREE.EdgesGeometry(ringGeo);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0x84cc16 })
        );
        line.position.z = -i * 3;
        tunnelGroup.add(line);
        rings.push(line);
      }
      scene.add(tunnelGroup);

      const handleKeyDown = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = true;
      };
      const handleKeyUp = (e: KeyboardEvent) => {
        gameStateRef.current.keys[e.key.toLowerCase()] = false;
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        if (gameStateRef.current.isStarted && !gameStateRef.current.isGameOver) {
          const state = gameStateRef.current;
          if (state.keys['arrowleft'] || state.keys['a']) camera.position.x -= 0.12;
          if (state.keys['arrowright'] || state.keys['d']) camera.position.x += 0.12;
          if (state.keys['arrowup'] || state.keys['w']) camera.position.y += 0.12;
          if (state.keys['arrowdown'] || state.keys['s']) camera.position.y -= 0.12;

          camera.position.x = Math.max(-2.5, Math.min(2.5, camera.position.x));
          camera.position.y = Math.max(-2.5, Math.min(2.5, camera.position.y));

          state.score += 1;
          setScore(Math.floor(state.score / 5));

          rings.forEach((ring) => {
            ring.position.z += 0.4;
            ring.rotation.z += 0.01;
            if (ring.position.z > 5) {
              ring.position.z = -115;
            }
          });
        }

        renderer.render(scene, camera);
      };
      animate();

      cleanupEngine = () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      cleanupEngine();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [engineId]);

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-[480px] cursor-crosshair" />

      {/* Top Overlay Game HUD */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700 flex items-center gap-3 text-white font-bold text-sm shadow-lg">
          <Award className="w-5 h-5 text-yellow-400" />
          <span>Score: <strong className="text-lime-400 text-lg">{score}</strong></span>
          <span className="text-slate-400 text-xs">| High: {highScore}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>
        </div>
      </div>

      {/* Pre-Game Start Overlay */}
      {!isStarted && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center gap-6 p-6 text-center z-20">
          <div className="p-4 bg-lime-500/10 border border-lime-500/30 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">{gameTitle}</h2>
            <p className="text-sm text-sky-300 mt-1">Interactive 3D WebGL Engine</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl max-w-sm text-left text-xs text-slate-300 space-y-2 shadow-lg">
            <p className="font-semibold text-lime-400 text-sm">🎮 Controls:</p>
            <p className="flex items-center justify-between">
              <span>Steer / Move Left & Right:</span>
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-400">Arrow Keys / A & D</kbd>
            </p>
            <p className="flex items-center justify-between">
              <span>Up & Down / Accelerate:</span>
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-sky-400">W & S / Space</kbd>
            </p>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-slate-950 font-black text-lg rounded-full shadow-lg shadow-lime-500/30 flex items-center gap-3 transform hover:scale-105 transition-all"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            START 3D GAME
          </button>
        </div>
      )}

      {/* Game Over Screen Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-5 p-6 text-center z-30">
          <div className="text-rose-500 text-4xl font-black tracking-wider uppercase animate-bounce">
            GAME OVER
          </div>
          <p className="text-slate-300 text-lg">
            Final Score: <strong className="text-lime-400 text-2xl">{score}</strong>
          </p>
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-full shadow-xl shadow-sky-500/25 flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
