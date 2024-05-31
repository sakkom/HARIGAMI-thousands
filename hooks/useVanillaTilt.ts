import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

const useVanillaTilt = () => {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = tiltRef.current;
    if (element) {
      VanillaTilt.init(element, {
        max: 25,
        speed: 150,
        glare: true,
        "max-glare": 0.5,
      });

      return () => (element as any).vanillaTilt.destroy();
    }
  }, []);

  return tiltRef;
};

export default useVanillaTilt;
