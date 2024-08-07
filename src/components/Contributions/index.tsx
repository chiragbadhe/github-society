import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { fetchGitHubContributions } from "@/lib/github";
import { ContributionsProps, Week } from "@/types";
import { getContributionColor } from "@/utils";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const Contributions3D: React.FC<ContributionsProps> = ({
  username,
  token,
  height,
  width,
  modelDepth = 1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneInitialized = useRef(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const fetchAndRender = async () => {
      try {
        const data = await fetchGitHubContributions(username, token);
        const weeks =
          data.user.contributionsCollection.contributionCalendar.weeks;
        if (!sceneInitialized.current) {
          render3DView(weeks);
          sceneInitialized.current = true;
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
      }
    };

    const render3DView = (weeks: Week[]) => {
      if (!containerRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        30,
        width! / height!,
        0.8,
        1500
      );
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(width!, height!);
      renderer.setClearColor(0x000000, 0); // Set clear color with alpha = 0 for transparency
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xc1c1c1);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(8, 10, 8);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 50);
      pointLight.position.set(25, 25, 25);
      scene.add(pointLight);

      const spotLight = new THREE.SpotLight(0xffffff, 0.3);
      spotLight.position.set(-10, 10, -10);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.1;
      spotLight.distance = 100;
      spotLight.decay = 2;
      scene.add(spotLight);

      // Create buildings
      const buildingsGroup = new THREE.Group();
      const buildingWidth = 1;
      const buildingDepth = 1;
      const baseHeight = 0.2;
      const maxHeight = 20;
      weeks.reverse().forEach((week, weekIndex) => {
        week.contributionDays.forEach((day, dayIndex) => {
          // Base
          const baseGeometry = new THREE.BoxGeometry(
            buildingWidth,
            baseHeight,
            buildingDepth
          );
          const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x424242,
          });
          const base = new THREE.Mesh(baseGeometry, baseMaterial);
          base.position.set(
            (weekIndex - weeks.length / 2) * (buildingWidth + 0.5),
            baseHeight / 2,
            (dayIndex - 3) * (buildingDepth + 0.5)
          );

          // Building
          const height = Math.min(day.contributionCount, maxHeight);
          const geometry = new THREE.BoxGeometry(
            buildingWidth,
            height,
            buildingDepth
          );
          const color = new THREE.Color(
            getContributionColor(day.contributionCount)
          );
          const material = new THREE.MeshStandardMaterial({ color });
          const building = new THREE.Mesh(geometry, material);
          building.position.set(
            (weekIndex - weeks.length / 2) * (buildingWidth + 0.5),
            height / 2 + baseHeight,
            (dayIndex - 3) * (buildingDepth + 0.5)
          );

          buildingsGroup.add(base);
          buildingsGroup.add(building);
        });
      });

      // Apply depth scaling
      buildingsGroup.scale.z = modelDepth;
      scene.add(buildingsGroup);

      // Set camera position
      camera.position.set(0, 20, 60);
      camera.lookAt(0, baseHeight / 2, 0);

      // Add OrbitControls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
      controls.minPolarAngle = Math.PI / 6;
      controls.maxPolarAngle = Math.PI / 2;
      controls.maxDistance = 50;
      controls.minDistance = 20;
      controlsRef.current = controls;

      // Render loop
      const animate = () => {
        requestAnimationFrame(animate);
        if (isAnimating) {
          buildingsGroup.rotation.y += 0.004; // Rotate the model
        }
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // Cleanup
      return () => {
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        if (controlsRef.current) {
          controlsRef.current.dispose();
        }
        scene.remove(...scene.children);
        containerRef.current?.removeChild(renderer.domElement);
      };
    };

    fetchAndRender();
  }, [username, token, modelDepth, width, height]);

  return (
    <div
      ref={containerRef}
      className="canvas-container  bg-[rgb(13,13,13)] border rounded-2xl border-white/10"
      style={{ width: width, height: height }}
    />
  );
};

export default Contributions3D;
