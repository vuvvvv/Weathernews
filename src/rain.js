import { useEffect, useRef } from "react";

export default function Rain() {
  const canvasRef = useRef(null);
  const rainArr = useRef([]);
  const msTimer = useRef(0);
  const lightningTimer = useRef(8000);
  const rainSpeed = 4;
  const animationRef = useRef(null);
  const lastTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let w, h;

    const updateCanvasSize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const handleResize = () => {
      updateCanvasSize();
     
      initRain();
    };

   
    updateCanvasSize();

   
    const initRain = () => {
      rainArr.current = [];
      for (let i = 0; i < 500; i++) {
        rainArr.current.push({
          x: Math.floor(Math.random() * w),
          y: Math.floor(Math.random() * h),
          z: Math.floor(Math.random() * 2) + 1,
          w: Math.floor(Math.random() * 3) + 2,
        });
      }
    };

    initRain();

    const drawLamp = () => {
      const grd = ctx.createLinearGradient(150, 210, 150, 500);
      grd.addColorStop(0, 'rgba(60, 60, 60, 1)');
      grd.addColorStop(0.2, 'rgba(80, 80, 80, 1)');
      grd.addColorStop(1, 'rgba(45, 45, 45, 1)');
      ctx.fillStyle = grd;
      ctx.fillRect(247, 325, 6, Math.min(290, h - 210));

      
      const grdOuterHigh = ctx.createLinearGradient(150, 210, 150, 500);
      grdOuterHigh.addColorStop(0, 'rgba(65, 65, 65, 1)');
      grdOuterHigh.addColorStop(0.2, 'rgba(95, 95, 95, 1)');
      grdOuterHigh.addColorStop(1, 'rgba(47, 47, 47, 1)');
      ctx.fillStyle = grdOuterHigh;
      ctx.fillRect(246, 210, 1, Math.min(290, h - 210));

      const grdOuterLow = ctx.createLinearGradient(150, 210, 150, 500);
      grdOuterLow.addColorStop(0, 'rgba(45, 45, 45, 1)');
      grdOuterLow.addColorStop(0.2, 'rgba(60, 60, 60, 1)');
      grdOuterLow.addColorStop(1, 'rgba(43, 43, 43, 1)');
      ctx.fillStyle = grdOuterLow;
      ctx.fillRect(253, 210, 1, Math.min(290, h - 210));

      
      const sinGlowMod = 5 * Math.sin(msTimer.current / 200);
      const cosGlowMod = 5 * Math.cos((msTimer.current + 0.5 * sinGlowMod) / 200);
      const grdGlow = ctx.createRadialGradient(250, 200, 0, 247 + sinGlowMod, 400, 206 + cosGlowMod);
      grdGlow.addColorStop(0, 'rgba(220, 240, 160, 1)');
      grdGlow.addColorStop(0.2, 'rgba(180, 240, 160, 0.4)');
      grdGlow.addColorStop(0.4, 'rgba(140, 240, 160, 0.2)');
      grdGlow.addColorStop(1, 'rgba(140, 240, 160, 0)');
      ctx.fillStyle = grdGlow;
      ctx.fillRect(0, 0, w, h);
    };

  
    const drawSidewalk = () => {
      const sidewalkY = h - 80;
      ctx.fillStyle = '#343A34';
      ctx.fillRect(0, sidewalkY, w, 10);
      
      const grd = ctx.createRadialGradient(250, sidewalkY, 0, 250, sidewalkY, 150);
      grd.addColorStop(0, 'rgba(32, 36, 38, 0)');
      grd.addColorStop(0.2, 'rgba(32, 36, 38, 0.1)');
      grd.addColorStop(0.6, 'rgba(32, 36, 38, 0.2)');
      grd.addColorStop(0.8, 'rgba(32, 36, 38, 0.6)');
      grd.addColorStop(1, 'rgba(32, 34, 38, 0.8)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, sidewalkY, w, 10);

      ctx.fillStyle = '#343A34';
      ctx.fillRect(0, sidewalkY + 10, w, 10);
      const grd2 = ctx.createRadialGradient(250, sidewalkY, 0, 250, sidewalkY, 150);
      grd2.addColorStop(0, 'rgba(32, 36, 38, 0.7)');
      grd2.addColorStop(0.2, 'rgba(32, 36, 38, 0.8)');
      grd2.addColorStop(0.4, 'rgba(32, 36, 38, 0.85)');
      grd2.addColorStop(1, 'rgba(32, 34, 38, 0.9)');
      ctx.fillStyle = grd2;
      ctx.fillRect(0, sidewalkY + 10, w, 10);
    };

    const drawRoad = () => {
      ctx.fillStyle = '#202224';
      ctx.fillRect(0, h - 60, w, 60);
    };

  
    const drawRain = () => {
      const groundLevel = h - 80;
      
      rainArr.current.forEach(drop => {
       
        drop.y += drop.w * rainSpeed;
        drop.x -= 5 + Math.floor(drop.y / 250) - drop.w;

      
        if (drop.y >= groundLevel) {
          drop.y = -10;
          drop.x = Math.floor(Math.random() * w);
        }
        if (drop.x < -10) {
          drop.x = w + 10;
        }

       
        const grd = ctx.createRadialGradient(250, 450, 140, 250, 300, 600);
        grd.addColorStop(0, 'rgba(100, 170, 160, 0.2)');
        grd.addColorStop(0.1, 'rgba(100, 160, 160, 0.12)');
        grd.addColorStop(0.2, 'rgba(100, 150, 150, 0.1)');
        grd.addColorStop(1, 'rgba(100, 140, 140, 0.08)');
        ctx.fillStyle = grd;
        ctx.fillRect(drop.x, drop.y, drop.z, 4);
      });
    };

   
    const drawLightning = () => {
      if (lightningTimer.current < 500) {
        let alpha = 0;
        const timer = lightningTimer.current;
        
        if (timer > 350) {
          alpha = (500 - timer) * 0.004;
        } else if (timer <= 350 && timer > 250) {
          alpha = (timer - 250) * 0.006;
        } else if (timer <= 250 && timer >= 100) {
          alpha = (250 - timer) * 0.004;
        } else if (timer < 100 && timer >= 0) {
          alpha = timer * 0.006;
        }

        if (alpha > 0) {
          ctx.fillStyle = `rgba(250, 250, 245, ${alpha})`;
          ctx.fillRect(0, 0, w, h);
        }
      }
    };

    const loop = (currentTime) => {
      
     
      lastTime.current = currentTime;


     
      msTimer.current += 30;
      lightningTimer.current -= 30;
      if (lightningTimer.current < 0) {
        lightningTimer.current = 8000;
      }

      
      ctx.fillStyle = "#202426";
      ctx.fillRect(0, 0, w, h);

     
      drawSidewalk();
      drawRoad();
      drawLamp();
      drawRain();
      drawLightning();

     

      animationRef.current = requestAnimationFrame(loop);
    };


    animationRef.current = requestAnimationFrame(loop);

    window.addEventListener("resize", handleResize);

   
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none", 
      }}
    />
  );
}